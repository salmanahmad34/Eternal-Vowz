import { SupabaseClient } from '@supabase/supabase-js';

export const BASE_CARD_PRICE_INR = 99;
export const BASE_CARD_PRICE_PAISE = 9900;

export const BUILT_IN_COUPONS: Record<
  string,
  {
    code: string;
    discount_type: 'percent' | 'flat';
    discount_value: number;
    max_uses?: number;
    is_active: boolean;
  }
> = {
  RUPEE1: {
    code: 'RUPEE1',
    discount_type: 'flat',
    discount_value: 98, // ₹99 - ₹98 = ₹1
    is_active: true,
  },
  SPECIAL1: {
    code: 'SPECIAL1',
    discount_type: 'flat',
    discount_value: 98, // ₹99 - ₹98 = ₹1
    is_active: true,
  },
};

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
  discount_type?: 'percent' | 'flat';
  discount_value?: number;
  original_paise: number;
  discount_paise: number;
  final_paise: number;
  original_inr: number;
  discount_inr: number;
  final_inr: number;
  is_free: boolean;
}

export async function validateCouponServer(
  supabaseAdmin: SupabaseClient,
  rawCode: string
): Promise<CouponValidationResult> {
  const code = rawCode.trim().toUpperCase();
  const baseFail: CouponValidationResult = {
    valid: false,
    original_paise: BASE_CARD_PRICE_PAISE,
    discount_paise: 0,
    final_paise: BASE_CARD_PRICE_PAISE,
    original_inr: BASE_CARD_PRICE_INR,
    discount_inr: 0,
    final_inr: BASE_CARD_PRICE_INR,
    is_free: false,
  };

  if (!code || code.length > 32) {
    return { ...baseFail, error: 'Please enter a valid coupon code.' };
  }

  const { data: coupon, error } = await supabaseAdmin
    .from('ev_coupons')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    console.error('[Coupon] Failed to query ev_coupons:', error.message);
    return { ...baseFail, error: 'Unable to validate coupon right now.' };
  }

  let couponData = coupon;
  if (!couponData && BUILT_IN_COUPONS[code]) {
    couponData = {
      id: `builtin_${code.toLowerCase()}`,
      code: BUILT_IN_COUPONS[code].code,
      discount_type: BUILT_IN_COUPONS[code].discount_type,
      discount_value: BUILT_IN_COUPONS[code].discount_value,
      max_uses: BUILT_IN_COUPONS[code].max_uses,
      used_count: 0,
      is_active: BUILT_IN_COUPONS[code].is_active,
      expires_at: null,
      created_at: new Date().toISOString(),
    };
  }

  if (!couponData) {
    return { ...baseFail, error: `Coupon "${code}" not found.` };
  }

  if (!couponData.is_active) {
    return { ...baseFail, error: `Coupon "${code}" is no longer active.` };
  }

  if (couponData.expires_at && new Date(couponData.expires_at).getTime() < Date.now()) {
    return { ...baseFail, error: `Coupon "${code}" has expired.` };
  }

  if (
    typeof couponData.max_uses === 'number' &&
    couponData.max_uses > 0 &&
    (couponData.used_count || 0) >= couponData.max_uses
  ) {
    return { ...baseFail, error: `Coupon "${code}" has reached its redemption limit.` };
  }

  let discountPaise = 0;
  if (couponData.discount_type === 'percent') {
    const pct = Math.min(100, Math.max(1, Number(couponData.discount_value) || 0));
    // Round to nearest whole rupee in paise for crisp Indian pricing
    const discountInr = Math.round((BASE_CARD_PRICE_INR * pct) / 100);
    discountPaise = Math.min(BASE_CARD_PRICE_PAISE, discountInr * 100);
  } else {
    const flatInr = Math.max(1, Number(couponData.discount_value) || 0);
    discountPaise = Math.min(BASE_CARD_PRICE_PAISE, flatInr * 100);
  }

  let finalPaise = Math.max(0, BASE_CARD_PRICE_PAISE - discountPaise);
  // Razorpay requires minimum 100 paise (₹1) for paid orders unless 100% free
  if (finalPaise > 0 && finalPaise < 100) {
    finalPaise = 100;
    discountPaise = BASE_CARD_PRICE_PAISE - finalPaise;
  }

  return {
    valid: true,
    code: couponData.code,
    discount_type: couponData.discount_type,
    discount_value: couponData.discount_value,
    original_paise: BASE_CARD_PRICE_PAISE,
    discount_paise: discountPaise,
    final_paise: finalPaise,
    original_inr: BASE_CARD_PRICE_INR,
    discount_inr: Math.round(discountPaise / 100),
    final_inr: Math.round(finalPaise / 100),
    is_free: finalPaise === 0,
  };
}

export async function incrementCouponUsage(
  supabaseAdmin: SupabaseClient,
  code: string | null | undefined
): Promise<void> {
  if (!code) return;
  const cleanCode = code.trim().toUpperCase();
  const { data: coupon } = await supabaseAdmin
    .from('ev_coupons')
    .select('id, used_count')
    .eq('code', cleanCode)
    .maybeSingle();

  if (coupon) {
    await supabaseAdmin
      .from('ev_coupons')
      .update({ used_count: (coupon.used_count || 0) + 1 })
      .eq('id', coupon.id);
  }
}
