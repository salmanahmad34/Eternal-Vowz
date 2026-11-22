'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/data-service';
import { HostUser } from '@/types/database';
import { EternalLogoBadge } from './EternalLoader';
import {
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  Mail,
  LogIn,
} from 'lucide-react';

export function WeddingNavbar() {
  const [hostUser, setHostUser] = useState<HostUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setHostUser(DataService.getCurrentUser());
    DataService.getAuthenticatedHost().then((u) => setHostUser(u));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/85 backdrop-blur-md border-b border-[#E2D7BD]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Editorial Monogram Logo (E&V) + Brand Name */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <EternalLogoBadge size="md" animated />
          <div>
            <span className="font-serif text-2xl font-semibold tracking-tight text-[#291418] block leading-none">
              Eternal Vowz
            </span>
            <span className="text-[9px] uppercase tracking-[0.24em] text-[#8B7355] font-medium block mt-0.5">
              Digital Wedding Invitations
            </span>
          </div>
        </Link>

        {/* Center: Clean Editorial Navigation Row */}
        <nav className="hidden lg:flex items-center gap-7 text-[14px] font-normal text-[#5A4636]">
          <Link href="/#how-it-works" className="hover:text-[#291418] transition-colors">
            How It Works
          </Link>
          <Link href="/#designs" className="hover:text-[#291418] transition-colors inline-flex items-center gap-1.5">
            <span>Card Themes</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-bold uppercase leading-none">
              NEW
            </span>
          </Link>
          <Link href="/dashboard" className="hover:text-[#291418] transition-colors">
            The Dashboard
          </Link>
          <Link href="/#comparison" className="hover:text-[#291418] transition-colors">
            Paper vs Digital
          </Link>
          <Link href="/#faq" className="hover:text-[#291418] transition-colors">
            FAQs
          </Link>
          <Link href="/contact" className="hover:text-[#291418] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right: Outlined Log In + Solid Champagne Gold Get Started */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {hostUser ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-sm font-medium transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-md bg-white hover:bg-[#F2ECE1] text-[#291418] border border-[#E2D7BD] text-sm font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#8B7355]" />
                <span>Log In</span>
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-sm font-medium transition-colors shadow-xs"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="lg:hidden p-2.5 rounded-md border border-[#E2D7BD] bg-white text-[#291418] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2D7BD] bg-[#FAF7F2] px-4 pt-4 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-1 gap-1 text-sm font-medium text-[#291418]">
            <Link
              href="/#designs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg hover:bg-[#F2ECE1]"
            >
              5 Curated Card Themes (₹79 / Card)
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg hover:bg-[#F2ECE1]"
            >
              How It Works
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg hover:bg-[#F2ECE1]"
            >
              The Dashboard
            </Link>
            <Link
              href="/#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg hover:bg-[#F2ECE1]"
            >
              Paper vs Digital
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg hover:bg-[#F2ECE1]"
            >
              FAQs
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg hover:bg-[#F2ECE1]"
            >
              Contact Support
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E2D7BD] flex flex-col sm:hidden gap-2.5">
            {hostUser ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-md bg-[#C9A84C] text-white text-sm font-medium text-center"
              >
                Open Host Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-md bg-[#C9A84C] text-white text-sm font-medium text-center"
                >
                  Get Started &bull; ₹79 / Card
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-md bg-white border border-[#E2D7BD] text-[#291418] text-sm font-medium text-center"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


export function WeddingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#1F1410] text-[#D9C9AE]">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <EternalLogoBadge size="md" />
              <div>
                <span className="font-serif text-2xl font-semibold text-[#FFF4DD] block leading-none">
                  Eternal Vowz
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] font-medium block mt-1">
                  Digital Wedding Invitations
                </span>
              </div>
            </div>
            <p className="text-sm text-[#BFAE92] max-w-sm leading-relaxed">
              Cinematic 3D wedding cards with built-in RSVP tracking. Flat{' '}
              <span className="text-[#FFF4DD] font-medium">₹79 per card</span>, live for 30 days.
            </p>
            <a
              href="mailto:mrsalman7307@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A84C]/40 text-xs font-medium text-[#FFF4DD] hover:bg-[#C9A84C] hover:text-[#1F1410] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>mrsalman7307@gmail.com</span>
            </a>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#designs" className="hover:text-white transition-colors">Card Themes</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/#comparison" className="hover:text-white transition-colors">Paper vs Digital</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Host Login</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-4">
              Legal &amp; Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund &amp; Cancellation Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping &amp; Delivery Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-[#BFAE92]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
              Secure payments by Razorpay
            </span>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-[#C9A84C]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8F7F66]">
          <p>&copy; {year} Eternal Vowz (E&amp;V). All rights reserved.</p>
          <p>Made with care for every nikah &amp; shaadi</p>
        </div>
      </div>
    </footer>
  );
}
