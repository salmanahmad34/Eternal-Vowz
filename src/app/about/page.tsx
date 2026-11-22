import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import {
  Heart,
  Sparkles,
  ArrowRight,
  Mail,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  User,
  MapPin,
  GraduationCap,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Eternal Vowz — Built by Salman Ahmad | 3D Digital Wedding Invitations',
  description:
    'Eternal Vowz is an independent Indian platform created by Salman Ahmad from Azamgarh, turning traditional royal wedding cards into 3D digital experiences for flat ₹99.',
  alternates: {
    canonical: 'https://eternal-vowz.onrender.com/about',
  },
  openGraph: {
    title: 'About Eternal Vowz — Built by Salman Ahmad',
    description:
      'Learn why Salman Ahmad built Eternal Vowz: bringing royal Lifafa & Shahi Palace gate traditions into 3D digital wedding cards for just ₹99.',
    url: 'https://eternal-vowz.onrender.com/about',
    siteName: 'Eternal Vowz',
    images: [
      {
        url: 'https://eternal-vowz.onrender.com/assets/logo-circle.png',
        width: 1024,
        height: 1024,
        alt: 'Eternal Vowz Monogram Emblem',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  mainEntity: {
    '@type': 'Organization',
    name: 'Eternal Vowz',
    alternateName: 'E&V',
    url: 'https://eternal-vowz.onrender.com',
    logo: 'https://eternal-vowz.onrender.com/assets/logo-circle.png',
    founder: {
      '@type': 'Person',
      name: 'Salman Ahmad',
      jobTitle: 'Founder & Software Developer',
      alumniOf: 'B.Tech Student',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Azamgarh',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'India',
      },
      email: 'mrsalman7307@gmail.com',
    },
    description:
      'Independent Indian platform turning traditional royal wedding invitations into 3D digital cards with live RSVP tracking at flat ₹99.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <WeddingNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-semibold text-[#8B7355]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Our Story &bull; Handcrafted in India</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#291418] tracking-tight">
            About Eternal Vowz
          </h1>
          <p className="text-sm sm:text-base text-[#6E5D4B] leading-relaxed">
            Bringing the warmth and royal majesty of traditional Indian wedding invitations into the modern WhatsApp era.
          </p>
        </div>

        {/* Core Value Proposition Card */}
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="border-l-4 border-[#C9A84C] pl-4 sm:pl-6 space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#291418]">
              Royal Invitations Reimagined for ₹99
            </h2>
            <p className="text-sm sm:text-base text-[#4A3D34] leading-relaxed">
              <strong>Eternal Vowz</strong> is an independent Indian platform that turns traditional royal wedding invitations, like the <strong>Shahi Palace gate</strong> and the <strong>Lifafa envelope</strong>, into 3D digital cards. For a flat <strong>₹99 per card</strong>, you get a personalized invitation, unlimited WhatsApp guest links, and a live RSVP dashboard that stays active for 30 days.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F2ECE1]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#291418] block">3D Cinematic Reveals</span>
                <span className="text-[11px] text-[#7A6A5E]">Lifafa wax seals &amp; Shahi gates</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#291418] block">Active for 30 Days</span>
                <span className="text-[11px] text-[#7A6A5E]">Live RSVP tracking &amp; guest counts</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#291418] block">Flat ₹99 &bull; No Hidden Fees</span>
                <span className="text-[11px] text-[#7A6A5E]">Unlimited personalized WhatsApp links</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why I Built This Section */}
        <div className="rounded-3xl bg-[#FAF8F5] border border-[#E8DFD1] p-6 sm:p-10 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C9A84C]">
            <Heart className="w-4 h-4 text-[#C9A84C]" />
            <span>The Heart Behind The Project</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#291418]">
            Why I built this
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#4A3D34] leading-relaxed">
            <p>
              In an Indian wedding, the invitation is never just information. It is the moment a family says, <em>&ldquo;you are a part of our celebration.&rdquo;</em> The heavy card, the lifafa you slowly open, the palace motifs, the gold lettering: that feeling is a tradition in itself.
            </p>
            <p>
              Then invitations moved to WhatsApp, and most of that warmth turned into a flat image or a forwarded PDF. I missed it. So I decided to bring the royal look back, in a form that fits how families invite each other today.
            </p>
          </div>
        </div>

        {/* Founder Bio Card */}
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#F2ECE1]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#C9A84C]/15 border-2 border-[#C9A84C] flex items-center justify-center text-[#9F7E28] shrink-0 font-serif text-xl font-bold">
                SA
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A84C] block">
                  Solo Builder &amp; Creator
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#291418]">
                  Salman Ahmad
                </h3>
                <span className="text-xs text-[#7A6A5E] flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
                  Azamgarh, Uttar Pradesh, India
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E2D7BD] text-xs text-[#5A4636]">
              <GraduationCap className="w-4 h-4 text-[#C9A84C]" />
              <span>B.Tech Student &bull; Full-Stack Builder</span>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#4A3D34] leading-relaxed">
            <h4 className="font-serif text-xl font-semibold text-[#291418]">
              Who I am
            </h4>
            <p>
              Hi, I&apos;m <strong>Salman Ahmad</strong>, a B.Tech student from <strong>Azamgarh, Uttar Pradesh</strong>. I built Eternal Vowz on my own, with no team behind it. Every design, from the Royal Lifafa to the Mughal Arch, is made with one idea: <em>your guests should feel invited, not just informed</em>.
            </p>
          </div>
        </div>

        {/* How It Works - 5 Steps */}
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A84C] block">
              Simple &bull; Transparent &bull; Elegant
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#291418]">
              How it works
            </h2>
          </div>

          <ol className="space-y-4 text-sm sm:text-base text-[#4A3D34]">
            <li className="flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-[#F6EEDB] text-[#9F7E28] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#E2D7BD]">
                1
              </span>
              <div>
                <strong className="text-[#291418]">Pick a design:</strong> Choose from our signature collection of 8 royal animated themes (Lifafa, Shahi Palace Gate, Frosted Veil).
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-[#F6EEDB] text-[#9F7E28] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#E2D7BD]">
                2
              </span>
              <div>
                <strong className="text-[#291418]">Add your details:</strong> Enter couple names, dates, venues, and your family&apos;s personal message. Optional modules (Timeline, Menu, Attire) only show if you fill them.
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-[#F6EEDB] text-[#9F7E28] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#E2D7BD]">
                3
              </span>
              <div>
                <strong className="text-[#291418]">Pay a flat ₹99:</strong> One-time activation fee. Zero subscriptions, zero hidden charges.
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-[#F6EEDB] text-[#9F7E28] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#E2D7BD]">
                4
              </span>
              <div>
                <strong className="text-[#291418]">Share personalized WhatsApp links:</strong> Generate custom greetings for as many guest families as you like with 1-click WhatsApp sending.
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-[#F6EEDB] text-[#9F7E28] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#E2D7BD]">
                5
              </span>
              <div>
                <strong className="text-[#291418]">Track RSVPs live on your dashboard:</strong> Watch attendance confirmations and meal counts live for 30 days.
              </div>
            </li>
          </ol>
        </div>

        {/* Questions or Feedback Direct Contact */}
        <div className="rounded-3xl cta-gold-banner p-8 sm:p-12 text-center text-white space-y-4 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold">
            Questions or feedback?
          </h3>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            You are talking to the person who built this, so I read every message. Write to me directly at{' '}
            <a
              href="mailto:mrsalman7307@gmail.com"
              className="underline font-bold text-white hover:text-[#FFF4DD] transition-colors"
            >
              mrsalman7307@gmail.com
            </a>
            .
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:mrsalman7307@gmail.com"
              className="px-6 py-3 rounded-md bg-white text-[#291418] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#FAF7F2] transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4 text-[#C9A84C]" />
              <span>Email Salman Directly</span>
            </a>
            <Link
              href="/login"
              className="px-6 py-3 rounded-md bg-[#291418] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-black transition-colors shadow-sm"
            >
              <span>Create Your Card @ ₹99</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
