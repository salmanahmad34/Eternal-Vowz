import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { incrementCouponUsage } from '@/lib/coupon-helper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CARD_VALIDITY_DAYS = 30;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isPlaceholder(val: string): boolean {
  const lower = val.trim().toLowerCase();
  return (
    !lower ||
    lower.includes('your_') ||
    lower.includes('your-') ||
    lower.includes('placeholder') ||
    lower.includes('xxxx')
  );
}

function verifyRazorpaySignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string
): boolean {
  if (!signatureHeader || !webhookSecret) return false;
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const actualBuf = Buffer.from(signatureHeader.trim(), 'utf8');

  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

interface RazorpayWebhookPayload {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        email?: string;
        amount?: number;
        status?: string;
        notes?: Record<string, string>;
      };
    };
    order?: {
      entity?: {
        id?: string;
        amount?: number;
        status?: string;
        notes?: Record<string, string>;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
    if (isPlaceholder(webhookSecret)) {
      console.error('[Razorpay webhook] RAZORPAY_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured on server' },
        { status: 500 }
      );
    }

    // IMPORTANT: Read raw body verbatim before parsing JSON for accurate HMAC verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    if (!verifyRazorpaySignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json(
        { error: 'Invalid x-razorpay-signature' },
        { status: 401 }
      );
    }

    let body: RazorpayWebhookPayload;
    try {
      body = JSON.parse(rawBody) as RazorpayWebhookPayload;
    } catch {
      return NextResponse.json(
        { error: 'Malformed webhook JSON payload' },
        { status: 400 }
      );
    }

    const event = body.event || '';
    const paymentEntity = body.payload?.payment?.entity;
    const orderEntity = body.payload?.order?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id || '';
    const razorpayPaymentId = paymentEntity?.id || null;
    const noteCardId =
      paymentEntity?.notes?.card_id || orderEntity?.notes?.card_id || null;

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.error('[Razorpay webhook] Supabase admin client unavailable');
      return NextResponse.json(
        { error: 'Database client not configured' },
        { status: 500 }
      );
    }

    // Handle successful payment events
    if (event === 'payment.captured' || event === 'order.paid') {
      if (!razorpayOrderId) {
        return NextResponse.json(
          { error: 'Missing razorpay order_id in webhook payload' },
          { status: 400 }
        );
      }

      // 1. Check current order status for idempotent coupon counting
      const { data: existingOrder } = await supabaseAdmin
        .from('ev_orders')
        .select('id, card_id, coupon_code, status')
        .eq('razorpay_order_id', razorpayOrderId)
        .maybeSingle();

      const wasAlreadyPaid = existingOrder?.status === 'paid';

      // 2. Update ev_orders status -> 'paid' and store razorpay_payment_id
      const orderUpdatePayload: Record<string, unknown> = {
        status: 'paid',
      };
      if (razorpayPaymentId) {
        orderUpdatePayload.razorpay_payment_id = razorpayPaymentId;
      }

      const { data: updatedOrder, error: orderUpdateError } = await supabaseAdmin
        .from('ev_orders')
        .update(orderUpdatePayload)
        .eq('razorpay_order_id', razorpayOrderId)
        .select('id, card_id, coupon_code, status')
        .maybeSingle();

      if (orderUpdateError) {
        console.error(
          '[Razorpay webhook] Failed to update ev_orders:',
          orderUpdateError.message
        );
        return NextResponse.json(
          { error: 'Failed to update order status' },
          { status: 500 }
        );
      }

      if (!wasAlreadyPaid && updatedOrder?.coupon_code) {
        await incrementCouponUsage(supabaseAdmin, updatedOrder.coupon_code);
      }

      // 2. Resolve target card_id from ev_orders (fallback to Razorpay notes.card_id)
      const targetCardId =
        updatedOrder?.card_id ||
        (noteCardId && UUID_REGEX.test(noteCardId) ? noteCardId : null);

      if (targetCardId) {
        const freshExpiresAt = new Date(
          Date.now() + CARD_VALIDITY_DAYS * 24 * 60 * 60 * 1000
        ).toISOString();

        const { error: cardUpdateError } = await supabaseAdmin
          .from('ev_cards')
          .update({
            is_paid: true,
            is_published: true,
            expires_at: freshExpiresAt,
          })
          .eq('id', targetCardId);

        if (cardUpdateError) {
          console.error(
            '[Razorpay webhook] Failed to update ev_cards.is_paid:',
            cardUpdateError.message
          );
          return NextResponse.json(
            { error: 'Order updated, but failed to activate invitation card' },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        received: true,
        event,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        card_id: targetCardId,
        status: 'paid',
        is_paid: Boolean(targetCardId),
      });
    }

    // Optionally mark failed payments cleanly without overwriting already-paid orders
    if (event === 'payment.failed' && razorpayOrderId) {
      const failPayload: Record<string, unknown> = { status: 'failed' };
      if (razorpayPaymentId) {
        failPayload.razorpay_payment_id = razorpayPaymentId;
      }
      await supabaseAdmin
        .from('ev_orders')
        .update(failPayload)
        .eq('razorpay_order_id', razorpayOrderId)
        .eq('status', 'pending');

      return NextResponse.json({
        received: true,
        event,
        razorpay_order_id: razorpayOrderId,
        status: 'failed',
      });
    }

    // Acknowledge unhandled webhook events with 200 OK
    return NextResponse.json({
      received: true,
      event,
      ignored: true,
    });
  } catch (err) {
    console.error('[Razorpay webhook] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error processing webhook' },
      { status: 500 }
    );
  }
}
