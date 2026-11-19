import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { validateCouponServer } from '@/lib/coupon-helper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const code = typeof body?.code === 'string' ? body.code.trim() : '';

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Please enter a coupon code.' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { valid: false, error: 'Database is not configured on the server.' },
        { status: 503 }
      );
    }

    const result = await validateCouponServer(supabaseAdmin, code);
    if (!result.valid) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Razorpay validate-coupon] Unexpected error:', err);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon code.' },
      { status: 500 }
    );
  }
}
