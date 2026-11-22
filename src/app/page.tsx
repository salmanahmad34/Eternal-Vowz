'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import EnvelopeExperience from '@/components/envelope/EnvelopeExperience';
import { INITIAL_DEMO_INVITATION } from '@/lib/data-service';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import {
  Check,
  X,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  Sliders,
  Sparkles,
  ShieldCheck,
  Clock,
  Lock,
  MessageCircle,
  ChevronDown,
  Mail,
  FileText,
  Eye,
  Zap,
  Users,
  MapPin,
  HelpCircle,
  Share2,
} from 'lucide-react';

const DYNAMIC_HERO_PHRASES = [
  'be remembered',
  'Digital Wedding Card',
  '3D Royal Lifafa',
  'Palace Gate Reveal',
  'Frosted Veil Suite',
];

const MARQUEE_ROW_ONE = [
  'Digital Wedding Card',
  '3D Embossed Royal Lifafa',
  '3D Shahi Palace Double-Gates',
  'Cinematic Frosted-Blur Veil',
  'Personalized Guest Links',
  'Instant WhatsApp Delivery',
  'Live Read Receipts',
  'Modest & Halal Suites',
];

const MARQUEE_ROW_TWO = [
  'Wedding Invitation',
  'Flat ₹99 Per Card',
  'Smart Optional Card Builder',
  'Real-Time RSVP Headcount',
  'Halal Catering Summary',
  'One-Tap Google Maps',
  'Card Active for 30 Days',
  'Post-Purchase WhatsApp Support',
];

const SIGNATURE_CARD_DESIGNS = [
  {
    id: 'pearl-veil',
    category: '3D Cinema Reveal',
    badge: '✨ 3D Cinema Reveal',
    name: 'Pearl Botanical Veil',
    couple: 'Layla & Omar',
    slug: 'layla-omar-veil',
    query: '',
    price: '₹99',
    heroImg: '/assets/pearl-veil/hero-palace-corridor.jpg',
    shortDesc: 'Tap anywhere to glide through a floral marble lattice into a candlelit palace hall.',
    nugget: 'Pearl Botanical Veil ek minimalist luxury wedding invitation hai jisme soft ivory, pastel floral flourishes, aur champagne gold typography milti hai. Yeh modern day-weddings aur sophisticated ceremonies ke liye best hai, jisme soft wind chimes aur elegant opening animation shamil hai.',
  },
  {
    id: 'blush-floral',
    category: '3D Gold Dust Reveal',
    badge: '✨ 3D Gold Dust',
    name: 'Shahi Palace Gates',
    couple: 'Amira & Rayyan',
    slug: 'amira-rayyan-palace',
    query: '',
    price: '₹99',
    heroImg: '/assets/shahi-gold/hero-mountain-pavilion.jpg',
    shortDesc: 'Tap anywhere as gold dust & rose petals reveal a sunlit mountain pavilion.',
    nugget: 'Shahi Palace Gates ek grand royal Rajasthani palace fort theme hai jisme double golden doors swing open hote hain. Gold filigree borders, regal dhol ya shehnai background music, aur traditional Darbar darshya ke sath yeh grand big-fat Indian weddings ke liye perfect choice hai.',
  },
  {
    id: 'tuscan-sunset',
    category: '3D Haveli Courtyard',
    badge: '✨ Most Popular',
    name: 'Tuscan Sunset Rose',
    couple: 'Sophia & Alexander',
    slug: 'sophia-alexander',
    query: '?guest=vip-tariq-family',
    price: '₹99',
    heroImg: '/assets/tuscan-haveli/hero-haveli-courtyard.jpg',
    shortDesc: 'Tap anywhere as grand royal haveli doors swing open into a chandelier courtyard.',
    nugget: 'Tuscan Sunset Rose ek warm terracotta aur rose gold Mediterranean courtyard invitation hai. Sunkissed Italian arches, warm sitar background melodies, aur floral bougainvillea styling ke sath yeh romantic destination weddings aur sunset receptions ke liye design kiya gaya hai.',
  },
  {
    id: 'royal-emerald',
    category: '3D Silk Veil Reveal',
    badge: '✨ Royal Nikah',
    name: 'Royal Mughal Arch',
    couple: 'Zoya & Ayaan',
    slug: 'zoya-ayaan-nikah',
    query: '?guest=guest-zaid-khan',
    price: '₹99',
    heroImg: '/assets/mughal-silk/hero-mughal-courtyard.jpg',
    shortDesc: 'Tap anywhere as gold-embroidered silk veils part to reveal a candlelit Mughal palace.',
    nugget: 'Royal Mughal Arch ek heritage Islamic wedding aur Nikah invitation hai jisme deep emerald green velvet, white marble jaali work, aur crescent gold arches shamil hain. Khususi duayein, Bismillah calligraphy, aur traditional sufi/shehnai melodies ke sath yeh sacred ceremonies ke liye behtareen hai.',
  },
  {
    id: 'midnight-minimalist',
    category: '3D Wax Box Reveal',
    badge: '✨ Trend 2027',
    name: 'Celestial Starlight',
    couple: 'Fatima & Hamza',
    slug: 'fatima-hamza-starlight',
    query: '',
    price: '₹99',
    heroImg: '/assets/celestial-box/hero-celestial-stage.jpg',
    shortDesc: 'Tap anywhere as a wax-sealed emerald silk box opens into a mountaintop floral arch.',
    nugget: 'Celestial Starlight ek midnight navy blue aur sparkling gold constellation theme hai jo evening receptions, cocktail parties, aur sangeet nights ke liye banayi gayi hai. Starlight particle glow, modern typography, aur romantic acoustic background score is card ko cinematic banate hain.',
  },
  {
    id: 'kashmir-lotus',
    category: '3D Frosted Mist',
    badge: '✨ Kashmiri Romance',
    name: 'Kashmir Chinar Lotus',
    couple: 'Mir & Falak',
    slug: 'mir-falak-lotus',
    query: '',
    price: '₹99',
    heroImg: '/assets/kashmir-lotus/hero-kashmir-lotus.jpg',
    shortDesc: 'Misty lavender silk veil opening into Dal Lake lotus blossoms and golden Chinar leaf filigree.',
    nugget: 'Kashmir Chinar Lotus theme Dal Lake aur Mughal gardens ki natural khubsurti se prerit hai. Golden chinar leaves, lotus petals, aur Kashmiri rabab/flute music ke sath yeh nature-inspired, peaceful aur elegant wedding celebrations ke liye ideal digital invitation hai.',
  },
  {
    id: 'shahi-crimson',
    category: '3D Crimson Velvet',
    badge: '✨ 24K Gold Zari',
    name: 'Shahi Crimson & Zari',
    couple: 'Kabir & Roshni',
    slug: 'kabir-roshni-crimson',
    query: '',
    price: '₹99',
    heroImg: '/assets/shahi-crimson/hero-shahi-crimson.jpg',
    shortDesc: 'Heritage deep crimson velvet Lifafa with 24K gold zari borders, rose petals & sitar melodies.',
    nugget: 'Shahi Crimson & Zari ek traditional Indian shaadi theme hai jo deep crimson red velvet aur 24-karat gold zari embroidery par aadharit hai. Heavy bridal styling, auspicious golden motifs, aur live mangal geet tunes ke sath yeh traditional Hindu aur North Indian weddings ki pehli pasand hai.',
  },
  {
    id: 'jodhpur-sapphire',
    category: '3D Royal Darbar',
    badge: '✨ Royal Sapphire',
    name: 'Jodhpur Sapphire Darbar',
    couple: 'Zayn & Anaya',
    slug: 'zayn-anaya-sapphire',
    query: '',
    price: '₹99',
    heroImg: '/assets/jodhpur-sapphire/hero-jodhpur-sapphire.jpg',
    shortDesc: 'Royal sapphire velvet envelope opening into a 24K gold Jharokha archway with marigold garlands.',
    nugget: 'Jodhpur Sapphire Darbar Blue City ke royal Mehrangarh palace se inspired ek majestic wedding theme hai. Deep imperial sapphire blue, carved stone jharokhas, aur royal fanfare trumpet audio ke sath yeh card har guest ko shahi mehmaan jaisa feel karwata hai.',
  },
];

const FILTER_CATEGORIES = [
  'All Designs',
  '3D Cinema Reveal',
  '3D Gold Dust Reveal',
  '3D Haveli Courtyard',
  '3D Silk Veil Reveal',
  '3D Wax Box Reveal',
  '3D Royal Darbar',
  '3D Crimson Velvet',
  '3D Frosted Mist',
];

const COMPARISON_ROWS = [
  {
    icon: 'zap' as const,
    feature: 'Total Cost (300+ Guests)',
    sub: 'Printing, envelopes & postage',
    physical: '₹15,000 – ₹45,000+ printing & courier fees',
    digital: 'Flat ₹99 per card — share with unlimited WhatsApp guests',
  },
  {
    icon: 'clock' as const,
    feature: 'Time to Create & Deliver',
    sub: 'From draft to every family',
    physical: '2 – 4 weeks printing & postal delivery delays',
    digital: 'Ready in 3 minutes · instant 1-click WhatsApp delivery',
  },
  {
    icon: 'sparkles' as const,
    feature: 'Guest Opening Experience',
    sub: 'First impression & wow factor',
    physical: 'Static paper envelope discarded after the event',
    digital: '3D Lifafa, 3D Palace Gates, or Frosted-Blur Veil + ambient music',
  },
  {
    icon: 'users' as const,
    feature: 'RSVP & Halal Catering Count',
    sub: 'Attendance & meal preferences',
    physical: 'Manual phone calls to confirm every family',
    digital: 'Built-in live RSVP form, headcount & Halal meal summary',
  },
  {
    icon: 'sliders' as const,
    feature: 'Smart Optional Builder',
    sub: 'Edits & custom sections',
    physical: 'Fixed printed text — typos cannot be corrected later',
    digital: 'Fill only Main Details (Names, Date, Venue) — rest hides automatically',
  },
  {
    icon: 'map' as const,
    feature: 'Directions & Live Updates',
    sub: 'Navigation & schedule changes',
    physical: 'Printed text address or confusing sketch map',
    digital: 'One-tap Google Maps navigation & instant live edits anytime',
  },
  {
    icon: 'shield' as const,
    feature: 'Privacy & Active Validity',
    sub: 'Control over family links',
    physical: 'Printed cards circulate indefinitely',
    digital: 'Card Active for 30 Days, then expires automatically',
  },
];

const FAQ_ITEMS = [
  {
    icon: 'sparkles' as const,
    bg: 'bg-[#EFF3FF]',
    border: 'border-[#DCE5FF]',
    q: 'Eternal Vowz kya hai aur card kitne din active rehta hai?',
    a: 'Eternal Vowz ek online platform hai jahan aap ₹99 me 3D digital wedding invitation bana sakte hain. Card 30 din active rehta hai, usme live RSVP dashboard milta hai, aur aap unlimited guests ko personalized WhatsApp link bhej sakte hain. Isme Lifafa opening, wax seal crack, aur background wedding music ka cinematic royal experience milta hai.',
  },
  {
    icon: 'sparkles' as const,
    bg: 'bg-[#FDF7EB]',
    border: 'border-[#F3E4C6]',
    q: '3D Shahi Palace wedding invitation kya hai?',
    a: '3D Shahi Palace wedding invitation ek royal digital card hai jisme mehmaan jab link kholte hain, toh unke phone par ek grand shahi mahal ke double-door darwaze animated roop se khulte hain. Isme 24K gold filigree, authentic shehnai ya dhol music, event schedule, venue Google Maps, aur RSVP button shamil hota hai jo bina kisi app ke browser me chalta hai.',
  },
  {
    icon: 'share' as const,
    bg: 'bg-[#EEFCF3]',
    border: 'border-[#D3F5DF]',
    q: 'India me WhatsApp digital RSVP kaise kaam karta hai?',
    a: 'India me WhatsApp digital RSVP me host apne dashboard se har mehmaan ke naam ka personalized WhatsApp link bhejta hai. Mehmaan bina kisi app download ke link khol kar \'Attending\' ya \'Declined\' select karte hain aur kitne log aayenge likh dete hain. Host ke live dashboard par attendance count aur guest details real-time update ho jaati hain.',
  },
  {
    icon: 'clock' as const,
    bg: 'bg-[#ECFCFA]',
    border: 'border-[#D3F5F1]',
    q: 'Digital wedding invitation paper card se sasta hai kya?',
    a: 'Haan, digital wedding invitation paper card se 99% sasta hai. Ek aam shaadi me 300 paper cards print aur courier karwane ka kharcha ₹15,000 se ₹50,000 tak aata hai. Eternal Vowz par sirf ₹99 me poora royal 3D digital card banta hai, jisme unlimited WhatsApp links, live RSVP tracking, aur Google Maps shamil hote hain, bina printing ya delivery ke jhanjhat ke.',
  },
  {
    icon: 'clock' as const,
    bg: 'bg-[#ECFCFA]',
    border: 'border-[#D3F5F1]',
    q: 'How long is my wedding invitation valid?',
    a: 'Every wedding card remains active for 1 full month (30 days) from creation. After 30 days, the public guest link expires automatically to keep your family celebration private, with an option to renew anytime from your dashboard.',
  },
  {
    icon: 'sparkles' as const,
    bg: 'bg-[#EFF3FF]',
    border: 'border-[#DCE5FF]',
    q: 'What makes the 8 animated designs different?',
    a: 'Eternal Vowz offers three distinct reveal experiences across 8 unique designs: (1) Classic 3D Embossed Royal Lifafa envelopes with wax seals, (2) 3D Shahi Palace Double-Door Gates that unlock and swing open, and (3) Frosted-Blur Botanical Veils that glide into crystal-clear HD palace halls.',
  },
  {
    icon: 'share' as const,
    bg: 'bg-[#EEFCF3]',
    border: 'border-[#D3F5DF]',
    q: 'How do I share my card & what is the price?',
    a: 'Every signature wedding invitation card on Eternal Vowz is priced at a flat ₹99 per card (one-time fee). You receive unlimited personalized guest links ("For Honored Guest & Family") to share instantly via WhatsApp, SMS, or email with live read receipts.',
  },
  {
    icon: 'sliders' as const,
    bg: 'bg-[#F7F0FD]',
    border: 'border-[#EAD9FA]',
    q: 'Can I fill only basic details & edit later?',
    a: 'Yes! Our Smart Conditional Card Builder only requires the main essentials — Couple Names, Event Date, and Venue. All other modules (Schedule, Dress Code, Halal Menu, Story, Gift Registry, Stay Info) are optional and stay hidden unless enabled. You can edit anytime live!',
  },
  {
    icon: 'message' as const,
    bg: 'bg-[#FDF7EB]',
    border: 'border-[#F3E4C6]',
    q: 'How do I reach support or WhatsApp concierge?',
    a: 'For all pre-purchase or general inquiries, email our official support desk at mrsalman7307@gmail.com. Once you create or purchase a ₹99 card, direct Priority WhatsApp Support unlocks immediately inside your Host Dashboard.',
  },
  {
    icon: 'shield' as const,
    bg: 'bg-[#FDF0F3]',
    border: 'border-[#F8D9E1]',
    q: 'Is my wedding data & ₹99 payment secure?',
    a: 'Yes. Eternal Vowz uses 256-bit SSL encryption, strict HTTP security headers, and server-side HMAC-SHA256 verification for payment and API integrations. We never sell or share guest data with third parties.',
  },
];

export default function LandingPage() {
  const [replayTrigger, setReplayTrigger] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All Designs');

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % DYNAMIC_HERO_PHRASES.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const previewGuest = {
    id: 'demo-preview',
    invitation_id: INITIAL_DEMO_INVITATION.id,
    guest_name: 'Honored Guest & Family',
    unique_token: 'demo',
    max_allowed_guests: 4,
    rsvp: null,
  };

  const filteredDesigns = SIGNATURE_CARD_DESIGNS.filter(
    (d) => activeCategory === 'All Designs' || d.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans selection:bg-[#C9A84C]/25 selection:text-[#291418] overflow-x-hidden">
      <WeddingNavbar />

      {/* =========================================================================
          1. WOOOWINVITES EDITORIAL HERO (WARM IVORY + CHAMPAGNE GOLD + SINGLE PHONE)
      ========================================================================= */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 hero-radial-glow border-b border-[#E2D7BD]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Editorial Column */}
            <div className="lg:col-span-6 space-y-7">
              {/* Tall Poetic Cormorant Garamond H1 with Dynamic Italic Champagne Gold Phrase */}
              <h1 className="font-serif text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-[66px] leading-[1.05] font-normal text-[#291418]">
                Invitations as special as the moment itself — designed to{' '}
                <span className="block mt-1 min-h-[1.15em] relative">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={DYNAMIC_HERO_PHRASES[phraseIndex]}
                      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block italic text-[#C9A84C]"
                    >
                      {DYNAMIC_HERO_PHRASES[phraseIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              {/* Uppercase Tracked Champagne Eyebrow */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
                  RSVP BUILT-IN &mdash; Effortless guest tracking
                </p>
                <p className="text-base text-[#8B7355] leading-relaxed max-w-lg">
                  Create cinematic 3D wedding invitations in minutes — pick from <strong className="text-[#291418] font-medium">8 animated designs</strong>, add your details, and share instantly on WhatsApp.
                </p>
              </div>

              {/* Rectangular Champagne Gold Primary CTA + Anchor Pricing Micro-Copy */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/login"
                    className="button-shine px-7 py-4 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2.5 transition-all shadow-[0_12px_28px_-8px_rgba(201,168,76,0.55)]"
                  >
                    <span>Create Your Card &bull; ₹99</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>

                  <Link
                    href="/invite/sophia-alexander?guest=vip-tariq-family"
                    target="_blank"
                    className="px-6 py-4 rounded-md bg-white hover:bg-[#F6EEDB] text-[#291418] border border-[#C9A84C]/60 text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2 transition-colors shadow-2xs"
                  >
                    <Eye className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>View Live Sample</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#8B7355] shrink-0" />
                  </Link>
                </div>

                <p className="text-xs text-[#8B7355] flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold text-[#291418]">Flat ₹99 per card</span>
                  <span>&bull;</span>
                  <span>Unlimited WhatsApp guests</span>
                  <span>&bull;</span>
                  <span>Card 30 Days tak active rahega</span>
                  <span>&bull;</span>
                  <span>256-Bit SSL secure</span>
                </p>
              </div>
            </div>

            {/* Right Column: Clean Tall Smartphone Mockup (Single Fixed Card, Flush 1:1 Fit) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-[368px] flex items-center justify-between px-4 py-2 mb-3 rounded-full bg-white/80 backdrop-blur-sm border border-[#E2D7BD] text-xs text-[#8B7355]">
                <span className="flex items-center gap-2 font-medium text-[#291418]">
                  <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                  <span>Live Interactive Card (Tap Anywhere)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setReplayTrigger((prev) => prev + 1)}
                  className="inline-flex items-center gap-1 text-[#C9A84C] hover:text-[#9F7E28] font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Realistic Dark-Bezel Smartphone Mockup */}
              <div className="w-full max-w-[368px] rounded-[44px] bg-[#1C1415] p-[10px] shadow-[0_32px_70px_-15px_rgba(41,20,24,0.28)] border border-[#C9A84C]/35">
                <div className="w-24 h-1.5 rounded-full bg-[#3A2D2F] mx-auto mb-2" />
                <div className="w-full h-[640px] rounded-[34px] overflow-y-auto overflow-x-hidden bg-[#f4e2c1] relative">
                  <EnvelopeExperience
                    key={`hero-fixed-card-${replayTrigger}`}
                    invitation={INITIAL_DEMO_INVITATION}
                    guest={previewGuest}
                    autoPlayAudio={true}
                    isPreview={true}
                    replayTrigger={replayTrigger}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. DUAL COUNTER-SCROLLING CHAMPAGNE KINETIC MARQUEE RIBBONS
      ========================================================================= */}
      <section className="py-6 bg-[#F2ECE1]/60 border-b border-[#E2D7BD]/70 overflow-hidden space-y-2.5 select-none">
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-3 pr-3">
            {[...MARQUEE_ROW_ONE, ...MARQUEE_ROW_ONE].map((label, idx) => (
              <span
                key={`r1-${idx}`}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2D7BD] text-xs font-medium text-[#291418] whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex overflow-hidden">
          <div className="animate-marquee-rev flex items-center gap-3 pr-3">
            {[...MARQUEE_ROW_TWO, ...MARQUEE_ROW_TWO].map((label, idx) => (
              <span
                key={`r2-${idx}`}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E2D7BD]/80 text-xs font-medium text-[#8B7355] whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CURATED COLLECTION SHOWCASE (#designs — WOOOWINVITES 5-CARD PORTRAIT GRID)
      ========================================================================= */}
      <section id="designs" className="py-16 sm:py-24 border-b border-[#E2D7BD]/60 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Header + 3 Gold Checkmark Benefits */}
          <div className="max-w-2xl mx-auto text-center mb-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-medium text-[#8B7355]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Beautiful Themes &bull; Flat ₹99 Per Card</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#291418]">
              Choose from our curated collection
            </h2>

            <ul className="space-y-1.5 text-sm text-[#8B7355] inline-flex flex-col items-start mx-auto pt-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span>3D Embossed Lifafa, 3D Shahi Palace Gates &amp; Frosted-Blur Veil reveals.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span>Personalize names, optional sections, music &amp; modest Halal artwork.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span>Flat ₹99 per card &bull; Card 30 Days tak active rahega with live RSVPs.</span>
              </li>
            </ul>
          </div>

          {/* WooowInvites Rounded Pill Filter Tabs (Active in Champagne Gold #C9A84C) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C9A84C] text-white shadow-sm'
                      : 'bg-white text-[#5A4636] border border-[#E2D7BD] hover:bg-[#F6EEDB]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* 8-Card Portrait Grid (Exact WooowInvites Curated Theme Cards in 9:16) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="rounded-2xl bg-white border border-[#E2D7BD]/90 overflow-hidden flex flex-col justify-between editorial-card-shadow hover:-translate-y-1 hover:border-[#C9A84C] transition-all duration-300 group max-w-[340px] sm:max-w-none mx-auto w-full"
              >
                {/* 9:16 Portrait Artwork — Clickable to View Full Live Sample */}
                <Link
                  href={`/invite/${design.slug}${design.query}`}
                  target="_blank"
                  className="relative aspect-[9/16] w-full overflow-hidden bg-[#291418] block cursor-pointer"
                >
                  <img
                    src={design.heroImg}
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none" />

                  {/* Top-Left Champagne Badge + Top-Right ₹99 Tag */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#C9A84C] text-white text-[10px] font-semibold shadow-sm truncate">
                      {design.badge}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#291418] text-[11px] font-bold border border-[#E2D7BD] shadow-xs shrink-0">
                      {design.price}
                    </span>
                  </div>

                  {/* Bottom Couple Label + Crisp Preview Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                    <span className="font-serif text-lg font-medium drop-shadow-sm block leading-tight truncate">
                      {design.couple}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm border border-white/25 text-[10px] font-semibold text-white inline-flex items-center gap-1 shrink-0 group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] transition-colors">
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </span>
                  </div>
                </Link>

                {/* Clean White Footer Strip with Clear "View Sample" & "Create @ ₹99" Buttons */}
                <div className="p-4 bg-white flex flex-col justify-between flex-1 space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-lg font-semibold text-[#291418] leading-snug">
                        {design.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#8B7355] mt-1 leading-relaxed">
                      {design.shortDesc}
                    </p>
                    {design.nugget && (
                      <p className="text-[11px] text-[#6E5D4B] mt-2 pt-2 border-t border-[#F2ECE1] leading-relaxed bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E8DFD1]/60">
                        <span className="font-semibold text-[#8C6430] block not-italic text-[10px] uppercase tracking-wider mb-0.5">About This Suite:</span>
                        {design.nugget}
                      </p>
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-[#F2ECE1] space-y-2">
                    <Link
                      href={`/invite/${design.slug}${design.query}`}
                      target="_blank"
                      className="w-full py-2.5 px-3 rounded-md bg-[#F6EEDB] hover:bg-[#EDE0C4] text-[#291418] border border-[#C9A84C]/60 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#9F7E28]" />
                      <span>View Live Sample</span>
                      <ExternalLink className="w-3 h-3 text-[#8B7355]" />
                    </Link>

                    <Link
                      href={`/login?next=${encodeURIComponent('/dashboard?new=true&theme=' + design.id)}`}
                      className="w-full py-2.5 px-3 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>Create @ ₹99</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS ("Four steps. That's it." — Alternating Sand Background)
      ========================================================================= */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-[#E2D7BD]/60 bg-[#F2ECE1]/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white border border-[#E2D7BD] text-xs font-medium text-[#8B7355] mb-3">
              <span>Simple Process</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#291418]">
              Four steps. That&apos;s it.
            </h2>
            <p className="text-sm sm:text-base text-[#8B7355] mt-3">
              No graphic design skills required — publish your animated 3D invitation in under 3 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Pick Your Reveal Style',
                desc: 'Select a 3D Embossed Lifafa, 3D Shahi Palace Double-Door Gate, or our Frosted-Blur Veil design.',
              },
              {
                step: '02',
                title: 'Fill Only Main Details',
                desc: 'Enter Couple Names, Date, and Venue. Optional modules like Menu, Dress Code, and Timeline stay hidden unless turned on.',
              },
              {
                step: '03',
                title: 'Publish at Flat ₹99',
                desc: 'Activate your card for 1 full month (30 days) and immediately unlock Priority WhatsApp Support inside your dashboard.',
              },
              {
                step: '04',
                title: 'Share & Track RSVPs',
                desc: 'Send personalized links ("For Honored Guest & Family") via WhatsApp and monitor real-time read receipts & headcount.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl bg-white border border-[#E2D7BD] p-7 editorial-card-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif text-4xl font-light text-[#C9A84C] block mb-4 leading-none">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-[#291418] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#8B7355] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SMART CONDITIONAL STUDIO & TRUST ARCHITECTURE
      ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-[#E2D7BD]/60 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Smart Optional Builder Panel */}
          <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-medium text-[#8B7355]">
                  <Sliders className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Personal Design Studio</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#291418]">
                  Only Fill What You Need. Nothing Extra.
                </h2>
                <p className="text-sm text-[#8B7355] leading-relaxed">
                  You never have to wrestle with long forms. Fill only your <strong className="text-[#291418] font-medium">Main Essentials</strong> to publish right away — any optional section you leave blank or toggled off automatically hides from your guest card with zero empty gaps.
                </p>
                <div className="pt-1">
                  <Link
                    href="/login"
                    className="button-shine inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                  >
                    <span>Open Design Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E2D7BD]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A84C] block mb-3.5">
                    Step 1 &bull; Main Details (Required)
                  </span>
                  <ul className="space-y-3 text-sm text-[#291418]">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C9A84C] shrink-0" />
                      <span>Bride &amp; Groom Names</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C9A84C] shrink-0" />
                      <span>Ceremony Date &amp; Time</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C9A84C] shrink-0" />
                      <span>Venue Name, Address &amp; Google Maps</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C9A84C] shrink-0" />
                      <span>3D Lifafa, Palace Gates, or Frosted Veil</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-[#F2ECE1]/45 border border-[#E2D7BD]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B7355] block mb-3.5">
                    Step 2 &bull; Optional Blocks (Auto-Hide)
                  </span>
                  <ul className="space-y-2.5 text-sm text-[#5A4636]">
                    {[
                      'Wedding Schedule (Nikah / Walima)',
                      'Modest Dress Code & Swatches',
                      'Royal Halal Banquet Menu',
                      'Couple Blessings, Story & Portrait',
                      'Gift Registry, Stay & Guest FAQs',
                    ].map((opt) => (
                      <li key={opt} className="flex items-center justify-between gap-2">
                        <span>{opt}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-[#E2D7BD] text-[#8B7355] font-medium shrink-0">
                          Optional
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Clean Editorial Trust Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white border border-[#E2D7BD] p-7 space-y-3 editorial-card-shadow">
              <div className="w-11 h-11 rounded-2xl bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#291418]">
                Enterprise API &amp; Payment Security
              </h3>
              <p className="text-sm text-[#8B7355] leading-relaxed">
                Hardened with 256-bit SSL encryption, strict HTTP security headers, and server-side HMAC-SHA256 payment verification so every ₹99 checkout and guest RSVP stays protected.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-[#E2D7BD] p-7 space-y-3 editorial-card-shadow">
              <div className="w-11 h-11 rounded-2xl bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#291418]">
                30 Days Card Active &amp; Automatic Expiry
              </h3>
              <p className="text-sm text-[#8B7355] leading-relaxed">
                Every wedding card stays active for <strong className="text-[#291418] font-medium">30 days</strong> from activation and expires automatically afterward so your private family celebration never lingers online indefinitely.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-[#E2D7BD] p-7 space-y-3 editorial-card-shadow">
              <div className="w-11 h-11 rounded-2xl bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#291418]">
                Post-Purchase WhatsApp Support
              </h3>
              <p className="text-sm text-[#8B7355] leading-relaxed">
                Email us anytime at <strong className="text-[#291418] font-medium">mrsalman7307@gmail.com</strong>. As soon as you create or purchase your ₹99 card, direct <strong className="text-[#291418] font-medium">Priority WhatsApp Support</strong> unlocks inside your Host Dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PAPER VS DIGITAL (UPGRADED LUXURY EDITORIAL COMPARISON TABLE)
      ========================================================================= */}
      <section id="comparison" className="py-16 sm:py-24 border-b border-[#E2D7BD]/60 bg-[#F2ECE1]/45">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-medium text-[#C9A84C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Paper vs Digital</span>
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#291418]">
              Why go digital?
            </h2>
            <p className="text-sm sm:text-base text-[#8B7355]">
              Save money, time, and the planet — while giving your guests a stunning interactive experience they&apos;ll actually love.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-[#E2D7BD] overflow-hidden shadow-[0_24px_55px_-20px_rgba(41,20,24,0.12)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#E2D7BD]">
                    <th className="py-6 px-6 bg-[#FAF7F2] w-[30%]">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-[#8B7355] font-semibold block">
                        Comparison Point
                      </span>
                      <span className="font-serif text-xl font-semibold text-[#291418] mt-0.5 block">
                        Feature
                      </span>
                    </th>
                    <th className="py-6 px-6 bg-[#FAF7F2] w-[32%] border-l border-[#F2ECE1]">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[#8B7355] font-medium block">
                        Traditional Printing
                      </span>
                      <span className="font-serif text-xl font-semibold text-[#5A4636] mt-0.5 inline-flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#8B7355]" />
                        <span>Paper Invitation</span>
                      </span>
                    </th>
                    <th className="py-6 px-6 bg-[#FAF4E6] w-[38%] border-l-2 border-[#C9A84C]/55">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C9A84C] text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Recommended &bull; ₹99 / Card</span>
                      </span>
                      <span className="font-serif text-xl font-semibold text-[#291418] block">
                        Eternal Vowz Digital
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1] text-sm">
                  {COMPARISON_ROWS.map((row, i) => {
                    const RowIcon =
                      row.icon === 'zap'
                        ? Zap
                        : row.icon === 'clock'
                        ? Clock
                        : row.icon === 'sparkles'
                        ? Sparkles
                        : row.icon === 'users'
                        ? Users
                        : row.icon === 'sliders'
                        ? Sliders
                        : row.icon === 'map'
                        ? MapPin
                        : ShieldCheck;

                    return (
                      <tr key={i} className="group transition-colors hover:bg-[#FAF7F2]/60">
                        <td className="py-5 px-6">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#F6EEDB] border border-[#E2D7BD]/80 text-[#C9A84C] flex items-center justify-center shrink-0 mt-0.5">
                              <RowIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-semibold text-[#291418] block leading-snug">
                                {row.feature}
                              </span>
                              <span className="text-xs text-[#8B7355] block mt-0.5">
                                {row.sub}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-[#6E5B47] border-l border-[#F2ECE1]">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                              <X className="w-3 h-3" />
                            </span>
                            <span className="leading-relaxed">{row.physical}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 bg-[#FAF4E6]/65 group-hover:bg-[#FAF4E6] border-l-2 border-[#C9A84C]/55 text-[#291418] font-medium transition-colors">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </span>
                            <span className="leading-relaxed">{row.digital}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Summary & Instant Sample / Create Action Bar */}
            <div className="bg-[#FAF7F2] border-t border-[#E2D7BD] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-serif text-lg font-semibold text-[#291418] block leading-tight">
                    Save ₹15,000+ &amp; 3 Weeks of Printing Stress
                  </span>
                  <span className="text-xs text-[#8B7355]">
                    Flat ₹99 per card &bull; 8 animated themes &bull; Card 30 Days tak active rahega
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  href="/invite/layla-omar-veil"
                  target="_blank"
                  className="px-4 py-2.5 rounded-md bg-white hover:bg-[#F6EEDB] text-[#291418] border border-[#C9A84C]/60 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>View Live Sample</span>
                  <ExternalLink className="w-3 h-3 text-[#8B7355]" />
                </Link>
                <Link
                  href="/login"
                  className="button-shine px-5 py-2.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Create Card @ ₹99</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. WOOOWINVITES PASTEL 3-COLUMN FAQ GRID & CHAMPAGNE-GOLD CTA BANNER
      ========================================================================= */}
      <section id="faq" className="py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* WooowInvites Signature Centered FAQ Header */}
          <div className="text-center mb-12 space-y-2.5">
            <div className="inline-flex items-center justify-center gap-3">
              <span className="w-8 h-8 rounded-full border border-[#6E2E3A]/40 text-[#6E2E3A] flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#4A252C]">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-sm text-[#8B7355]">
              Tap a question to learn more
            </p>
          </div>

          {/* 3-Column Soft Pastel Rounded Cards (Exact WooowInvites /faq Pattern) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FAQ_ITEMS.map((item, idx) => {
              const FaqIcon =
                item.icon === 'clock'
                  ? Clock
                  : item.icon === 'sparkles'
                  ? Sparkles
                  : item.icon === 'share'
                  ? Share2
                  : item.icon === 'sliders'
                  ? Sliders
                  : item.icon === 'message'
                  ? MessageCircle
                  : ShieldCheck;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveFaqIndex(idx)}
                  className={`${item.bg} ${item.border} border rounded-2xl p-6 text-left flex flex-col justify-between min-h-[196px] hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer group`}
                >
                  <div className="space-y-3">
                    <div className="text-[#6E2E3A]">
                      <FaqIcon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#3D1D24] leading-snug">
                      {item.q}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#7A6A5E] leading-relaxed line-clamp-2">
                      {item.a}
                    </p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <ArrowRight className="w-4 h-4 text-[#8B7355] group-hover:text-[#3D1D24] group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Frosted Modal when a Pastel FAQ Card is Tapped */}
          <AnimatePresence>
            {activeFaqIndex !== null && FAQ_ITEMS[activeFaqIndex] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveFaqIndex(null)}
                className="fixed inset-0 z-[90] bg-[#291418]/45 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 12 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full max-w-lg rounded-3xl ${FAQ_ITEMS[activeFaqIndex].bg} border-2 ${FAQ_ITEMS[activeFaqIndex].border} p-6 sm:p-8 shadow-2xl space-y-4`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E2D7BD] text-[11px] font-semibold text-[#6E2E3A]">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Eternal Vowz FAQ</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveFaqIndex(null)}
                      aria-label="Close FAQ dialog"
                      className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#291418] flex items-center justify-center border border-[#E2D7BD] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3D1D24] leading-snug">
                    {FAQ_ITEMS[activeFaqIndex].q}
                  </h3>

                  <p className="text-sm sm:text-base text-[#5A4636] leading-relaxed">
                    {FAQ_ITEMS[activeFaqIndex].a}
                  </p>

                  <div className="pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveFaqIndex(null)}
                      className="px-4 py-2 rounded-md bg-white hover:bg-[#FAF7F2] text-[#291418] border border-[#E2D7BD] text-xs font-semibold cursor-pointer"
                    >
                      Close
                    </button>
                    <Link
                      href="/login"
                      className="px-5 py-2.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Create Your Card @ ₹99</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exact WooowInvites Signature Champagne-Gold Gradient CTA Banner */}
          <div className="mt-16 max-w-4xl mx-auto rounded-3xl cta-gold-banner p-10 sm:p-14 text-center space-y-5 shadow-[0_24px_60px_-20px_rgba(201,168,76,0.55)] relative overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/25 backdrop-blur-sm border border-white/35 text-xs text-white font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Flat ₹99 Per Card &bull; Card Active for 30 Days</span>
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white">
              Ready to Create Something Beautiful?
            </h3>

            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
              Join modern families crafting interactive 3D Lifafas, 3D Shahi Palace Double-Door Gates, and Frosted-Blur Veil wedding invitations.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-7 py-3.5 rounded-md bg-[#FAF7F2] hover:bg-white text-[#291418] text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-md"
              >
                <span>Create Your Card &mdash; ₹99</span>
                <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
              </Link>
              <a
                href="mailto:mrsalman7307@gmail.com"
                className="px-5 py-3.5 rounded-md text-white hover:bg-white/15 text-sm font-medium inline-flex items-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>mrsalman7307@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <WeddingFooter />
    </div>
  );
}
