'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitation, GuestWithRsvp } from '@/types/database';
import { luxuryAudio } from '@/lib/audio';
import { safeExternalUrl } from '@/lib/security';
import OriginalEmbossedLifafa from './OriginalEmbossedLifafa';
import RoyalPalaceGatesReveal from './RoyalPalaceGatesReveal';
import FrostedBlurReveal from './FrostedBlurReveal';
import CinemaVideoReveal from './CinemaVideoReveal';
import FloatingParticles from './FloatingParticles';
import ScratchCountdownBoxes from '../invitation/ScratchCountdownBoxes';
import RsvpSection from '../invitation/RsvpSection';
import {
  ScrollInkHeading,
  ScrollWordReveal,
  ScrollOrnamentDivider,
  ScrollRevealBlock,
} from '../invitation/ScrollRevealText';
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

const CINEMA_VIDEO_THEMES: Partial<Record<string, { videoSrc: string; posterSrc: string }>> = {
  'pearl-veil': {
    videoSrc: '/assets/pearl-veil/intro-camera.mp4',
    posterSrc: '/assets/pearl-veil/intro-poster.jpg',
  },
  'blush-floral': {
    videoSrc: '/assets/shahi-gold/intro-gold.mp4',
    posterSrc: '/assets/shahi-gold/intro-poster.jpg',
  },
  'tuscan-sunset': {
    videoSrc: '/assets/tuscan-haveli/intro-haveli.mp4',
    posterSrc: '/assets/tuscan-haveli/intro-poster.jpg',
  },
  'royal-emerald': {
    videoSrc: '/assets/mughal-silk/intro-silk.mp4',
    posterSrc: '/assets/mughal-silk/intro-poster.jpg',
  },
  'midnight-minimalist': {
    videoSrc: '/assets/celestial-box/intro-box.mp4',
    posterSrc: '/assets/celestial-box/intro-poster.jpg',
  },
};

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
  const [isDateRevealed, setIsDateRevealed] = useState(false);

  // Restore scratched/revealed date status from localStorage (persists across page reloads)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const key = `ev_date_scratched_${invitation.slug || invitation.id}`;
        if (localStorage.getItem(key) === 'true') {
          setIsDateRevealed(true);
        }
      }
    } catch {
      // Storage unavailable in private browsing
    }
  }, [invitation.slug, invitation.id]);

  // Forward desktop wheel events to the phone frame container for seamless snap scrolling
  useEffect(() => {
    if (isPreview || stage !== 'opened') return;
    const phoneContainer = document.querySelector('[data-invitation-phone-frame="true"]');
    if (!phoneContainer) return;

    const handleWindowWheel = (e: WheelEvent) => {
      if (!phoneContainer.contains(e.target as Node)) {
        phoneContainer.scrollBy({ top: e.deltaY, behavior: 'auto' });
      }
    };
    window.addEventListener('wheel', handleWindowWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWindowWheel);
  }, [isPreview, stage]);

  // Smooth scroll to next section
  const scrollToNextSection = (targetId?: string) => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    const phoneContainer = document.querySelector('[data-invitation-phone-frame="true"]');
    if (phoneContainer) {
      phoneContainer.scrollBy({ top: window.innerHeight * 0.92, behavior: 'smooth' });
    }
  };

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

  // Cleanup audio when leaving the card page
  useEffect(() => {
    return () => {
      luxuryAudio.stop();
    };
  }, []);

  const handleOpenEnvelope = () => {
    if (stage !== 'closed') return;

    luxuryAudio.playWaxSealCrack();
    setStage('opening');

    // Start signature wedding music synchronously within the user tap gesture for 100% mobile compatibility
    if (autoPlayAudio) {
      const activeTrack = invitation.design_config.custom_music_url || invitation.design_config.music_track || 'wedding-nasheed';
      luxuryAudio.startAmbientMusic(activeTrack);
    }

    setTimeout(() => {
      setStage('opened');
      if (onAnimationComplete) onAnimationComplete();
    }, 1850);
  };

  // Starts ambient wedding music right from the first tap across all cards (including 3D Cinema Video cards):
  const handleCinemaStart = () => {
    if (stage !== 'closed') return;
    setStage('opening');
    if (autoPlayAudio) {
      const activeTrack = invitation.design_config.custom_music_url || invitation.design_config.music_track || 'wedding-nasheed';
      luxuryAudio.startAmbientMusic(activeTrack);
    }
  };

  const handleCinemaComplete = () => {
    setStage('opened');
    if (autoPlayAudio) {
      const activeTrack = invitation.design_config.custom_music_url || invitation.design_config.music_track || 'wedding-nasheed';
      luxuryAudio.startAmbientMusic(activeTrack);
    }
    if (onAnimationComplete) onAnimationComplete();
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

  const cinemaConfig = CINEMA_VIDEO_THEMES[invitation.theme_id];
  const isCinemaVideo = Boolean(cinemaConfig);
  const isDarkPalace = invitation.theme_id === 'pearl-veil';

  const heroImageSrc =
    invitation.theme_id === 'pearl-veil'
      ? '/assets/pearl-veil/hero-palace-corridor.jpg'
      : invitation.theme_id === 'royal-emerald'
      ? '/assets/mughal-silk/hero-mughal-courtyard.jpg'
      : invitation.theme_id === 'midnight-minimalist'
      ? '/assets/celestial-box/hero-celestial-stage.jpg'
      : invitation.theme_id === 'blush-floral'
      ? '/assets/shahi-gold/hero-mountain-pavilion.jpg'
      : invitation.theme_id === 'jodhpur-sapphire'
      ? '/assets/jodhpur-sapphire/hero-jodhpur-sapphire.jpg'
      : invitation.theme_id === 'shahi-crimson'
      ? '/assets/shahi-crimson/hero-shahi-crimson.jpg'
      : invitation.theme_id === 'kashmir-lotus'
      ? '/assets/kashmir-lotus/hero-kashmir-lotus.jpg'
      : '/assets/tuscan-haveli/hero-haveli-courtyard.jpg';

  const isFrostedBlur =
    !isCinemaVideo && cfg.opening_style === 'frosted-blur';

  const isPalaceGates =
    !isCinemaVideo &&
    !isFrostedBlur &&
    cfg.opening_style === 'palace-gates';

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
        isPreview
          ? isDarkPalace
            ? 'w-full bg-[#1A110B]'
            : 'w-full bg-[#f4e2c1]'
          : isDarkPalace
          ? 'h-[100dvh] overflow-hidden bg-[#120B07] flex justify-center'
          : 'h-[100dvh] overflow-hidden bg-[#f5f0e6] flex justify-center'
      } relative select-none`}
    >
      {/* =========================================================================
          DESKTOP BACKGROUND FRAMING (Candlelit Palace Glow vs Watercolor Corners)
      ========================================================================= */}
      {!isPreview && (
        <div
          aria-hidden="true"
          className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
          {isDarkPalace ? (
            <>
              <div
                className="absolute inset-0 opacity-35"
                style={{
                  background:
                    'radial-gradient(circle at 14% 18%, rgba(229,193,123,0.28) 0%, transparent 45%), radial-gradient(circle at 86% 18%, rgba(229,193,123,0.28) 0%, transparent 45%), radial-gradient(circle at 50% 85%, rgba(168,112,48,0.18) 0%, transparent 55%)',
                }}
              />
            </>
          ) : (
            <>
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
            </>
          )}
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
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full backdrop-blur-sm shadow-md transition-all text-xs font-serif italic cursor-pointer ${
                isDarkPalace
                  ? 'bg-[#1C120B]/90 border border-[#E5C17B]/45 hover:bg-[#2A1B10] text-[#FFF4CF]'
                  : 'bg-[#FAF8F5]/95 border border-[#d8cfc0] hover:bg-white text-[#2f2a24]'
              }`}
              title="Replay Opening Animation"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isDarkPalace ? 'text-[#E5C17B]' : 'text-[#7a5c3e]'}`} />
              <span>
                {isCinemaVideo
                  ? 'Replay Scene'
                  : isFrostedBlur
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
            className={`${isPreview ? 'absolute bottom-3 right-3 w-10 h-10' : 'fixed bottom-6 right-6 w-14 h-14'} z-[60] rounded-full backdrop-blur-sm shadow-xl flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
              isDarkPalace
                ? 'bg-[#1C120B]/90 hover:bg-[#2A1B10] border border-[#E5C17B]/45 text-[#FFF4CF]'
                : 'bg-neutral-900/85 hover:bg-neutral-900 text-white'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-300" />
            ) : (
              <Volume2 className={`w-5 h-5 animate-pulse ${isDarkPalace ? 'text-[#E5C17B]' : 'text-white'}`} />
            )}
          </button>
        </>
      )}

      {/* =========================================================================
          CENTERED MOBILE INVITATION FRAME (100% Width inside Phone Preview)
      ========================================================================= */}
      <div
        data-invitation-phone-frame="true"
        className={`relative w-full ${
          isPreview
            ? 'overflow-x-clip'
            : stage === 'opened'
            ? 'md:max-w-[390px] mx-auto md:shadow-2xl h-[100dvh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth'
            : 'md:max-w-[390px] mx-auto md:shadow-2xl h-[100dvh] overflow-hidden'
        } z-10 ${isDarkPalace ? 'bg-[#1A110B]' : 'bg-[#f4e2c1]'}`}
        style={{
          color: isDarkPalace ? '#FFF4CF' : '#2f2a24',
          scrollSnapType: !isPreview && stage === 'opened' ? 'y mandatory' : undefined,
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <AnimatePresence>
          {/* =====================================================================
              STAGE 1 & 2: SEAMLESS 3D CINEMA OVERLAY (ZERO BLACK FLASH) OR LIFAFA/GATES
          ===================================================================== */}
          {(stage === 'closed' || stage === 'opening') && (
            <motion.div
              key="original-opening-stage"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeOut' } }}
              className={isCinemaVideo ? 'absolute inset-x-0 top-0 z-40' : 'relative z-40'}
            >
              {isCinemaVideo && cinemaConfig ? (
                <CinemaVideoReveal
                  videoSrc={cinemaConfig.videoSrc}
                  posterSrc={cinemaConfig.posterSrc}
                  heroImageSrc={heroImageSrc}
                  guestName={guest ? guest.guest_name : 'Honored Guest & Family'}
                  waxSealInitial={waxSealSymbol}
                  coupleNames={coupleNames}
                  eventDateFormatted={dotDate}
                  stage={stage}
                  isPreview={isPreview}
                  onStartPlay={handleCinemaStart}
                  onVideoComplete={handleCinemaComplete}
                />
              ) : isFrostedBlur ? (
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
        </AnimatePresence>

        {/* =====================================================================
            STAGE 3: OPENED INVITATION SUITE
            (Pre-mounted directly beneath cinema video so dissolve is 100% seamless — zero black screen!)
        ===================================================================== */}
        {(stage === 'opened' || isCinemaVideo) && (
          <motion.div
            key="opened-original-scroll"
            initial={isCinemaVideo ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className={`relative w-full ${
              stage !== 'opened'
                ? `${isPreview ? 'h-[640px]' : 'h-[100dvh] max-h-[860px] min-h-[640px]'} overflow-hidden pointer-events-none`
                : 'overflow-x-clip'
            }`}
          >
            {/* Ambient Shimmering Golden Bokeh Particles */}
            {stage === 'opened' && (
              <FloatingParticles count={isPreview ? 10 : 18} color="#E6B85C" />
            )}

            {/* -----------------------------------------------------------------
                HERO SECTION: UNIQUE THEME-SPECIFIC WATERCOLOR / PALACE SCENE (full viewport height matches video)
            ----------------------------------------------------------------- */}
            <div className="relative w-full h-[100dvh] snap-start snap-always shrink-0 overflow-hidden">
              <img
                src={heroImageSrc}
                alt="Wedding Card Hero Scene"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
                {invitation.theme_id === 'midnight-minimalist' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(28,16,30,0.58) 0%, rgba(28,16,30,0.38) 28%, rgba(28,16,30,0.06) 52%, rgba(28,16,30,0.12) 84%, rgba(244,226,193,0.94) 100%)',
                    }}
                  />
                )}
                {invitation.theme_id === 'pearl-veil' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(16,10,6,0.12) 0%, rgba(16,10,6,0.06) 44%, rgba(16,10,6,0.65) 66%, rgba(16,10,6,0.88) 88%, #1A110B 100%)',
                    }}
                  />
                )}
                {(invitation.theme_id === 'tuscan-sunset' ||
                  invitation.theme_id === 'royal-emerald') && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(16,10,6,0.12) 0%, rgba(16,10,6,0.06) 44%, rgba(16,10,6,0.65) 66%, rgba(16,10,6,0.88) 88%, rgba(244,226,193,0.92) 100%)',
                    }}
                  />
                )}
                {invitation.theme_id === 'blush-floral' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 68% 36% at 50% 42%, rgba(255,250,238,0.82) 0%, rgba(255,248,232,0.45) 55%, rgba(255,248,232,0) 100%), linear-gradient(180deg, rgba(0,0,0,0) 76%, rgba(244,226,193,0.9) 100%)',
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

                {/* Couple Names & Wedding Date Overlay — Sequential Ink & Word Reveal on Open */}
                {stage === 'opened' && (
                  <div
                    className={`relative z-10 px-6 text-center flex flex-col items-center ${
                      invitation.theme_id === 'midnight-minimalist'
                        ? 'pt-[80px]'
                        : invitation.theme_id === 'pearl-veil' ||
                          invitation.theme_id === 'tuscan-sunset' ||
                          invitation.theme_id === 'royal-emerald'
                        ? 'pt-[52vh]'
                        : invitation.theme_id === 'blush-floral'
                        ? 'pt-[26vh]'
                        : 'pt-[48vh]'
                    }`}
                  >
                  <ScrollInkHeading
                    as="h1"
                    immediate
                    delay={0.15}
                    duration={0.85}
                    text={coupleNames.partner1 || 'ZOYA'}
                    className={`font-serif text-[31px] tracking-[0.1em] uppercase font-normal leading-tight ${
                      invitation.theme_id === 'midnight-minimalist' ||
                      invitation.theme_id === 'pearl-veil' ||
                      invitation.theme_id === 'tuscan-sunset' ||
                      invitation.theme_id === 'royal-emerald'
                        ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.92)]'
                        : invitation.theme_id === 'blush-floral'
                        ? 'text-[#2E1A14] drop-shadow-[0_1px_10px_rgba(255,250,238,0.95)]'
                        : 'text-[#2f2a24]'
                    }`}
                  />

                  <ScrollInkHeading
                    as="span"
                    immediate
                    delay={0.45}
                    duration={0.65}
                    text="and"
                    className={`font-great-vibes text-[24px] -my-1 block ${
                      invitation.theme_id === 'midnight-minimalist' ||
                      invitation.theme_id === 'pearl-veil' ||
                      invitation.theme_id === 'tuscan-sunset' ||
                      invitation.theme_id === 'royal-emerald'
                        ? 'text-[#F0CF7E] drop-shadow-[0_2px_8px_rgba(0,0,0,0.92)]'
                        : invitation.theme_id === 'blush-floral'
                        ? 'text-[#8C5B32] drop-shadow-[0_1px_8px_rgba(255,250,238,0.95)]'
                        : 'text-[#7a5c3e]'
                    }`}
                  />

                  <ScrollInkHeading
                    as="h1"
                    immediate
                    delay={0.62}
                    duration={0.85}
                    text={coupleNames.partner2 || 'AYAAN'}
                    className={`font-serif text-[31px] tracking-[0.1em] uppercase font-normal leading-tight ${
                      invitation.theme_id === 'midnight-minimalist' ||
                      invitation.theme_id === 'pearl-veil' ||
                      invitation.theme_id === 'tuscan-sunset' ||
                      invitation.theme_id === 'royal-emerald'
                        ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.92)]'
                        : invitation.theme_id === 'blush-floral'
                        ? 'text-[#2E1A14] drop-shadow-[0_1px_10px_rgba(255,250,238,0.95)]'
                        : 'text-[#2f2a24]'
                    }`}
                  />

                  {cfg.subtitle && (
                    <ScrollWordReveal
                      as="p"
                      immediate
                      delay={0.95}
                      stagger={0.055}
                      text={cfg.subtitle}
                      className={`font-serif text-[10px] tracking-[0.16em] uppercase mt-1.5 max-w-[250px] ${
                        invitation.theme_id === 'midnight-minimalist' ||
                        invitation.theme_id === 'pearl-veil' ||
                        invitation.theme_id === 'tuscan-sunset' ||
                        invitation.theme_id === 'royal-emerald'
                          ? 'text-[#F5E8C8] drop-shadow-[0_1px_6px_rgba(0,0,0,0.92)]'
                          : invitation.theme_id === 'blush-floral'
                          ? 'text-[#4A2E20] font-semibold drop-shadow-[0_1px_8px_rgba(255,250,238,0.95)]'
                          : 'text-[#5a5044]'
                      }`}
                    />
                  )}

                  {/* Diamond Ornamental Line */}
                  <ScrollOrnamentDivider
                    immediate
                    diamond
                    delay={1.15}
                    className="flex items-center justify-center gap-2.5 mt-3 mb-1.5 opacity-85"
                    lineColorClass={
                      invitation.theme_id === 'midnight-minimalist' ||
                      invitation.theme_id === 'pearl-veil' ||
                      invitation.theme_id === 'tuscan-sunset' ||
                      invitation.theme_id === 'royal-emerald'
                        ? 'bg-[#E5C17B]'
                        : invitation.theme_id === 'blush-floral'
                        ? 'bg-[#8C5B32]'
                        : 'bg-[#6e5d4b]'
                    }
                    dotColorClass={
                      invitation.theme_id === 'midnight-minimalist' ||
                      invitation.theme_id === 'pearl-veil' ||
                      invitation.theme_id === 'tuscan-sunset' ||
                      invitation.theme_id === 'royal-emerald'
                        ? 'bg-[#E5C17B]'
                        : invitation.theme_id === 'blush-floral'
                        ? 'bg-[#8C5B32]'
                        : 'bg-[#8c6d46]'
                    }
                  />

                  <div className="mt-1">
                    <ScrollInkHeading
                      as="div"
                      immediate
                      delay={0.1}
                      duration={0.8}
                      text={dotDate}
                      className={`font-serif text-[18px] tracking-[0.14em] font-semibold ${
                        invitation.theme_id === 'midnight-minimalist' ||
                        invitation.theme_id === 'pearl-veil' ||
                        invitation.theme_id === 'tuscan-sunset' ||
                        invitation.theme_id === 'royal-emerald'
                          ? 'text-[#FFF6D6] drop-shadow-[0_2px_8px_rgba(0,0,0,0.92)]'
                          : invitation.theme_id === 'blush-floral'
                          ? 'text-[#2E1A14] drop-shadow-[0_1px_8px_rgba(255,250,238,0.95)]'
                          : 'text-[#2f2a24]'
                      }`}
                    />
                  </div>
                  </div>
                )}

                {/* Gentle Bottom Scroll Cue on Hero */}
                {stage === 'opened' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.35, duration: 0.7 }}
                    onClick={() => scrollToNextSection('card-section-countdown')}
                    className="absolute bottom-5 inset-x-0 z-20 flex flex-col items-center cursor-pointer pointer-events-auto"
                  >
                    <span
                      className={`text-[9px] font-sans uppercase tracking-[0.24em] font-semibold px-3 py-1 rounded-full backdrop-blur-[2px] transition-transform hover:scale-105 ${
                        invitation.theme_id === 'midnight-minimalist' ||
                        invitation.theme_id === 'pearl-veil' ||
                        invitation.theme_id === 'tuscan-sunset' ||
                        invitation.theme_id === 'royal-emerald'
                          ? 'bg-black/55 text-[#F8E7B2] border border-[#E5C17B]/40'
                          : 'bg-[#FAF6EE]/85 text-[#5a4a38] border border-[#C5A059]/40'
                      }`}
                    >
                      Scroll to Read Invitation ↓
                    </span>
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      className={`mt-1 ${
                        invitation.theme_id === 'midnight-minimalist' ||
                        invitation.theme_id === 'pearl-veil' ||
                        invitation.theme_id === 'tuscan-sunset' ||
                        invitation.theme_id === 'royal-emerald'
                          ? 'text-[#F8E7B2]'
                          : 'text-[#6e5d4b]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* -----------------------------------------------------------------
                  CONTINUOUS SCROLL BODY (Mounted once opened for crisp performance)
              ----------------------------------------------------------------- */}
              {stage === 'opened' && (
              <div
                className="relative w-full"
                style={
                  isDarkPalace
                    ? { backgroundColor: '#1A110B' }
                    : {
                        backgroundImage: "url('/assets/invitecraft/parchment-floral-frame.jpg')",
                        backgroundSize: '100% auto',
                        backgroundRepeat: 'repeat-y',
                        backgroundPosition: 'top center',
                      }
                }
              >
                {/* Seamless sticky full-viewport candlelit palace backdrop (zero tiling seams) */}
                {isDarkPalace && (
                  <div
                    aria-hidden="true"
                    className={`sticky top-0 left-0 w-full pointer-events-none z-0 overflow-hidden ${
                      isPreview ? 'h-[640px] -mb-[640px]' : 'h-[100dvh] -mb-[100dvh]'
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url('/assets/pearl-veil/bg-corridor-scroll.jpg')",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(16,10,6,0.12) 0%, rgba(18,11,7,0.52) 18%, rgba(18,11,7,0.58) 50%, rgba(18,11,7,0.52) 82%, rgba(16,10,6,0.12) 100%)',
                      }}
                    />
                  </div>
                )}

                {/* Soft Gradient Transition Seam */}
                <div
                  className="w-full h-12 -mt-6 relative z-10 pointer-events-none"
                  style={{
                    background: isDarkPalace
                      ? 'linear-gradient(180deg, rgba(26,17,11,0) 0%, #1A110B 50%, rgba(26,17,11,0) 100%)'
                      : 'linear-gradient(180deg, rgba(244,226,193,0) 0%, #f4e2c1 50%, rgba(244,226,193,0) 100%)',
                  }}
                />

                {/* ===============================================================
                    BLOCK 1: LIVE 3-BOX SCRATCH COUNTDOWN & CELEBRATION
                =============================================================== */}
                <section
                  id="card-section-countdown"
                  className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-8 px-4 text-center"
                >
                  <ScrollInkHeading
                    text="Countdown"
                    className={`font-serif font-semibold tracking-[0.06em] uppercase text-[24px] leading-tight ${
                      isDarkPalace
                        ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                        : 'text-[#2f2a24]'
                    }`}
                  />
                  <ScrollWordReveal
                    text="Counting every moment until we celebrate together"
                    delay={0.12}
                    className={`font-sans text-[12.5px] tracking-wide mt-1 mb-2 ${
                      isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#5a4e42]'
                    }`}
                  />

                  {/* 3 Interactive Scratchable Countdown Boxes (Days, Hours, Minutes) */}
                  <ScratchCountdownBoxes
                    timeLeft={timeLeft}
                    invitationSlug={invitation.slug || invitation.id}
                    isDarkPalace={isDarkPalace}
                    onExploreNext={() => scrollToNextSection(hasVenue ? 'card-section-venue' : 'card-section-schedule')}
                  />
                </section>

                {/* ===============================================================
                    BLOCK 2: THE VENUE (Shown if Venue Name or Address is filled)
                =============================================================== */}
                {hasVenue && (
                  <section id="card-section-venue" className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-6 px-4 text-center">
                    <ScrollInkHeading
                      text="The Venue"
                      className={`font-great-vibes text-[46px] leading-tight mb-3 ${
                        isDarkPalace
                          ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                          : 'text-[#2f2a24]'
                      }`}
                    />

                    <ScrollRevealBlock
                      direction="scale"
                      delay={0.08}
                      className={`relative mx-auto w-full max-w-[345px] rounded-2xl overflow-hidden ${
                        isDarkPalace
                          ? 'border border-[#E5C17B]/45 shadow-[0_16px_40px_rgba(0,0,0,0.68)]'
                          : ''
                      }`}
                    >
                      <img
                        src={
                          isDarkPalace
                            ? '/assets/pearl-veil/venue-candlelit-palace.jpg'
                            : '/assets/invitecraft/venue-royal-palace.jpg'
                        }
                        alt={invitation.venue_details.venue_name}
                        className={`w-full h-auto mx-auto ${
                          isDarkPalace ? 'object-cover' : 'object-contain mix-blend-multiply'
                        }`}
                      />
                    </ScrollRevealBlock>

                    <ScrollRevealBlock
                      direction="scale"
                      delay={0.12}
                      className={`w-11 h-11 rounded-full border-[1.5px] flex items-center justify-center mx-auto my-3 shadow-xs ${
                        isDarkPalace
                          ? 'bg-[#22150D]/90 border-[#E5C17B]/75 text-[#E5C17B] shadow-md'
                          : 'bg-[#fbf9f5] border-[#5c724a] text-[#495e38]'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </ScrollRevealBlock>

                    {invitation.venue_details.venue_name && (
                      <ScrollInkHeading
                        as="h3"
                        text={invitation.venue_details.venue_name}
                        className={`font-great-vibes text-[31px] leading-snug px-2 ${
                          isDarkPalace
                            ? 'text-[#FFF4CF] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]'
                            : 'text-[#2f2a24]'
                        }`}
                      />
                    )}
                    {invitation.venue_details.hall_name && (
                      <ScrollWordReveal
                        text={invitation.venue_details.hall_name}
                        delay={0.08}
                        className={`font-serif italic text-[14px] font-semibold px-6 mt-0.5 ${
                          isDarkPalace ? 'text-[#E5C17B]' : 'text-[#6e5d4b]'
                        }`}
                      />
                    )}
                    {invitation.venue_details.address && (
                      <ScrollWordReveal
                        text={invitation.venue_details.address}
                        delay={0.14}
                        className={`font-serif italic text-[14.5px] px-8 leading-relaxed mt-1 ${
                          isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#4a4238]'
                        }`}
                      />
                    )}

                    {invitation.venue_details.maps_url && (
                      <ScrollRevealBlock direction="up" delay={0.16}>
                        <a
                          href={safeExternalUrl(invitation.venue_details.maps_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-5 mx-auto max-w-[285px] rounded-full px-4 py-2.5 shadow-md flex items-center justify-between gap-3 transition-transform hover:scale-[1.02] ${
                            isDarkPalace
                              ? 'bg-[#22150D]/90 hover:bg-[#2F1E13] text-[#FFF4CF] border border-[#E5C17B]/45 shadow-[0_12px_30px_rgba(0,0,0,0.55)]'
                              : 'bg-[#fbf9f5] hover:bg-white text-[#2f2a24] border border-[#e6dec8]'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              isDarkPalace
                                ? 'bg-[#E5C17B]/20 text-[#E5C17B]'
                                : 'bg-[#e5dec9] text-[#5c4934]'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                          </div>
                          <div className="text-center leading-tight flex-1">
                            <span
                              className={`font-serif italic text-[15px] block ${
                                isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                              }`}
                            >
                              Get directions
                            </span>
                            <span
                              className={`font-serif italic text-[12px] block ${
                                isDarkPalace ? 'text-[#D8C398]' : 'text-[#6e6254]'
                              }`}
                            >
                              Open in Google Maps
                            </span>
                          </div>
                          <ExternalLink
                            className={`w-4 h-4 shrink-0 mr-1 ${
                              isDarkPalace ? 'text-[#E5C17B]' : 'text-[#5c5246]'
                            }`}
                          />
                        </a>
                      </ScrollRevealBlock>
                    )}
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 3: SCHEDULE TIMELINE (Clear, High-Readability Luxury Cards)
                =============================================================== */}
                {showTimeline && (
                  <section id="card-section-timeline" className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-6 px-4 text-center">
                    <ScrollOrnamentDivider
                      lineColorClass={isDarkPalace ? 'bg-[#E5C17B]/70' : undefined}
                      dotColorClass={isDarkPalace ? 'bg-[#E5C17B]' : undefined}
                    />

                    <ScrollRevealBlock direction="scale">
                      <SectionHeaderBadge type="clock" darkPalace={isDarkPalace} />
                    </ScrollRevealBlock>

                    <ScrollInkHeading
                      text="Wedding Itinerary"
                      className={`font-serif font-semibold tracking-[0.05em] uppercase text-[23px] mb-1 ${
                        isDarkPalace
                          ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                          : 'text-[#2f2a24]'
                      }`}
                    />
                    <ScrollWordReveal
                      text="What we have planned for our special day"
                      delay={0.12}
                      className={`font-sans text-[12.5px] mb-7 px-2 ${
                        isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#5a4e42]'
                      }`}
                    />

                    <div className="relative max-w-[348px] mx-auto pl-6">
                      {/* Vertical Timeline Rail */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: 'top center' }}
                        className={`absolute left-[11px] top-6 bottom-6 w-[1.5px] ${
                          isDarkPalace ? 'bg-[#E5C17B]/55' : 'bg-[#a68f74]/55'
                        }`}
                      />

                      <div className="space-y-4">
                        {scheduleItems.map((item, idx) => (
                          <div key={idx} className="relative">
                            {/* Timeline Node Dot */}
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true, amount: 0.4 }}
                              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              className={`absolute -left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 z-10 ${
                                isDarkPalace
                                  ? 'bg-[#1A110B] border-[#E5C17B] shadow-[0_0_8px_rgba(229,193,123,0.65)]'
                                  : 'bg-[#fbf9f5] border-[#6E2E3A]'
                              }`}
                            />

                            {/* Clean Readable Event Card */}
                            <ScrollRevealBlock
                              direction="up"
                              delay={idx * 0.08}
                              className={`rounded-2xl p-3.5 flex items-center gap-3 text-left transition-colors ${
                                isDarkPalace
                                  ? 'bg-[#1D120B]/90 backdrop-blur-sm border border-[#E5C17B]/40 shadow-[0_12px_30px_rgba(0,0,0,0.55)]'
                                  : 'bg-[#fbf9f5]/95 backdrop-blur-sm border border-[#e3d7c3] shadow-sm'
                              }`}
                            >
                              <div
                                className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                                  isDarkPalace
                                    ? 'bg-[#2A1A10] border border-[#E5C17B]/25'
                                    : 'bg-[#f4ece0] border border-[#e6dec8]'
                                }`}
                              >
                                <TimelineIllustration
                                  index={idx}
                                  darkPalace={isDarkPalace}
                                  className="w-12 h-12"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full font-sans font-bold text-[11px] tracking-[0.08em] uppercase ${
                                    isDarkPalace
                                      ? 'bg-[#E5C17B]/20 text-[#F5D88F] border border-[#E5C17B]/35'
                                      : 'bg-[#6E2E3A]/10 text-[#6E2E3A] border border-[#6E2E3A]/20'
                                  }`}
                                >
                                  {item.time}
                                </span>

                                <ScrollInkHeading
                                  as="h3"
                                  text={item.title}
                                  delay={0.08}
                                  duration={0.65}
                                  className={`font-serif font-bold text-[15.5px] tracking-[0.03em] leading-snug mt-1.5 ${
                                    isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2B221B]'
                                  }`}
                                />

                                {item.location && (
                                  <ScrollWordReveal
                                    text={item.location}
                                    delay={0.14}
                                    stagger={0.03}
                                    className={`font-sans text-[11px] font-medium mt-0.5 ${
                                      isDarkPalace ? 'text-[#E5C17B]' : 'text-[#7a5c3e]'
                                    }`}
                                  />
                                )}

                                {item.description && (
                                  <ScrollWordReveal
                                    text={item.description}
                                    delay={0.18}
                                    stagger={0.03}
                                    className={`font-sans text-[12px] leading-relaxed mt-1 ${
                                      isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#4e4338]'
                                    }`}
                                  />
                                )}
                              </div>
                            </ScrollRevealBlock>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 4: DRESS CODE (Optional — Only if filled & enabled)
                =============================================================== */}
                {showDressCode && (
                  <section id="card-section-dresscode" className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-6 px-4 text-center">
                    <ScrollOrnamentDivider
                      className={`flex items-center justify-center gap-3 mb-4 ${
                        isDarkPalace ? 'opacity-80' : 'opacity-45'
                      }`}
                      lineColorClass={isDarkPalace ? 'bg-[#E5C17B]/70' : undefined}
                      dotColorClass={isDarkPalace ? 'bg-[#E5C17B]' : undefined}
                    />

                    <ScrollInkHeading
                      text={invitation.venue_details.dress_code || 'Modest & Royal Attire'}
                      className={`font-great-vibes text-[42px] mb-4 ${
                        isDarkPalace
                          ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                          : 'text-[#2f2a24]'
                      }`}
                    />

                    <ScrollRevealBlock
                      direction="up"
                      className={`rounded-3xl p-6 shadow-md ${
                        isDarkPalace
                          ? 'bg-[#1D120B]/90 backdrop-blur-sm border border-[#E5C17B]/40 shadow-[0_18px_45px_rgba(0,0,0,0.65)]'
                          : 'bg-[#fbf8f1]/85 backdrop-blur-xs border border-white/80'
                      }`}
                    >
                      <ScrollRevealBlock
                        direction="scale"
                        delay={0.08}
                        className={`w-60 mx-auto mb-3 rounded-2xl overflow-hidden ${
                          isDarkPalace
                            ? 'border border-[#E5C17B]/40 shadow-[0_12px_32px_rgba(0,0,0,0.6)]'
                            : ''
                        }`}
                      >
                        <img
                          src={
                            isDarkPalace
                              ? '/assets/pearl-veil/dresscode-palace-couple.jpg'
                              : '/assets/invitecraft/dresscode-couple-art.jpg?v=loose-abaya'
                          }
                          alt="Modest Loose Abaya Muslim Bride and Groom Attire Illustration"
                          className={`w-full h-auto mx-auto ${
                            isDarkPalace ? 'object-cover' : 'object-contain mix-blend-multiply'
                          }`}
                        />
                      </ScrollRevealBlock>

                      <ScrollInkHeading
                        as="h3"
                        text="Modest Traditional Elegance"
                        delay={0.1}
                        className={`font-great-vibes text-[28px] mb-3 ${
                          isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                        }`}
                      />

                      <div
                        className={`border-t pt-3 pb-4 grid grid-cols-2 gap-4 text-center ${
                          isDarkPalace ? 'border-[#E5C17B]/25' : 'border-[#d8cbb8]/60'
                        }`}
                      >
                        <div>
                          <ScrollWordReveal
                            as="span"
                            text="Ladies"
                            className={`font-sans font-semibold text-[10.5px] uppercase tracking-[0.16em] block mb-1 ${
                              isDarkPalace ? 'text-[#E5C17B]' : 'text-[#6e6254]'
                            }`}
                          />
                          <ScrollWordReveal
                            as="span"
                            text={cfg.ladies_attire || 'Modest Gown / Abaya'}
                            delay={0.12}
                            className={`font-serif font-medium text-[15px] leading-snug block ${
                              isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                            }`}
                          />
                        </div>
                        <div>
                          <ScrollWordReveal
                            as="span"
                            text="Gentlemen"
                            className={`font-sans font-semibold text-[10.5px] uppercase tracking-[0.16em] block mb-1 ${
                              isDarkPalace ? 'text-[#E5C17B]' : 'text-[#6e6254]'
                            }`}
                          />
                          <ScrollWordReveal
                            as="span"
                            text={cfg.gents_attire || 'Sherwani / Suit'}
                            delay={0.12}
                            className={`font-serif font-medium text-[15px] leading-snug block ${
                              isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                            }`}
                          />
                        </div>
                      </div>

                      <ScrollWordReveal
                        text="Suggested color palette:"
                        delay={0.1}
                        className={`font-serif italic text-[17px] mb-3 ${
                          isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#2f2a24]'
                        }`}
                      />

                      <div className="flex items-center justify-center gap-3">
                        {DRESS_SWATCHES.map((s, idx) => (
                          <ScrollRevealBlock
                            key={s.name}
                            direction="scale"
                            delay={idx * 0.08}
                            className="flex flex-col items-center gap-1"
                          >
                            <div
                              className="w-10 h-10 rounded-full shadow-xs border"
                              style={{ backgroundColor: s.hex, borderColor: s.border }}
                            />
                            <span
                              className={`font-serif italic text-[10.5px] ${
                                isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#4a4238]'
                              }`}
                            >
                              {s.name}
                            </span>
                          </ScrollRevealBlock>
                        ))}
                      </div>
                    </ScrollRevealBlock>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 5: BLESSINGS & GIFTS (Optional — Only if filled & enabled)
                =============================================================== */}
                {showGifts && (
                  <section id="card-section-gifts" className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-6 px-4 text-center">
                    <ScrollRevealBlock direction="scale">
                      <SectionHeaderBadge type="gift" darkPalace={isDarkPalace} />
                    </ScrollRevealBlock>
                    <ScrollInkHeading
                      text="Blessings & Gifts"
                      className={`font-great-vibes text-[44px] mb-4 ${
                        isDarkPalace
                          ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                          : 'text-[#2f2a24]'
                      }`}
                    />

                    <ScrollRevealBlock
                      direction="up"
                      className={`rounded-3xl p-6 shadow-md ${
                        isDarkPalace
                          ? 'bg-[#1D120B]/90 backdrop-blur-sm border border-[#E5C17B]/40 shadow-[0_18px_45px_rgba(0,0,0,0.65)]'
                          : 'bg-[#fbf9f5] border border-[#e6dec8]'
                      }`}
                    >
                      <ScrollWordReveal
                        text={
                          cfg.gift_note ||
                          'Your warm presence and duas are our greatest blessing. Should you wish to honor us with a gift, details are below.'
                        }
                        stagger={0.035}
                        className={`font-serif text-[15.5px] leading-relaxed ${
                          isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                        }`}
                      />

                      {(cfg.bank_account_holder || cfg.bank_account_number) && (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowDirectBank(!showDirectBank)}
                            className={`mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-serif text-sm shadow-xs transition-transform hover:scale-105 cursor-pointer ${
                              isDarkPalace
                                ? 'bg-gradient-to-r from-[#D5AE5C] via-[#E8C97E] to-[#C99B3B] text-[#1A110B] font-semibold'
                                : 'bg-[#d88c9a]/90 hover:bg-[#c77b89] text-[#2f2a24] italic'
                            }`}
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
                            <div
                              className={`mt-4 pt-4 border-t space-y-2.5 text-left font-serif italic text-xs ${
                                isDarkPalace ? 'border-[#E5C17B]/25' : 'border-[#e6dec8]'
                              }`}
                            >
                              {cfg.bank_account_holder && (
                                <div
                                  className={`p-3 rounded-xl flex items-center justify-between ${
                                    isDarkPalace
                                      ? 'bg-[#291A10] border border-[#E5C17B]/25'
                                      : 'bg-[#f5f0e6]'
                                  }`}
                                >
                                  <div>
                                    <span
                                      className={`text-[10px] uppercase not-italic block ${
                                        isDarkPalace ? 'text-[#E5C17B]' : 'text-[#7a6855]'
                                      }`}
                                    >
                                      Account Holder
                                    </span>
                                    <span
                                      className={`text-sm ${
                                        isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                                      }`}
                                    >
                                      {cfg.bank_account_holder}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(cfg.bank_account_holder!, 'holder')}
                                    className={`p-1.5 ${
                                      isDarkPalace
                                        ? 'text-[#E5C17B] hover:text-[#FFF4CF]'
                                        : 'text-[#5c5246] hover:text-[#2f2a24]'
                                    }`}
                                  >
                                    {copiedField === 'holder' ? (
                                      <Check className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              )}

                              {cfg.bank_account_number && (
                                <div
                                  className={`p-3 rounded-xl flex items-center justify-between ${
                                    isDarkPalace
                                      ? 'bg-[#291A10] border border-[#E5C17B]/25'
                                      : 'bg-[#f5f0e6]'
                                  }`}
                                >
                                  <div>
                                    <span
                                      className={`text-[10px] uppercase not-italic block ${
                                        isDarkPalace ? 'text-[#E5C17B]' : 'text-[#7a6855]'
                                      }`}
                                    >
                                      Account / UPI / IBAN
                                    </span>
                                    <span
                                      className={`text-sm font-mono not-italic ${
                                        isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                                      }`}
                                    >
                                      {cfg.bank_account_number}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(cfg.bank_account_number!, 'iban')}
                                    className={`p-1.5 ${
                                      isDarkPalace
                                        ? 'text-[#E5C17B] hover:text-[#FFF4CF]'
                                        : 'text-[#5c5246] hover:text-[#2f2a24]'
                                    }`}
                                  >
                                    {copiedField === 'iban' ? (
                                      <Check className="w-4 h-4 text-emerald-500" />
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
                    </ScrollRevealBlock>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 6: ROYAL HALAL MENU (Optional — Only if filled & enabled)
                =============================================================== */}
                {showMenu && (
                  <section id="card-section-menu" className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-6 px-4 text-center">
                    <ScrollRevealBlock
                      direction="up"
                      className={`relative mx-auto w-full flex flex-col items-center justify-start ${
                        isDarkPalace
                          ? 'rounded-[30px] bg-[#1B120C]/90 backdrop-blur-sm border-2 border-[#E5C17B]/50 shadow-[0_20px_50px_rgba(0,0,0,0.7)] py-12 px-8'
                          : 'min-h-[610px] pt-20 pb-28 px-12'
                      }`}
                    >
                      {isDarkPalace ? (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-3 rounded-[22px] border border-[#E5C17B]/25"
                        />
                      ) : (
                        <OriginalRibbonMenuFrame />
                      )}

                      <div className="relative z-20 space-y-5">
                        <div>
                          {isDarkPalace && (
                            <div className="flex items-center justify-center gap-2 mb-2 text-[#E5C17B]">
                              <span className="h-[1px] w-10 bg-[#E5C17B]/60" />
                              <span className="text-xs">✦</span>
                              <span className="h-[1px] w-10 bg-[#E5C17B]/60" />
                            </div>
                          )}
                          <ScrollInkHeading
                            text="Royal Halal Menu"
                            className={`font-great-vibes text-[44px] leading-none ${
                              isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                            }`}
                          />
                          <ScrollWordReveal
                            as="span"
                            delay={0.12}
                            text="✦ 100% Certified Halal Dawat ✦"
                            className={`font-serif italic text-[11.5px] tracking-widest uppercase block mt-1 ${
                              isDarkPalace ? 'text-[#E5C17B]' : 'text-[#7a5c3e]'
                            }`}
                          />
                        </div>

                        {cfg.menu_starter_title && (
                          <div className="space-y-1">
                            <ScrollInkHeading
                              as="h3"
                              text="— Starter —"
                              duration={0.75}
                              className={`font-great-vibes text-[27px] ${
                                isDarkPalace ? 'text-[#E5C17B]' : 'text-[#6B2232]'
                              }`}
                            />
                            <ScrollWordReveal
                              text={cfg.menu_starter_title}
                              delay={0.08}
                              className={`font-serif italic text-[14.5px] font-semibold ${
                                isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                              }`}
                            />
                            {cfg.menu_starter_desc && (
                              <ScrollWordReveal
                                text={cfg.menu_starter_desc}
                                delay={0.16}
                                stagger={0.035}
                                className={`font-serif italic text-[12.5px] leading-snug ${
                                  isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#4a4238]'
                                }`}
                              />
                            )}
                          </div>
                        )}

                        {cfg.menu_main_title && (
                          <div className="space-y-1">
                            <ScrollInkHeading
                              as="h3"
                              text="— Main Course —"
                              duration={0.75}
                              className={`font-great-vibes text-[27px] ${
                                isDarkPalace ? 'text-[#E5C17B]' : 'text-[#6B2232]'
                              }`}
                            />
                            <ScrollWordReveal
                              text={cfg.menu_main_title}
                              delay={0.08}
                              className={`font-serif italic text-[14.5px] font-semibold ${
                                isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                              }`}
                            />
                            {cfg.menu_main_desc && (
                              <ScrollWordReveal
                                text={cfg.menu_main_desc}
                                delay={0.16}
                                stagger={0.035}
                                className={`font-serif italic text-[12.5px] leading-snug ${
                                  isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#4a4238]'
                                }`}
                              />
                            )}
                          </div>
                        )}

                        {cfg.menu_dessert_title && (
                          <div className="space-y-1">
                            <ScrollInkHeading
                              as="h3"
                              text="— Dessert —"
                              duration={0.75}
                              className={`font-great-vibes text-[27px] ${
                                isDarkPalace ? 'text-[#E5C17B]' : 'text-[#6B2232]'
                              }`}
                            />
                            <ScrollWordReveal
                              text={cfg.menu_dessert_title}
                              delay={0.08}
                              className={`font-serif italic text-[14.5px] font-semibold ${
                                isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                              }`}
                            />
                            {cfg.menu_dessert_desc && (
                              <ScrollWordReveal
                                text={cfg.menu_dessert_desc}
                                delay={0.16}
                                stagger={0.035}
                                className={`font-serif italic text-[12.5px] leading-snug ${
                                  isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#4a4238]'
                                }`}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </ScrollRevealBlock>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 7: BLESSED UNION PORTRAIT & OUR STORY (Optional)
                =============================================================== */}
                {showStoryOrPortrait && (
                  <section id="card-section-story" className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-6 px-4 text-center">
                    <ScrollInkHeading
                      text="Blessed Union"
                      className={`font-great-vibes text-[42px] leading-tight ${
                        isDarkPalace
                          ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                          : 'text-[#2f2a24]'
                      }`}
                    />
                    <ScrollWordReveal
                      text="And We created you in pairs"
                      delay={0.12}
                      className={`font-serif italic text-[14px] mb-5 ${
                        isDarkPalace ? 'text-[#E5C17B]' : 'text-[#5c5246]'
                      }`}
                    />

                    <ScrollRevealBlock
                      direction="up"
                      className={`relative mx-auto max-w-[310px] rounded-[36px] border-2 p-5 shadow-md space-y-4 ${
                        isDarkPalace
                          ? 'bg-[#1D120B]/90 backdrop-blur-sm border-[#E5C17B]/55 shadow-[0_18px_48px_rgba(0,0,0,0.68)]'
                          : 'bg-[#fbf8f1]/90 border-[#C5A059]'
                      }`}
                    >
                      {cfg.show_couple_portrait !== false && (
                        <ScrollRevealBlock
                          direction="scale"
                          delay={0.08}
                          className={`w-60 mx-auto rounded-2xl overflow-hidden ${
                            isDarkPalace
                              ? 'border border-[#E5C17B]/40 shadow-[0_12px_32px_rgba(0,0,0,0.65)]'
                              : ''
                          }`}
                        >
                          <img
                            src={
                              isDarkPalace
                                ? '/assets/pearl-veil/portrait-palace-nikah.jpg'
                                : '/assets/invitecraft/couple-nikah-portrait.jpg?v=loose-abaya'
                            }
                            alt="Modest Loose Abaya Muslim Bride and Groom Under Floral Arch"
                            className={`w-full h-auto mx-auto ${
                              isDarkPalace ? 'object-cover' : 'object-contain mix-blend-multiply'
                            }`}
                          />
                        </ScrollRevealBlock>
                      )}

                      {cfg.show_story !== false && cfg.story?.trim() && (
                        <div
                          className={`pt-2 border-t ${
                            isDarkPalace ? 'border-[#E5C17B]/30' : 'border-[#e6dec8]'
                          }`}
                        >
                          <ScrollRevealBlock
                            direction="scale"
                            className={`w-8 h-8 mx-auto mb-2 rounded-full border flex items-center justify-center ${
                              isDarkPalace
                                ? 'bg-[#E5C17B]/15 border-[#E5C17B]/65'
                                : 'bg-[#C5A059]/15 border-[#C5A059]'
                            }`}
                          >
                            <Sparkles
                              className={`w-3.5 h-3.5 ${
                                isDarkPalace ? 'text-[#E5C17B]' : 'text-[#9C762B]'
                              }`}
                            />
                          </ScrollRevealBlock>
                          <ScrollWordReveal
                            text={`“${cfg.story}”`}
                            delay={0.1}
                            stagger={0.035}
                            className={`font-serif italic text-[14px] leading-relaxed ${
                              isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                            }`}
                          />
                        </div>
                      )}
                    </ScrollRevealBlock>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 8: ACCOMMODATION (Optional — Only if filled & enabled)
                =============================================================== */}
                {showAccommodation && (
                  <section id="card-section-accommodation" className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-6 px-4 text-center">
                    <ScrollOrnamentDivider
                      className={`flex items-center justify-center gap-3 mb-4 ${
                        isDarkPalace ? 'opacity-80' : 'opacity-45'
                      }`}
                      lineColorClass={isDarkPalace ? 'bg-[#E5C17B]/70' : undefined}
                      dotColorClass={isDarkPalace ? 'bg-[#E5C17B]' : undefined}
                    />

                    <ScrollInkHeading
                      text="Accommodation"
                      className={`font-great-vibes text-[44px] leading-tight ${
                        isDarkPalace
                          ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                          : 'text-[#2f2a24]'
                      }`}
                    />
                    <ScrollWordReveal
                      text="Curated stays for our traveling family & guests"
                      delay={0.12}
                      className={`font-serif italic text-[15px] mb-6 ${
                        isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#4a4238]'
                      }`}
                    />

                    <ScrollRevealBlock
                      direction="up"
                      className={`rounded-3xl p-4 shadow-md text-left ${
                        isDarkPalace
                          ? 'bg-[#1D120B]/90 backdrop-blur-sm border border-[#E5C17B]/40 shadow-[0_18px_45px_rgba(0,0,0,0.65)]'
                          : 'bg-[#fbf8f1]/85 border border-[#e6dec8]'
                      }`}
                    >
                      <ScrollRevealBlock
                        direction="scale"
                        delay={0.08}
                        className={`rounded-2xl overflow-hidden mb-3 ${
                          isDarkPalace ? 'border border-[#E5C17B]/35' : ''
                        }`}
                      >
                        <img
                          src={
                            isDarkPalace
                              ? '/assets/pearl-veil/venue-candlelit-palace.jpg'
                              : '/assets/invitecraft/accommodation-palace-hotel.jpg'
                          }
                          alt={cfg.accommodation_name || 'Partner Hotel'}
                          className={`w-full h-auto ${
                            isDarkPalace ? 'object-cover' : 'object-contain mix-blend-multiply'
                          }`}
                        />
                      </ScrollRevealBlock>
                      <div className="px-2 space-y-1.5">
                        {cfg.accommodation_name && (
                          <ScrollWordReveal
                            as="h3"
                            text={cfg.accommodation_name}
                            className={`font-serif font-bold text-[20px] ${
                              isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                            }`}
                          />
                        )}
                        {cfg.accommodation_note && (
                          <ScrollWordReveal
                            text={cfg.accommodation_note}
                            delay={0.1}
                            stagger={0.035}
                            className={`font-serif italic text-[14px] leading-snug ${
                              isDarkPalace ? 'text-[#E8D7B9]' : 'text-[#4a4238]'
                            }`}
                          />
                        )}
                        {cfg.accommodation_url && (
                          <div className="flex items-center justify-between pt-2">
                            <span
                              className={`font-serif italic text-[14px] font-semibold ${
                                isDarkPalace ? 'text-[#E5C17B]' : 'text-[#7a5c3e]'
                              }`}
                            >
                              Courtesy Guest Block
                            </span>
                            <a
                              href={cfg.accommodation_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 font-serif italic text-[13.5px] hover:underline ${
                                isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                              }`}
                            >
                              <span>View details</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </ScrollRevealBlock>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 9: FAQ ACCORDION (Optional — Only if filled & enabled)
                =============================================================== */}
                {showFaq && (
                  <section id="card-section-faq" className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-6 px-4 text-center">
                    <ScrollRevealBlock direction="scale">
                      <SectionHeaderBadge type="faq" darkPalace={isDarkPalace} />
                    </ScrollRevealBlock>
                    <ScrollInkHeading
                      text="Questions & Answers"
                      className={`font-great-vibes text-[42px] mb-6 ${
                        isDarkPalace
                          ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                          : 'text-[#2f2a24]'
                      }`}
                    />

                    <div className="space-y-3 text-left">
                      {faqItems.map((faq, idx) => {
                        const isOpen = openFaqIdx === idx;
                        return (
                          <ScrollRevealBlock
                            key={idx}
                            direction="up"
                            delay={idx * 0.08}
                            className={`rounded-xl shadow-xs overflow-hidden ${
                              isDarkPalace
                                ? 'bg-[#1D120B]/90 backdrop-blur-sm border border-[#E5C17B]/35'
                                : 'bg-[#fbf9f5] border border-[#e6dec8]'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                              className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 cursor-pointer"
                            >
                              <span
                                className={`font-serif text-[14.5px] ${
                                  isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                                }`}
                              >
                                {faq.q}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 shrink-0 transition-transform ${
                                  isDarkPalace ? 'text-[#E5C17B]' : 'text-[#5c5246]'
                                } ${isOpen ? 'rotate-180' : ''}`}
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
                                  <div
                                    className={`px-4 pb-4 pt-1 font-serif italic text-[13.5px] border-t ${
                                      isDarkPalace
                                        ? 'text-[#E8D7B9] border-[#E5C17B]/20'
                                        : 'text-[#5c5246] border-[#f0e8d8]'
                                    }`}
                                  >
                                    {faq.a}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </ScrollRevealBlock>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* ===============================================================
                    BLOCK 10: RSVP SECTION & FOOTER (Shown if show_rsvp !== false)
                =============================================================== */}
                {showRsvp ? (
                  <section
                    id="rsvp"
                    className="relative z-10 min-h-[100dvh] snap-start snap-always flex flex-col justify-between py-8 px-4 text-center"
                  >
                    <RsvpSection guest={guest} invitationId={invitation.id} darkPalace={isDarkPalace} />

                    <div className="pb-8 pt-4 text-center space-y-3 relative z-10">
                      <button
                        type="button"
                        onClick={() => {
                          const phoneContainer = document.querySelector('[data-invitation-phone-frame="true"]');
                          if (phoneContainer) {
                            phoneContainer.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className={`mx-auto flex flex-col items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer transition-opacity ${
                          isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                        }`}
                      >
                        <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold">
                          Back to Top ↑
                        </span>
                      </button>

                      <div className="pt-2 space-y-1.5">
                        <div className="flex items-center justify-center gap-2 opacity-75">
                          <span className={`h-[1px] w-8 ${isDarkPalace ? 'bg-[#E5C17B]/60' : 'bg-[#8c7a65]/50'}`} />
                          <span
                            className={`font-serif text-[11px] font-semibold tracking-[0.2em] uppercase ${
                              isDarkPalace ? 'text-[#E5C17B]' : 'text-[#6e5d4b]'
                            }`}
                          >
                            E&amp;V
                          </span>
                          <span className={`h-[1px] w-8 ${isDarkPalace ? 'bg-[#E5C17B]/60' : 'bg-[#8c7a65]/50'}`} />
                        </div>
                        <ScrollWordReveal
                          text="Crafted with Love • Eternal Vowz Bespoke Wedding Suite"
                          delay={0.1}
                          className={`font-sans text-[11px] tracking-wide ${
                            isDarkPalace ? 'text-[#D8C398]' : 'text-[#5c5246]'
                          }`}
                        />
                      </div>
                    </div>
                  </section>
                ) : (
                  <div className="pb-14 pt-8 text-center space-y-4 relative z-10">
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-center justify-center gap-2 opacity-75">
                        <span className={`h-[1px] w-8 ${isDarkPalace ? 'bg-[#E5C17B]/60' : 'bg-[#8c7a65]/50'}`} />
                        <span
                          className={`font-serif text-[11px] font-semibold tracking-[0.2em] uppercase ${
                            isDarkPalace ? 'text-[#E5C17B]' : 'text-[#6e5d4b]'
                          }`}
                        >
                          E&amp;V
                        </span>
                        <span className={`h-[1px] w-8 ${isDarkPalace ? 'bg-[#E5C17B]/60' : 'bg-[#8c7a65]/50'}`} />
                      </div>
                      <ScrollWordReveal
                        text="Crafted with Love • Eternal Vowz Bespoke Wedding Suite"
                        delay={0.1}
                        className={`font-sans text-[11px] tracking-wide ${
                          isDarkPalace ? 'text-[#D8C398]' : 'text-[#5c5246]'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
              )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
