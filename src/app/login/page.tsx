'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { EternalLogoBadge } from '@/components/layout/EternalLoader';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('Ayaan & Zoya');
  const [email, setEmail] = useState('mrsalman7307@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    DataService.loginHost(
      mode === 'signup' ? name : name || 'Host',
      email,
      ''
    );
    setTimeout(() => {
      router.push('/dashboard');
    }, 300);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    DataService.loginHost('Ayaan & Zoya', 'mrsalman7307@gmail.com', '');
    setTimeout(() => {
      router.push('/dashboard');
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 hero-radial-glow">
        <div className="w-full max-w-md rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-8 editorial-card-shadow">
          {/* E&V Animated Crest */}
          <div className="flex flex-col items-center mb-5">
            <EternalLogoBadge size="lg" animated />
            <span className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-[11px] font-semibold text-[#8B7355]">
              <span>Eternal Vowz (E&amp;V) &bull; Flat ₹79 / Card</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-[#F2ECE1] border border-[#E2D7BD] mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('signin')}
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
              onClick={() => setMode('signup')}
              className={`py-2.5 rounded-full transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#C9A84C] text-white shadow-xs'
                  : 'text-[#8B7355] hover:text-[#291418]'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6 text-center">
            <h1 className="font-serif text-3xl font-normal text-[#291418]">
              {mode === 'signin' ? 'Welcome to Eternal Vowz' : 'Create Your Host Account'}
            </h1>
            <p className="text-xs text-[#8B7355] mt-1.5">
              {mode === 'signin'
                ? 'Manage your 3D Lifafa, Shahi Palace Gate & Frosted Veil cards and live RSVPs.'
                : 'Craft your royal 3D wedding card in minutes — ₹79 per card (1-month validity).'}
            </p>
          </div>

          {/* 1-Click Quick Demo Login */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full mb-5 py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E2D7BD] text-[#291418] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
              <span>1-Click Instant Demo Host Access (5 Sample Cards)</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
          </button>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-[#E2D7BD]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-[#8B7355] font-medium">
              or continue with email
            </span>
            <div className="flex-grow border-t border-[#E2D7BD]" />
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#5A4636] mb-1">
                Couple / Host Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ayaan & Zoya"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] focus:outline-none focus:border-[#C9A84C] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4636] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] focus:outline-none focus:border-[#C9A84C] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4636] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E2D7BD] text-sm text-[#291418] focus:outline-none focus:border-[#C9A84C] focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button-shine w-full py-3.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2 shadow-sm"
            >
              <span>
                {isLoading
                  ? 'Opening Eternal Vowz Studio...'
                  : mode === 'signin'
                  ? 'Sign In & Open Wedding Dashboard'
                  : 'Create Account & Start Designing'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#8B7355]">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>5 Unique 3D Designs</span>
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>₹79 / Card (30 Days)</span>
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>WhatsApp Support Unlocked</span>
            </span>
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
