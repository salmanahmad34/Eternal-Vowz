import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Server-enforced flat pricing: ₹79.00 (7900 paise) per card (valid for 30 days)
const CARD_PRICE_PAISE = 7900;
const CURRENCY = 'INR';

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

    if (!rawCardId || !UUID_REGEX.test(rawCardId)) {
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

    // Verify that the target card exists in ev_cards
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

    // Razorpay receipt must be <= 40 characters
    const shortRand = crypto.randomBytes(4).toString('hex');
    const receipt = `ev_${rawCardId.slice(0, 8)}_${Date.now().toString(36)}_${shortRand}`.slice(
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
        amount: CARD_PRICE_PAISE,
        currency: CURRENCY,
        receipt,
        notes: {
          card_id: rawCardId,
          customer_email: rawEmail || 'not_provided',
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

    // Persist pending order in Supabase ev_orders
    const { data: insertedOrder, error: insertError } = await supabaseAdmin
      .from('ev_orders')
      .insert({
        card_id: rawCardId,
        customer_email: rawEmail || null,
        razorpay_order_id: rzpOrder.id,
        razorpay_payment_id: null,
        amount: rzpOrder.amount,
        status: 'pending',
      })
      .select('id, card_id, customer_email, razorpay_order_id, amount, status, created_at')
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
      keyId,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
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
