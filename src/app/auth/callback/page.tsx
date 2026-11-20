'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DataService } from '@/lib/data-service';
import { EternalLogoBadge } from '@/components/layout/EternalLoader';
import { Loader2, AlertCircle } from 'lucide-react';

function sanitizeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\')) {
    return '/dashboard';
  }
  return raw;
}

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function completeAuth() {
      if (!supabase) {
        if (active) setErrorMsg('Authentication service is not configured.');
        return;
      }

      const errorDesc =
        searchParams.get('error_description') || searchParams.get('error');
      if (errorDesc) {
        if (active) setErrorMsg(errorDesc);
        return;
      }

      const nextPath = sanitizeNext(searchParams.get('next'));
      const code = searchParams.get('code');

      try {
        // Check if Supabase already parsed session from URL automatically
        const existingHost = await DataService.getAuthenticatedHost();
        if (existingHost) {
          if (active) router.replace(nextPath);
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            if (active) setErrorMsg(error.message);
            return;
          }
          const verifiedHost = await DataService.getAuthenticatedHost();
          if (verifiedHost && active) {
            router.replace(nextPath);
            return;
          }
        }

        // Wait briefly for hash-fragment session detection if applicable
        await new Promise((r) => setTimeout(r, 400));
        const finalHost = await DataService.getAuthenticatedHost();
        if (finalHost && active) {
          router.replace(nextPath);
        } else if (active) {
          setErrorMsg('Could not complete sign-in. Please try logging in again.');
        }
      } catch {
        if (active) {
          setErrorMsg('Authentication handshake failed. Please try again.');
        }
      }
    }

    completeAuth();
    return () => {
      active = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#E2D7BD] p-8 text-center shadow-lg space-y-4">
        <div className="flex justify-center">
          <EternalLogoBadge size="lg" animated />
        </div>

        {errorMsg ? (
          <>
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              Return to Sign In
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="w-7 h-7 text-[#C9A84C] animate-spin mx-auto" />
            <h1 className="font-serif text-2xl text-[#291418]">
              Securing Your Session...
            </h1>
            <p className="text-xs text-[#8B7355]">
              Completing encrypted authentication and opening your Eternal Vowz Studio.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
          <Loader2 className="w-7 h-7 text-[#C9A84C] animate-spin" />
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
