'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitation, GuestWithRsvp } from '@/types/database';
import { luxuryAudio } from '@/lib/audio';
import OriginalEmbossedLifafa from './OriginalEmbossedLifafa';
import RoyalPalaceGatesReveal from './RoyalPalaceGatesReveal';
import FrostedBlurReveal from './FrostedBlurReveal';
import FloatingParticles from './FloatingParticles';
import RsvpSection from '../invitation/RsvpSection';
import {
  TimelineIllustration,
  SectionHeaderBadge,
  OriginalRibbonMenuFrame,
} from '../invitation/OriginalWatercolorArt';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  MapPin,
  Send,
  ExternalLink,
  Gift,
  ChevronDown,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

interface EnvelopeExperienceProps {
  invitation: Invitation;
  guest?: GuestWithRsvp | null;
  autoPlayAudio?: boolean;
  isPreview?: boolean;
  replayTrigger?: number;
  onAnimationComplete?: () => void;
}

type Stage = 'closed' | 'opening' | 'opened';

const DRESS_SWATCHES = [
  { name: 'Champagne', hex: '#D8C398', border: '#B89E6C' },
  { name: 'Ivory Silk', hex: '#FAF6EE', border: '#DCD2C0' },
  { name: 'Dusty Rose', hex: '#D9A7B0', border: '#B8848E' },
  { name: 'Sage Leaf', hex: '#9EB096', border: '#7D9175' },
  { name: 'Espresso', hex: '#4A3B32', border: '#2F251F' },
];

export default function EnvelopeExperience({
  invitation,
  guest = null,
  autoPlayAudio = true,
  isPreview = false,
  replayTrigger = 0,
  onAnimationComplete,
}: EnvelopeExperienceProps) {
  const [stage, setStage] = useState<Stage>('closed');
  const [isMuted, setIsMuted] = useState(false);
  const [showDirectBank, setShowDirectBank] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 165, hours: 18, minutes: 14, seconds: 32 });

  // Live countdown ticker
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(invitation.event_date).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [invitation.event_date]);

  // Sync replay trigger from studio editor
  useEffect(() => {
    if (replayTrigger > 0) {
      setStage('closed');
      luxuryAudio.stop();
    }
  }, [replayTrigger]);

  const handleOpenEnvelope = () => {
    if (stage !== 'closed') return;

    luxuryAudio.playWaxSealCrack();
    setStage('opening');

    if (autoPlayAudio) {
      setTimeout(() => {
        luxuryAudio.startAmbientMusic(invitation.design_config.music_track || 'royal-harp');
      }, 450);
    }

    setTimeout(() => {
      setStage('opened');
      if (onAnimationComplete) onAnimationComplete();
    }, 1850);
  };

  const handleToggleMute = () => {
    const muted = luxuryAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleReplay = () => {
    setStage('closed');
    luxuryAudio.stop();
  };

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cfg = invitation.design_config;
  const coupleNames = cfg.couple_names;
  const waxSealSymbol =
    cfg.wax_seal_initial ||
    `${coupleNames.partner1?.[0] || 'Z'}&${coupleNames.partner2?.[0] || 'A'}`;

  // Format date like 24.10.2027
  const eventDateObj = new Date(invitation.event_date);
  const dotDate = !isNaN(eventDateObj.getTime())
    ? `${String(eventDateObj.getDate()).padStart(2, '0')}.${String(
        eventDateObj.getMonth() + 1
      ).padStart(2, '0')}.${eventDateObj.getFullYear()}`
    : '24.10.2027';

  // Conditional Visibility Flags ("user jitni detail card me fill kare utna hi card me show ho")
  const hasVenue = Boolean(
    invitation.venue_details?.venue_name?.trim() || invitation.venue_details?.address?.trim()
  );

  const scheduleItems = cfg.timeline?.filter((t) => t.title?.trim() || t.time?.trim()) || [];
  const showTimeline = cfg.show_timeline !== false && scheduleItems.length > 0;

  const showDressCode =
    cfg.show_dress_code !== false &&
    Boolean(
      invitation.venue_details?.dress_code?.trim() ||
        cfg.ladies_attire?.trim() ||
        cfg.gents_attire?.trim()
    );

  const showGifts =
    cfg.show_gifts === true &&
    Boolean(
      cfg.gift_note?.trim() || cfg.bank_account_holder?.trim() || cfg.bank_account_number?.trim()
    );

  const showMenu =
    cfg.show_menu === true &&
    Boolean(
      cfg.menu_starter_title?.trim() ||
        cfg.menu_main_title?.trim() ||
        cfg.menu_dessert_title?.trim()
    );

  const showStoryOrPortrait =
    (cfg.show_story !== false && Boolean(cfg.story?.trim())) || cfg.show_couple_portrait === true;

  const showAccommodation =
    cfg.show_accommodation === true &&
    Boolean(cfg.accommodation_name?.trim() || cfg.accommodation_note?.trim());

  const faqItems = cfg.faqs?.filter((f) => f.q?.trim() && f.a?.trim()) || [];
  const showFaq = cfg.show_faq === true && faqItems.length > 0;

  const showRsvp = cfg.show_rsvp !== false;

  const isFrostedBlur =
    cfg.opening_style === 'frosted-blur' ||
    (invitation.theme_id === 'pearl-veil' && !cfg.opening_style);

  const isPalaceGates =
    !isFrostedBlur &&
    (cfg.opening_style === 'palace-gates' ||
      (invitation.theme_id === 'blush-floral' && cfg.opening_style !== 'lifafa'));

  // 1-Month (30-Day) Card Expiry Calculation
  const createdMs = invitation.created_at ? new Date(invitation.created_at).getTime() : Date.now();
  const expiresMs = invitation.expires_at
    ? new Date(invitation.expires_at).getTime()
    : createdMs + 30 * 24 * 60 * 60 * 1000;
  const isCardExpired = !isPreview && expiresMs < Date.now();

  if (isCardExpired) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-white border border-[#E8DFD1] p-8 shadow-lg">
          <div className="w-14 h-14 rounded-full bg-[#6E2E3A] text-[#E5C17B] font-serif font-bold text-sm flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]">
            E&amp;V
          </div>
          <h1 className="font-serif text-2xl font-semibold text-[#2C221E] mb-2">
            Wedding Invitation Expired
          </h1>
          <p className="text-xs text-[#6E5D53] leading-relaxed mb-6">
            Each Eternal Vowz digital wedding card is active for <strong>1 Month (30 Days)</strong> from creation. This invitation link has completed its 30-day hosting period.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#6E2E3A] text-white text-xs font-medium hover:bg-[#58222C] transition-colors"
          >
            Host Dashboard &bull; Renew @ ₹79
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`notranslate ${
        isPreview ? 'w-full bg-[#f4e2c1]' : 'min-h-[100dvh] bg-[#f5f0e6] flex justify-center'
      } overflow-x-hidden relative select-none`}
    >
      {/* =========================================================================
          ORIGINAL DESKTOP WATERCOLOR FLORAL GARLAND CORNERS (Left & Right)
      ========================================================================= */}
      {!isPreview && (
        <div
          aria-hidden="true"
          className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
          <img
            src="/assets/invitecraft/floral-garland-corner.jpg"
            alt=""
            className="absolute top-0 left-0 w-[340px] xl:w-[420px] h-auto object-contain mix-blend-multiply opacity-90"
          />
          <img
            src="/assets/invitecraft/floral-garland-corner.jpg"
            alt=""
            className="absolute top-0 right-0 w-[340px] xl:w-[420px] h-auto object-contain scale-x-[-1] mix-blend-multiply opacity-90"
          />
        </div>
      )}

      {/* =========================================================================
          TOP-RIGHT REPLAY PILL & BOTTOM-RIGHT AUDIO SPEAKER BUTTON
      ========================================================================= */}
      {stage === 'opened' && (
        <>
          <div className={`${isPreview ? 'absolute top-3 right-3' : 'fixed top-4 right-4'} z-[60] flex items-center gap-2`}>
            <button
              type="button"
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FAF8F5]/95 backdrop-blur-sm border border-[#d8cfc0] shadow-md hover:bg-white transition-all text-xs font-serif italic text-[#2f2a24] cursor-pointer"
              title="Replay Opening Animation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#7a5c3e]" />
              <span>
                {isFrostedBlur
                  ? 'Replay Veil'
                  : isPalaceGates
                  ? 'Replay Gates'
                  : 'Replay Lifafa'}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            className={`${isPreview ? 'absolute bottom-3 right-3 w-10 h-10' : 'fixed bottom-6 right-6 w-14 h-14'} z-[60] rounded-full bg-neutral-900/85 hover:bg-neutral-900 backdrop-blur-sm shadow-xl flex items-center justify-center text-white transition-transform hover:scale-105 cursor-pointer`}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-300" />
            ) : (
              <Volume2 className="w-5 h-5 text-white animate-pulse" />
            )}
          </button>
        </>
      )}

      {/* =========================================================================
          CENTERED MOBILE INVITATION FRAME (100% Width inside Phone Preview)
      ========================================================================= */}
      <div
        data-invitation-phone-frame="true"
        className={`relative overflow-hidden w-full ${
          isPreview ? '' : 'md:max-w-[390px] mx-auto md:shadow-2xl min-h-[100dvh]'
        } z-10 bg-[#f4e2c1]`}
        style={{ color: '#2f2a24' }}
      >
        <AnimatePresence mode="wait">
          {/* =====================================================================
              STAGE 1 & 2: 3D EMBOSSED LIFAFA OR 3D SHAHI PALACE DOUBLE-GATES
          ===================================================================== */}
          {(stage === 'closed' || stage === 'opening') && (
            <motion.div
              key="original-opening-stage"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeInOut' } }}
            >
              {isFrostedBlur ? (
                <FrostedBlurReveal
                  themeId={invitation.theme_id}
                  guestName={guest ? guest.guest_name : 'Honored Guest & Family'}
                  waxSealInitial={waxSealSymbol}
                  coupleNames={coupleNames}
                  eventDateFormatted={dotDate}
                  stage={stage}
                  isPreview={isPreview}
                  onOpen={handleOpenEnvelope}
                />
              ) : isPalaceGates ? (
                <RoyalPalaceGatesReveal
                  themeId={invitation.theme_id}
                  guestName={guest ? guest.guest_name : 'Honored Guest & Family'}
                  waxSealInitial={waxSealSymbol}
                  coupleNames={coupleNames}
                  eventDateFormatted={dotDate}
                  stage={stage}
                  isPreview={isPreview}
                  onOpen={handleOpenEnvelope}
                />
              ) : (
                <OriginalEmbossedLifafa
                  themeId={invitation.theme_id}
                  guestName={guest ? guest.guest_name : 'Honored Guest & Family'}
                  waxSealInitial={waxSealSymbol}
                  coupleNames={coupleNames}
                  eventDateFormatted={dotDate}
                  stage={stage}
                  isPreview={isPreview}
                  onOpen={handleOpenEnvelope}
                />
              )}
            </motion.div>
          )}

          {/* =====================================================================
              STAGE 3: OPENED ORIGINAL WATERCOLOR ILLUSTRATED INVITATION SUITE
          ===================================================================== */}
          {stage === 'opened' && (
            <motion.div
              key="opened-original-scroll"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="relative w-full overflow-hidden"
            >
              {/* Ambient Shimmering Golden Bokeh Particles */}
              <FloatingParticles count={isPreview ? 10 : 18} color="#E6B85C" />

              {/* -----------------------------------------------------------------
                  HERO SECTION: UNIQUE THEME-SPECIFIC WATERCOLOR SCENE (690px)
              ----------------------------------------------------------------- */}
              <div className="relative w-full h-[690px] overflow-hidden">
                <img
                  src={
                    invitation.theme_id === 'pearl-veil'
                      ? '/assets/invitecraft/hero-pearl-botanical.jpg'
                      : invitation.theme_id === 'royal-emerald'
                      ? '/assets/invitecraft/hero-mughal-emerald.jpg'
                      : invitation.theme_id === 'midnight-minimalist'
                      ? '/assets/invitecraft/hero-starlight-midnight.jpg'
                      : invitation.theme_id === 'blush-floral'
                      ? '/assets/invitecraft/venue-royal-palace.jpg'
                      : '/assets/invitecraft/hero-palace-sunset.jpg'
                  }
                  alt="Wedding Card Hero Scene"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                {invitation.theme_id === 'blush-floral' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(253,246,240,0.92) 0%, rgba(253,246,240,0.58) 38%, rgba(253,246,240,0.12) 100%)',
                    }}
                  />
                )}

                {/* Animated Twinkling String Light Glow Overlay */}
                <motion.div
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-0 top-[34%] h-32 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(255, 223, 138, 0.45) 0%, transparent 75%)',
                  }}
                />

                {/* Couple Names & Wedding Date Overlay */}
                <div
                  className={`relative z-10 px-6 text-center flex flex-col items-center ${
                    invitation.theme_id === 'royal-emerald'
                      ? 'pt-36'
                      : invitation.theme_id === 'midnight-minimalist'
                      ? 'pt-36'
                      : invitation.theme_id === 'pearl-veil'
                      ? 'pt-14'
                      : 'pt-12'
                  }`}
                >
                  <h1
                    className={`font-serif text-[31px] tracking-[0.1em] uppercase font-normal leading-tight ${
                      invitation.theme_id === 'midnight-minimalist'
                        ? 'text-[#F8E7B2] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]'
                        : invitation.theme_id === 'royal-emerald'
                        ? 'text-[#0B3626] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'
                        : 'text-[#2f2a24]'
                    }`}
                  >
                    {coupleNames.partner1 || 'ZOYA'}
                  </h1>

                  <span
                    className={`font-great-vibes text-[24px] -my-1 ${
                      invitation.theme_id === 'midnight-minimalist'
                        ? 'text-[#E5C17B]'
                        : 'text-[#7a5c3e]'
                    }`}
                  >
                    and
                  </span>

                  <h1
                    className={`font-serif text-[31px] tracking-[0.1em] uppercase font-normal leading-tight ${
                      invitation.theme_id === 'midnight-minimalist'
                        ? 'text-[#F8E7B2] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]'
                        : invitation.theme_id === 'royal-emerald'
                        ? 'text-[#0B3626] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'
                        : 'text-[#2f2a24]'
                    }`}
                  >
                    {coupleNames.partner2 || 'AYAAN'}
                  </h1>

                  {cfg.subtitle && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className={`font-serif text-[10px] tracking-[0.16em] uppercase mt-1.5 max-w-[230px] ${
                        invitation.theme_id === 'midnight-minimalist'
                          ? 'text-[#E8DFCA] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                          : 'text-[#5a5044]'
                      }`}
                    >
                      {cfg.subtitle}
                    </motion.p>
                  )}

                  {/* Diamond Ornamental Line */}
                  <div className="flex items-center justify-center gap-2.5 mt-3 mb-1.5 opacity-75">
                    <div
                      className={`h-[1px] w-12 ${
                        invitation.theme_id === 'midnight-minimalist'
                          ? 'bg-[#E5C17B]'
                          : 'bg-[#6e5d4b]'
                      }`}
                    />
                    <div
                      className={`w-1.5 h-1.5 rotate-45 ${
                        invitation.theme_id === 'midnight-minimalist'
                          ? 'bg-[#E5C17B]'
                          : 'bg-[#8c6d46]'
                      }`}
                    />
                    <div
                      className={`h-[1px] w-12 ${
                        invitation.theme_id === 'midnight-minimalist'
                          ? 'bg-[#E5C17B]'
                          : 'bg-[#6e5d4b]'
                      }`}
                    />
                  </div>

                  {/* Date in 24.10.2027 format */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                    className={`font-serif text-[18px] tracking-[0.14em] font-semibold ${
                      invitation.theme_id === 'midnight-minimalist'
                        ? 'text-[#FFF6D6] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]'
                        : 'text-[#2f2a24]'
                    }`}
                  >
                    {dotDate}
                  </motion.div>
                </div>
              </div>

              {/* -----------------------------------------------------------------
                  CONTINUOUS ORIGINAL VINTAGE ROSE PARCHMENT BODY
              ----------------------------------------------------------------- */}
              <div
                className="relative w-full"
                style={{
                  backgroundImage: "url('/assets/invitecraft/parchment-floral-frame.jpg')",
                  backgroundSize: '100% auto',
                  backgroundRepeat: 'repeat-y',
                  backgroundPosition: 'top center',
                }}
              >
                {/* Soft Gradient Transition Seam */}
                <div
                  className="w-full h-10 -mt-5 relative z-10 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(244,226,193,0) 0%, #f4e2c1 50%, rgba(244,226,193,0) 100%)',
                  }}
                />

                {/* ===============================================================
                    BLOCK 1: LIVE COUNTDOWN (Always Shown)
                =============================================================== */}
                <section className="relative z-10 pt-4 pb-10 px-5 text-center">
                  <h2 className="font-great-vibes text-[44px] text-[#2f2a24] leading-tight">
                    Countdown
                  </h2>
                  <p className="font-serif italic text-[15px] text-[#4a4238] -mt-1 mb-6">
                    Counting every moment until we celebrate together
                  </p>

                  <div className="grid grid-cols-4 gap-2.5 max-w-[335px] mx-auto">
                    {[
                      { value: timeLeft.days, label: 'DAYS' },
                      { value: timeLeft.hours, label: 'HOURS' },
                      { value: timeLeft.minutes, label: 'MINUTES' },
                      { value: timeLeft.seconds, label: 'SECONDS' },
                    ].map((unit) => (
                      <div key={unit.label} className="flex flex-col items-center">
                        <div className="w-full aspect-square rounded-xl bg-white/40 backdrop-blur-[2px] border border-white/70 shadow-xs flex items-center justify-center">
                          <span className="font-great-vibes text-[34px] text-[#2f2a24] leading-none">
                            {unit.value}
                          </span>
                        </div>
                        <span className="font-serif italic text-[11px] tracking-[0.16em] uppercase text-[#4a4238] mt-2">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ===============================================================
                    BLOCK 2: THE VENUE (Shown if Venue Name or Address is filled)
                =============================================================== */}
                {hasVenue && (
                  <section className="relative z-10 py-9 px-4 text-center">
                    <h2 className="font-great-vibes text-[46px] text-[#2f2a24] leading-tight mb-3">
                      The Venue
                    </h2>

                    <div className="relative mx-auto w-full max-w-[345px] rounded-2xl overflow-hidden">
                      <img
                        src="/assets/invitecraft/venue-royal-palace.jpg"
                        alt={invitation.venue_details.venue_name}
                        className="w-full h-auto object-contain mx-auto mix-blend-multiply"
                      />
                    </div>

                    <div className="w-11 h-11 rounded-full bg-[#fbf9f5] border-[1.5px] border-[#5c724a] flex items-center justify-center mx-auto my-3 text-[#495e38] shadow-xs">
                      <MapPin className="w-5 h-5" />
                    </div>

                    {invitation.venue_details.venue_name && (
                      <h3 className="font-great-vibes text-[31px] text-[#2f2a24] leading-snug px-2">
                        {invitation.venue_details.venue_name}
                      </h3>
                    )}
                    {invitation.venue_details.hall_name && (
                      <p className="font-serif italic text-[14px] font-semibold text-[#6e5d4b] px-6 mt-0.5">
                        {invitation.venue_details.hall_name}
                      </p>
                    )}
                    {invitation.venue_details.address && (
                      <p className="font-serif italic text-[14.5px] text-[#4a4238] px-8 leading-relaxed mt-1">
                        {invitation.venue_details.address}
                      </p>
                    )}

                    {invitation.venue_details.maps_url && (
                      <a
                        href={invitation.venue_details.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 mx-auto max-w-[285px] bg-[#fbf9f5] hover:bg-white text-[#2f2a24] rounded-full px-4 py-2.5 shadow-md border border-[#e6dec8] flex items-center justify-between gap-3 transition-transform hover:scale-[1.02]"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#e5dec9] flex items-center justify-center shrink-0 text-[#5c4934]">
                          <Send className="w-4 h-4" />
                        </div>
                        <div className="text-center leading-tight flex-1">
                          <span className="font-serif italic text-[15px] block text-[#2f2a24]">
                            Get directions
                          </span>
                          <span className="font-serif italic text-[12px] text-[#6e6254] block">
                            Open in Google Maps
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#5c5246] shrink-0 mr-1" />
                      </a>
                    )}
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 3: SCHEDULE TIMELINE (Optional — Only if filled & enabled)
                =============================================================== */}
                {showTimeline && (
                  <section className="relative z-10 py-9 px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-5 opacity-45">
                      <div className="h-[1px] w-14 bg-[#7a6855]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7a6855]" />
                      <div className="h-[1px] w-14 bg-[#7a6855]" />
                    </div>

                    <SectionHeaderBadge type="clock" />

                    <h2 className="font-great-vibes text-[40px] text-[#2f2a24] mb-1">
                      Wedding Itinerary
                    </h2>
                    <p className="font-serif italic text-[15px] text-[#4a4238] mb-10 px-2">
                      What we have planned for our special day
                    </p>

                    <div className="relative max-w-[340px] mx-auto">
                      <div className="absolute left-1/2 top-4 bottom-4 w-[1px] -translate-x-1/2 bg-[#8c7a65]/50" />

                      <div className="space-y-12">
                        {scheduleItems.map((item, idx) => {
                          const isLeft = idx % 2 === 0;
                          return (
                            <div key={idx} className="relative grid grid-cols-2 items-center">
                              <div className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#fbf9f5] border-[1.5px] border-[#5c4d3c] z-10" />

                              {isLeft ? (
                                <>
                                  <div className="pr-5 flex flex-col items-center text-center">
                                    <TimelineIllustration index={idx} />
                                    <span className="font-serif italic text-[21px] font-semibold text-[#2f2a24] leading-tight">
                                      {item.time}
                                    </span>
                                    <h3 className="font-great-vibes text-[20px] tracking-wider text-[#2f2a24] mt-0.5">
                                      {item.title}
                                    </h3>
                                    {item.description && (
                                      <p className="font-serif italic text-[13px] text-[#4a4238] leading-snug mt-1">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                  <div />
                                </>
                              ) : (
                                <>
                                  <div />
                                  <div className="pl-5 flex flex-col items-center text-center">
                                    <TimelineIllustration index={idx} />
                                    <span className="font-serif italic text-[21px] font-semibold text-[#2f2a24] leading-tight">
                                      {item.time}
                                    </span>
                                    <h3 className="font-great-vibes text-[20px] tracking-wider text-[#2f2a24] mt-0.5">
                                      {item.title}
                                    </h3>
                                    {item.description && (
                                      <p className="font-serif italic text-[13px] text-[#4a4238] leading-snug mt-1">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 4: DRESS CODE (Optional — Only if filled & enabled)
                =============================================================== */}
                {showDressCode && (
                  <section className="relative z-10 py-9 px-5 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4 opacity-45">
                      <div className="h-[1px] w-14 bg-[#7a6855]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7a6855]" />
                      <div className="h-[1px] w-14 bg-[#7a6855]" />
                    </div>

                    <h2 className="font-great-vibes text-[42px] text-[#2f2a24] mb-4">
                      {invitation.venue_details.dress_code || 'Modest & Royal Attire'}
                    </h2>

                    <div className="rounded-3xl bg-[#fbf8f1]/85 backdrop-blur-xs border border-white/80 p-6 shadow-md">
                      <div className="w-60 mx-auto mb-2 rounded-2xl overflow-hidden">
                        <img
                          src="/assets/invitecraft/dresscode-couple-art.jpg?v=loose-abaya"
                          alt="Modest Loose Abaya Muslim Bride and Groom Attire Illustration"
                          className="w-full h-auto object-contain mx-auto mix-blend-multiply"
                        />
                      </div>

                      <h3 className="font-great-vibes text-[28px] text-[#2f2a24] mb-3">
                        Modest Traditional Elegance
                      </h3>

                      <div className="border-t border-[#d8cbb8]/60 pt-3 pb-4 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <span className="font-serif italic text-xs uppercase tracking-widest text-[#6e6254] block">
                            Ladies
                          </span>
                          <span className="font-great-vibes text-[20px] text-[#2f2a24]">
                            {cfg.ladies_attire || 'Modest Gown / Abaya'}
                          </span>
                        </div>
                        <div>
                          <span className="font-serif italic text-xs uppercase tracking-widest text-[#6e6254] block">
                            Gentlemen
                          </span>
                          <span className="font-serif italic text-[17px] text-[#2f2a24]">
                            {cfg.gents_attire || 'Sherwani / Suit'}
                          </span>
                        </div>
                      </div>

                      <p className="font-serif italic text-[17px] text-[#2f2a24] mb-3">
                        Suggested color palette:
                      </p>

                      <div className="flex items-center justify-center gap-3">
                        {DRESS_SWATCHES.map((s) => (
                          <div key={s.name} className="flex flex-col items-center gap-1">
                            <div
                              className="w-10 h-10 rounded-full shadow-xs border"
                              style={{ backgroundColor: s.hex, borderColor: s.border }}
                            />
                            <span className="font-serif italic text-[10.5px] text-[#4a4238]">
                              {s.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 5: BLESSINGS & GIFTS (Optional — Only if filled & enabled)
                =============================================================== */}
                {showGifts && (
                  <section className="relative z-10 py-9 px-5 text-center">
                    <SectionHeaderBadge type="gift" />
                    <h2 className="font-great-vibes text-[44px] text-[#2f2a24] mb-4">
                      Blessings &amp; Gifts
                    </h2>

                    <div className="rounded-3xl bg-[#fbf9f5] p-6 shadow-md border border-[#e6dec8]">
                      <p className="font-great-vibes text-[24px] leading-relaxed text-[#2f2a24]">
                        {cfg.gift_note ||
                          'Your warm presence and duas are our greatest blessing. Should you wish to honor us with a gift, details are below.'}
                      </p>

                      {(cfg.bank_account_holder || cfg.bank_account_number) && (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowDirectBank(!showDirectBank)}
                            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d88c9a]/90 hover:bg-[#c77b89] text-[#2f2a24] font-serif italic text-sm shadow-xs transition-transform hover:scale-105 cursor-pointer"
                          >
                            <Gift className="w-4 h-4" />
                            <span>
                              {showDirectBank ? 'Hide Account Details' : 'View Salam / Gift Details'}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${
                                showDirectBank ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {showDirectBank && (
                            <div className="mt-4 pt-4 border-t border-[#e6dec8] space-y-2.5 text-left font-serif italic text-xs">
                              {cfg.bank_account_holder && (
                                <div className="p-3 rounded-xl bg-[#f5f0e6] flex items-center justify-between">
                                  <div>
                                    <span className="text-[10px] uppercase not-italic text-[#7a6855] block">
                                      Account Holder
                                    </span>
                                    <span className="text-sm text-[#2f2a24]">
                                      {cfg.bank_account_holder}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(cfg.bank_account_holder!, 'holder')}
                                    className="p-1.5 text-[#5c5246] hover:text-[#2f2a24]"
                                  >
                                    {copiedField === 'holder' ? (
                                      <Check className="w-4 h-4 text-emerald-700" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              )}

                              {cfg.bank_account_number && (
                                <div className="p-3 rounded-xl bg-[#f5f0e6] flex items-center justify-between">
                                  <div>
                                    <span className="text-[10px] uppercase not-italic text-[#7a6855] block">
                                      Account / UPI / IBAN
                                    </span>
                                    <span className="text-sm font-mono not-italic text-[#2f2a24]">
                                      {cfg.bank_account_number}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(cfg.bank_account_number!, 'iban')}
                                    className="p-1.5 text-[#5c5246] hover:text-[#2f2a24]"
                                  >
                                    {copiedField === 'iban' ? (
                                      <Check className="w-4 h-4 text-emerald-700" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 6: ROYAL HALAL MENU (Optional — Only if filled & enabled)
                =============================================================== */}
                {showMenu && (
                  <section className="relative z-10 py-9 px-4 text-center">
                    <div className="relative mx-auto w-full min-h-[610px] flex flex-col items-center justify-start pt-20 pb-28 px-12">
                      <OriginalRibbonMenuFrame />

                      <div className="relative z-20 space-y-5">
                        <div>
                          <h2 className="font-great-vibes text-[44px] text-[#2f2a24] leading-none">
                            Royal Halal Menu
                          </h2>
                          <span className="font-serif italic text-[11.5px] tracking-widest uppercase text-[#7a5c3e] block mt-1">
                            ✦ 100% Certified Halal Dawat ✦
                          </span>
                        </div>

                        {cfg.menu_starter_title && (
                          <div className="space-y-1">
                            <h3 className="font-great-vibes text-[27px] text-[#6B2232]">
                              — Starter —
                            </h3>
                            <p className="font-serif italic text-[14.5px] font-semibold text-[#2f2a24]">
                              {cfg.menu_starter_title}
                            </p>
                            {cfg.menu_starter_desc && (
                              <p className="font-serif italic text-[12.5px] text-[#4a4238] leading-snug">
                                {cfg.menu_starter_desc}
                              </p>
                            )}
                          </div>
                        )}

                        {cfg.menu_main_title && (
                          <div className="space-y-1">
                            <h3 className="font-great-vibes text-[27px] text-[#6B2232]">
                              — Main Course —
                            </h3>
                            <p className="font-serif italic text-[14.5px] font-semibold text-[#2f2a24]">
                              {cfg.menu_main_title}
                            </p>
                            {cfg.menu_main_desc && (
                              <p className="font-serif italic text-[12.5px] text-[#4a4238] leading-snug">
                                {cfg.menu_main_desc}
                              </p>
                            )}
                          </div>
                        )}

                        {cfg.menu_dessert_title && (
                          <div className="space-y-1">
                            <h3 className="font-great-vibes text-[27px] text-[#6B2232]">
                              — Dessert —
                            </h3>
                            <p className="font-serif italic text-[14.5px] font-semibold text-[#2f2a24]">
                              {cfg.menu_dessert_title}
                            </p>
                            {cfg.menu_dessert_desc && (
                              <p className="font-serif italic text-[12.5px] text-[#4a4238] leading-snug">
                                {cfg.menu_dessert_desc}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 7: BLESSED UNION PORTRAIT & OUR STORY (Optional)
                =============================================================== */}
                {showStoryOrPortrait && (
                  <section className="relative z-10 py-8 px-5 text-center">
                    <h2 className="font-great-vibes text-[42px] text-[#2f2a24] leading-tight">
                      Blessed Union
                    </h2>
                    <p className="font-serif italic text-[14px] text-[#5c5246] mb-5">
                      And We created you in pairs
                    </p>

                    <div className="relative mx-auto max-w-[310px] rounded-[36px] bg-[#fbf8f1]/90 border-2 border-[#C5A059] p-5 shadow-md space-y-4">
                      {cfg.show_couple_portrait !== false && (
                        <div className="w-60 mx-auto rounded-2xl overflow-hidden">
                          <img
                            src="/assets/invitecraft/couple-nikah-portrait.jpg?v=loose-abaya"
                            alt="Modest Loose Abaya Muslim Bride and Groom Under Floral Arch"
                            className="w-full h-auto object-contain mx-auto mix-blend-multiply"
                          />
                        </div>
                      )}

                      {cfg.show_story !== false && cfg.story?.trim() && (
                        <div className="pt-2 border-t border-[#e6dec8]">
                          <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-[#9C762B]" />
                          </div>
                          <p className="font-serif italic text-[14px] text-[#2f2a24] leading-relaxed">
                            &ldquo;{cfg.story}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 8: ACCOMMODATION (Optional — Only if filled & enabled)
                =============================================================== */}
                {showAccommodation && (
                  <section className="relative z-10 py-9 px-5 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4 opacity-45">
                      <div className="h-[1px] w-14 bg-[#7a6855]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7a6855]" />
                      <div className="h-[1px] w-14 bg-[#7a6855]" />
                    </div>

                    <h2 className="font-great-vibes text-[44px] text-[#2f2a24] leading-tight">
                      Accommodation
                    </h2>
                    <p className="font-serif italic text-[15px] text-[#4a4238] mb-6">
                      Curated stays for our traveling family &amp; guests
                    </p>

                    <div className="rounded-3xl bg-[#fbf8f1]/85 border border-[#e6dec8] p-4 shadow-md text-left">
                      <div className="rounded-2xl overflow-hidden mb-3">
                        <img
                          src="/assets/invitecraft/accommodation-palace-hotel.jpg"
                          alt={cfg.accommodation_name || 'Partner Hotel'}
                          className="w-full h-auto object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="px-2 space-y-1.5">
                        {cfg.accommodation_name && (
                          <h3 className="font-serif font-bold text-[20px] text-[#2f2a24]">
                            {cfg.accommodation_name}
                          </h3>
                        )}
                        {cfg.accommodation_note && (
                          <p className="font-serif italic text-[14px] text-[#4a4238] leading-snug">
                            {cfg.accommodation_note}
                          </p>
                        )}
                        {cfg.accommodation_url && (
                          <div className="flex items-center justify-between pt-2">
                            <span className="font-serif italic text-[14px] font-semibold text-[#7a5c3e]">
                              Courtesy Guest Block
                            </span>
                            <a
                              href={cfg.accommodation_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-serif italic text-[13.5px] text-[#2f2a24] hover:underline"
                            >
                              <span>View details</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 9: FAQ ACCORDION (Optional — Only if filled & enabled)
                =============================================================== */}
                {showFaq && (
                  <section className="relative z-10 py-9 px-5 text-center">
                    <SectionHeaderBadge type="faq" />
                    <h2 className="font-great-vibes text-[42px] text-[#2f2a24] mb-6">
                      Questions &amp; Answers
                    </h2>

                    <div className="space-y-3 text-left">
                      {faqItems.map((faq, idx) => {
                        const isOpen = openFaqIdx === idx;
                        return (
                          <div
                            key={idx}
                            className="rounded-xl bg-[#fbf9f5] border border-[#e6dec8] shadow-xs overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                              className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 cursor-pointer"
                            >
                              <span className="font-serif text-[14.5px] text-[#2f2a24]">
                                {faq.q}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-[#5c5246] shrink-0 transition-transform ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 pt-1 font-serif italic text-[13.5px] text-[#5c5246] border-t border-[#f0e8d8]">
                                    {faq.a}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 10: RSVP SECTION (Shown if show_rsvp !== false)
                =============================================================== */}
                {showRsvp && <RsvpSection guest={guest} />}

                {/* ===============================================================
                    SCROLL TO RSVP INDICATOR & FOOTER
                =============================================================== */}
                <div className="pb-14 pt-4 text-center space-y-4 relative z-10">
                  {showRsvp && (
                    <button
                      type="button"
                      onClick={scrollToRsvp}
                      className="mx-auto flex flex-col items-center gap-1.5 text-[#2f2a24] opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold">
                        SCROLL TO RSVP
                      </span>
                      <span className="w-5 h-8 rounded-full border-[1.5px] border-[#2f2a24] flex items-start justify-center p-1">
                        <motion.span
                          animate={{ y: [0, 8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-1 h-2 rounded-full bg-[#2f2a24]"
                        />
                      </span>
                    </button>
                  )}

                  <p className="font-serif italic text-xs text-[#5c5246]">
                    Crafted with Love ❤️ Eternal Vowz (E&amp;V) Bespoke Wedding Suite
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
