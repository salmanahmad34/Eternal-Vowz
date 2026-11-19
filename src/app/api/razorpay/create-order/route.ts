import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import {
  BASE_CARD_PRICE_PAISE,
  incrementCouponUsage,
  validateCouponServer,
} from '@/lib/coupon-helper';
import { CardCreatePayload, createPaidCardInDb } from '@/lib/card-creator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CURRENCY = 'INR';
const CARD_VALIDITY_DAYS = 30;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid JSON request payload' },
        { status: 400 }
      );
    }

    const isCreateNew = body.create_new === true || body.mode === 'create-new';
    const cardPayload =
      body.card_payload && typeof body.card_payload === 'object'
        ? (body.card_payload as CardCreatePayload)
        : null;

    const rawCardId =
      typeof body.card_id === 'string'
        ? body.card_id.trim()
        : typeof body.cardId === 'string'
        ? body.cardId.trim()
        : '';

    const rawEmail =
      typeof body.customer_email === 'string'
        ? body.customer_email.trim()
        : typeof body.customerEmail === 'string'
        ? body.customerEmail.trim()
        : '';

    const rawCouponCode =
      typeof body.coupon_code === 'string'
        ? body.coupon_code.trim()
        : typeof body.couponCode === 'string'
        ? body.couponCode.trim()
        : '';

    if (isCreateNew) {
      if (!cardPayload || !cardPayload.design_config) {
        return NextResponse.json(
          { error: 'Valid card_payload is required to publish a new card' },
          { status: 400 }
        );
      }
    } else if (!rawCardId || !UUID_REGEX.test(rawCardId)) {
      return NextResponse.json(
        { error: 'A valid UUID card_id is required' },
        { status: 400 }
      );
    }

    if (rawEmail && !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { error: 'Invalid customer_email format' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error:
            'Supabase server credentials (NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY) are not configured.',
        },
        { status: 503 }
      );
    }

    // If paying for an existing card, verify it exists and isn't already paid
    if (!isCreateNew) {
      const { data: card, error: cardError } = await supabaseAdmin
        .from('ev_cards')
        .select('id, title, is_paid')
        .eq('id', rawCardId)
        .maybeSingle();

      if (cardError) {
        console.error('[Razorpay create-order] Failed to query ev_cards:', cardError.message);
        return NextResponse.json(
          { error: 'Failed to verify invitation card' },
          { status: 500 }
        );
      }

      if (!card) {
        return NextResponse.json(
          { error: 'Invitation card not found' },
          { status: 404 }
        );
      }

      if (card.is_paid) {
        return NextResponse.json(
          { error: 'This invitation card is already paid and active' },
          { status: 409 }
        );
      }
    }

    // Server-side coupon calculation (never trust client-submitted totals)
    let finalAmountPaise = BASE_CARD_PRICE_PAISE;
    let discountPaise = 0;
    let appliedCouponCode: string | null = null;

    if (rawCouponCode) {
      const couponResult = await validateCouponServer(supabaseAdmin, rawCouponCode);
      if (!couponResult.valid) {
        return NextResponse.json(
          { error: couponResult.error || 'Invalid coupon code' },
          { status: 400 }
        );
      }
      finalAmountPaise = couponResult.final_paise;
      discountPaise = couponResult.discount_paise;
      appliedCouponCode = couponResult.code || rawCouponCode.toUpperCase();
    }

    // Case A: 100% Free Coupon Unlock (finalAmountPaise === 0)
    if (finalAmountPaise === 0 && appliedCouponCode) {
      const freeOrderId = `coupon_free_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      let targetCardId = rawCardId;
      let createdCard = null;

      if (isCreateNew && cardPayload) {
        createdCard = await createPaidCardInDb(supabaseAdmin, cardPayload);
        targetCardId = createdCard.id;
      } else {
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
          .eq('id', rawCardId);
      }

      const { data: freeOrder, error: freeInsertError } = await supabaseAdmin
        .from('ev_orders')
        .insert({
          card_id: targetCardId,
          customer_email: rawEmail || null,
          razorpay_order_id: freeOrderId,
          razorpay_payment_id: `coupon_${appliedCouponCode}`,
          amount: 0,
          coupon_code: appliedCouponCode,
          discount_amount: discountPaise,
          status: 'paid',
        })
        .select('id, card_id, customer_email, razorpay_order_id, amount, coupon_code, discount_amount, status, created_at')
        .single();

      if (freeInsertError) {
        console.error('[Razorpay create-order] Failed to save free coupon order:', freeInsertError.message);
        return NextResponse.json(
          { error: 'Failed to record free coupon activation' },
          { status: 500 }
        );
      }

      await incrementCouponUsage(supabaseAdmin, appliedCouponCode);

      return NextResponse.json({
        success: true,
        freeUnlock: true,
        orderId: freeOrderId,
        amount: 0,
        originalAmount: BASE_CARD_PRICE_PAISE,
        discountPaise,
        couponCode: appliedCouponCode,
        currency: CURRENCY,
        card: createdCard,
        order: freeOrder,
      });
    }

    // Case B: Paid Razorpay Order (full ₹79 or discounted amount > ₹0)
    // NOTE: In create_new mode, NO card is inserted in ev_cards until payment succeeds!
    const keyId = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (isPlaceholder(keyId) || isPlaceholder(keySecret)) {
      return NextResponse.json(
        {
          error:
            'Razorpay credentials are not configured yet. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local.',
        },
        { status: 503 }
      );
    }

    const shortRand = crypto.randomBytes(4).toString('hex');
    const receiptPrefix = isCreateNew ? 'ev_new' : `ev_${rawCardId.slice(0, 8)}`;
    const receipt = `${receiptPrefix}_${Date.now().toString(36)}_${shortRand}`.slice(
      0,
      40
    );

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: finalAmountPaise,
        currency: CURRENCY,
        receipt,
        notes: {
          mode: isCreateNew ? 'create_new' : 'pay_existing',
          card_id: isCreateNew ? 'pending_creation' : rawCardId,
          customer_email: rawEmail || 'not_provided',
          coupon_code: appliedCouponCode || 'none',
          platform: 'Eternal Vowz',
        },
      }),
    });

    if (!rzpRes.ok) {
      const errText = await rzpRes.text();
      console.error('[Razorpay create-order] Razorpay API error:', rzpRes.status, errText);
      return NextResponse.json(
        { error: 'Failed to create order with Razorpay' },
        { status: 502 }
      );
    }

    const rzpOrder = (await rzpRes.json()) as RazorpayOrderResponse;

    const { data: insertedOrder, error: insertError } = await supabaseAdmin
      .from('ev_orders')
      .insert({
        card_id: isCreateNew ? null : rawCardId,
        customer_email: rawEmail || null,
        razorpay_order_id: rzpOrder.id,
        razorpay_payment_id: null,
        amount: rzpOrder.amount,
        coupon_code: appliedCouponCode,
        discount_amount: discountPaise,
        status: 'pending',
      })
      .select('id, card_id, customer_email, razorpay_order_id, amount, coupon_code, discount_amount, status, created_at')
      .single();

    if (insertError) {
      console.error('[Razorpay create-order] Failed to save ev_orders row:', insertError.message);
      return NextResponse.json(
        { error: 'Razorpay order created but failed to save order record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      freeUnlock: false,
      keyId,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      originalAmount: BASE_CARD_PRICE_PAISE,
      discountPaise,
      couponCode: appliedCouponCode,
      currency: rzpOrder.currency,
      receipt: rzpOrder.receipt,
      order: insertedOrder,
    });
  } catch (err) {
    console.error('[Razorpay create-order] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error while creating Razorpay order' },
      { status: 500 }
    );
  }
}
