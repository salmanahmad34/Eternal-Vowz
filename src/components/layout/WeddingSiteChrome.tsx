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
  return (
    <footer className="bg-[#F2ECE1] border-t border-[#E2D7BD] text-[#5A4636]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Column (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <EternalLogoBadge size="md" />
              <div>
                <span className="font-serif text-2xl font-semibold text-[#291418] block leading-none">
                  Eternal Vowz
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8B7355] font-medium block mt-0.5">
                  Digital Wedding Invitations &amp; RSVP Tracking
                </span>
              </div>
            </div>
            <p className="text-sm text-[#6E5B47] max-w-md leading-relaxed">
              Invitations as special as the moment itself. Create interactive 3D Embossed Lifafas, 3D Shahi Palace Double-Door Gates, and Cinematic Frosted-Blur Veils with built-in RSVP tracking — flat <strong>₹79 per card</strong> (active for 1 month / 30 days).
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2D7BD] text-xs font-medium text-[#291418]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>256-Bit SSL &amp; Payment Ready</span>
              </span>
              <a
                href="mailto:mrsalman7307@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2D7BD] text-xs font-medium text-[#291418] hover:text-[#C9A84C] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>mrsalman7307@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#291418] mb-3.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6E5B47]">
              <li>
                <Link href="/#designs" className="hover:text-[#291418] transition-colors">
                  5 Curated Card Themes (₹79)
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#291418] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#comparison" className="hover:text-[#291418] transition-colors">
                  Paper vs Digital
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#291418] transition-colors">
                  Host Login / Get Started
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#291418] transition-colors">
                  The Host Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#291418] mb-3.5">
              Legal &amp; Support
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6E5B47]">
              <li>
                <Link href="/privacy" className="hover:text-[#291418] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#291418] transition-colors">
                  Terms &amp; Conditions (30-Day Validity)
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#291418] transition-colors">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#291418] transition-colors">
                  Contact Us (mrsalman7307@gmail.com)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E2D7BD] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8B7355]">
          <p>&copy; {new Date().getFullYear()} Eternal Vowz (E&amp;V). All rights reserved. 100% Original Artwork.</p>
          <p>Support: mrsalman7307@gmail.com &bull; Priority WhatsApp Support unlocked inside Dashboard after purchase</p>
        </div>
      </div>
    </footer>
  );
}
