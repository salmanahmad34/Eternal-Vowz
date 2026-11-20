import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { incrementCouponUsage } from '@/lib/coupon-helper';
import { CardCreatePayload, createPaidCardInDb } from '@/lib/card-creator';
import { getAuthenticatedUser } from '@/lib/server-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CARD_VALIDITY_DAYS = 30;

interface RazorpayPaymentItem {
  id: string;
  status: string;
  order_id?: string;
  amount?: number;
  error_code?: string | null;
  error_description?: string | null;
  error_reason?: string | null;
}

/**
 * Server-to-server fallback verification directly against Razorpay Orders & Payments API.
 * Handles cases where Razorpay Checkout captured payment (e.g. mobile UPI intent or modal closed)
 * even if the browser JS handler did not fire.
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const razorpayOrderId =
      typeof body.razorpay_order_id === 'string' ? body.razorpay_order_id.trim() : '';
    const cardPayload =
      body.card_payload && typeof body.card_payload === 'object'
        ? (body.card_payload as CardCreatePayload)
        : null;

    if (!razorpayOrderId || !razorpayOrderId.startsWith('order_')) {
      return NextResponse.json(
        { error: 'Valid razorpay_order_id is required' },
        { status: 400 }
      );
    }

    const keyId = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    if (!keyId || !keySecret || keyId.includes('your_') || keySecret.includes('your_')) {
      return NextResponse.json(
        { error: 'Razorpay credentials not configured on server' },
        { status: 503 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin credentials not configured' },
        { status: 503 }
      );
    }

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpHeaders = { Authorization: `Basic ${basicAuth}` };

    // 1. Fetch authoritative order & payments directly from Razorpay API
    const [orderRes, paymentsRes] = await Promise.all([
      fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpayOrderId)}`, {
        headers: rzpHeaders,
      }),
      fetch(
        `https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpayOrderId)}/payments`,
        { headers: rzpHeaders }
      ),
    ]);

    if (!orderRes.ok) {
      return NextResponse.json(
        { error: 'Could not verify order with Razorpay' },
        { status: 502 }
      );
    }

    const rzpOrder = (await orderRes.json()) as {
      id: string;
      status: string;
      amount_paid?: number;
    };
    const rzpPaymentsData = paymentsRes.ok
      ? ((await paymentsRes.json()) as { items?: RazorpayPaymentItem[] })
      : { items: [] };

    const items = rzpPaymentsData.items || [];
    const capturedPayment = items.find(
      (p) => p.status === 'captured' || p.status === 'authorized'
    );
    const isPaid = rzpOrder.status === 'paid' || Boolean(capturedPayment);

    if (!isPaid) {
      const failedPayment = items.find((p) => p.status === 'failed');
      return NextResponse.json({
        success: true,
        paid: false,
        failed: Boolean(failedPayment),
        error_description:
          failedPayment?.error_description ||
          failedPayment?.error_reason ||
          null,
      });
    }

    // 2. Order IS PAID on Razorpay! Sync Supabase ev_orders + create/activate ev_cards idempotently
    const { data: existingOrder } = await supabaseAdmin
      .from('ev_orders')
      .select('id, card_id, coupon_code, status')
      .eq('razorpay_order_id', razorpayOrderId)
      .maybeSingle();

    const wasAlreadyPaid = existingOrder?.status === 'paid';
    let targetCardId = existingOrder?.card_id || null;
    let createdCard = null;

    if (!targetCardId && cardPayload) {
      createdCard = await createPaidCardInDb(supabaseAdmin, cardPayload, authUser.id);
      targetCardId = createdCard.id;
    } else if (targetCardId) {
      const freshExpiresAt = new Date(
        Date.now() + CARD_VALIDITY_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      const { data: activatedCard } = await supabaseAdmin
        .from('ev_cards')
        .update({
          is_paid: true,
          is_published: true,
          expires_at: freshExpiresAt,
        })
        .eq('id', targetCardId)
        .select('*')
        .maybeSingle();

      createdCard = activatedCard || null;
    }

    const updatePayload: Record<string, unknown> = {
      status: 'paid',
    };
    if (capturedPayment?.id) {
      updatePayload.razorpay_payment_id = capturedPayment.id;
    }
    if (targetCardId) {
      updatePayload.card_id = targetCardId;
    }

    await supabaseAdmin
      .from('ev_orders')
      .update(updatePayload)
      .eq('razorpay_order_id', razorpayOrderId);

    if (!wasAlreadyPaid && existingOrder?.coupon_code) {
      await incrementCouponUsage(supabaseAdmin, existingOrder.coupon_code);
    }

    return NextResponse.json({
      success: true,
      paid: true,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: capturedPayment?.id || null,
      card_id: targetCardId,
      card: createdCard,
    });
  } catch (err) {
    console.error('[Razorpay check-order] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error checking Razorpay order status' },
      { status: 500 }
    );
  }
}
