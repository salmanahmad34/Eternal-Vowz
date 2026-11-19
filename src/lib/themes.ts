import { ThemeConfig, ThemeId } from "@/types/database";

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'royal-emerald': {
    id: 'royal-emerald',
    name: 'Royal Mughal Arch & Fanoos',
    subtitle: 'Carved ivory-gold Mughal archway, brass Fanoos lanterns, white jasmine & emerald-gold Lifafa',
    previewColor: '#064E3B',
    accentGold: '#C5A059',
    colors: {
      envelopeExterior: '#064E3B', // Deep forest emerald
      envelopeFlap: '#053E2F',     // Rich darker emerald
      envelopeInterior: '#032B20', // Inner pocket
      envelopeLiningPattern: 'linear-gradient(135deg, #04382B 0%, #064E3B 50%, #032B20 100%)',
      waxSealBackground: '#8B1E1E', // Royal crimson / Antique gold wax seal option
      waxSealColor: '#C5A059',
      cardBackground: '#FAF8F5',   // Warm ivory luxury cotton paper
      cardBorder: '#C5A059',
      cardHeaderColor: '#064E3B',
      cardTextColor: '#1C1917',
      accentGlow: 'rgba(197, 160, 89, 0.35)',
      badgeBg: '#ECFDF5',
      badgeText: '#065F46',
    },
    typography: {
      headingFont: 'font-serif',
      bodyFont: 'font-sans',
    },
    waxSealInitialDefault: '♔',
  },
  'blush-floral': {
    id: 'blush-floral',
    name: 'Shahi Palace Gates & Rose Darbar',
    subtitle: '3D Carved Royal Palace Double-Doors that swing open with a golden lock to reveal your card',
    previewColor: '#5E2230',
    accentGold: '#D49B88',
    colors: {
      envelopeExterior: '#F8EAEC', // Soft Parisian blush
      envelopeFlap: '#F1D9DE',     // Dusty rose flap
      envelopeInterior: '#E8C7CD', // Inner petal pocket
      envelopeLiningPattern: 'linear-gradient(135deg, #FDE8EC 0%, #F8D3DA 50%, #F5C2CB 100%)',
      waxSealBackground: '#A24357', // Antique Rosewood wax seal
      waxSealColor: '#FCE7ED',
      cardBackground: '#FFFDFC',   // Pure silk ivory
      cardBorder: '#D49B88',
      cardHeaderColor: '#882A40',
      cardTextColor: '#2E1A20',
      accentGlow: 'rgba(212, 155, 136, 0.35)',
      badgeBg: '#FDF2F8',
      badgeText: '#9D174D',
    },
    typography: {
      headingFont: 'font-serif',
      bodyFont: 'font-sans',
    },
    waxSealInitialDefault: '❀',
  },
  'midnight-minimalist': {
    id: 'midnight-minimalist',
    name: 'Celestial Starlight & Crescent',
    subtitle: 'Starry sapphire night sky, golden crescent moon, constellations & crystal chandelier courtyard',
    previewColor: '#0F172A',
    accentGold: '#D4AF37',
    colors: {
      envelopeExterior: '#0B0F19', // Obsidian midnight velvet
      envelopeFlap: '#111827',     // Crisp dark charcoal flap
      envelopeInterior: '#080B12', // Pure deep pocket
      envelopeLiningPattern: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #0F172A 100%)',
      waxSealBackground: '#1E293B', // Matte midnight wax seal with gold crest
      waxSealColor: '#D4AF37',
      cardBackground: '#0F172A',   // Dark luxury card or Ivory reverse
      cardBorder: '#D4AF37',
      cardHeaderColor: '#FAF8F5',
      cardTextColor: '#E2E8F0',
      accentGlow: 'rgba(212, 175, 55, 0.4)',
      badgeBg: '#1E293B',
      badgeText: '#F8FAFC',
    },
    typography: {
      headingFont: 'font-display',
      bodyFont: 'font-sans',
    },
    waxSealInitialDefault: '✦',
  },
  'tuscan-sunset': {
    id: 'tuscan-sunset',
    name: 'Tuscan Sunset & Rose Banquet',
    subtitle: 'Warm golden sunset terrace, candlelit long rose banquet table & merlot-gold embossed Lifafa',
    previewColor: '#78350F',
    accentGold: '#D97706',
    colors: {
      envelopeExterior: '#66240C', // Merlot bloom & terracotta
      envelopeFlap: '#853216',
      envelopeInterior: '#451A03',
      envelopeLiningPattern: 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #451A03 100%)',
      waxSealBackground: '#8A1C14', // Merlot red wax seal
      waxSealColor: '#FEF3C7',
      cardBackground: '#F5F0E6',   // Exact WooowInvites #f5f0e6 warm parchment
      cardBorder: '#D97706',
      cardHeaderColor: '#2F2A24',
      cardTextColor: '#2F2A24',
      accentGlow: 'rgba(217, 119, 6, 0.35)',
      badgeBg: '#FEF3C7',
      badgeText: '#92400E',
    },
    typography: {
      headingFont: 'font-serif',
      bodyFont: 'font-sans',
    },
    waxSealInitialDefault: 'S&A',
  },
  'pearl-veil': {
    id: 'pearl-veil',
    name: 'Pearl Botanical & Frosted Veil',
    subtitle: 'Starts fully blurred under a frosted crystal veil — tap to melt the blur into an orchid glass conservatory',
    previewColor: '#7C8E79',
    accentGold: '#C5A059',
    colors: {
      envelopeExterior: '#ECE7DF',
      envelopeFlap: '#E1D9CC',
      envelopeInterior: '#D6CCB9',
      envelopeLiningPattern: 'linear-gradient(135deg, #FAF7F2 0%, #EFE9DF 50%, #E5DDD0 100%)',
      waxSealBackground: '#7C8E79',
      waxSealColor: '#FFFDF9',
      cardBackground: '#FDFBF7',
      cardBorder: '#C5A059',
      cardHeaderColor: '#2C221E',
      cardTextColor: '#2C221E',
      accentGlow: 'rgba(197, 160, 89, 0.35)',
      badgeBg: '#F4F7F3',
      badgeText: '#475945',
    },
    typography: {
      headingFont: 'font-serif',
      bodyFont: 'font-sans',
    },
    waxSealInitialDefault: 'L&O',
  },
};

export const MUSIC_TRACKS = [
  { id: 'royal-harp', name: 'Royal Harp & Strings (Romantic Waltz)', mood: 'Warm, Classical & Ethereal' },
  { id: 'acoustic-romance', name: 'Acoustic Sunset Romance (Gentle Guitar)', mood: 'Intimate, Heartfelt & Acoustic' },
  { id: 'cinematic-piano', name: 'Cinematic Piano Reverie (Ludovico Style)', mood: 'Dramatic, Poetic & Uplifting' },
  { id: 'candlelight-strings', name: 'Candlelight Chamber Serenade', mood: 'Aristocratic & Sophisticated' },
];

export const MEAL_OPTIONS = [
  'Vegetarian Gourmet (Truffle & Forest Mushroom)',
  'Non-Veg Royal Feast (Herb-Crusted Filet & Salmon)',
  'Vegan Delicacy (Roasted Root Vegetable Roulade)',
  'Jain Gourmet (Pure Satvik Multi-Course)',
  'Gluten-Free Artisan Selection',
  'Little Guests / Kids Menu',
];
