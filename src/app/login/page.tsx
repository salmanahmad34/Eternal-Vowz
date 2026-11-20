'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { EternalLogoBadge } from '@/components/layout/EternalLoader';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Loader2,
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

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(authErrorParam);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Redirect automatically if user already has a verified Supabase session
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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      const { error } = await DataService.sendPasswordReset(cleanEmail);
      setIsLoading(false);
      if (error) {
        setErrorMsg(error);
      } else {
        setSuccessMsg(
          'Password reset link sent! Please check your email inbox (and spam folder).'
        );
      }
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    if (mode === 'signin') {
      const { user, error } = await DataService.signInWithEmail(cleanEmail, password);
      if (error || !user) {
        setErrorMsg(error || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }
      router.replace(nextPath);
      return;
    }

    // Sign Up mode
    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your name or couple name (at least 2 characters).');
      setIsLoading(false);
      return;
    }

    const { user, needsConfirmation, error } = await DataService.signUpWithEmail(
      name.trim(),
      cleanEmail,
      password
    );
    setIsLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    if (user) {
      router.replace(nextPath);
      return;
    }

    if (needsConfirmation) {
      setSuccessMsg(
        'Verification email sent! Please click the link in your inbox to activate your account and sign in.'
      );
      setMode('signin');
      setPassword('');
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
          <span>Eternal Vowz &bull; Verified Secure Auth</span>
        </span>
      </div>

      {/* Mode Tabs */}
      {mode !== 'forgot' && (
        <div className="grid grid-cols-2 p-1 rounded-full bg-[#F2ECE1] border border-[#E2D7BD] mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2.5 rounded-full transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#C9A84C] text-white shadow-xs'
                : 'text-[#8B7355] hover:text-[#291418]'
            }`}
          >
            Host Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2.5 rounded-full transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#C9A84C] text-white shadow-xs'
                : 'text-[#8B7355] hover:text-[#291418]'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      <div className="mb-5 text-center">
        <h1 className="font-serif text-3xl font-normal text-[#291418]">
          {mode === 'signin'
            ? 'Welcome Back'
            : mode === 'signup'
            ? 'Create Host Account'
            : 'Reset Password'}
        </h1>
        <p className="text-xs text-[#8B7355] mt-1">
          {mode === 'signin'
            ? 'Sign in securely to manage your 3D wedding cards & live RSVPs.'
            : mode === 'signup'
            ? 'Create your private host studio — flat ₹79 per published card.'
            : 'Enter your registered email to receive a secure password reset link.'}
        </p>
      </div>

      {/* Error & Success Banners */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Real Google OAuth Button */}
      {mode !== 'forgot' && (
        <>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#D8CBB3] text-[#291418] text-sm font-medium flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C9A84C]" />
            ) : (
              <GoogleIcon />
            )}
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative my-5 flex items-center justify-center">
            <span className="h-[1px] w-full bg-[#EFE7D8]" />
            <span className="px-3 text-[11px] uppercase tracking-widest text-[#9C866A] bg-white shrink-0">
              or with email
            </span>
            <span className="h-[1px] w-full bg-[#EFE7D8]" />
          </div>
        </>
      )}

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-medium text-[#5A4636] mb-1">
              Couple / Host Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name or couple name"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] focus:outline-none focus:border-[#C9A84C] focus:bg-white"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#5A4636] mb-1">
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
              placeholder="you@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] focus:outline-none focus:border-[#C9A84C] focus:bg-white"
            />
          </div>
        </div>

        {mode !== 'forgot' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#5A4636]">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[11px] font-medium text-[#9F7E28] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min 8 characters' : 'Enter your password'}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] focus:outline-none focus:border-[#C9A84C] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#291418] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || googleLoading}
          className="button-shine w-full py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2 shadow-sm disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Please wait...</span>
            </>
          ) : (
            <>
              <span>
                {mode === 'signin'
                  ? 'Sign In Securely'
                  : mode === 'signup'
                  ? 'Create Verified Account'
                  : 'Send Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="w-full py-2 text-xs font-medium text-[#8B7355] hover:text-[#291418] cursor-pointer"
          >
            &larr; Back to Host Login
          </button>
        )}
      </form>

      <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-[#8B7355]">
        <span className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Google &amp; Email Auth</span>
        </span>
        <span className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>PKCE Encrypted Sessions</span>
        </span>
        <span className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Private Per-User Cards</span>
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 hero-radial-glow">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-3xl bg-white border border-[#E2D7BD] p-10 editorial-card-shadow flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 text-[#C9A84C] animate-spin" />
              <p className="text-xs font-medium text-[#8B7355]">Loading secure sign in...</p>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </main>

      <WeddingFooter />
    </div>
  );
}
