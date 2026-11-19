import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { incrementCouponUsage } from '@/lib/coupon-helper';
import { CardCreatePayload, createPaidCardInDb } from '@/lib/card-creator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CARD_VALIDITY_DAYS = 30;

function verifyCheckoutSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string
): boolean {
  if (!orderId || !paymentId || !signature || !keySecret) return false;
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const actualBuf = Buffer.from(signature.trim(), 'utf8');
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const razorpayOrderId =
      typeof body.razorpay_order_id === 'string' ? body.razorpay_order_id.trim() : '';
    const razorpayPaymentId =
      typeof body.razorpay_payment_id === 'string' ? body.razorpay_payment_id.trim() : '';
    const razorpaySignature =
      typeof body.razorpay_signature === 'string' ? body.razorpay_signature.trim() : '';
    const cardPayload =
      body.card_payload && typeof body.card_payload === 'object'
        ? (body.card_payload as CardCreatePayload)
        : null;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature' },
        { status: 400 }
      );
    }

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    if (!keySecret || keySecret.includes('your_')) {
      return NextResponse.json(
        { error: 'RAZORPAY_KEY_SECRET is not configured on the server' },
        { status: 503 }
      );
    }

    // Cryptographically verify Razorpay payment signature BEFORE creating/activating any card
    if (
      !verifyCheckoutSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        keySecret
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid Razorpay payment signature' },
        { status: 401 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin credentials not configured' },
        { status: 503 }
      );
    }

    // Fetch existing order for idempotency
    const { data: existingOrder } = await supabaseAdmin
      .from('ev_orders')
      .select('id, card_id, coupon_code, status')
      .eq('razorpay_order_id', razorpayOrderId)
      .maybeSingle();

    const wasAlreadyPaid = existingOrder?.status === 'paid';
    let targetCardId = existingOrder?.card_id || null;
    let createdCard = null;

    // If this was a pre-publish new card order (card_id was null), create the card ONLY NOW!
    if (!targetCardId && cardPayload) {
      createdCard = await createPaidCardInDb(supabaseAdmin, cardPayload);
      targetCardId = createdCard.id;
    } else if (targetCardId) {
      const freshExpiresAt = new Date(
        Date.now() + CARD_VALIDITY_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      await supabaseAdmin
        .from('ev_cards')
        .update({
          is_paid: true,
          is_published: true,
          expires_at: freshExpiresAt,
        })
        .eq('id', targetCardId);
    }

    // Update ev_orders row -> status = 'paid', link card_id, store razorpay_payment_id
    const orderUpdatePayload: Record<string, unknown> = {
      status: 'paid',
      razorpay_payment_id: razorpayPaymentId,
    };
    if (targetCardId) {
      orderUpdatePayload.card_id = targetCardId;
    }

    const { data: updatedOrder, error: orderUpdateError } = await supabaseAdmin
      .from('ev_orders')
      .update(orderUpdatePayload)
      .eq('razorpay_order_id', razorpayOrderId)
      .select('id, card_id, coupon_code, amount, status')
      .maybeSingle();

    if (orderUpdateError) {
      console.error('[Razorpay verify-payment] Failed updating ev_orders:', orderUpdateError.message);
      return NextResponse.json(
        { error: 'Failed to update order status in database' },
        { status: 500 }
      );
    }

    if (!wasAlreadyPaid && updatedOrder?.coupon_code) {
      await incrementCouponUsage(supabaseAdmin, updatedOrder.coupon_code);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      card_id: targetCardId,
      card: createdCard,
      status: 'paid',
    });
  } catch (err) {
    console.error('[Razorpay verify-payment] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error verifying payment' },
      { status: 500 }
    );
  }
}
