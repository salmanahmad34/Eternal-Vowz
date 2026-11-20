'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Invitation } from '@/types/database';
import { DataService } from '@/lib/data-service';
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
  Info,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      close?: () => void;
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
  mode?: 'pay-existing' | 'create-new';
  defaultEmail?: string;
  onClose: () => void;
  onSuccess: (createdCard?: Invitation) => Promise<void> | void;
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

    // Remove any previously failed/stale script tag before reinjecting
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.remove();
    }

    let settled = false;
    const finish = (ok: boolean) => {
      if (!settled) {
        settled = true;
        resolve(ok);
      }
    };

    const timer = setTimeout(() => finish(Boolean(window.Razorpay)), 12000);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      clearTimeout(timer);
      finish(Boolean(window.Razorpay));
    };
    script.onerror = () => {
      clearTimeout(timer);
      finish(false);
    };
    document.body.appendChild(script);
  });
}

const IS_TEST_MODE = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').startsWith('rzp_test_');

async function authHeaders(): Promise<Record<string, string>> {
  const token = await DataService.getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {}),
  };
}

export default function RazorpayCheckoutModal({
  card,
  mode = 'pay-existing',
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
  const [verifyingStatus, setVerifyingStatus] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const completedRef = useRef(false);
  const pollInFlightRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rzpInstanceRef = useRef<{ close?: () => void } | null>(null);

  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const closeRazorpayPopup = () => {
    try {
      rzpInstanceRef.current?.close?.();
    } catch {
      // Ignore if already closed
    }
    rzpInstanceRef.current = null;
  };

  useEffect(() => {
    stopPolling();
    setCustomerEmail(defaultEmail);
    setCouponInput('');
    setAppliedCoupon(null);
    setCouponError(null);
    setPaymentError(null);
    setPaymentSuccess(null);
    setPendingOrderId(null);
    setPaying(false);
    setVerifyingStatus(false);
    completedRef.current = false;
    return () => {
      stopPolling();
    };
  }, [card?.id, mode, defaultEmail]);

  if (!card) return null;

  const isCreateNew = mode === 'create-new';
  const coupleTitle = `${card.design_config.couple_names.partner1} & ${card.design_config.couple_names.partner2}`;
  const baseInr = 79;
  const discountInr = appliedCoupon ? appliedCoupon.discount_inr : 0;
  const finalInr = appliedCoupon ? appliedCoupon.final_inr : baseInr;
  const isFree = appliedCoupon?.is_free === true;

  const buildCardPayload = () => ({
    slug: card.slug,
    theme_id: card.theme_id,
    title:
      card.title ||
      `Wedding of ${card.design_config.couple_names.partner1} & ${card.design_config.couple_names.partner2}`,
    event_date: card.event_date,
    venue_details: card.venue_details,
    design_config: card.design_config,
  });

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

  const celebrateSuccess = async (message: string, createdCard?: Invitation) => {
    if (completedRef.current) return;
    completedRef.current = true;
    stopPolling();
    closeRazorpayPopup();
    setPaying(false);
    setVerifyingStatus(false);
    setPendingOrderId(null);
    setPaymentError(null);
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
    await onSuccess(createdCard);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const checkOrderStatusFromServer = async (
    orderId: string,
    cardPayload?: ReturnType<typeof buildCardPayload>,
    silentIfUnpaid = false
  ) => {
    if (completedRef.current) return;
    setVerifyingStatus(true);
    try {
      const res = await fetch('/api/razorpay/check-order', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({
          razorpay_order_id: orderId,
          ...(isCreateNew && cardPayload ? { card_payload: cardPayload } : {}),
        }),
      });
      const data = await res.json();

      if (res.ok && data.paid) {
        await celebrateSuccess(
          isCreateNew
            ? 'Payment confirmed! Your new 3D wedding card has been created & published for 30 days.'
            : 'Payment confirmed! Your 3D wedding invitation is now active for 30 days.',
          data.card || undefined
        );
        return;
      }

      if (data.failed && data.error_description) {
        setPaymentError(
          IS_TEST_MODE
            ? `${data.error_description}. Tip: In Razorpay Test Mode, use UPI "success@razorpay" or Netbanking â†’ Success.`
            : data.error_description
        );
      } else if (!silentIfUnpaid) {
        setPaymentError(
          'Payment is not completed yet. Please try again or use UPI "success@razorpay" in Test Mode.'
        );
      }
    } catch {
      if (!silentIfUnpaid) {
        setPaymentError('Could not verify payment status. Please try again.');
      }
    } finally {
      setVerifyingStatus(false);
    }
  };

  const handleProceedPayment = async () => {
    setPaying(true);
    setPaymentError(null);
    completedRef.current = false;

    try {
      const cardPayload = isCreateNew ? buildCardPayload() : undefined;

      // 1. Create order on server (re-validates coupon securely server-side)
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(
          isCreateNew
            ? {
                create_new: true,
                card_payload: cardPayload,
                customer_email: customerEmail.trim(),
                coupon_code: appliedCoupon?.code || '',
              }
            : {
                card_id: card.id,
                customer_email: customerEmail.trim(),
                coupon_code: appliedCoupon?.code || '',
              }
        ),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        setPaymentError(orderData.error || 'Unable to initiate payment.');
        setPaying(false);
        return;
      }

      // 2. If 100% free coupon unlocked / published the card immediately
      if (orderData.freeUnlock) {
        setPaying(false);
        await celebrateSuccess(
          isCreateNew
            ? `Published free with coupon ${orderData.couponCode}! Your 3D wedding card is now live for 30 days.`
            : `Unlocked free with coupon ${orderData.couponCode}! Your 30-day card is now active.`,
          orderData.card || undefined
        );
        return;
      }

      const createdOrderId = String(orderData.orderId || '');
      setPendingOrderId(createdOrderId);

      // 3. Load Razorpay Checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        setPaymentError(
          'Could not load Razorpay Checkout script. Please disable any ad-blocker and check your internet connection.'
        );
        setPaying(false);
        return;
      }

      const prefillObj: Record<string, string> = {};
      if (customerEmail.trim()) {
        prefillObj.email = customerEmail.trim();
      }

      // 4. Open Razorpay Checkout Popup
      const options: Record<string, unknown> = {
        key: orderData.keyId,
        amount: Number(orderData.amount),
        currency: orderData.currency || 'INR',
        name: 'Eternal Vowz',
        description: `${coupleTitle} - 30-Day Digital Wedding Card`,
        order_id: createdOrderId,
        ...(Object.keys(prefillObj).length > 0 ? { prefill: prefillObj } : {}),
        notes: {
          mode: isCreateNew ? 'create_new' : 'pay_existing',
          card_id: isCreateNew ? 'pending_creation' : card.id,
          coupon_code: appliedCoupon?.code || 'none',
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        theme: {
          color: '#C9A84C',
        },
        modal: {
          escape: false,
          confirm_close: true,
          ondismiss: async () => {
            stopPolling();
            rzpInstanceRef.current = null;
            setPaying(false);
            // Automatically check with Razorpay server in case UPI intent/payment already succeeded
            if (!completedRef.current && createdOrderId) {
              await checkOrderStatusFromServer(createdOrderId, cardPayload, true);
            }
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          stopPolling();
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: await authHeaders(),
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                ...(isCreateNew ? { card_payload: cardPayload } : {}),
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              // Fallback to direct server-side Razorpay order verification
              await checkOrderStatusFromServer(createdOrderId, cardPayload, false);
              setPaying(false);
              return;
            }

            setPaying(false);
            await celebrateSuccess(
              isCreateNew
                ? 'Payment verified! Your new 3D wedding card has been created & published for 30 days.'
                : 'Payment verified! Your 3D wedding invitation is now active for 30 days.',
              verifyData.card || undefined
            );
          } catch {
            // Fallback to direct server-side Razorpay order check
            await checkOrderStatusFromServer(createdOrderId, cardPayload, false);
            setPaying(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzpInstanceRef.current = rzp;

      // Live 3-second server poll while Razorpay popup is open:
      // Catches captured UPI Intent / QR payments immediately even if Razorpay's test UPI UI hangs!
      stopPolling();
      let pollCount = 0;
      pollTimerRef.current = setInterval(async () => {
        if (pollInFlightRef.current || completedRef.current) return;
        pollCount += 1;
        if (pollCount > 60) {
          stopPolling();
          return;
        }
        pollInFlightRef.current = true;
        try {
          const pollRes = await fetch('/api/razorpay/check-order', {
            method: 'POST',
            headers: await authHeaders(),
            body: JSON.stringify({
              razorpay_order_id: createdOrderId,
              ...(isCreateNew && cardPayload ? { card_payload: cardPayload } : {}),
            }),
          });
          const pollData = await pollRes.json();
          if (pollRes.ok && pollData.paid && !completedRef.current) {
            await celebrateSuccess(
              isCreateNew
                ? 'Payment captured & verified! Your new 3D wedding card is now live for 30 days.'
                : 'Payment captured & verified! Your 3D wedding invitation is now active for 30 days.',
              pollData.card || undefined
            );
          }
        } catch {
          // Silently retry on next tick
        } finally {
          pollInFlightRef.current = false;
        }
      }, 3000);

      rzp.on('payment.failed', (failedResp: Record<string, unknown>) => {
        stopPolling();
        const errObj = failedResp?.error as
          | { description?: string; reason?: string }
          | undefined;
        const msg =
          errObj?.description ||
          errObj?.reason ||
          'Payment could not be completed.';
        setPaymentError(
          IS_TEST_MODE
            ? `${msg} In Razorpay Test Mode, please use UPI ID "success@razorpay" (under Pay using UPI ID) or Netbanking â†’ Success.`
            : msg
        );
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
      onClick={() => {
        if (!paying && !verifyingStatus) onClose();
      }}
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
              {isCreateNew ? 'Pay to Publish Card â€¢ 30-Day Pass' : '30-Day Card Activation'}
            </span>
            <h3 className="font-serif text-2xl font-semibold text-[#291418] mt-1 leading-tight">
              {coupleTitle}
            </h3>
            <p className="text-xs text-[#8B7355] mt-0.5">
              {isCreateNew
                ? 'Your card will be created & published immediately after payment succeeds.'
                : 'One-time activation â€¢ Unlimited WhatsApp guest links & RSVPs'}
            </p>
          </div>
          <button
            type="button"
            disabled={paying || verifyingStatus}
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B7355] hover:text-[#291418] hover:bg-[#FAF7F2] disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Close checkout modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {paymentSuccess ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-xl font-semibold text-emerald-900">
                {isCreateNew ? 'Card Published!' : 'Card Activated!'}
              </h4>
              <p className="text-xs text-emerald-800">{paymentSuccess}</p>
            </div>
          ) : (
            <>
              {/* Test Mode Hint Banner (only shown when rzp_test_ key is active) */}
              {IS_TEST_MODE && (
                <div className="rounded-xl bg-amber-50/90 border border-amber-200 px-3.5 py-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Razorpay Test Mode:</strong> Select{' '}
                    <strong>Pay using UPI ID</strong> and enter{' '}
                    <code className="px-1 py-0.5 rounded bg-amber-100 font-mono text-[10px]">
                      success@razorpay
                    </code>{' '}
                    (or <strong>Netbanking â†’ Success</strong>). Payment auto-confirms within 3 seconds.
                  </div>
                </div>
              )}

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
                            ? `${appliedCoupon.discount_value}% OFF â€¢ Saved â‚¹${appliedCoupon.discount_inr}`
                            : `â‚¹${appliedCoupon.discount_inr} OFF`}
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
                  <span className="font-medium">â‚¹{baseInr}</span>
                </div>
                {discountInr > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold">-â‚¹{discountInr}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#E2D7BD]/70 flex items-center justify-between">
                  <span className="font-semibold text-[#291418]">Total Payable</span>
                  <div className="text-right">
                    {discountInr > 0 && (
                      <span className="text-xs text-[#A5947E] line-through mr-2">
                        â‚¹{baseInr}
                      </span>
                    )}
                    <span className="font-serif text-2xl font-bold text-[#291418]">
                      {isFree ? 'FREE' : `â‚¹${finalInr}`}
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

              {/* Pay / Publish Button */}
              <button
                type="button"
                onClick={handleProceedPayment}
                disabled={paying || verifyingStatus}
                className="w-full py-3.5 px-5 rounded-lg bg-[#C9A84C] hover:bg-[#B8963B] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-[0.16em] transition-colors shadow-sm cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {paying || verifyingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{verifyingStatus ? 'Verifying Payment...' : 'Processing...'}</span>
                  </>
                ) : isFree ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isCreateNew
                        ? `Publish Free with ${appliedCoupon?.code}`
                        : `Unlock Free with ${appliedCoupon?.code}`}
                    </span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>
                      {isCreateNew
                        ? `Pay â‚¹${finalInr} & Publish Card`
                        : `Pay â‚¹${finalInr} Securely via Razorpay`}
                    </span>
                  </>
                )}
              </button>

              {/* Manual Fallback Verification Button if user already completed payment */}
              {pendingOrderId && !paying && (
                <button
                  type="button"
                  disabled={verifyingStatus}
                  onClick={() =>
                    checkOrderStatusFromServer(
                      pendingOrderId,
                      isCreateNew ? buildCardPayload() : undefined,
                      false
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-[#F6EEDB] border border-[#E2D7BD] text-[#5A4636] text-xs font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-[#C9A84C] ${verifyingStatus ? 'animate-spin' : ''}`}
                  />
                  <span>Already Paid? Verify Payment Status</span>
                </button>
              )}

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
