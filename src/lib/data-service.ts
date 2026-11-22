import { Invitation, GuestWithRsvp, RSVP, RsvpStatus, HostUser } from '@/types/database';
import { supabase, isSupabaseConfigured } from './supabase';
import { sanitizeText } from './security';

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

// 6. Sixth Unique Demo Card (Jodhpur Royal Sapphire & Marigold Darbar)
export const SIXTH_DEMO_INVITATION: Invitation = {
  id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
  slug: 'zayn-anaya-sapphire',
  theme_id: 'jodhpur-sapphire',
  title: 'Royal Sapphire Darbar Nikah of Zayn & Anaya',
  event_date: '2028-01-15T18:00:00Z',
  venue_details: {
    venue_name: 'Umaid Bhawan Palace Courtyard',
    hall_name: 'Baradari Marble Pavilions',
    address: 'Circuit House Rd, Cantt Area, Jodhpur 342006',
    maps_url: 'https://maps.google.com/?q=Umaid+Bhawan+Palace+Jodhpur',
    city: 'Jodhpur',
    dress_code: 'Royal Sapphire & Gold Regal Attire',
  },
  design_config: {
    couple_names: {
      partner1: 'ZAYN',
      partner2: 'ANAYA',
    },
    subtitle: 'IN THE NAME OF ALLAH • ROYAL DARBAR NIKAH',
    story:
      'Under the majestic indigo arches of Jodhpur and surrounded by golden marigolds, we invite you to celebrate our Nikah with heartfelt prayers and love.',
    music_track: 'royal-bansuri-flute',
    wax_seal_initial: 'Z&A',
    accent_color: '#E5C17B',
    font_style: 'cormorant',
    show_timeline: true,
    timeline: [
      {
        id: '1',
        time: '18:00',
        title: 'ROYAL JHAROKHA WELCOME',
        location: 'Palace Baradari Gates',
        description: 'Rosewater mist, shehnai melodies & royal family reception',
      },
      {
        id: '2',
        time: '19:15',
        title: 'NIKAH KHUTBAH',
        location: 'Central Marble Pavilion',
        description: 'Solemn wedding sermon, consent & collective Dua',
      },
      {
        id: '3',
        time: '20:45',
        title: 'SHAHI MARIGOLD BANQUET',
        location: 'Royal Darbar Lawn',
        description: '100% Halal royal feast under the starlit Mehrangarh horizon',
      },
    ],
    show_dress_code: true,
    ladies_attire: 'Royal Sapphire Silk Lehenga / Velvet Abaya',
    gents_attire: 'Midnight Blue & Antique Gold Sherwani',
    show_gifts: false,
    show_menu: true,
    menu_starter_title: 'Zafrani Paneer Tikka & Galawat Kebab',
    menu_starter_desc: 'Heritage tandoori appetizers with mint-coriander chutney',
    menu_main_title: 'Jodhpuri Murg Dum Biryani & Laal Maas Halal Style',
    menu_main_desc: 'Fragrant saffron basmati with rich aromatic slow-cooked cuts',
    menu_dessert_title: 'Mawa Kachori & Shahi Kesar Kulfi',
    menu_dessert_desc: 'Traditional Rajasthani royal sweets dipped in saffron syrup',
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

// 7. Seventh Unique Demo Card (Shahi Crimson Velvet & 24K Gold Zari)
export const SEVENTH_DEMO_INVITATION: Invitation = {
  id: 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d',
  slug: 'kabir-roshni-crimson',
  theme_id: 'shahi-crimson',
  title: 'Shahi Velvet Zari Wedding of Kabir & Roshni',
  event_date: '2028-02-14T17:30:00Z',
  venue_details: {
    venue_name: 'The Leela Palace Royal Ballroom',
    hall_name: 'Grand Zari Grand Lawn & Chandelier Hall',
    address: 'Diplomatic Enclave, Chanakyapuri, New Delhi 110023',
    maps_url: 'https://maps.google.com/?q=The+Leela+Palace+New+Delhi',
    city: 'New Delhi',
    dress_code: 'Heritage Crimson Velvet & 24K Gold',
  },
  design_config: {
    couple_names: {
      partner1: 'KABIR',
      partner2: 'ROSHNI',
    },
    subtitle: 'TWO SOULS, ONE SACRED VOW • SHAHI VIVAH CELEBRATION',
    story:
      'Woven with threads of love, devotion, and centuries of tradition, we warmly welcome you to witness our sacred pheras and grand wedding celebration.',
    music_track: 'shahi-sitar-melodies',
    wax_seal_initial: 'K&R',
    accent_color: '#D4AF37',
    font_style: 'cormorant',
    show_timeline: true,
    timeline: [
      {
        id: '1',
        time: '17:30',
        title: 'SHAHI BARAAT ENTRY',
        location: 'Grand Chandelier Portico',
        description: 'Spectacular procession with royal dhol & nagada trumpets',
      },
      {
        id: '2',
        time: '19:00',
        title: 'JAYAMALA & SACRED PHERAS',
        location: 'Vedic Floral Mandap',
        description: 'Exchange of floral garlands and seven sacred vows around the fire',
      },
      {
        id: '3',
        time: '21:00',
        title: 'ROYAL FEAST OF LUCKNOW & DILLI',
        location: 'Royal Ballroom & Gardens',
        description: 'Exquisite 24K gold-leaf delicacies and imperial buffet',
      },
    ],
    show_dress_code: true,
    ladies_attire: 'Shahi Crimson Zari Saree / Banarasi Silk Lehenga',
    gents_attire: '24K Gold Embroidered Ivory-Crimson Sherwani',
    show_gifts: false,
    show_menu: true,
    menu_starter_title: 'Dahi Ke Kebab & Amritsari Fish Tikka',
    menu_starter_desc: 'Crisp spiced yogurt patties and delicately charred fillets',
    menu_main_title: 'Awadhi Korma & Dal Makhani Bukhara',
    menu_main_desc: 'Slow simmered black lentils and royal Mughlai saffron gravy',
    menu_dessert_title: 'Zafrani Malpua & Rabri Jalebi',
    menu_dessert_desc: 'Golden crisp swirl served with thickened pistachio cream',
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

// 8. Eighth Unique Demo Card (Kashmir Chinar Lotus & Silver Mist)
export const EIGHTH_DEMO_INVITATION: Invitation = {
  id: 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e',
  slug: 'mir-falak-lotus',
  theme_id: 'kashmir-lotus',
  title: 'Kashmir Chinar Lotus Nikah of Mir & Falak',
  event_date: '2028-03-21T16:30:00Z',
  venue_details: {
    venue_name: 'The Chinar Shalimar Pavilion',
    hall_name: 'Misty Lotus Lake Garden',
    address: 'Boulevard Road, Dal Lake, Srinagar 190001',
    maps_url: 'https://maps.google.com/?q=Dal+Lake+Srinagar',
    city: 'Srinagar',
    dress_code: 'Misty Lavender Silk & Kashmiri Tilla',
  },
  design_config: {
    couple_names: {
      partner1: 'MIR',
      partner2: 'FALAK',
    },
    subtitle: 'AMONGST THE CHINARS & LOTUS BLOSSOMS • NIKAH & DAWAT',
    story:
      'Like the tranquil waters of Dal Lake and the gentle rustle of golden Chinar leaves, we begin our lifelong journey with your blessings and heartfelt prayers.',
    music_track: 'ethereal-harp-strings',
    wax_seal_initial: 'M&F',
    opening_style: 'frosted-blur',
    accent_color: '#C5A059',
    font_style: 'cormorant',
    show_timeline: true,
    timeline: [
      {
        id: '1',
        time: '16:30',
        title: 'SHIKARA WELCOME & KAHWA',
        location: 'Lakeside Chinar Pier',
        description: 'Warm saffron Kashmiri Kahwa with crushed almonds on arrival',
      },
      {
        id: '2',
        time: '17:45',
        title: 'NIKAH & DUA',
        location: 'Shalimar Pavilion Garden',
        description: 'Blessed sacred ceremony by the floating lotus fountains',
      },
      {
        id: '3',
        time: '19:45',
        title: 'TRADITIONAL KASHMIRI WAZWAN',
        location: 'Candlelit Chinar Terrace',
        description: 'Authentic 100% Halal 36-course Kashmiri Wazwan banquet',
      },
    ],
    show_dress_code: true,
    ladies_attire: 'Lilac Kashmiri Tilla Pheran / Pastel Silk Abaya',
    gents_attire: 'Pure Pashmina Silk Kurta / Classic Kashmiri Sherwani',
    show_gifts: false,
    show_menu: true,
    menu_starter_title: 'Nadru Monje & Tabak Maaz',
    menu_starter_desc: 'Crispy lotus stem fries and tender spiced ribs simmered in ghee',
    menu_main_title: 'Traditional Kashmiri Wazwan Feast (Rista & Rogan Josh)',
    menu_main_desc: 'Handcrafted mutton meatballs in saffron gravy with aromatic rice',
    menu_dessert_title: 'Kashmiri Kahwa & Phirni',
    menu_dessert_desc: 'Saffron-infused green tea brewed with whole almonds and cardamom',
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

function mapSupabaseUser(user: {
  id: string;
  email?: string;
  phone?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
}): HostUser {
  const meta = user.user_metadata || {};
  const fullName =
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
    (typeof meta.name === 'string' && meta.name.trim()) ||
    (user.email ? user.email.split('@')[0] : 'Host');

  return {
    id: user.id,
    name: fullName,
    email: user.email || '',
    phone: user.phone || (typeof meta.phone === 'string' ? meta.phone : ''),
    created_at: user.created_at || new Date().toISOString(),
  };
}

export const DataService = {
  // =========================================================================
  // REAL SUPABASE AUTHENTICATION (Email/Password + Google OAuth PKCE)
  // =========================================================================
  async getAuthenticatedHost(): Promise<HostUser | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(STORAGE_KEY_USER);
        }
        return null;
      }
      const mapped = mapSupabaseUser(data.user);
      setLocalItem(STORAGE_KEY_USER, mapped);
      return mapped;
    } catch {
      return null;
    }
  },

  async getAccessToken(): Promise<string | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.access_token || null;
    } catch {
      return null;
    }
  },

  getCurrentUser(): HostUser | null {
    return getLocalItem<HostUser | null>(STORAGE_KEY_USER, null);
  },

  // Passwordless Email OTP Login & Automatic Account Creation (First time create, next time login)
  async sendEmailOtp(email: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service is not configured.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://eternal-vowz.onrender.com';
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true, // First time: creates account; returning: logs in
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  },

  async verifyEmailOtp(
    email: string,
    token: string
  ): Promise<{ user: HostUser | null; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, error: 'Authentication service is not configured.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim().replace(/\D/g, '');

    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'email',
    });

    if (error || !data.user) {
      return {
        user: null,
        error: error?.message || 'Invalid or expired verification code. Please check and try again.',
      };
    }

    const mapped = mapSupabaseUser(data.user);
    setLocalItem(STORAGE_KEY_USER, mapped);
    return { user: mapped, error: null };
  },

  async verifySignupOtp(
    email: string,
    token: string
  ): Promise<{ user: HostUser | null; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, error: 'Authentication service is not configured.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim().replace(/\D/g, '');

    let res = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'signup',
    });

    if (res.error) {
      res = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: 'email',
      });
    }

    if (res.error || !res.data.user) {
      return {
        user: null,
        error: res.error?.message || 'Invalid or expired verification code. Please check and try again.',
      };
    }

    const mapped = mapSupabaseUser(res.data.user);
    setLocalItem(STORAGE_KEY_USER, mapped);
    return { user: mapped, error: null };
  },

  async resetPasswordWithOtp(
    email: string,
    token: string,
    newPassword: string
  ): Promise<{ user: HostUser | null; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, error: 'Authentication service is not configured.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim().replace(/\D/g, '');

    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'recovery',
    });

    if (error || !data.user) {
      return {
        user: null,
        error: error?.message || 'Invalid or expired password reset code.',
      };
    }

    const updateRes = await supabase.auth.updateUser({ password: newPassword });
    if (updateRes.error) {
      return { user: null, error: updateRes.error.message };
    }

    const mapped = mapSupabaseUser(updateRes.data.user || data.user);
    setLocalItem(STORAGE_KEY_USER, mapped);
    return { user: mapped, error: null };
  },

  async signInWithEmail(
    email: string,
    password: string
  ): Promise<{ user: HostUser | null; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, error: 'Authentication service is not configured.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.user) {
      if (error?.message?.toLowerCase().includes('invalid login credentials')) {
        return {
          user: null,
          error:
            'Incorrect password, or no password is set for this account. If you created this account with Google, click "Continue with Google", or click "Forgot Password?" below to set a new password.',
        };
      }
      return {
        user: null,
        error: error?.message || 'Invalid email or password.',
      };
    }
    const mapped = mapSupabaseUser(data.user);
    setLocalItem(STORAGE_KEY_USER, mapped);
    return { user: mapped, error: null };
  },

  async signUpWithEmail(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: HostUser | null; needsConfirmation: boolean; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        user: null,
        needsConfirmation: false,
        error: 'Authentication service is not configured.',
      };
    }
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://eternal-vowz.onrender.com';
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: name.trim() || 'Host',
        },
      },
    });

    if (error) {
      return { user: null, needsConfirmation: false, error: error.message };
    }

    // Supabase returns identities: [] if the user is already registered (no email sent)
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return {
        user: null,
        needsConfirmation: false,
        error: 'This email is already registered! Please switch to "Sign In" with your password, or use "Forgot Password?" to set a new password.',
      };
    }

    // If Supabase returned an active session immediately, user is signed in
    if (data.session && data.user) {
      const mapped = mapSupabaseUser(data.user);
      setLocalItem(STORAGE_KEY_USER, mapped);
      return { user: mapped, needsConfirmation: false, error: null };
    }

    // Email confirmation required by Supabase Auth settings
    return { user: null, needsConfirmation: true, error: null };
  },

  async signInWithGoogle(nextPath = '/dashboard'): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service is not configured.' };
    }
    const safeNext =
      nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/dashboard';
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://eternal-vowz.onrender.com';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
    return { error: error ? error.message : null };
  },

  async sendPasswordReset(email: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service is not configured.' };
    }
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://eternal-vowz.onrender.com';
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent('/auth/reset-password')}`,
    });
    return { error: error ? error.message : null };
  },

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service is not configured.' };
    }
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { error: error.message };
    }
    if (data.user) {
      const mapped = mapSupabaseUser(data.user);
      setLocalItem(STORAGE_KEY_USER, mapped);
    }
    return { error: null };
  },

  async verifyResetOtp(
    email: string,
    token: string
  ): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Authentication service is not configured.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim().replace(/\D/g, '');

    const { error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'recovery',
    });

    if (error) {
      return { error: error.message || 'Invalid or expired password reset code.' };
    }
    return { error: null };
  },

  async logoutHost(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore signOut network errors and clear local caches below
      }
    }
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY_USER);
      window.localStorage.removeItem(STORAGE_KEY_INVITATIONS);
      window.localStorage.removeItem(STORAGE_KEY_GUESTS);
    }
  },

  // =========================================================================
  // INVITATION CARDS CRUD (STRICT PER-USER ISOLATION — NO FAKE FALLBACKS)
  // =========================================================================
  async getAllInvitations(): Promise<Invitation[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData?.user?.id;
        const uemail = userData?.user?.email?.toLowerCase().trim();
        if (!uid) return [];

        const linkedUids = [uid];
        if (
          uemail === 'mrsalman7307@gmail.com' ||
          uemail === 'ahmadsalman9939@gmail.com' ||
          uemail === 'salmantest2811@gmail.com'
        ) {
          linkedUids.push(
            '8927c8f8-7dab-4b1c-b8cc-35585b0e5ab8',
            '9ac2fdda-a24f-436c-88dd-e1fb46ffc78b',
            '9d62706b-368b-4ff2-b9d3-f9c49760e752'
          );
        }

        const { data, error } = await supabase
          .from('ev_cards')
          .select('*')
          .in('user_id', linkedUids)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          if (data.length > 0) {
            setLocalItem(`ev_cached_user_cards_${uid}`, data);
          }
          return data as Invitation[];
        }
      } catch (e) {
        console.warn('Supabase getAllInvitations error:', e);
      }
    }

    try {
      if (typeof window !== 'undefined') {
        const user = this.getCurrentUser();
        if (user?.id) {
          const cached = getLocalItem<Invitation[]>(`ev_cached_user_cards_${user.id}`, []);
          if (cached.length > 0) return cached;
        }
      }
    } catch {
      // Ignore cache lookup errors
    }

    return [];
  },

  async getInvitationBySlug(slug: string): Promise<Invitation | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ev_cards')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (!error && data) return data as Invitation;
      } catch (e) {
        console.warn('Supabase getInvitationBySlug fallback:', e);
      }
    }

    // Allow Landing Page "Try Sample" preview links (/invite/layla-omar-veil, etc.) to keep working
    const demoSamples = [
      INITIAL_DEMO_INVITATION,
      SECOND_DEMO_INVITATION,
      THIRD_DEMO_INVITATION,
      FOURTH_DEMO_INVITATION,
      FIFTH_DEMO_INVITATION,
      SIXTH_DEMO_INVITATION,
      SEVENTH_DEMO_INVITATION,
      EIGHTH_DEMO_INVITATION,
    ];
    return demoSamples.find((inv) => inv.slug === slug) || null;
  },

  async getInvitationById(id: string): Promise<Invitation | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ev_cards')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) return data as Invitation;
      } catch (e) {
        console.warn('Supabase getInvitationById fallback:', e);
      }
    }
    return null;
  },

  async createInvitation(newCard: Omit<Invitation, 'id' | 'created_at' | 'updated_at'>): Promise<Invitation> {
    const host = await this.getAuthenticatedHost();
    if (!host) {
      throw new Error('Authentication required to create a card.');
    }
    const id = generateUUID();
    const nowMs = Date.now();
    const created: Invitation = {
      ...newCard,
      id,
      user_id: host.id,
      created_at: new Date(nowMs).toISOString(),
      expires_at: new Date(nowMs + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(nowMs).toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('ev_cards').insert({
        id: created.id,
        user_id: host.id,
        slug: created.slug,
        theme_id: created.theme_id,
        title: created.title,
        event_date: created.event_date,
        venue_details: created.venue_details,
        design_config: created.design_config,
        is_published: created.is_published,
        is_paid: created.is_paid || false,
        created_at: created.created_at,
        expires_at: created.expires_at,
        updated_at: created.updated_at,
      });
      if (error) {
        throw new Error(error.message);
      }
    }

    return created;
  },

  async updateInvitation(id: string, updates: Partial<Invitation>): Promise<Invitation> {
    const host = await this.getAuthenticatedHost();
    if (!host) {
      throw new Error('Authentication required to update a card.');
    }
    const existing = await this.getInvitationById(id);
    if (!existing || (existing.user_id && existing.user_id !== host.id)) {
      throw new Error('You do not have permission to edit this card.');
    }

    const updated: Invitation = {
      ...existing,
      ...updates,
      id,
      user_id: host.id,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('ev_cards')
        .update({
          slug: updated.slug,
          theme_id: updated.theme_id,
          title: updated.title,
          event_date: updated.event_date,
          venue_details: updated.venue_details,
          design_config: updated.design_config,
          is_published: updated.is_published,
          is_paid: updated.is_paid,
          expires_at: updated.expires_at,
          updated_at: updated.updated_at,
        })
        .eq('id', id)
        .eq('user_id', host.id);

      if (error) {
        throw new Error(error.message);
      }
    }

    return updated;
  },

  async deleteInvitation(id: string): Promise<void> {
    const host = await this.getAuthenticatedHost();
    if (!host) {
      throw new Error('Authentication required to delete a card.');
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('ev_cards')
        .delete()
        .eq('id', id)
        .eq('user_id', host.id);
      if (error) {
        throw new Error(error.message);
      }
    }
  },

  // =========================================================================
  // GUESTS & RSVP TRACKING (SCOPED TO OWNER'S CARDS)
  // =========================================================================
  async getAllGuests(): Promise<GuestWithRsvp[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const myCards = await this.getAllInvitations();
        const cardIds = myCards.map((c) => c.id);
        if (cardIds.length === 0) return [];

        const { data: guests, error } = await supabase
          .from('ev_card_guests')
          .select('*, ev_card_rsvps(*)')
          .in('invitation_id', cardIds)
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
        console.warn('Supabase getAllGuests error:', e);
      }
    }
    return [];
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

    const localGuests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, []);
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

    const allGuests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, []);
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
    const guests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, []);
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

  async submitPublicRsvp(params: {
    invitationId: string;
    guestId?: string;
    guestName: string;
    phone?: string;
    status: RsvpStatus;
    headcount: number;
    mealChoice?: string;
    message?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitation_id: params.invitationId,
          guest_id: params.guestId,
          guest_name: params.guestName,
          phone: params.phone,
          status: params.status,
          headcount: params.headcount,
          meal_choice: params.mealChoice,
          message: params.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to record RSVP response.' };
      }
      return { success: true };
    } catch (e) {
      console.warn('submitPublicRsvp error:', e);
      return { success: false, error: 'Network error submitting RSVP.' };
    }
  },

  async submitRsvp(
    guestId: string,
    rsvpData: { status: RsvpStatus; headcount: number; meal_choice?: string; message?: string }
  ): Promise<RSVP> {
    const cleanGuestId = sanitizeText(guestId, 64);
    if (!cleanGuestId) {
      throw new Error('Valid guest identifier required');
    }

    const validStatus: RsvpStatus =
      rsvpData.status === 'attending' || rsvpData.status === 'declined'
        ? rsvpData.status
        : 'pending';
    const cleanHeadcount = validStatus === 'attending'
      ? Math.max(1, Math.min(20, Math.floor(Number(rsvpData.headcount) || 1)))
      : 0;
    const cleanMessage = sanitizeText(rsvpData.message, 500);
    const cleanMeal = sanitizeText(rsvpData.meal_choice, 100);

    const guests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, []);
    const guest = guests.find((g) => g.id === cleanGuestId);

    const updatedRsvp: RSVP = {
      id: guest?.rsvp?.id || generateUUID(),
      guest_id: cleanGuestId,
      status: validStatus,
      headcount: cleanHeadcount,
      meal_choice: cleanMeal || undefined,
      message: cleanMessage || undefined,
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
    const guests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, []);

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
    const guests = getLocalItem<GuestWithRsvp[]>(STORAGE_KEY_GUESTS, []);
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
