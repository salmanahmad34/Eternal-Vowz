'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { EternalLogoBadge } from '@/components/layout/EternalLoader';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';

function sanitizeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\')) {
    return '/dashboard';
  }
  return raw;
}

// =========================================================================
// PER-USER DAILY OTP RATE LIMITER (Protects Gmail SMTP Quota)
// =========================================================================
const OTP_LIMIT_KEY_PREFIX = 'ev_otp_daily_';
const MAX_OTP_PER_DAY = 5;

function checkEmailOtpLimit(email: string): { allowed: boolean; error?: string } {
  if (typeof window === 'undefined') return { allowed: true };
  const clean = email.toLowerCase().trim();
  const key = OTP_LIMIT_KEY_PREFIX + clean;
  const stored = localStorage.getItem(key);
  if (!stored) return { allowed: true };

  try {
    const { count, start } = JSON.parse(stored);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - start > oneDay) {
      localStorage.removeItem(key);
      return { allowed: true };
    }
    if (count >= MAX_OTP_PER_DAY) {
      const hoursRemaining = Math.ceil((oneDay - (now - start)) / (1000 * 60 * 60));
      return {
        allowed: false,
        error: `Daily OTP limit reached for this email (${MAX_OTP_PER_DAY}/day). For security, please wait ${hoursRemaining} hour(s) before requesting another code.`,
      };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

function recordEmailOtpSent(email: string) {
  if (typeof window === 'undefined') return;
  const clean = email.toLowerCase().trim();
  const key = OTP_LIMIT_KEY_PREFIX + clean;
  const stored = localStorage.getItem(key);
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (!stored) {
    localStorage.setItem(key, JSON.stringify({ count: 1, start: now }));
    return;
  }
  try {
    const { count, start } = JSON.parse(stored);
    if (now - start > oneDay) {
      localStorage.setItem(key, JSON.stringify({ count: 1, start: now }));
    } else {
      localStorage.setItem(key, JSON.stringify({ count: count + 1, start }));
    }
  } catch {
    localStorage.setItem(key, JSON.stringify({ count: 1, start: now }));
  }
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNext(searchParams.get('next'));
  const authErrorParam = searchParams.get('error');

  // Mode: 'signin' | 'signup' | 'forgot'
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  // Signup step: 'form' | 'otp'
  const [signupStep, setSignupStep] = useState<'form' | 'otp'>('form');
  // Forgot password step: 'email' | 'otp' | 'new_password'
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'new_password'>('email');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(authErrorParam);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Resend OTP Countdown Timer (60s)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputRef = useRef<HTMLInputElement | null>(null);

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
    const isWaitingOtp = (mode === 'signup' && signupStep === 'otp') || (mode === 'forgot' && forgotStep === 'otp');
    if (!isWaitingOtp || countdown <= 0) {
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
  }, [mode, signupStep, forgotStep, countdown]);

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode);
    setSignupStep('form');
    setForgotStep('email');
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // =========================================================================
  // 1. SIGN IN (Email + Password -> Zero OTP required!)
  // =========================================================================
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const { user, error } = await DataService.signInWithEmail(cleanEmail, password);
    setIsLoading(false);

    if (error || !user) {
      setErrorMsg(error || 'Invalid email or password. Please try again.');
      return;
    }

    setSuccessMsg('Welcome back! Opening your dashboard...');
    setTimeout(() => {
      router.replace(nextPath);
    }, 300);
  };

  // =========================================================================
  // 2. CREATE ACCOUNT (Sign Up -> Sends 6-digit OTP verification)
  // =========================================================================
  const handleStartSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Check per-email daily limit (max 5 OTPs/day)
    const rateCheck = checkEmailOtpLimit(cleanEmail);
    if (!rateCheck.allowed) {
      setErrorMsg(rateCheck.error || 'Daily OTP limit reached for this email.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const { user, needsConfirmation, error } = await DataService.signUpWithEmail(
      fullName.trim() || 'Host',
      cleanEmail,
      password
    );
    setIsLoading(false);

    if (error) {
      if (
        error.toLowerCase().includes('rate limit') ||
        error.toLowerCase().includes('over_email_send_rate_limit')
      ) {
        setErrorMsg(
          'Supabase email hourly limit reached. Please wait a few minutes before requesting another code.'
        );
      } else {
        setErrorMsg(error);
      }
      return;
    }

    if (needsConfirmation) {
      recordEmailOtpSent(cleanEmail);
      setSignupStep('otp');
      setOtpCode('');
      setCountdown(60);
      setCanResend(false);
      setSuccessMsg(`We sent a 6-digit verification code to ${cleanEmail}`);
      setTimeout(() => otpInputRef.current?.focus(), 150);
    } else if (user) {
      setSuccessMsg('Account created! Opening your dashboard...');
      setTimeout(() => router.replace(nextPath), 300);
    }
  };

  const handleVerifySignupOtp = async (codeToVerify?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const token = (codeToVerify || otpCode).trim();

    if (token.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    const { user, error } = await DataService.verifySignupOtp(cleanEmail, token);
    setIsLoading(false);

    if (error || !user) {
      setErrorMsg(error || 'Invalid or expired verification code. Please check and try again.');
      return;
    }

    setSuccessMsg('Account verified successfully! Opening your dashboard...');
    setTimeout(() => {
      router.replace(nextPath);
    }, 400);
  };

  // =========================================================================
  // 3. FORGOT PASSWORD (3-Step Flow: Email -> Verify OTP -> Set & Confirm New Password)
  // =========================================================================

  // Step 1: Send Reset OTP to Email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Check per-email daily limit (max 5 OTPs/day)
    const rateCheck = checkEmailOtpLimit(cleanEmail);
    if (!rateCheck.allowed) {
      setErrorMsg(rateCheck.error || 'Daily OTP limit reached for this email.');
      return;
    }

    setIsLoading(true);
    const { error } = await DataService.sendPasswordReset(cleanEmail);
    setIsLoading(false);

    if (error) {
      if (
        error.toLowerCase().includes('rate limit') ||
        error.toLowerCase().includes('over_email_send_rate_limit')
      ) {
        setErrorMsg(
          'Supabase email hourly limit reached. Please wait a few minutes before requesting another code.'
        );
      } else {
        setErrorMsg(error);
      }
      return;
    }

    recordEmailOtpSent(cleanEmail);
    setForgotStep('otp');
    setOtpCode('');
    setCountdown(60);
    setCanResend(false);
    setSuccessMsg(`A 6-digit password reset code was sent to ${cleanEmail}`);
    setTimeout(() => otpInputRef.current?.focus(), 150);
  };

  // Step 2: Verify OTP Only (Advances to Next Screen only if OTP is correct!)
  const handleVerifyResetOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    if (cleanOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit reset code.');
      return;
    }

    setIsLoading(true);
    const { error } = await DataService.verifyResetOtp(cleanEmail, cleanOtp);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error || 'Invalid or expired reset code. Please check and try again.');
      return;
    }

    // OTP Verified! Advance to the dedicated Next Page for new password
    setForgotStep('new_password');
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMsg('Code verified! Please enter your new password below.');
  };

  // Step 3: Set New Password & Confirm Password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure both password fields match.');
      return;
    }

    setIsLoading(true);
    const { error } = await DataService.updatePassword(newPassword);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error || 'Failed to update password. Please try again.');
      return;
    }

    setSuccessMsg('Password updated successfully! Opening your dashboard...');
    setTimeout(() => {
      router.replace(nextPath);
    }, 400);
  };

  // Loading state during initial session check
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
          <span>Eternal Vowz &bull; Secure Host Access</span>
        </span>
      </div>

      {/* Tabs: Sign In vs Create Account */}
      {mode !== 'forgot' && (
        <div className="grid grid-cols-2 p-1 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] mb-5">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-[#291418] shadow-xs border border-[#E2D7BD]'
                : 'text-[#8B7355] hover:text-[#291418]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#291418] shadow-xs border border-[#E2D7BD]'
                : 'text-[#8B7355] hover:text-[#291418]'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="mb-5 text-center">
        <h1 className="font-serif text-3xl font-normal text-[#291418]">
          {mode === 'signin' && 'Welcome Back'}
          {mode === 'signup' && (signupStep === 'form' ? 'Create Host Account' : 'Verify Your Email')}
          {mode === 'forgot' && forgotStep === 'email' && 'Forgot Password?'}
          {mode === 'forgot' && forgotStep === 'otp' && 'Verify Reset Code'}
          {mode === 'forgot' && forgotStep === 'new_password' && 'Set New Password'}
        </h1>
        <p className="text-xs text-[#8B7355] mt-1.5 leading-relaxed">
          {mode === 'signin' && 'Sign in with your email and password to access your dashboard.'}
          {mode === 'signup' && signupStep === 'form' && 'Create your account to design bespoke 3D digital wedding cards.'}
          {mode === 'signup' && signupStep === 'otp' && (
            <>
              Enter the 6-digit verification code sent to <strong className="text-[#291418]">{email}</strong>
            </>
          )}
          {mode === 'forgot' && forgotStep === 'email' && 'Enter your registered email to receive a 6-digit password reset code.'}
          {mode === 'forgot' && forgotStep === 'otp' && (
            <>
              Enter the 6-digit code sent to <strong className="text-[#291418]">{email}</strong> to verify your identity.
            </>
          )}
          {mode === 'forgot' && forgotStep === 'new_password' && 'Code verified! Enter and confirm your new password.'}
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
          MODE 1: SIGN IN (Zero OTP)
      ========================================================================= */}
      {mode === 'signin' && (
        <>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] mb-1.5">
                Email Address
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs text-[#A27A2F] hover:text-[#7A5828] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] placeholder:text-[#A89885] focus:outline-none focus:border-[#C9A84C] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#291418] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password}
              className="w-full py-3.5 px-4 rounded-xl font-sans font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F3E2B3] to-[#C5A059] text-[#2A1408] shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#F2ECE1] text-center">
            <span className="text-[11px] text-[#8B7355] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Flat ₹99 per published wedding invitation card</span>
            </span>
          </div>
        </>
      )}

      {/* =========================================================================
          MODE 2: CREATE ACCOUNT (Sign Up with 6-digit OTP verification)
      ========================================================================= */}
      {mode === 'signup' && signupStep === 'form' && (
        <form onSubmit={handleStartSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] mb-1.5">
              Your Name / Couple Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoFocus
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sophia & Alexander"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] placeholder:text-[#A89885] focus:outline-none focus:border-[#C9A84C] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. brideorhost@gmail.com"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] placeholder:text-[#A89885] focus:outline-none focus:border-[#C9A84C] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] mb-1.5">
              Choose Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] placeholder:text-[#A89885] focus:outline-none focus:border-[#C9A84C] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#291418] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim() || password.length < 6}
            className="w-full py-3.5 px-4 rounded-xl font-sans font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F3E2B3] to-[#C5A059] text-[#2A1408] shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Verification OTP...</span>
              </>
            ) : (
              <>
                <span>Create Account & Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* SIGNUP STEP 2: VERIFY OTP */}
      {mode === 'signup' && signupStep === 'otp' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs px-1">
            <button
              type="button"
              onClick={() => {
                setSignupStep('form');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="inline-flex items-center gap-1 text-[#8B7355] hover:text-[#291418] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Form</span>
            </button>
            <span className="text-[#8B7355] font-mono font-medium">Valid for 10 mins</span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] text-center">
              Enter 6-Digit Email Code
            </label>
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              autoFocus
              autoComplete="one-time-code"
              maxLength={6}
              value={otpCode}
              onChange={(e) => {
                setErrorMsg(null);
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtpCode(val);
                if (val.length === 6) {
                  handleVerifySignupOtp(val);
                }
              }}
              placeholder="••••••"
              className="w-full text-center font-mono text-3xl font-bold tracking-[0.3em] py-3.5 px-4 rounded-xl border-2 border-[#C9A84C] bg-white text-[#291418] placeholder:text-[#D8C7A8] focus:outline-none focus:ring-4 focus:ring-[#C9A84C]/20 shadow-xs transition-all"
            />
            <p className="text-[11px] text-center text-[#8B7355]">
              Check your inbox for the royal verification email from Eternal Vowz.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleVerifySignupOtp()}
            disabled={isLoading || otpCode.length < 6}
            className="w-full py-3.5 px-4 rounded-xl font-sans font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F3E2B3] to-[#C5A059] text-[#2A1408] shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <span>Verify & Activate Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-1">
            {canResend ? (
              <button
                type="button"
                onClick={handleStartSignUp}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A27A2F] hover:text-[#7A5828] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resend Verification Code</span>
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

      {/* =========================================================================
          MODE 3: FORGOT PASSWORD (STRICT 3-STEP FLOW)
      ========================================================================= */}

      {/* STEP 1: Enter Registered Email */}
      {mode === 'forgot' && forgotStep === 'email' && (
        <form onSubmit={handleSendResetEmail} className="space-y-4">
          <div className="text-left">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="inline-flex items-center gap-1 text-xs text-[#8B7355] hover:text-[#291418] transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] mb-1.5">
              Enter Your Registered Email
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
                placeholder="brideorhost@gmail.com"
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
                <span>Sending Reset Code...</span>
              </>
            ) : (
              <>
                <span>Send Password Reset Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: Enter & Verify 6-Digit OTP Only (Next page ONLY opens if verified!) */}
      {mode === 'forgot' && forgotStep === 'otp' && (
        <form onSubmit={handleVerifyResetOtp} className="space-y-5">
          <div className="flex items-center justify-between text-xs px-1">
            <button
              type="button"
              onClick={() => {
                setForgotStep('email');
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

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] text-center">
              Enter 6-Digit Password Reset Code
            </label>
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              autoFocus
              autoComplete="one-time-code"
              maxLength={6}
              value={otpCode}
              onChange={(e) => {
                setErrorMsg(null);
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtpCode(val);
              }}
              placeholder="••••••"
              className="w-full text-center font-mono text-3xl font-bold tracking-[0.3em] py-3.5 px-4 rounded-xl border-2 border-[#C9A84C] bg-white text-[#291418] placeholder:text-[#D8C7A8] focus:outline-none focus:ring-4 focus:ring-[#C9A84C]/20 shadow-xs transition-all"
            />
            <p className="text-[11px] text-center text-[#8B7355]">
              Check your inbox for the reset code sent to <strong className="text-[#291418]">{email}</strong>.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || otpCode.length < 6}
            className="w-full py-3.5 px-4 rounded-xl font-sans font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F3E2B3] to-[#C5A059] text-[#2A1408] shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <span>Verify Code & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-1">
            {canResend ? (
              <button
                type="button"
                onClick={handleSendResetEmail}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A27A2F] hover:text-[#7A5828] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resend Reset Code</span>
              </button>
            ) : (
              <span className="text-xs text-[#8B7355]">
                Didn&apos;t receive code? Resend in{' '}
                <strong className="text-[#291418] font-mono">{countdown}s</strong>
              </span>
            )}
          </div>
        </form>
      )}

      {/* STEP 3: NEXT PAGE - Set New Password & Confirm New Password */}
      {mode === 'forgot' && forgotStep === 'new_password' && (
        <form onSubmit={handleSetNewPassword} className="space-y-4">
          <div className="text-left">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="inline-flex items-center gap-1 text-xs text-[#8B7355] hover:text-[#291418] transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] mb-1.5">
              New Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                autoFocus
                minLength={6}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] placeholder:text-[#A89885] focus:outline-none focus:border-[#C9A84C] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#291418] transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password (Separate input to confirm!) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4636] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password to confirm"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] placeholder:text-[#A89885] focus:outline-none focus:border-[#C9A84C] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#291418] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || newPassword.length < 6 || confirmPassword.length < 6}
            className="w-full py-3.5 px-4 rounded-xl font-sans font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F3E2B3] to-[#C5A059] text-[#2A1408] shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Save Password & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
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
