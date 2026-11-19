-- ============================================================================
-- InviteCraft Database Schema (Supabase PostgreSQL)
-- Modeled for interactive animated invitations & RSVP management
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- References auth.users(id) if Supabase Auth is enabled
    slug TEXT UNIQUE NOT NULL,
    theme_id TEXT NOT NULL DEFAULT 'royal-emerald',
    title TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    venue_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    design_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for slug lookup
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations (slug);

-- 2. GUESTS TABLE
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    unique_token TEXT UNIQUE NOT NULL,
    max_allowed_guests INTEGER NOT NULL DEFAULT 2,
    group_tag TEXT DEFAULT 'General',
    link_opened_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for guests
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests (invitation_id);
CREATE INDEX IF NOT EXISTS idx_guests_token ON public.guests (unique_token);

-- 3. RSVPS TABLE
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID UNIQUE NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('attending', 'declined', 'pending')),
    headcount INTEGER NOT NULL DEFAULT 1,
    meal_choice TEXT,
    message TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for RSVPs
CREATE INDEX IF NOT EXISTS idx_rsvps_guest_id ON public.rsvps (guest_id);

-- 4. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_invitations_updated_at ON public.invitations;
CREATE TRIGGER set_invitations_updated_at
BEFORE UPDATE ON public.invitations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_rsvps_updated_at ON public.rsvps;
CREATE TRIGGER set_rsvps_updated_at
BEFORE UPDATE ON public.rsvps
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security (RLS) policies
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published invitations
CREATE POLICY "Public read published invitations"
ON public.invitations FOR SELECT
USING (is_published = true OR auth.uid() = user_id OR auth.uid() IS NULL);

-- Allow public read & update of invitations for demo mode
CREATE POLICY "Public all access invitations"
ON public.invitations FOR ALL
USING (true)
WITH CHECK (true);

-- Allow guests read & update
CREATE POLICY "Public all access guests"
ON public.guests FOR ALL
USING (true)
WITH CHECK (true);

-- Allow public RSVP insertions and updates
CREATE POLICY "Public all access rsvps"
ON public.rsvps FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================================================
-- SEED DATA (Demo Wedding: Sophia & Alexander)
-- ============================================================================

INSERT INTO public.invitations (
    id,
    slug,
    theme_id,
    title,
    event_date,
    venue_details,
    design_config,
    is_published
) VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'sophia-alexander',
    'royal-emerald',
    'The Wedding of Sophia & Alexander',
    '2026-10-24 16:30:00+00',
    '{
        "venue_name": "The Grand St. Regis Palace",
        "hall_name": "Imperial Ballroom & Courtyard Gardens",
        "address": "450 Palace Promenade, Beverly Hills, CA 90210",
        "maps_url": "https://maps.google.com/?q=The+Grand+St+Regis+Palace+Beverly+Hills",
        "city": "Beverly Hills",
        "dress_code": "Black Tie & Royal Elegance (Emerald & Gold touches welcomed)"
    }'::jsonb,
    '{
        "couple_names": {
            "partner1": "Sophia Montgomery",
            "partner2": "Alexander Vance"
        },
        "subtitle": "Together with their families, request the honor of your presence",
        "story": "From a chance encounter in Paris to a lifetime of adventures across seven continents, our journey has been an extraordinary love story. We cannot wait to celebrate this monumental next chapter with our closest circle of family and beloved friends.",
        "music_track": "royal-harp",
        "wax_seal_initial": "S&A",
        "timeline": [
            {
                "time": "4:30 PM",
                "title": "Welcome Cocktail & String Quartet",
                "location": "The Rose Courtyard",
                "description": "Champagne reception, artisan mocktails, and live acoustic violin serenade."
            },
            {
                "time": "5:30 PM",
                "title": "Solemn Wedding Ceremony",
                "location": "The Glass Conservatory",
                "description": "Exchange of vows amidst candlelit chandeliers and botanical floral arches."
            },
            {
                "time": "7:00 PM",
                "title": "Gala Dinner & Imperial Toasts",
                "location": "Imperial Ballroom",
                "description": "Four-course Michelin-inspired culinary feast paired with grand toasts."
            },
            {
                "time": "9:30 PM",
                "title": "Cake Cutting & Dancing Under Stars",
                "location": "Starlight Pavilion",
                "description": "First dance, midnight dessert lounge, and celebrations into the night."
            }
        ]
    }'::jsonb,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Seed Guests
INSERT INTO public.guests (
    id,
    invitation_id,
    guest_name,
    phone,
    email,
    unique_token,
    max_allowed_guests,
    group_tag,
    link_opened_at
) VALUES 
(
    '11111111-2222-3333-4444-555555555551',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Rahul & Priya Sharma',
    '+1 (555) 234-5678',
    'rahul.sharma@example.com',
    'rahul-priya-vip',
    3,
    'VIP Family',
    NOW() - INTERVAL '2 hours'
),
(
    '11111111-2222-3333-4444-555555555552',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Lady Eleanor & Lord Hastings',
    '+1 (555) 345-6789',
    'eleanor.hastings@example.com',
    'eleanor-hastings',
    2,
    'Bride Family',
    NOW() - INTERVAL '1 day'
),
(
    '11111111-2222-3333-4444-555555555553',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Dr. David Chen & Guest',
    '+1 (555) 456-7890',
    'david.chen@example.com',
    'david-chen',
    2,
    'Groom Friends',
    NOW() - INTERVAL '5 hours'
),
(
    '11111111-2222-3333-4444-555555555554',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Aarav Patel & Family',
    '+1 (555) 567-8901',
    'aarav.patel@example.com',
    'aarav-family',
    4,
    'VIP Family',
    NULL
),
(
    '11111111-2222-3333-4444-555555555555',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Camilla Dubois',
    '+1 (555) 678-9012',
    'camilla@example.com',
    'camilla-dubois',
    1,
    'Colleagues',
    NOW() - INTERVAL '30 minutes'
) ON CONFLICT (unique_token) DO NOTHING;

-- Seed RSVPs
INSERT INTO public.rsvps (
    guest_id,
    status,
    headcount,
    meal_choice,
    message
) VALUES 
(
    '11111111-2222-3333-4444-555555555551',
    'attending',
    3,
    'Vegetarian Gourmet',
    'So overjoyed for you both! Priya and I wouldn''t miss this magnificent celebration for the world.'
),
(
    '11111111-2222-3333-4444-555555555552',
    'attending',
    2,
    'Non-Veg Royal Feast',
    'Wishing you a lifetime of unbounded happiness, joy, and peace. Looking forward to the gala!'
),
(
    '11111111-2222-3333-4444-555555555553',
    'declined',
    0,
    NULL,
    'Deepest apologies as I have an overseas medical symposium on that date, but sending all my love!'
),
(
    '11111111-2222-3333-4444-555555555555',
    'attending',
    1,
    'Vegan Delicacy',
    'Congratulations Sophia and Alexander! Can''t wait to dance the night away with you!'
) ON CONFLICT (guest_id) DO NOTHING;
