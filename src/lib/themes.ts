import { ThemeConfig, ThemeId } from "@/types/database";

export const ORDERED_THEME_IDS: ThemeId[] = [
  'pearl-veil',
  'blush-floral',
  'tuscan-sunset',
  'royal-emerald',
  'midnight-minimalist',
  'kashmir-lotus',
  'shahi-crimson',
  'jodhpur-sapphire',
];

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'pearl-veil': {
    id: 'pearl-veil',
    name: 'Pearl Botanical Veil',
    subtitle: 'Starts fully blurred under a frosted crystal veil — tap to melt the blur into an orchid glass conservatory',
    heroImg: '/assets/pearl-veil/hero-palace-corridor.jpg',
    badge: '✨ 3D Cinema Reveal',
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
  'blush-floral': {
    id: 'blush-floral',
    name: 'Shahi Palace Gates',
    subtitle: '3D Carved Royal Palace Double-Doors that swing open with a golden lock to reveal your card',
    heroImg: '/assets/shahi-gold/hero-mountain-pavilion.jpg',
    badge: '✨ 3D Gold Dust',
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
  'tuscan-sunset': {
    id: 'tuscan-sunset',
    name: 'Tuscan Sunset Rose',
    subtitle: 'Warm golden sunset terrace, candlelit long rose banquet table & merlot-gold embossed Lifafa',
    heroImg: '/assets/tuscan-haveli/hero-haveli-courtyard.jpg',
    badge: '✨ Most Popular',
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
  'royal-emerald': {
    id: 'royal-emerald',
    name: 'Royal Mughal Arch',
    subtitle: 'Carved ivory-gold Mughal archway, brass Fanoos lanterns, white jasmine & emerald-gold Lifafa',
    heroImg: '/assets/mughal-silk/hero-mughal-courtyard.jpg',
    badge: '✨ Royal Nikah',
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
  'midnight-minimalist': {
    id: 'midnight-minimalist',
    name: 'Celestial Starlight',
    subtitle: 'Starry sapphire night sky, golden crescent moon, constellations & crystal chandelier courtyard',
    heroImg: '/assets/celestial-box/hero-celestial-stage.jpg',
    badge: '✨ Trend 2027',
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
  'kashmir-lotus': {
    id: 'kashmir-lotus',
    name: 'Kashmir Chinar Lotus',
    subtitle: 'Misty lavender silk veil, Chinar gold leaf filigree, floating white lotus blossoms & serene Kashmiri romance',
    heroImg: '/assets/kashmir-lotus/hero-kashmir-lotus.gif',
    badge: '✨ Kashmiri Romance',
    previewColor: '#7C6E94',
    accentGold: '#C5A059',
    colors: {
      envelopeExterior: '#DDD6E8', // Misty lavender silver
      envelopeFlap: '#D1C7E0',     // Soft lilac flap
      envelopeInterior: '#C4B7D6', // Inner pocket
      envelopeLiningPattern: 'linear-gradient(135deg, #E6E0F0 0%, #DDD6E8 50%, #CBC0DC 100%)',
      waxSealBackground: '#7C6E94', // Misty plum wax seal
      waxSealColor: '#FDFCFE',
      cardBackground: '#FAF9FC',   // Alabaster paper
      cardBorder: '#BFA89E',
      cardHeaderColor: '#3B2E4A',
      cardTextColor: '#282033',
      accentGlow: 'rgba(124, 110, 148, 0.35)',
      badgeBg: '#F5F3FF',
      badgeText: '#6D28D9',
    },
    typography: {
      headingFont: 'font-serif',
      bodyFont: 'font-sans',
    },
    waxSealInitialDefault: 'M&F',
  },
  'shahi-crimson': {
    id: 'shahi-crimson',
    name: 'Shahi Crimson & Zari',
    subtitle: 'Heritage deep crimson velvet Lifafa, 24K gold zari borders, fresh red rose petals & royal brass royal crest',
    heroImg: '/assets/shahi-crimson/hero-shahi-crimson.jpg',
    badge: '✨ 24K Gold Zari',
    previewColor: '#780D18',
    accentGold: '#D4AF37',
    colors: {
      envelopeExterior: '#780D18', // Deep royal crimson velvet
      envelopeFlap: '#5C0911',     // Dark wine flap
      envelopeInterior: '#3D050B', // Inner velvet pocket
      envelopeLiningPattern: 'linear-gradient(135deg, #5C0911 0%, #780D18 50%, #3D050B 100%)',
      waxSealBackground: '#8A1C14', // Royal crimson & gold wax crest
      waxSealColor: '#FDE68A',
      cardBackground: '#FFFDF9',   // Silk ivory royal paper
      cardBorder: '#D4AF37',       // 24K Gold zari border
      cardHeaderColor: '#780D18',
      cardTextColor: '#2A1215',
      accentGlow: 'rgba(212, 175, 55, 0.45)',
      badgeBg: '#FEF2F2',
      badgeText: '#991B1B',
    },
    typography: {
      headingFont: 'font-serif',
      bodyFont: 'font-sans',
    },
    waxSealInitialDefault: 'K&R',
  },
  'jodhpur-sapphire': {
    id: 'jodhpur-sapphire',
    name: 'Jodhpur Sapphire Darbar',
    subtitle: 'Royal sapphire blue velvet, 24K antique gold Jharokha arch, golden marigold garlands & brass palace lanterns',
    heroImg: '/assets/jodhpur-sapphire/hero-jodhpur-sapphire.jpg',
    badge: '✨ Royal Sapphire',
    previewColor: '#0E2A5A',
    accentGold: '#E5C17B',
    colors: {
      envelopeExterior: '#0E2A5A', // Royal sapphire blue
      envelopeFlap: '#081B3B',     // Deep navy sapphire flap
      envelopeInterior: '#051229', // Inner pocket
      envelopeLiningPattern: 'linear-gradient(135deg, #081B3B 0%, #0E2A5A 50%, #051229 100%)',
      waxSealBackground: '#B45309', // Amber Gold Topaz wax seal
      waxSealColor: '#FEF3C7',
      cardBackground: '#FAF8F2',   // Warm ivory cotton paper
      cardBorder: '#E5C17B',
      cardHeaderColor: '#0E2A5A',
      cardTextColor: '#1E293B',
      accentGlow: 'rgba(229, 193, 123, 0.4)',
      badgeBg: '#EFF6FF',
      badgeText: '#1D4ED8',
    },
    typography: {
      headingFont: 'font-serif',
      bodyFont: 'font-sans',
    },
    waxSealInitialDefault: 'Z&A',
  },
};

export interface MusicTrackOption {
  id: string;
  name: string;
  mood: string;
  url: string;
}

// All built-in/preset music tracks removed — users may upload or link their own custom audio track only.
export const MUSIC_TRACKS: MusicTrackOption[] = [];

export const MEAL_OPTIONS = [
  'Vegetarian Gourmet (Truffle & Forest Mushroom)',
  'Non-Veg Royal Feast (Herb-Crusted Filet & Salmon)',
  'Vegan Delicacy (Roasted Root Vegetable Roulade)',
  'Jain Gourmet (Pure Satvik Multi-Course)',
  'Gluten-Free Artisan Selection',
  'Little Guests / Kids Menu',
];
