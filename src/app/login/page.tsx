'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { EternalLogoBadge } from '@/components/layout/EternalLoader';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

function sanitizeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\')) {
    return '/dashboard';
  }
  return raw;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.15 3.56-8.86z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3a7.17 7.17 0 0 1-10.67-3.77H1.39v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.39 14.33A7.2 7.2 0 0 1 5.01 12c0-.81.14-1.6.38-2.33v-3.1H1.39A12 12 0 0 0 0 12c0 1.94.46 3.77 1.39 5.43l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.39 6.57l4 3.1A7.17 7.17 0 0 1 12 4.77z"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNext(searchParams.get('next'));
  const authErrorParam = searchParams.get('error');

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  const [checkingSession, setCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(authErrorParam);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Resend OTP Countdown Timer (60s)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Automatically redirect if user already has an active verified Supabase session
  useEffect(() => {
    let active = true;
    DataService.getAuthenticatedHost().then((host) => {
      if (!active) return;
      if (host) {
        router.replace(nextPath);
      } else {
        setCheckingSession(false);
      }
    });
    return () => {
      active = false;
    };
  }, [router, nextPath]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step !== 'otp' || countdown <= 0) {
      if (countdown <= 0) setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  // 1-Click Google OAuth
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleLoading(true);
    const { error } = await DataService.signInWithGoogle(nextPath);
    if (error) {
      setErrorMsg(error);
      setGoogleLoading(false);
    }
  };

  // STEP 1: Send OTP to Email (Auto Creates user on first time, logs in on returning)
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const { error } = await DataService.sendEmailOtp(cleanEmail);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    setStep('otp');
    setOtpDigits(['', '', '', '', '', '']);
    setCountdown(60);
    setCanResend(false);
    setSuccessMsg(`We sent a 6-digit login code to ${cleanEmail}`);

    // Focus first OTP input on next tick
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    await handleSendOtp();
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const token = (codeToVerify || otpDigits.join('')).trim();

    if (token.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit code sent to your email.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    const { user, error } = await DataService.verifyEmailOtp(cleanEmail, token);
    setIsLoading(false);

    if (error || !user) {
      setErrorMsg(error || 'Invalid or expired verification code. Please check and try again.');
      return;
    }

    setSuccessMsg('Verification successful! Opening your dashboard...');
    setTimeout(() => {
      router.replace(nextPath);
    }, 400);
  };

  // Handle individual OTP input changes
  const handleOtpChange = (index: number, val: string) => {
    setErrorMsg(null);
    // Allow paste of 6 digits
    if (val.length > 1) {
      const cleanDigits = val.replace(/\D/g, '').slice(0, 6).split('');
      const updated = [...otpDigits];
      cleanDigits.forEach((digit, i) => {
        if (i < 6) updated[i] = digit;
      });
      setOtpDigits(updated);
      const nextFocus = Math.min(cleanDigits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();

      if (cleanDigits.length === 6) {
        handleVerifyOtp(cleanDigits.join(''));
      }
      return;
    }

    const digit = val.replace(/\D/g, '');
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    // Auto-advance
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are typed
    if (digit && index === 5) {
      const full = updated.join('');
      if (full.length === 6) {
        handleVerifyOtp(full);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  if (checkingSession) {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#E2D7BD] p-10 editorial-card-shadow flex flex-col items-center justify-center gap-3 text-center">
        <Loader2 className="w-7 h-7 text-[#C9A84C] animate-spin" />
        <p className="text-xs font-medium text-[#8B7355]">Verifying secure session...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-8 editorial-card-shadow">
      {/* E&V Animated Crest */}
      <div className="flex flex-col items-center mb-5">
        <EternalLogoBadge size="lg" animated />
        <span className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-[11px] font-semibold text-[#8B7355]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Eternal Vowz &bull; Passwordless Email Access</span>
        </span>
      </div>

      {/* Header Info */}
      <div className="mb-5 text-center">
        <h1 className="font-serif text-3xl font-normal text-[#291418]">
          {step === 'email' ? 'Sign In or Sign Up' : 'Enter Verification Code'}
        </h1>
        <p className="text-xs text-[#8B7355] mt-1.5 leading-relaxed">
          {step === 'email' ? (
            <>
              Enter your email to receive a secure 6-digit code.
              <br />
              <span className="text-[#A27A2F] font-medium">First time here?</span> Your host account is created automatically!
            </>
          ) : (
            <>
              Enter the 6-digit code sent to <strong className="text-[#291418]">{email}</strong>
            </>
          )}
        </p>
      </div>

      {/* Error & Success Banners */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-tight">{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span className="leading-tight">{successMsg}</span>
        </div>
      )}

      {/* =========================================================================
          STEP 1: ENTER EMAIL
      ========================================================================= */}
      {step === 'email' ? (
        <>
          {/* Optional Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#D8CBB3] text-[#291418] text-sm font-medium flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer disabled:opacity-60 mb-5"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C9A84C]" />
            ) : (
              <GoogleIcon />
            )}
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <span className="h-[1px] w-full bg-[#EFE7D8]" />
            <span className="px-3 text-[11px] uppercase tracking-widest text-[#9C866A] bg-white shrink-0">
              or with email OTP
            </span>
            <span className="h-[1px] w-full bg-[#EFE7D8]" />
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] mb-1.5">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. brideorhost@gmail.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] placeholder:text-[#A89885] focus:outline-none focus:border-[#C9A84C] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-sans font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F3E2B3] to-[#C5A059] text-[#2A1408] shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Login Code...</span>
                </>
              ) : (
                <>
                  <span>Send Login Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#F2ECE1] text-center">
            <span className="text-[11px] text-[#8B7355] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Flat ₹79 per published wedding invitation card</span>
            </span>
          </div>
        </>
      ) : (
        /* =========================================================================
            STEP 2: ENTER 6-DIGIT OTP
        ========================================================================= */
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs px-1">
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="inline-flex items-center gap-1 text-[#8B7355] hover:text-[#291418] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Email</span>
            </button>
            <span className="text-[#8B7355] font-mono font-medium">Valid for 10 mins</span>
          </div>

          {/* 6 Digit Input Boxes */}
          <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  otpInputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedData = e.clipboardData.getData('text');
                  handleOtpChange(idx, pastedData);
                }}
                className={`w-full aspect-square text-center font-mono text-2xl font-bold rounded-xl border transition-all select-none ${
                  digit
                    ? 'border-[#C9A84C] bg-white text-[#291418] shadow-xs'
                    : 'border-[#E2D7BD] bg-[#FAF7F2] text-[#8B7355]'
                } focus:outline-none focus:border-[#C9A84C] focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/25`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={() => handleVerifyOtp()}
            disabled={isLoading || otpDigits.join('').length !== 6}
            className="w-full py-3.5 px-4 rounded-xl font-sans font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F3E2B3] to-[#C5A059] text-[#2A1408] shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <span>Verify & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend Code Countdown */}
          <div className="text-center pt-2">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A27A2F] hover:text-[#7A5828] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resend Login Code</span>
              </button>
            ) : (
              <span className="text-xs text-[#8B7355]">
                Didn&apos;t receive code? Resend in{' '}
                <strong className="text-[#291418] font-mono">{countdown}s</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#291418]">
      <WeddingNavbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16 relative">
        {/* Soft Background Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.18) 0%, rgba(250,247,242,0) 70%)',
          }}
        />

        <div className="relative z-10 w-full flex justify-center">
          <Suspense
            fallback={
              <div className="w-full max-w-md rounded-3xl bg-white border border-[#E2D7BD] p-10 editorial-card-shadow flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="w-7 h-7 text-[#C9A84C] animate-spin" />
                <p className="text-xs font-medium text-[#8B7355]">Loading secure authentication...</p>
              </div>
            }
          >
            <LoginFormContent />
          </Suspense>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
