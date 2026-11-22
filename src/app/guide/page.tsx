import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { SITE_CONFIG } from '@/config/site';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  Eye,
  Check,
  AlertCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wedding Invitation Ka Budget Kaise Bachayein — Real Numbers & Cost Guide | Eternal Vowz',
  description:
    'Real wedding stationery cost benchmark: 300 paper cards at ₹23 (₹6,900 in tier 2 city) versus Eternal Vowz at flat ₹99. Save ₹6,801 (~98% less in this example).',
  alternates: {
    canonical: `${SITE_CONFIG.url}/guide`,
  },
  openGraph: {
    title: 'Wedding Invitation Ka Budget Kaise Bachayein — Real Numbers Guide',
    description:
      'Real wedding stationery cost benchmark: 300 paper cards at ₹23 (₹6,900) vs flat ₹99 digital card. Save ₹6,801 (~98% less in this example).',
    url: `${SITE_CONFIG.url}/guide`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/assets/logo-circle.png`,
        width: 1024,
        height: 1024,
        alt: 'Wedding Budget Guide by Eternal Vowz',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
};

const guideJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Wedding Invitation Ka Budget Kaise Bachayein — Real Numbers & Cost Guide',
  author: {
    '@type': 'Person',
    '@id': `${SITE_CONFIG.url}/about#salman`,
    name: SITE_CONFIG.founder.name,
    jobTitle: SITE_CONFIG.founder.role,
  },
  publisher: {
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_CONFIG.url}/assets/logo-circle.png`,
    },
  },
  datePublished: '2026-11-22',
  dateModified: '2026-11-22',
  description:
    'A realistic cost comparison between traditional paper cards (₹23/card tier 2 benchmark, ₹6,900 for 300 cards) and ₹99 3D digital invitations in Indian weddings, showing net savings of ₹6,801 (~98% less).',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
      />
      <WeddingNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-semibold text-[#8B7355]">
            <TrendingDown className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Wedding Budget &amp; Stationery Guide</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#291418] tracking-tight leading-tight">
            Wedding Invitation Ka Budget Kaise Bachayein?
          </h1>
          <p className="text-sm sm:text-base text-[#6E5D4B] leading-relaxed">
            Real Numbers &amp; Cost Breakdown: Traditional Paper Cards vs. ₹99 Royal 3D Digital Card
          </p>
          <div className="text-xs text-[#8B7355] pt-1">
            Written by <strong>Salman Ahmad</strong> &bull; Last updated: 22 November 2026
          </div>
        </div>

        {/* Real Benchmark Disclosure Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9ED] border border-[#E8DFD1] text-xs sm:text-sm text-[#5A4636] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Disclosure:</strong> Ye number founder ke apne family wedding ke rate par based hai (tier 2 shehar, ₹23 per card). Bade shehron me rate aam taur par zyada hota hai. 300 cards sirf ek example hai.
          </p>
        </div>

        {/* Executive Summary Nugget Card (45-75 words GEO Answer Nugget) */}
        <div className="rounded-3xl bg-white border-2 border-[#C9A84C]/50 p-6 sm:p-8 editorial-card-shadow space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C]">
            <Sparkles className="w-4 h-4" />
            <span>Quick Answer (Direct Summary)</span>
          </div>
          <p className="font-serif text-lg sm:text-xl text-[#291418] leading-relaxed italic">
            &ldquo;Haan, digital wedding invitation paper card se bohot sasta padta hai. Real example ke mutabiq: tier 2 shehar me 300 paper cards ₹23 ke hisaab se print karwane me ₹6,900 kharch hote hain, jabki Eternal Vowz par wahi card sirf ₹99 me banta hai. Is example me direct ₹6,801 ki bachat hoti hai (lagbhag 98% sasta), aur courier ya reprint ka koi extra kharcha nahi lagta.&rdquo;
          </p>
        </div>

        {/* Real Cost Comparison Table */}
        <div className="rounded-3xl bg-white border border-[#E2D7BD] overflow-hidden editorial-card-shadow">
          <div className="p-6 sm:p-8 border-b border-[#E2D7BD] bg-[#FAF8F5]">
            <h2 className="font-serif text-2xl font-semibold text-[#291418]">
              Real Cost Comparison (300 Cards Example)
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6A5E] mt-1">
              Founder ke parivar ki shaadi ke asli rates par aadharit benchmark.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#F6EEDB]/70 border-b border-[#E2D7BD] text-[#291418] font-serif">
                  <th className="p-4 sm:p-5 font-bold">Expense Category</th>
                  <th className="p-4 sm:p-5 font-bold text-red-800">Traditional Paper Cards</th>
                  <th className="p-4 sm:p-5 font-bold text-emerald-800">Eternal Vowz (E&amp;V)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D7BD]/60 text-[#4A3D34]">
                <tr className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-[#291418]">
                    Card Printing (300 Units)
                  </td>
                  <td className="p-4 sm:p-5 text-red-700 font-semibold">
                    ₹6,900 <span className="text-[11px] text-[#7A6A5E] block font-normal">(Tier 2 actual rate: ₹23 per card)</span>
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-700 font-bold">
                    ₹99 flat <span className="text-[11px] text-[#7A6A5E] block font-normal">(One-time card activation)</span>
                  </td>
                </tr>

                <tr className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-[#291418]">
                    Mithai / Sweet Boxes
                  </td>
                  <td className="p-4 sm:p-5 text-red-700">
                    Extra kharcha <span className="text-[11px] text-[#7A6A5E] block">(Har physical card ke sath mithai dabba)</span>
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-700 font-bold">
                    ₹0 Optional <span className="text-[11px] text-[#7A6A5E] block">(Koi compulsory mithai box nahi lagta)</span>
                  </td>
                </tr>

                <tr className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-[#291418]">
                    Courier &amp; Delivery Travel
                  </td>
                  <td className="p-4 sm:p-5 text-red-700">
                    Extra kharcha <span className="text-[11px] text-[#7A6A5E] block">(Speed post, courier aur travel petrol)</span>
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-700 font-bold">
                    ₹0 <span className="text-[11px] text-[#7A6A5E] block">(Instant 1-click WhatsApp delivery)</span>
                  </td>
                </tr>

                <tr className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-[#291418]">
                    Date/Venue Change or Typos
                  </td>
                  <td className="p-4 sm:p-5 text-red-700">
                    Reprinting ka extra kharcha <span className="text-[11px] text-[#7A6A5E] block">(Purane cards bekar ho jate hain)</span>
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-700 font-bold">
                    ₹0 Free Live Updates <span className="text-[11px] text-[#7A6A5E] block">(Dashboard se kabhi bhi live edit karein)</span>
                  </td>
                </tr>

                <tr className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-[#291418]">
                    RSVP Headcount &amp; Catering Calls
                  </td>
                  <td className="p-4 sm:p-5 text-red-700">
                    Manual phone calling <span className="text-[11px] text-[#7A6A5E] block">(Khana waste hone ya kam padne ka risk)</span>
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-700 font-bold">
                    Automated Real-Time <span className="text-[11px] text-[#7A6A5E] block">(Live dashboard headcount &amp; meal counts)</span>
                  </td>
                </tr>

                <tr className="bg-[#FAF8F5] font-bold text-sm sm:text-base">
                  <td className="p-4 sm:p-5 text-[#291418]">TOTAL BASE PRINTING COST</td>
                  <td className="p-4 sm:p-5 text-red-700">₹6,900 + extra kharche</td>
                  <td className="p-4 sm:p-5 text-emerald-700 font-serif text-lg">Just ₹99 Flat</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-5 bg-[#FAF7F2] border-t border-[#E2D7BD] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#7A6A5E]">
            <span className="font-semibold text-emerald-800">
              💰 Direct Net Saving: ₹6,801 ki bachat &mdash; lagbhag 98% sasta (is example me)
            </span>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-[#C9A84C] text-white font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-[#B8963B] transition-colors"
            >
              <span>Build Card @ ₹99</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 5 Practical Tips to Save Budget */}
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#291418]">
            5 Tarike Wedding Invitation Ka Kharcha Kam Karne Ke
          </h2>

          <div className="space-y-5 text-sm sm:text-base text-[#4A3D34] leading-relaxed">
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-bold text-[#291418] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F6EEDB] text-[#C9A84C] text-xs flex items-center justify-center font-sans">1</span>
                <span>Badi Quantity Printing Se Bachein (The Hybrid Model)</span>
              </h3>
              <p>
                Agar aapke ghar me buzurg hain jo physical card pasand karte hain, toh sirf 25–50 physical cards print karwayein jo bohot qareebi rishtedaaron ke liye hon. Baaqi 250–500 mehmaano ko royal <strong>3D Digital Lifafa</strong> bhejein. Isse aapka bada printing kharcha turant bach jayega.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-bold text-[#291418] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F6EEDB] text-[#C9A84C] text-xs flex items-center justify-center font-sans">2</span>
                <span>Flat PDF Ke Badle 3D Royal Experience Use Karein</span>
              </h3>
              <p>
                Aksar log WhatsApp par sadha photo ya PDF bhej dete hain, jise koi dhang se nahi dekhta. Eternal Vowz par mehmaan ko ek <strong>animated wax-seal lifafa</strong> ya <strong>shahi mahal ke khulte hue darwaze</strong> dikhte hain aur background me shehnai bajti hai. Guests ko lagta hai ki unhe sach me shahi tareeqe se invite kiya gaya hai.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-bold text-[#291418] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F6EEDB] text-[#C9A84C] text-xs flex items-center justify-center font-sans">3</span>
                <span>Personalized Greeting Se Mehmaan Ka Dil Jeetein</span>
              </h3>
              <p>
                Eternal Vowz ke dashboard se har guest ke liye personalized link banti hai: <em>&ldquo;For Tariq Family&rdquo;</em>, <em>&ldquo;For Farhan Bhai&rdquo;</em>. Jab guest apna naam card par dekhte hain, toh unhe lagta hai ki card sirf unhi ke liye banaya gaya hai.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-bold text-[#291418] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F6EEDB] text-[#C9A84C] text-xs flex items-center justify-center font-sans">4</span>
                <span>RSVP Count Se Catering Ka Kharcha Bachayein</span>
              </h3>
              <p>
                Indian shaadi me bada nuksan hota hai khana waste hone ka ya kam padne ka. Digital RSVP ke zariye aapko pehle hi pata chal jata hai ki kitne log &lsquo;Attending&rsquo; hain aur kitne &lsquo;Declined&rsquo;. Is data se aap caterer ko exact plates ka order de sakte hain aur khana waste hone se bacha sakte hain.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-bold text-[#291418] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F6EEDB] text-[#C9A84C] text-xs flex items-center justify-center font-sans">5</span>
                <span>Reprinting Ke Jhanjhat Aur Late Delivery Se Chhuti</span>
              </h3>
              <p>
                Agar time ya venue me aakhri waqt par koi badlaav hota hai, toh printed card me safed fluid lagana padta hai ya naya card print karwana padta hai. Digital card me aap apne phone se 10 second me timing ya Google Maps update kar sakte hain, aur sabhi guests ko instantly update mil jata hai bina kisi reprint kharche ke.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Answer Nuggets for GEO/SEO */}
        <div className="rounded-3xl bg-[#FAF8F5] border border-[#E8DFD1] p-6 sm:p-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#291418]">
            Zaroori Sawal &amp; Seedhe Jawab (Quick FAQ Nuggets)
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E2D7BD] space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#291418]">
                3D Shahi Palace wedding invitation kya hai?
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3D34] leading-relaxed">
                3D Shahi Palace wedding invitation ek royal digital card hai jisme mehmaan jab link kholte hain, toh unke phone par ek grand shahi mahal ke double-door darwaze animated roop se khulte hain. Isme 24K gold filigree, authentic shehnai ya dhol music, event schedule, venue Google Maps, aur RSVP button shamil hota hai jo bina kisi app ke browser me chalta hai.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2D7BD] space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#291418]">
                India me WhatsApp digital RSVP kaise kaam karta hai?
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3D34] leading-relaxed">
                India me WhatsApp digital RSVP me host apne dashboard se har mehmaan ke naam ka personalized WhatsApp link bhejta hai. Mehmaan bina kisi app download ke link khol kar &lsquo;Attending&rsquo; ya &lsquo;Declined&rsquo; select karte hain aur kitne log aayenge likh dete hain. Host ke live dashboard par attendance count aur guest details real-time update ho jaati hain.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2D7BD] space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#291418]">
                Eternal Vowz kya hai aur card kitne din active rehta hai?
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3D34] leading-relaxed">
                Eternal Vowz ek online platform hai jahan aap ₹99 me 3D digital wedding invitation bana sakte hain. Card 30 din active rehta hai, usme live RSVP dashboard milta hai, aur aap unlimited guests ko personalized WhatsApp link bhej sakte hain. Isme Lifafa opening, wax seal crack, aur background wedding music ka cinematic royal experience milta hai bina kisi app download ke.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl cta-gold-banner p-8 sm:p-12 text-center text-white space-y-4 shadow-xl">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/25 backdrop-blur-sm border border-white/35 text-xs text-white font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flat ₹99 Per Card &bull; Instant WhatsApp Sharing</span>
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-semibold">
            Shaadi Ke Card Ka Budget Bachayein
          </h3>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            Sirf 3 minute me apna royal 3D digital wedding card banayein aur mehmaano ko shahi andaz me invite karein.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="px-6 py-3 rounded-md bg-white text-[#291418] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#FAF7F2] transition-colors shadow-sm"
            >
              <span>Create Card @ ₹99</span>
              <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
            </Link>
            <Link
              href="/#designs"
              className="px-6 py-3 rounded-md bg-[#291418] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-black transition-colors shadow-sm"
            >
              <span>Explore 8 Themes</span>
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
