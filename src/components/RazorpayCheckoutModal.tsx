'use client';

import React, { useEffect, useState } from 'react';
import { Invitation } from '@/types/database';
import {
  X,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Sparkles,
  CreditCard,
  AlertCircle,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: Record<string, unknown>) => void) => void;
    };
  }
}

interface AppliedCoupon {
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  original_inr: number;
  discount_inr: number;
  final_inr: number;
  final_paise: number;
  is_free: boolean;
}

interface RazorpayCheckoutModalProps {
  card: Invitation | null;
  defaultEmail?: string;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckoutModal({
  card,
  defaultEmail = '',
  onClose,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const [customerEmail, setCustomerEmail] = useState(defaultEmail);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  useEffect(() => {
    setCustomerEmail(defaultEmail);
    setCouponInput('');
    setAppliedCoupon(null);
    setCouponError(null);
    setPaymentError(null);
    setPaymentSuccess(null);
  }, [card?.id, defaultEmail]);

  if (!card) return null;

  const coupleTitle = `${card.design_config.couple_names.partner1} & ${card.design_config.couple_names.partner2}`;
  const baseInr = 79;
  const discountInr = appliedCoupon ? appliedCoupon.discount_inr : 0;
  const finalInr = appliedCoupon ? appliedCoupon.final_inr : baseInr;
  const isFree = appliedCoupon?.is_free === true;

  const handleApplyCoupon = async () => {
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) {
      setCouponError('Please enter a coupon code first.');
      return;
    }

    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch('/api/razorpay/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setAppliedCoupon(null);
        setCouponError(data.error || 'Invalid or expired coupon code.');
      } else {
        setAppliedCoupon({
          code: data.code,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          original_inr: data.original_inr,
          discount_inr: data.discount_inr,
          final_inr: data.final_inr,
          final_paise: data.final_paise,
          is_free: data.is_free,
        });
        setCouponInput(data.code);
      }
    } catch {
      setCouponError('Could not validate coupon right now. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const celebrateSuccess = async (message: string) => {
    setPaymentSuccess(message);
    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#C9A84C', '#E6CFA0', '#291418', '#10B981'],
      });
    } catch {
      // Ignore confetti error in headless environments
    }
    await onSuccess();
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const handleProceedPayment = async () => {
    setPaying(true);
    setPaymentError(null);

    try {
      // 1. Create order on server (re-validates coupon securely server-side)
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: card.id,
          customer_email: customerEmail.trim(),
          coupon_code: appliedCoupon?.code || '',
        }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        setPaymentError(orderData.error || 'Unable to initiate payment.');
        setPaying(false);
        return;
      }

      // 2. If 100% free coupon unlocked the card immediately
      if (orderData.freeUnlock) {
        setPaying(false);
        await celebrateSuccess(
          `Unlocked free with coupon ${orderData.couponCode}! Your 30-day card is now active.`
        );
        return;
      }

      // 3. Load Razorpay Checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        setPaymentError(
          'Could not load Razorpay Checkout script. Please check your internet connection.'
        );
        setPaying(false);
        return;
      }

      // 4. Open Razorpay Checkout Popup
      const options: Record<string, unknown> = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Eternal Vowz (E&V)',
        description: `${coupleTitle} — 30-Day 3D Wedding Card`,
        order_id: orderData.orderId,
        prefill: {
          email: customerEmail.trim() || undefined,
        },
        notes: {
          card_id: card.id,
          coupon_code: appliedCoupon?.code || 'none',
        },
        theme: {
          color: '#C9A84C',
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              setPaymentError(
                verifyData.error ||
                  'Payment received, but verification failed. Please contact support.'
              );
              setPaying(false);
              return;
            }

            setPaying(false);
            await celebrateSuccess(
              'Payment verified! Your 3D wedding invitation is now active for 30 days.'
            );
          } catch {
            setPaymentError('Error verifying payment signature. Please refresh your dashboard.');
            setPaying(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (failedResp: Record<string, unknown>) => {
        const errObj = failedResp?.error as { description?: string } | undefined;
        setPaymentError(errObj?.description || 'Payment failed or was cancelled.');
        setPaying(false);
      });
      rzp.open();
    } catch {
      setPaymentError('Network error while connecting to payment server.');
      setPaying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#291418]/55 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#FAF7F2] border border-[#E2D7BD] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E2D7BD]/80 flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A84C]">
              <Sparkles className="w-3.5 h-3.5" />
              30-Day Card Activation
            </span>
            <h3 className="font-serif text-2xl font-semibold text-[#291418] mt-1 leading-tight">
              {coupleTitle}
            </h3>
            <p className="text-xs text-[#8B7355] mt-0.5">
              One-time activation &bull; Unlimited WhatsApp guest links &amp; RSVPs
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B7355] hover:text-[#291418] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            aria-label="Close checkout modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {paymentSuccess ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-xl font-semibold text-emerald-900">
                Card Activated!
              </h4>
              <p className="text-xs text-emerald-800">{paymentSuccess}</p>
            </div>
          ) : (
            <>
              {/* Customer Email */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5A4636] mb-1.5">
                  Email for Receipt (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E2D7BD] text-sm text-[#291418] placeholder:text-[#A5947E] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Coupon Code Box */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5A4636] mb-1.5">
                  Have a Coupon Code?
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="text-xs text-emerald-900 truncate">
                        <span className="font-bold tracking-wider">{appliedCoupon.code}</span>
                        <span className="ml-1.5 text-emerald-700">
                          (
                          {appliedCoupon.is_free
                            ? '100% FREE'
                            : appliedCoupon.discount_type === 'percent'
                            ? `${appliedCoupon.discount_value}% OFF • Saved ₹${appliedCoupon.discount_inr}`
                            : `₹${appliedCoupon.discount_inr} OFF`}
                          )
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-[#A5947E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          if (couponError) setCouponError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="Enter coupon code"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-[#E2D7BD] text-sm uppercase tracking-wider text-[#291418] placeholder:normal-case placeholder:tracking-normal placeholder:text-[#A5947E] focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2.5 rounded-lg bg-[#291418] hover:bg-[#3d2126] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                    >
                      {couponLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Apply</span>
                      )}
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="rounded-xl bg-white border border-[#E2D7BD]/90 p-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-[#5A4636]">
                  <span>Eternal Vowz 3D Card (30 Days)</span>
                  <span className="font-medium">₹{baseInr}</span>
                </div>
                {discountInr > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold">-₹{discountInr}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#E2D7BD]/70 flex items-center justify-between">
                  <span className="font-semibold text-[#291418]">Total Payable</span>
                  <div className="text-right">
                    {discountInr > 0 && (
                      <span className="text-xs text-[#A5947E] line-through mr-2">
                        ₹{baseInr}
                      </span>
                    )}
                    <span className="font-serif text-2xl font-bold text-[#291418]">
                      {isFree ? 'FREE' : `₹${finalInr}`}
                    </span>
                  </div>
                </div>
              </div>

              {paymentError && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Pay / Unlock Button */}
              <button
                type="button"
                onClick={handleProceedPayment}
                disabled={paying}
                className="w-full py-3.5 px-5 rounded-lg bg-[#C9A84C] hover:bg-[#B8963B] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-[0.16em] transition-colors shadow-sm cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {paying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : isFree ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Unlock Free with {appliedCoupon?.code}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{finalInr} Securely via Razorpay</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-[#8B7355]">
                <span className="inline-flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#C9A84C]" />
                  Razorpay Secured
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#C9A84C]" />
                  UPI / Cards / NetBanking
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
