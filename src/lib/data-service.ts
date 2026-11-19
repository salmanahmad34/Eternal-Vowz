import { Invitation, GuestWithRsvp, RSVP, RsvpStatus, HostUser } from '@/types/database';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY_INVITATIONS = 'eternal_vowz_invitations_v8';
const STORAGE_KEY_GUESTS = 'eternal_vowz_guests_v8';
const STORAGE_KEY_RSVPS = 'eternal_vowz_rsvps_v8';
const STORAGE_KEY_USER = 'eternal_vowz_host_user_v1';

// 1. Flagship Full-Showcase Demo Invitation
export const INITIAL_DEMO_INVITATION: Invitation = {
  id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  slug: 'sophia-alexander',
  theme_id: 'tuscan-sunset',
  title: 'Nikah & Walima of Sophia & Alexander',
  event_date: '2027-10-24T16:30:00Z',
  venue_details: {
    venue_name: 'The Grand Palace Gardens',
    hall_name: 'Imperial Ballroom & Courtyard Terrace',
    address: '450 Royal Promenade, Beverly Hills, CA 90210',
    maps_url: 'https://maps.google.com/?q=Beverly+Hills+Hotel+CA',
    city: 'Beverly Hills',
    dress_code: 'Modest & Royal Attire',
  },
  design_config: {
    couple_names: {
      partner1: 'SOPHIA',
      partner2: 'ALEXANDER',
    },
    subtitle: 'TOGETHER WITH THEIR FAMILIES INVITE YOU',
    story:
      'With the blessings of the Almighty and our beloved parents, we begin our journey together in faith, love, and companionship. Your prayers and presence will make our celebration complete.',
    music_track: 'royal-harp',
    wax_seal_initial: 'S&A',
    accent_color: '#C5A059',
    font_style: 'cormorant',
    show_timeline: true,
    timeline: [
      {
        id: '1',
        time: '16:30',
        title: 'WELCOME',
        location: 'The Rose Courtyard',
        description: 'Rosewater welcome & artisanal non-alcoholic mocktails',
        icon: 'GlassWater',
      },
      {
        id: '2',
        time: '18:00',
        title: 'NIKAH',
        location: 'The Sunset Terrace',
        description: 'Blessed Nikah ceremony & prayers for the couple',
        icon: 'Heart',
      },
      {
        id: '3',
        time: '19:30',
        title: 'WALIMA',
        location: 'Imperial Ballroom',
        description: 'Royal Halal Dawat banquet & family blessings',
        icon: 'Utensils',
      },
      {
        id: '4',
        time: '22:30',
        title: 'RUKHSATI',
        location: 'Starlight Courtyard',
        description: 'Sparkler send-off & heartfelt prayers',
        icon: 'Sparkles',
      },
    ],
    show_dress_code: true,
    ladies_attire: 'Modest Gown / Abaya',
    gents_attire: 'Sherwani / Suit',
    show_gifts: true,
    gift_note:
      'Your warm presence and duas are our greatest blessing. Should you wish to honor us with a gift, a contribution toward our future home is deeply appreciated.',
    bank_account_holder: 'Sophia & Alexander',
    bank_account_number: 'US89 3000 1204 9482 1093',
    show_menu: true,
    menu_starter_title: 'Zafrani Seekh Kebab & Paneer Tikka',
    menu_starter_desc:
      'Charcoal-grilled heritage halal kebabs served with mint chutney & saffron tartlets',
    menu_main_title: 'Shahi Dum Biryani & Mutton Rogan Josh',
    menu_main_desc:
      'Fragrant saffron basmati rice paired with slow-cooked tender halal cuts & naan',
    menu_dessert_title: 'Shahi Rose Phirni & Pistachio Baklava',
    menu_dessert_desc:
      'Chilled saffron milk pudding garnished with crushed pistachios & edible gold leaf',
    show_story: true,
    show_couple_portrait: true,
    show_accommodation: true,
    accommodation_name: 'Villa Aurelia & Spa',
    accommodation_note:
      'Special courtesy room block reserved for our wedding guests (Code: INVITECRAFT)',
    accommodation_url: 'https://www.booking.com',
    show_faq: true,
    faqs: [
      {
        q: 'Can I bring a plus-one or additional guests?',
        a: 'Due to venue seating capacity, we can only accommodate the guests named on your personalized invitation. Check your RSVP section below for your party allowance.',
      },
      {
        q: 'What time should we arrive for the Nikah ceremony?',
        a: 'We kindly request guests to arrive 30 minutes prior to the welcome reception so everyone is comfortably seated.',
      },
      {
        q: 'Is the catering 100% Halal certified?',
        a: 'Yes, all dishes and beverages served at our celebration are 100% Halal and non-alcoholic.',
      },
      {
        q: 'Is valet parking available at the estate?',
        a: 'Yes! Complimentary valet parking is provided at the main gate for all attendees.',
      },
    ],
    show_rsvp: true,
  },
  is_published: true,
  created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

// 2. Second Demo Card (Essential Details Only — Shows how optional sections auto-hide!)
export const SECOND_DEMO_INVITATION: Invitation = {
  id: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  slug: 'zoya-ayaan-nikah',
  theme_id: 'royal-emerald',
  title: 'Blessed Nikah of Zoya & Ayaan',
  event_date: '2027-12-12T17:00:00Z',
  venue_details: {
    venue_name: 'Taj Falaknuma Royal Lawn',
    hall_name: 'Darbar Hall & Rose Terrace',
    address: 'Engine Bowli, Falaknuma, Hyderabad 500053',
    maps_url: 'https://maps.google.com/?q=Taj+Falaknuma+Palace+Hyderabad',
    city: 'Hyderabad',
    dress_code: 'Modest Traditional Attire',
  },
  design_config: {
    couple_names: {
      partner1: 'ZOYA',
      partner2: 'AYAAN',
    },
    subtitle: 'BISMILLAHIR RAHMANIR RAHIM • NIKAH INVITATION',
    story:
      'Alhamdulillah, with the prayers of our parents, we invite your family to join us for our blessed Nikah ceremony and Walima feast.',
    music_track: 'royal-harp',
    wax_seal_initial: 'Z&A',
    accent_color: '#D4AF37',
    font_style: 'cormorant',
    show_timeline: true,
    timeline: [
      {
        id: '1',
        time: '17:00',
        title: 'NIKAH',
        location: 'Grand Darbar Lawn',
        description: 'Solemn Nikah Khutbah & collective Dua',
      },
      {
        id: '2',
        time: '19:30',
        title: 'DAWAT',
        location: 'Imperial Dining Hall',
        description: 'Royal Hyderabadi Halal Feast',
      },
    ],
    show_dress_code: true,
    ladies_attire: 'Modest Abaya / Gharara',
    gents_attire: 'Sherwani / Kurta Pajama',
    show_gifts: false,
    show_menu: false,
    show_story: true,
    show_couple_portrait: true,
    show_accommodation: false,
    show_faq: false,
    show_rsvp: true,
  },
  is_published: true,
  created_at: new Date(Date.now() - 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

// 3. Third Unique Demo Card (Celestial Starlight & Midnight Sapphire Design)
export const THIRD_DEMO_INVITATION: Invitation = {
  id: 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
  slug: 'fatima-hamza-starlight',
  theme_id: 'midnight-minimalist',
  title: 'Starlight Walima of Fatima & Hamza',
  event_date: '2027-11-28T19:00:00Z',
  venue_details: {
    venue_name: 'The Oberoi Starlight Pavilion',
    hall_name: 'Crystal Gazebo & Night Gardens',
    address: 'Dr Zakir Hussain Marg, New Delhi 110003',
    maps_url: 'https://maps.google.com/?q=The+Oberoi+New+Delhi',
    city: 'New Delhi',
    dress_code: 'Evening Modest Formal',
  },
  design_config: {
    couple_names: {
      partner1: 'FATIMA',
      partner2: 'HAMZA',
    },
    subtitle: 'UNDER THE STARS • WALIMA RECEPTION',
    story:
      'And We created you in pairs. Join our families under the starlit sky for an evening of prayers, love, and our Royal Walima dinner.',
    music_track: 'candlelight-strings',
    wax_seal_initial: 'F&H',
    accent_color: '#E2C275',
    font_style: 'cormorant',
    show_timeline: true,
    timeline: [
      {
        id: '1',
        time: '19:00',
        title: 'WELCOME',
        location: 'Starlight Gazebo',
        description: 'Rosewater welcome & family greetings',
      },
      {
        id: '2',
        time: '20:30',
        title: 'WALIMA DAWAT',
        location: 'Crystal Lawn',
        description: 'Candlelit 100% Halal Royal Banquet',
      },
    ],
    show_dress_code: true,
    ladies_attire: 'Modest Evening Abaya / Gown',
    gents_attire: 'Dark Sherwani / Suit',
    show_gifts: false,
    show_menu: true,
    menu_starter_title: 'Zafrani Seekh Kebab & Galouti Platter',
    menu_starter_desc: 'Melt-in-mouth Lucknowi halal kebabs with saffron sheermal',
    menu_main_title: 'Awadhi Dum Biryani & Nalli Nihari',
    menu_main_desc: 'Slow-cooked royal halal delicacies with fragrant basmati',
    menu_dessert_title: 'Shahi Tukda & Pistachio Kulfi',
    menu_dessert_desc: 'Warm saffron bread pudding topped with rabri & gold leaf',
    show_story: true,
    show_couple_portrait: true,
    show_accommodation: false,
    show_faq: false,
    show_rsvp: true,
  },
  is_published: true,
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

// 4. Fourth Unique Demo Card (3D Shahi Palace Double-Door Gates Reveal — Non-Lifafa Design)
export const FOURTH_DEMO_INVITATION: Invitation = {
  id: 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
  slug: 'amira-rayyan-palace',
  theme_id: 'blush-floral',
  title: 'Royal Shahi Darbar Nikah of Amira & Rayyan',
  event_date: '2027-12-18T17:30:00Z',
  venue_details: {
    venue_name: 'Rambagh Royal Palace Courtyard',
    hall_name: 'Shahi Jharokha Darbar Lawn',
    address: 'Bhawani Singh Rd, Rambagh, Jaipur 302005',
    maps_url: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur',
    city: 'Jaipur',
    dress_code: 'Royal Modest Heritage Attire',
  },
  design_config: {
    couple_names: {
      partner1: 'AMIRA',
      partner2: 'RAYYAN',
    },
    subtitle: 'BISMILLAH • ROYAL PALACE NIKAH & WALIMA',
    story:
      'As the Shahi Palace Gates open, our families warmly welcome you to celebrate the blessed union of Amira and Rayyan with your prayers and presence.',
    music_track: 'royal-harp',
    wax_seal_initial: 'A&R',
    opening_style: 'palace-gates',
    accent_color: '#D49B88',
    font_style: 'cormorant',
    show_timeline: true,
    timeline: [
      {
        id: '1',
        time: '17:30',
        title: 'SHAHI BARAAT & WELCOME',
        location: 'Palace Jharokha Gate',
        description: 'Royal rose-petal welcome at the Shahi Darwaza',
      },
      {
        id: '2',
        time: '18:30',
        title: 'NIKAH CEREMONY',
        location: 'Courtyard Pavilion',
        description: 'Blessed Nikah Khutbah & collective Dua',
      },
      {
        id: '3',
        time: '20:30',
        title: 'SHAHI HALAL BANQUET',
        location: 'Maharani Garden Lawn',
        description: '100% Halal Royal Rajasthani & Mughlai Feast',
      },
    ],
    show_dress_code: true,
    ladies_attire: 'Loose Modest Cape-Abaya / Royal Gharara',
    gents_attire: 'Ivory-Gold Sherwani / Bandhgala',
    show_gifts: false,
    show_menu: true,
    menu_starter_title: 'Shahi Murgh Malai Tikka & Subz Kebab',
    menu_starter_desc: 'Charcoal-roasted halal delicacies with saffron mint chutney',
    menu_main_title: 'Royal Mughlai Dum Biryani & Korma',
    menu_main_desc: 'Fragrant aged basmati rice with slow-cooked halal cuts',
    menu_dessert_title: 'Zafrani Rasmalai & Rose Rabri',
    menu_dessert_desc: 'Chilled saffron-infused cottage cheese medallions with pistachios',
    show_story: true,
    show_couple_portrait: true,
    show_accommodation: false,
    show_faq: false,
    show_rsvp: true,
  },
  is_published: true,
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

// 5. Fifth Unique Demo Card (Cinematic Frosted-Blur Veil Reveal — Pearl Botanical Conservatory)
export const FIFTH_DEMO_INVITATION: Invitation = {
  id: 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
  slug: 'layla-omar-veil',
  theme_id: 'pearl-veil',
  title: 'Pearl Conservatory Nikah of Layla & Omar',
  event_date: '2027-12-26T16:00:00Z',
  venue_details: {
    venue_name: 'The Ivory Glass Conservatory',
    hall_name: 'White Orchid Pavilion & Botanical Terrace',
    address: '88 Botanical Garden Promenade, Bengaluru 560001',
    maps_url: 'https://maps.google.com/?q=Lalbagh+Glass+House+Bengaluru',
    city: 'Bengaluru',
    dress_code: 'Ivory Pearl, Champagne & Soft Sage',
  },
  design_config: {
    couple_names: {
      partner1: 'LAYLA',
      partner2: 'OMAR',
    },
    subtitle: 'TOGETHER WITH THEIR FAMILIES • INVITE YOU TO CELEBRATE',
    story:
      'With gratitude in our hearts and the blessings of our parents, we joyfully invite you to witness the beginning of our forever beneath the ivory orchids.',
    music_track: 'cinematic-piano',
    wax_seal_initial: 'L&O',
    opening_style: 'frosted-blur',
    accent_color: '#C5A059',
    font_style: 'cormorant',
    show_timeline: true,
    timeline: [
      {
        id: '1',
        time: '16:00',
        title: 'GUEST ARRIVAL',
        location: 'Botanical Courtyard',
        description: 'Warm rose-tea reception & family greetings',
      },
      {
        id: '2',
        time: '17:00',
        title: 'NIKAH CEREMONY',
        location: 'White Orchid Pavilion',
        description: 'Solemn Nikah ceremony & collective blessings',
      },
      {
        id: '3',
        time: '19:30',
        title: 'ROYAL HALAL DINNER',
        location: 'Candlelit Glass Hall',
        description: 'Curated 100% Halal gourmet banquet under glass',
      },
    ],
    show_dress_code: true,
    ladies_attire: 'Flowing Modest Gown / Ivory Cape-Abaya',
    gents_attire: 'Champagne Sherwani / Classic Tailored Suit',
    show_gifts: false,
    show_menu: true,
    menu_starter_title: 'Herb-Crusted Lamb Croquettes & Truffle Soup',
    menu_starter_desc: 'Artisanal halal starters paired with fresh botanical mocktails',
    menu_main_title: 'Saffron Dum Biryani & Slow-Braised Herb Chicken',
    menu_main_desc: 'Signature royal halal main course with freshly baked naan',
    menu_dessert_title: 'White Chocolate Rose Tart & Pistachio Gelato',
    menu_dessert_desc: 'Handcrafted botanical patisserie dessert',
    show_story: true,
    show_couple_portrait: true,
    show_accommodation: false,
    show_faq: false,
    show_rsvp: true,
  },
  is_published: true,
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

// Initial demo guests
const INITIAL_DEMO_GUESTS: GuestWithRsvp[] = [
  {
    id: 'guest-1',
    invitation_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    guest_name: 'Rahul & Priya Sharma',
    phone: '+1 (555) 234-5678',
    email: 'rahul.sharma@example.com',
    unique_token: 'rahul-priya-vip',
    max_allowed_guests: 3,
    group_tag: 'VIP Family',
    link_opened_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    rsvp: {
      id: 'rsvp-1',
      guest_id: 'guest-1',
      status: 'attending',
      headcount: 3,
      meal_choice: 'Royal Halal Chicken & Biryani',
      message: 'MashaAllah! So thrilled for both of you! Counting down the days.',
      updated_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    },
  },
  {
    id: 'guest-2',
    invitation_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    guest_name: 'Tariq Bhai & Family',
    phone: '+1 (555) 876-5432',
    email: 'tariq.family@example.com',
    unique_token: 'tariq-family',
    max_allowed_guests: 4,
    group_tag: 'Close Relatives',
    link_opened_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    rsvp: {
      id: 'rsvp-2',
      guest_id: 'guest-2',
      status: 'attending',
      headcount: 4,
      meal_choice: 'Halal Mutton Rogan Josh',
      message: 'Allah jodi salamat rakhe! InshaAllah we will all attend.',
      updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
  },
  {
    id: 'guest-3',
    invitation_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    guest_name: 'Zainab & Bilal Ahmed',
    phone: '+1 (555) 345-6789',
    email: 'zainab.ahmed@example.com',
    unique_token: 'zainab-bilal',
    max_allowed_guests: 2,
    group_tag: 'Friends',
    link_opened_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    rsvp: null,
  },
  {
    id: 'guest-4',
    invitation_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    guest_name: 'Imran Uncle & Family',
    phone: '+1 (555) 987-6543',
    email: 'imran.uncle@example.com',
    unique_token: 'imran-uncle',
    max_allowed_guests: 2,
    group_tag: 'Family',
    link_opened_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    rsvp: {
      id: 'rsvp-4',
      guest_id: 'guest-4',
      status: 'declined',
      headcount: 0,
      message: 'Heartiest Mubarakbad! Travelling abroad that week, sending lots of duas.',
      updated_at: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    },
  },
  {
    id: 'guest-5',
    invitation_id: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    guest_name: 'Salman Khan & Family',
    phone: '+91 98765 43210',
    email: 'salman.family@example.com',
    unique_token: 'salman-vip',
    max_allowed_guests: 4,
    group_tag: 'VIP Family',
    link_opened_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    rsvp: {
      id: 'rsvp-5',
      guest_id: 'guest-5',
      status: 'attending',
      headcount: 4,
      meal_choice: 'Royal Halal Chicken & Biryani',
      message: 'Mubarak ho Zoya & Ayaan! Looking forward to the Nikah at Falaknuma!',
      updated_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    },
  },
];

// Helper to generate PostgreSQL-compatible UUID v4
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper to safely access browser localStorage
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`LocalStorage read error for ${key}:`, err);
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`LocalStorage write error for ${key}:`, err);
  }
}

export const DataService = {
  // =========================================================================
  // HOST AUTHENTICATION
  // =========================================================================
  getCurrentUser(): HostUser | null {
    return getLocalItem<HostUser | null>(STORAGE_KEY_USER, null);
  },

  loginHost(name: string, email: string, phone?: string): HostUser {
    const user: HostUser = {
      id: `host-${Date.now()}`,
      name: name.trim() || 'Host',
      email: email.trim() || 'host@eternalvowz.com',
      phone: phone?.trim() || '',
      created_at: new Date().toISOString(),
    };
    setLocalItem(STORAGE_KEY_USER, user);
    return user;
  },

  logoutHost(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY_USER);
    }
  },

  // =========================================================================
  // INVITATION CARDS CRUD
  // =========================================================================
  async getAllInvitations(): Promise<Invitation[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ev_cards')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Invitation[];
      } catch (e) {
        console.warn('Supabase getAllInvitations fallback:', e);
      }
    }
    return getLocalItem<Invitation[]>(STORAGE_KEY_INVITATIONS, [
      INITIAL_DEMO_INVITATION,
      SECOND_DEMO_INVITATION,
      THIRD_DEMO_INVITATION,
      FOURTH_DEMO_INVITATION,
      FIFTH_DEMO_INVITATION,
    ]);
  },

  async getInvitationBySlug(slug: string): Promise<Invitation | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ev_cards')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) return data as Invitation;
      } catch (e) {
        console.warn('Supabase getInvitationBySlug fallback:', e);
      }
    }
    const all = await this.getAllInvitations();
    return all.find((inv) => inv.slug === slug) || INITIAL_DEMO_INVITATION;
  },

  async getInvitationById(id: string): Promise<Invitation | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ev_cards')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data as Invitation;
      } catch (e) {
        console.warn('Supabase getInvitationById fallback:', e);
      }
    }
    const all = await this.getAllInvitations();
    return all.find((inv) => inv.id === id) || INITIAL_DEMO_INVITATION;
  },

  async createInvitation(newCard: Omit<Invitation, 'id' | 'created_at' | 'updated_at'>): Promise<Invitation> {
    const all = await this.getAllInvitations();
    const id = generateUUID();
    const nowMs = Date.now();
    const created: Invitation = {
      ...newCard,
      id,
      created_at: new Date(nowMs).toISOString(),
      expires_at: new Date(nowMs + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(nowMs).toISOString(),
    };

    const updatedList = [created, ...all];
    setLocalItem(STORAGE_KEY_INVITATIONS, updatedList);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ev_cards').insert({
          id: created.id,
          slug: created.slug,
          theme_id: created.theme_id,
          title: created.title,
          event_date: created.event_date,
          venue_details: created.venue_details,
          design_config: created.design_config,
          is_published: created.is_published,
          created_at: created.created_at,
          expires_at: created.expires_at,
          updated_at: created.updated_at,
        });
      } catch (e) {
        console.warn('Supabase createInvitation fallback:', e);
      }
    }

    // Automatically seed 1 sample VIP guest AFTER invitation exists in DB (satisfies FK)
    await this.addGuest(id, {
      guest_name: 'Special Guest & Family',
      phone: '',
      max_allowed_guests: 4,
      group_tag: 'VIP Family',
    });

    return created;
  },

  async updateInvitation(id: string, updates: Partial<Invitation>): Promise<Invitation> {
    const all = await this.getAllInvitations();
    const index = all.findIndex((inv) => inv.id === id);
    let updated: Invitation;

    if (index >= 0) {
      updated = { ...all[index], ...updates, updated_at: new Date().toISOString() };
      all[index] = updated;
    } else {
      updated = {
        ...INITIAL_DEMO_INVITATION,
        ...updates,
        id,
        updated_at: new Date().toISOString(),
      };
      all.push(updated);
    }

    setLocalItem(STORAGE_KEY_INVITATIONS, all);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ev_cards').upsert({
          id: updated.id,
          slug: updated.slug,
          theme_id: updated.theme_id,
          title: updated.title,
          event_date: updated.event_date,
          venue_details: updated.venue_details,
          design_config: updated.design_config,
          is_published: updated.is_published,
          expires_at: updated.expires_at,
          updated_at: updated.updated_at,
        });
      } catch (e) {
        console.warn('Supabase updateInvitation fallback:', e);
      }
    }

    return updated;
  },

  async deleteInvitation(id: string): Promise<void> {
    const all = await this.getAllInvitations();
    if (all.length <= 1) return; // Keep at least 1 card
    const filtered = all.filter((inv) => inv.id !== id);
    setLocalItem(STORAGE_KEY_INVITATIONS, filtered);

    const guests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, INITIAL_DEMO_GUESTS);
    setLocalItem(
      STORAGE_KEY_GUESTS,
      guests.filter((g) => g.invitation_id !== id)
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ev_cards').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteInvitation fallback:', e);
      }
    }
  },

  // =========================================================================
  // GUESTS & RSVP TRACKING
  // =========================================================================
  async getAllGuests(): Promise<GuestWithRsvp[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: guests, error } = await supabase
          .from('ev_card_guests')
          .select('*, ev_card_rsvps(*)')
          .order('created_at', { ascending: false });
        if (!error && guests) {
          return guests.map((g: Record<string, unknown> & { ev_card_rsvps?: Record<string, unknown>[] | Record<string, unknown> }) => {
            const rawRsvp = Array.isArray(g.ev_card_rsvps) ? g.ev_card_rsvps[0] : g.ev_card_rsvps;
            const clean = { ...g };
            delete clean.ev_card_rsvps;
            return {
              ...clean,
              rsvp: rawRsvp || null,
            } as unknown as GuestWithRsvp;
          });
        }
      } catch (e) {
        console.warn('Supabase getAllGuests fallback:', e);
      }
    }
    return getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, INITIAL_DEMO_GUESTS);
  },

  async getGuestsWithRsvp(invitationId: string): Promise<GuestWithRsvp[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: guests, error } = await supabase
          .from('ev_card_guests')
          .select('*, ev_card_rsvps(*)')
          .eq('invitation_id', invitationId);
        if (!error && guests) {
          return guests.map((g: Record<string, unknown> & { ev_card_rsvps?: Record<string, unknown>[] | Record<string, unknown> }) => {
            const rawRsvp = Array.isArray(g.ev_card_rsvps) ? g.ev_card_rsvps[0] : g.ev_card_rsvps;
            const clean = { ...g };
            delete clean.ev_card_rsvps;
            return {
              ...clean,
              rsvp: rawRsvp || null,
            } as unknown as GuestWithRsvp;
          });
        }
      } catch (e) {
        console.warn('Supabase getGuestsWithRsvp fallback:', e);
      }
    }

    const localGuests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, INITIAL_DEMO_GUESTS);
    return localGuests.filter((g) => g.invitation_id === invitationId);
  },

  async getGuestByToken(token: string, invitationId?: string): Promise<GuestWithRsvp | null> {
    if (!token) return null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ev_card_guests')
          .select('*, ev_card_rsvps(*)')
          .eq('unique_token', token)
          .maybeSingle();
        if (!error && data) {
          const g = data as Record<string, unknown> & { ev_card_rsvps?: Record<string, unknown>[] | Record<string, unknown> };
          const rawRsvp = Array.isArray(g.ev_card_rsvps) ? g.ev_card_rsvps[0] : g.ev_card_rsvps;
          const clean = { ...g };
          delete clean.ev_card_rsvps;
          return {
            ...clean,
            rsvp: rawRsvp || null,
          } as unknown as GuestWithRsvp;
        }
      } catch (e) {
        console.warn('Supabase getGuestByToken fallback:', e);
      }
    }

    const allGuests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, INITIAL_DEMO_GUESTS);
    return (
      allGuests.find(
        (g) => g.unique_token === token && (!invitationId || g.invitation_id === invitationId)
      ) ||
      allGuests.find((g) => g.unique_token === token) ||
      null
    );
  },

  async markLinkOpened(guestId: string): Promise<void> {
    const openedAt = new Date().toISOString();
    const guests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, INITIAL_DEMO_GUESTS);
    const guest = guests.find((g) => g.id === guestId);
    if (guest && !guest.link_opened_at) {
      guest.link_opened_at = openedAt;
      setLocalItem(STORAGE_KEY_GUESTS, guests);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('ev_card_guests')
          .update({ link_opened_at: openedAt })
          .eq('id', guestId)
          .is('link_opened_at', null);
      } catch (e) {
        console.warn('Supabase markLinkOpened fallback:', e);
      }
    }
  },

  async submitRsvp(
    guestId: string,
    rsvpData: { status: RsvpStatus; headcount: number; meal_choice?: string; message?: string }
  ): Promise<RSVP> {
    const guests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, INITIAL_DEMO_GUESTS);
    const guest = guests.find((g) => g.id === guestId);

    const updatedRsvp: RSVP = {
      id: guest?.rsvp?.id || generateUUID(),
      guest_id: guestId,
      status: rsvpData.status,
      headcount: rsvpData.headcount,
      meal_choice: rsvpData.meal_choice,
      message: rsvpData.message,
      updated_at: new Date().toISOString(),
    };

    if (guest) {
      guest.rsvp = updatedRsvp;
      setLocalItem(STORAGE_KEY_GUESTS, guests);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('ev_card_rsvps')
          .upsert(
            {
              guest_id: updatedRsvp.guest_id,
              status: updatedRsvp.status,
              headcount: updatedRsvp.headcount,
              meal_choice: updatedRsvp.meal_choice || null,
              message: updatedRsvp.message || null,
              updated_at: updatedRsvp.updated_at,
            },
            { onConflict: 'guest_id' }
          );
      } catch (e) {
        console.warn('Supabase submitRsvp fallback:', e);
      }
    }

    return updatedRsvp;
  },

  async addGuest(
    invitationId: string,
    guestData: {
      guest_name: string;
      phone?: string;
      email?: string;
      max_allowed_guests: number;
      group_tag?: string;
    }
  ): Promise<GuestWithRsvp> {
    const guests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, INITIAL_DEMO_GUESTS);

    const tokenBase = guestData.guest_name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const uniqueToken = `${tokenBase || 'guest'}-${Math.random().toString(36).substring(2, 6)}`;

    const newGuest: GuestWithRsvp = {
      id: generateUUID(),
      invitation_id: invitationId,
      guest_name: guestData.guest_name,
      phone: guestData.phone || '',
      email: guestData.email || '',
      unique_token: uniqueToken,
      max_allowed_guests: guestData.max_allowed_guests || 2,
      group_tag: guestData.group_tag || 'Family',
      link_opened_at: null,
      created_at: new Date().toISOString(),
      rsvp: null,
    };

    guests.push(newGuest);
    setLocalItem(STORAGE_KEY_GUESTS, guests);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ev_card_guests').insert({
          id: newGuest.id,
          invitation_id: newGuest.invitation_id,
          guest_name: newGuest.guest_name,
          phone: newGuest.phone || null,
          email: newGuest.email || null,
          unique_token: newGuest.unique_token,
          max_allowed_guests: newGuest.max_allowed_guests,
          group_tag: newGuest.group_tag,
          link_opened_at: null,
          created_at: newGuest.created_at,
        });
      } catch (e) {
        console.warn('Supabase addGuest fallback:', e);
      }
    }

    return newGuest;
  },

  async deleteGuest(guestId: string): Promise<void> {
    const guests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, INITIAL_DEMO_GUESTS);
    const filtered = guests.filter((g) => g.id !== guestId);
    setLocalItem(STORAGE_KEY_GUESTS, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ev_card_guests').delete().eq('id', guestId);
      } catch (e) {
        console.warn('Supabase deleteGuest fallback:', e);
      }
    }
  },

  resetDemoData(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY_INVITATIONS);
      window.localStorage.removeItem(STORAGE_KEY_GUESTS);
      window.localStorage.removeItem(STORAGE_KEY_RSVPS);
    }
  },
};
