import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Server-enforced immutable pricing: ₹79.00 (7900 paise) per card, valid for 30 days (1 month)
const CARD_PRICE_INR = 79;
const CARD_PRICE_PAISE = 7900;
const CARD_VALIDITY_DAYS = 30;

function sanitizeId(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = sanitizeId(body?.action || 'create_order');
    const cardId = sanitizeId(body?.cardId);

    if (!cardId) {
      return NextResponse.json(
        { error: 'Valid cardId is required' },
        { status: 400 }
      );
    }

    if (action === 'create_order') {
      const orderId = `order_ev_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const expiresAt = new Date(Date.now() + CARD_VALIDITY_DAYS * 24 * 60 * 60 * 1000).toISOString();

      return NextResponse.json({
        success: true,
        provider: process.env.RAZORPAY_KEY_ID ? 'razorpay_live' : 'eternal_vowz_secure_sandbox',
        orderId,
        cardId,
        amountInr: CARD_PRICE_INR,
        amountPaise: CARD_PRICE_PAISE,
        currency: 'INR',
        validityDays: CARD_VALIDITY_DAYS,
        expiresAt,
      });
    }

    if (action === 'verify_signature') {
      const orderId = sanitizeId(body?.orderId);
      const paymentId = sanitizeId(body?.paymentId);
      const signature = typeof body?.signature === 'string' ? body.signature.trim() : '';

      const secret = process.env.PAYMENT_WEBHOOK_SECRET;
      if (secret && signature) {
        const expected = crypto
          .createHmac('sha256', secret)
          .update(`${orderId}|${paymentId}`)
          .digest('hex');

        const isValid =
          expected.length === signature.length &&
          crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

        if (!isValid) {
          return NextResponse.json(
            { error: 'Invalid payment signature' },
            { status: 403 }
          );
        }
      }

      const now = Date.now();
      return NextResponse.json({
        success: true,
        verified: true,
        cardId,
        amountInr: CARD_PRICE_INR,
        activatedAt: new Date(now).toISOString(),
        expiresAt: new Date(now + CARD_VALIDITY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
        supportEmail: 'mrsalman7307@gmail.com',
        whatsappSupportUnlocked: true,
      });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: 'Malformed request payload' },
      { status: 400 }
    );
  }
}
