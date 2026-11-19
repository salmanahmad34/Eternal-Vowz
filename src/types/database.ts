export type ThemeId =
  | 'royal-emerald'
  | 'blush-floral'
  | 'midnight-minimalist'
  | 'tuscan-sunset'
  | 'pearl-veil';

export type RsvpStatus = 'attending' | 'declined' | 'pending';

export interface VenueDetails {
  venue_name: string;
  hall_name?: string;
  address: string;
  city?: string;
  maps_url: string;
  dress_code?: string;
}

export interface TimelineItem {
  id?: string;
  time: string;
  title: string;
  location: string;
  description: string;
  icon?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface DesignConfig {
  couple_names: {
    partner1: string;
    partner2: string;
  };
  subtitle?: string;
  story?: string;
  music_track?: string;
  wax_seal_initial?: string;
  opening_style?: 'lifafa' | 'palace-gates' | 'frosted-blur';
  accent_color?: string;
  font_style?: 'cormorant' | 'playfair' | 'classic';
  timeline: TimelineItem[];
  banner_image_url?: string;

  // Optional Section Visibility & Custom Content ("jitni detail user fill kare utna hi card me show ho")
  show_timeline?: boolean;

  show_dress_code?: boolean;
  ladies_attire?: string;
  gents_attire?: string;

  show_gifts?: boolean;
  gift_note?: string;
  bank_account_holder?: string;
  bank_account_number?: string;

  show_menu?: boolean;
  menu_starter_title?: string;
  menu_starter_desc?: string;
  menu_main_title?: string;
  menu_main_desc?: string;
  menu_dessert_title?: string;
  menu_dessert_desc?: string;

  show_story?: boolean;
  show_couple_portrait?: boolean;

  show_accommodation?: boolean;
  accommodation_name?: string;
  accommodation_note?: string;
  accommodation_url?: string;

  show_faq?: boolean;
  faqs?: FaqItem[];

  show_rsvp?: boolean;
}

export interface Invitation {
  id: string;
  user_id?: string;
  slug: string;
  theme_id: ThemeId;
  title: string;
  event_date: string; // ISO string
  venue_details: VenueDetails;
  design_config: DesignConfig;
  is_published: boolean;
  is_paid?: boolean;
  created_at?: string;
  expires_at?: string;
  updated_at?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface EvOrder {
  id: string;
  card_id: string | null;
  customer_email?: string | null;
  razorpay_order_id: string;
  razorpay_payment_id?: string | null;
  amount: number; // in paise (7900 = ₹79.00)
  status: OrderStatus;
  created_at?: string;
}

export interface Guest {
  id: string;
  invitation_id: string;
  guest_name: string;
  phone?: string;
  email?: string;
  unique_token: string;
  max_allowed_guests: number;
  group_tag?: string;
  link_opened_at?: string | null;
  created_at?: string;
}

export interface RSVP {
  id: string;
  guest_id: string;
  status: RsvpStatus;
  headcount: number;
  meal_choice?: string;
  message?: string;
  updated_at?: string;
}

export interface GuestWithRsvp extends Guest {
  rsvp?: RSVP | null;
}

export interface HostUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  previewColor: string;
  accentGold: string;
  colors: {
    envelopeExterior: string;
    envelopeFlap: string;
    envelopeInterior: string;
    envelopeLiningPattern: string;
    waxSealBackground: string;
    waxSealColor: string;
    cardBackground: string;
    cardBorder: string;
    cardHeaderColor: string;
    cardTextColor: string;
    accentGlow: string;
    badgeBg: string;
    badgeText: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  waxSealInitialDefault: string;
}
