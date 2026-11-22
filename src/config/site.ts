/**
 * Centralized Site Configuration & Constants for Eternal Vowz
 * When domain or contact details change, update here to propagate everywhere.
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eternal-vowz.onrender.com';
export const SITE_URL = rawUrl.replace(/\/+$/, '');

export const SITE_CONFIG = {
  url: SITE_URL,
  name: 'Eternal Vowz',
  shortName: 'E&V',
  tagline: '3D Digital Wedding Invitations & Live RSVP Platform',
  description:
    'Create royal 3D Lifafa and 3D Shahi Palace Gate digital wedding cards at flat ₹99 per card with live RSVP tracking and personalized WhatsApp links.',
  contactEmail: 'mrsalman7307@gmail.com',
  founder: {
    name: 'Salman Ahmad',
    role: 'Founder & Software Developer',
    education: 'B.Tech Student',
    location: 'Azamgarh, Uttar Pradesh, India',
    email: 'mrsalman7307@gmail.com',
    id: `${SITE_URL}/about#salman`,
  },
  pricing: {
    amount: 99,
    currency: 'INR',
    display: '₹99',
    unit: 'per card',
  },
  cardValidityDays: 30,
  realComparisonExample: {
    cardsCount: 300,
    tier2RatePerCard: 23,
    tier2TotalPaperCost: 6900, // 300 * 23
    digitalCost: 99,
    savingsAmount: 6801, // 6900 - 99
    savingsPercentage: 98, // ~98.56%
    founderContext:
      'Ye number founder ke apne family wedding ke rate par based hai (tier 2 shehar, ₹23 per card). Bade shehron me rate aam taur par zyada hota hai. 300 cards sirf ek example hai.',
  },
} as const;

export const SITE_NAME = SITE_CONFIG.name;
export const CONTACT_EMAIL = SITE_CONFIG.contactEmail;
export const FOUNDER_NAME = SITE_CONFIG.founder.name;
