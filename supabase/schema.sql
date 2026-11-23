-- ============================================================================
-- Eternal Vowz (E&V) Database Schema (Supabase PostgreSQL)
-- Interactive 3D Digital Wedding Invitations, 30-Day Validity & Live RSVPs
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ETERNAL VOWZ 3D CARDS TABLE
CREATE TABLE IF NOT EXISTS public.ev_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    slug TEXT UNIQUE NOT NULL,
    theme_id TEXT NOT NULL DEFAULT 'tuscan-sunset',
    title TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    venue_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    design_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ev_cards
    ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_ev_cards_slug ON public.ev_cards (slug);

-- 1B. RAZORPAY ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.ev_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES public.ev_cards(id) ON DELETE SET NULL,
    customer_email TEXT,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    amount INTEGER NOT NULL DEFAULT 7900,
    coupon_code TEXT,
    discount_amount INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ev_orders
    ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE public.ev_orders
    ADD COLUMN IF NOT EXISTS discount_amount INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_ev_orders_card_id ON public.ev_orders (card_id);
CREATE INDEX IF NOT EXISTS idx_ev_orders_razorpay_order_id ON public.ev_orders (razorpay_order_id);

-- 1C. COUPON CODES TABLE
CREATE TABLE IF NOT EXISTS public.ev_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'flat')),
    discount_value INTEGER NOT NULL CHECK (discount_value > 0),
    max_uses INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ev_coupons_code ON public.ev_coupons (code);

-- 2. GUESTS TABLE
CREATE TABLE IF NOT EXISTS public.ev_card_guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.ev_cards(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    unique_token TEXT UNIQUE NOT NULL,
    max_allowed_guests INTEGER NOT NULL DEFAULT 2,
    group_tag TEXT DEFAULT 'Family',
    link_opened_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ev_card_guests_invitation_id ON public.ev_card_guests (invitation_id);
CREATE INDEX IF NOT EXISTS idx_ev_card_guests_token ON public.ev_card_guests (unique_token);

-- 3. RSVPS TABLE
CREATE TABLE IF NOT EXISTS public.ev_card_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID UNIQUE NOT NULL REFERENCES public.ev_card_guests(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('attending', 'declined', 'pending')),
    headcount INTEGER NOT NULL DEFAULT 1,
    meal_choice TEXT,
    message TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ev_card_rsvps_guest_id ON public.ev_card_rsvps (guest_id);

-- 4. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.ev_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_ev_cards_updated_at ON public.ev_cards;
CREATE TRIGGER set_ev_cards_updated_at
BEFORE UPDATE ON public.ev_cards
FOR EACH ROW
EXECUTE FUNCTION public.ev_update_updated_at_column();

DROP TRIGGER IF EXISTS set_ev_card_rsvps_updated_at ON public.ev_card_rsvps;
CREATE TRIGGER set_ev_card_rsvps_updated_at
BEFORE UPDATE ON public.ev_card_rsvps
FOR EACH ROW
EXECUTE FUNCTION public.ev_update_updated_at_column();

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.ev_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_card_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_card_rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public all access ev_cards" ON public.ev_cards;
CREATE POLICY "Public all access ev_cards"
ON public.ev_cards FOR ALL
USING (true)
WITH CHECK (true);

-- Orders & Coupons are written/updated strictly by server-side Razorpay API routes
DROP POLICY IF EXISTS "Public read ev_orders" ON public.ev_orders;
CREATE POLICY "Public read ev_orders"
ON public.ev_orders FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public read active ev_coupons" ON public.ev_coupons;
CREATE POLICY "Public read active ev_coupons"
ON public.ev_coupons FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Public all access ev_card_guests" ON public.ev_card_guests;
CREATE POLICY "Public all access ev_card_guests"
ON public.ev_card_guests FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public all access ev_card_rsvps" ON public.ev_card_rsvps;
CREATE POLICY "Public all access ev_card_rsvps"
ON public.ev_card_rsvps FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================================================
-- SEED 5 SIGNATURE ETERNAL VOWZ CARDS (IDEMPOTENT)
-- ============================================================================

INSERT INTO public.ev_cards (
    id, slug, theme_id, title, event_date, venue_details, design_config, is_published, expires_at
) VALUES
(
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'sophia-alexander',
    'tuscan-sunset',
    'Nikah & Walima of Sophia & Alexander',
    '2027-10-24T16:30:00Z',
    '{
        "venue_name": "The Grand Palace Gardens",
        "hall_name": "Imperial Ballroom & Courtyard Terrace",
        "address": "450 Royal Promenade, Beverly Hills, CA 90210",
        "maps_url": "https://maps.google.com/?q=Beverly+Hills+Hotel+CA",
        "city": "Beverly Hills",
        "dress_code": "Modest & Royal Attire"
    }'::jsonb,
    '{
        "couple_names": {"partner1": "SOPHIA", "partner2": "ALEXANDER"},
        "subtitle": "TOGETHER WITH THEIR FAMILIES INVITE YOU",
        "story": "With the blessings of our parents and loved ones, we joyfully invite you to witness and celebrate our blessed Nikah and Walima reception.",
        "music_track": "wedding-nasheed",
        "wax_seal_initial": "S&A",
        "opening_style": "lifafa",
        "accent_color": "#C9A84C",
        "font_style": "cormorant",
        "show_timeline": true,
        "timeline": [
            {"id": "1", "time": "16:30", "title": "WELCOME", "location": "Rose Courtyard", "description": "Warm family welcome & rose sherbet reception"},
            {"id": "2", "time": "17:30", "title": "NIKAH", "location": "Royal Pavilion", "description": "Blessed Nikah ceremony & collective Dua"},
            {"id": "3", "time": "19:30", "title": "WALIMA", "location": "Grand Banquet Hall", "description": "100% Halal Royal Banquet Dinner"},
            {"id": "4", "time": "22:00", "title": "RUKHSATI", "location": "Palace Courtyard", "description": "Heartfelt prayers & fond farewells"}
        ],
        "show_dress_code": true,
        "ladies_attire": "Loose Modest Cape-Abaya / Flowing Gown",
        "gents_attire": "Ivory-Gold Sherwani / Classic Suit",
        "show_menu": true,
        "menu_starter_title": "Zafrani Seekh Kebab & Paneer Tikka",
        "menu_starter_desc": "Charcoal-grilled halal delicacies with saffron mint chutney",
        "menu_main_title": "Royal Shahi Dum Biryani & Mutton Rogan Josh",
        "menu_main_desc": "Slow-cooked aromatic basmati & tender halal cuts",
        "menu_dessert_title": "Shahi Rose Phirni & Pistachio Baklava",
        "menu_dessert_desc": "Chilled saffron pudding with crushed pistachios",
        "show_story": true,
        "show_couple_portrait": true,
        "show_gifts": true,
        "gift_note": "Your presence and heartfelt duas are the greatest gift we could ask for.",
        "show_accommodation": true,
        "accommodation_name": "The Royal Heritage Suites",
        "accommodation_note": "Special family wedding room block available near the venue.",
        "show_faq": true,
        "faqs": [
            {"q": "Is the catering 100% Halal?", "a": "Yes, every dish and beverage served at our wedding is 100% Halal certified."}
        ],
        "show_rsvp": true
    }'::jsonb,
    true,
    NOW() + INTERVAL '30 days'
),
(
    'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    'zoya-ayaan-nikah',
    'royal-emerald',
    'Blessed Nikah of Zoya & Ayaan',
    '2027-12-12T17:00:00Z',
    '{
        "venue_name": "Taj Falaknuma Royal Lawn",
        "hall_name": "Grand Darbar Courtyard",
        "address": "Engine Bowli, Falaknuma, Hyderabad 500053",
        "maps_url": "https://maps.google.com/?q=Taj+Falaknuma+Palace+Hyderabad",
        "city": "Hyderabad",
        "dress_code": "Modest Traditional & Royal Attire"
    }'::jsonb,
    '{
        "couple_names": {"partner1": "ZOYA", "partner2": "AYAAN"},
        "subtitle": "BISMILLAHIR RAHMANIR RAHIM • NIKAH INVITATION",
        "story": "Alhamdulillah, with the blessings of our parents, we invite you and your family to grace our Nikah ceremony with your prayers and presence.",
        "music_track": "wedding-nasheed",
        "wax_seal_initial": "Z&A",
        "opening_style": "lifafa",
        "accent_color": "#D4AF37",
        "font_style": "cormorant",
        "show_timeline": true,
        "timeline": [
            {"id": "1", "time": "17:00", "title": "NIKAH", "location": "Grand Darbar Lawn", "description": "Solemn Nikah Khutbah & collective Dua"},
            {"id": "2", "time": "19:30", "title": "BANQUET", "location": "Imperial Dining Hall", "description": "Royal Hyderabadi Halal Feast"}
        ],
        "show_dress_code": true,
        "ladies_attire": "Modest Abaya / Gharara",
        "gents_attire": "Sherwani / Kurta Pajama",
        "show_story": true,
        "show_couple_portrait": true,
        "show_rsvp": true
    }'::jsonb,
    true,
    NOW() + INTERVAL '30 days'
),
(
    'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
    'fatima-hamza-starlight',
    'midnight-minimalist',
    'Starlight Walima of Fatima & Hamza',
    '2027-11-28T19:00:00Z',
    '{
        "venue_name": "The Oberoi Starlight Pavilion",
        "hall_name": "Crystal Gazebo & Night Gardens",
        "address": "Dr Zakir Hussain Marg, New Delhi 110003",
        "maps_url": "https://maps.google.com/?q=The+Oberoi+New+Delhi",
        "city": "New Delhi",
        "dress_code": "Evening Modest Formal"
    }'::jsonb,
    '{
        "couple_names": {"partner1": "FATIMA", "partner2": "HAMZA"},
        "subtitle": "UNDER THE STARS • WALIMA RECEPTION",
        "story": "And We created you in pairs. Join our families under the starlit sky for an evening of prayers, love, and our Royal Walima dinner.",
        "music_track": "wedding-nasheed",
        "wax_seal_initial": "F&H",
        "opening_style": "lifafa",
        "accent_color": "#E2C275",
        "font_style": "cormorant",
        "show_timeline": true,
        "timeline": [
            {"id": "1", "time": "19:00", "title": "WELCOME", "location": "Starlight Gazebo", "description": "Rosewater welcome & family greetings"},
            {"id": "2", "time": "20:30", "title": "WALIMA DINNER", "location": "Crystal Lawn", "description": "Candlelit 100% Halal Royal Banquet"}
        ],
        "show_dress_code": true,
        "ladies_attire": "Modest Evening Abaya / Gown",
        "gents_attire": "Dark Sherwani / Suit",
        "show_menu": true,
        "menu_starter_title": "Zafrani Seekh Kebab & Galouti Platter",
        "menu_starter_desc": "Melt-in-mouth Lucknowi halal kebabs with saffron sheermal",
        "menu_main_title": "Awadhi Dum Biryani & Nalli Nihari",
        "menu_main_desc": "Slow-cooked royal halal delicacies with fragrant basmati",
        "menu_dessert_title": "Shahi Tukda & Pistachio Kulfi",
        "menu_dessert_desc": "Warm saffron bread pudding topped with rabri & gold leaf",
        "show_story": true,
        "show_couple_portrait": true,
        "show_rsvp": true
    }'::jsonb,
    true,
    NOW() + INTERVAL '30 days'
),
(
    'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
    'amira-rayyan-palace',
    'blush-floral',
    'Royal Shahi Darbar Nikah of Amira & Rayyan',
    '2027-12-18T17:30:00Z',
    '{
        "venue_name": "Rambagh Royal Palace Courtyard",
        "hall_name": "Shahi Jharokha Darbar Lawn",
        "address": "Bhawani Singh Rd, Rambagh, Jaipur 302005",
        "maps_url": "https://maps.google.com/?q=Rambagh+Palace+Jaipur",
        "city": "Jaipur",
        "dress_code": "Royal Modest Heritage Attire"
    }'::jsonb,
    '{
        "couple_names": {"partner1": "AMIRA", "partner2": "RAYYAN"},
        "subtitle": "BISMILLAH • ROYAL PALACE NIKAH & WALIMA",
        "story": "As the Shahi Palace Gates open, our families warmly welcome you to celebrate the blessed union of Amira and Rayyan with your prayers and presence.",
        "music_track": "wedding-nasheed",
        "wax_seal_initial": "A&R",
        "opening_style": "palace-gates",
        "accent_color": "#D49B88",
        "font_style": "cormorant",
        "show_timeline": true,
        "timeline": [
            {"id": "1", "time": "17:30", "title": "ROYAL WELCOME", "location": "Palace Jharokha Gate", "description": "Royal rose-petal welcome at the palace courtyard"},
            {"id": "2", "time": "18:30", "title": "NIKAH CEREMONY", "location": "Courtyard Pavilion", "description": "Blessed Nikah Khutbah & collective Dua"},
            {"id": "3", "time": "20:30", "title": "ROYAL HALAL BANQUET", "location": "Maharani Garden Lawn", "description": "100% Halal Royal Rajasthani & Mughlai Feast"}
        ],
        "show_dress_code": true,
        "ladies_attire": "Loose Modest Cape-Abaya / Royal Gharara",
        "gents_attire": "Ivory-Gold Sherwani / Bandhgala",
        "show_menu": true,
        "menu_starter_title": "Shahi Murgh Malai Tikka & Subz Kebab",
        "menu_starter_desc": "Charcoal-roasted halal delicacies with saffron mint chutney",
        "menu_main_title": "Royal Mughlai Dum Biryani & Korma",
        "menu_main_desc": "Fragrant aged basmati rice with slow-cooked halal cuts",
        "menu_dessert_title": "Zafrani Rasmalai & Rose Rabri",
        "menu_dessert_desc": "Chilled saffron-infused cottage cheese medallions with pistachios",
        "show_story": true,
        "show_couple_portrait": true,
        "show_rsvp": true
    }'::jsonb,
    true,
    NOW() + INTERVAL '30 days'
),
(
    'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
    'layla-omar-veil',
    'pearl-veil',
    'Pearl Conservatory Nikah of Layla & Omar',
    '2027-12-26T16:00:00Z',
    '{
        "venue_name": "The Ivory Glass Conservatory",
        "hall_name": "White Orchid Pavilion & Botanical Terrace",
        "address": "88 Botanical Garden Promenade, Bengaluru 560001",
        "maps_url": "https://maps.google.com/?q=Lalbagh+Glass+House+Bengaluru",
        "city": "Bengaluru",
        "dress_code": "Ivory Pearl, Champagne & Soft Sage"
    }'::jsonb,
    '{
        "couple_names": {"partner1": "LAYLA", "partner2": "OMAR"},
        "subtitle": "TOGETHER WITH THEIR FAMILIES • INVITE YOU TO CELEBRATE",
        "story": "With gratitude in our hearts and the blessings of our parents, we joyfully invite you to witness the beginning of our forever beneath the ivory orchids.",
        "music_track": "wedding-nasheed",
        "wax_seal_initial": "L&O",
        "opening_style": "frosted-blur",
        "accent_color": "#C5A059",
        "font_style": "cormorant",
        "show_timeline": true,
        "timeline": [
            {"id": "1", "time": "16:00", "title": "GUEST ARRIVAL", "location": "Botanical Courtyard", "description": "Warm rose-tea reception & family greetings"},
            {"id": "2", "time": "17:00", "title": "NIKAH CEREMONY", "location": "White Orchid Pavilion", "description": "Solemn Nikah ceremony & collective blessings"},
            {"id": "3", "time": "19:30", "title": "ROYAL HALAL DINNER", "location": "Candlelit Glass Hall", "description": "Curated 100% Halal gourmet banquet under glass"}
        ],
        "show_dress_code": true,
        "ladies_attire": "Flowing Modest Gown / Ivory Cape-Abaya",
        "gents_attire": "Champagne Sherwani / Classic Tailored Suit",
        "show_menu": true,
        "menu_starter_title": "Herb-Crusted Lamb Croquettes & Truffle Soup",
        "menu_starter_desc": "Artisanal halal starters paired with fresh botanical mocktails",
        "menu_main_title": "Saffron Dum Biryani & Slow-Braised Herb Chicken",
        "menu_main_desc": "Signature royal halal main course with freshly baked naan",
        "menu_dessert_title": "White Chocolate Rose Tart & Pistachio Gelato",
        "menu_dessert_desc": "Handcrafted botanical patisserie dessert",
        "show_story": true,
        "show_couple_portrait": true,
        "show_rsvp": true
    }'::jsonb,
    true,
    NOW() + INTERVAL '30 days'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Guests
INSERT INTO public.ev_card_guests (
    id, invitation_id, guest_name, phone, email, unique_token, max_allowed_guests, group_tag, link_opened_at
) VALUES
(
    '11111111-2222-3333-4444-555555555551',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Rahul & Priya Sharma',
    '+91 98765 23456',
    'rahul.sharma@example.com',
    'rahul-priya-vip',
    3,
    'VIP Family',
    NOW() - INTERVAL '2 hours'
),
(
    '11111111-2222-3333-4444-555555555552',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Tariq & Family',
    '+91 98765 87654',
    'tariq.family@example.com',
    'vip-tariq-family',
    4,
    'Close Relatives',
    NOW() - INTERVAL '5 hours'
),
(
    '11111111-2222-3333-4444-555555555553',
    'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    'Zaid Khan & Family',
    '+91 98765 43210',
    'zaid.khan@example.com',
    'guest-zaid-khan',
    4,
    'VIP Family',
    NOW() - INTERVAL '30 minutes'
) ON CONFLICT (unique_token) DO NOTHING;

-- Seed Sample RSVPs
INSERT INTO public.ev_card_rsvps (
    guest_id, status, headcount, meal_choice, message
) VALUES
(
    '11111111-2222-3333-4444-555555555551',
    'attending',
    3,
    'Royal Halal Chicken & Biryani',
    'MashaAllah! So thrilled for both of you! Counting down the days.'
),
(
    '11111111-2222-3333-4444-555555555552',
    'attending',
    4,
    'Halal Mutton Rogan Josh',
    'Wishing you both a lifetime of barakah and happiness!'
),
(
    '11111111-2222-3333-4444-555555555553',
    'attending',
    4,
    'Royal Halal Chicken & Biryani',
    'Congratulations Zoya & Ayaan! Looking forward to celebrating with you.'
) ON CONFLICT (guest_id) DO NOTHING;


-- Seed Starter Coupon Codes (Idempotent)
INSERT INTO public.ev_coupons (code, discount_type, discount_value, max_uses, is_active) VALUES
    ('RUPEE1', 'flat', 98, 10000, true),
    ('SPECIAL1', 'flat', 98, 10000, true),
    ('NIKAH20', 'flat', 20, 500, true),
    ('ETERNAL50', 'percent', 50, 200, true),
    ('FREE100', 'percent', 100, 100, true)
ON CONFLICT (code) DO NOTHING;
