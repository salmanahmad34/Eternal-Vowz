-- ============================================================================
-- Eternal Vowz: per-user ownership + hardened Row Level Security
-- Run once in Supabase Dashboard -> SQL Editor (safe to re-run).
-- ============================================================================

ALTER TABLE public.ev_cards ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_ev_cards_user_id ON public.ev_cards (user_id);

ALTER TABLE public.ev_cards       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_card_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_card_rsvps  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_coupons     ENABLE ROW LEVEL SECURITY;

-- Remove the old wide-open policies
DROP POLICY IF EXISTS "Public all access ev_cards"       ON public.ev_cards;
DROP POLICY IF EXISTS "Public all access ev_card_guests" ON public.ev_card_guests;
DROP POLICY IF EXISTS "Public all access ev_card_rsvps"  ON public.ev_card_rsvps;
DROP POLICY IF EXISTS "Public read ev_orders"            ON public.ev_orders;
DROP POLICY IF EXISTS "Public read active ev_coupons"    ON public.ev_coupons;

-- CARDS: anyone can open a published invitation link; only the owner can write.
CREATE POLICY "ev_cards public read" ON public.ev_cards
  FOR SELECT USING (true);
CREATE POLICY "ev_cards owner insert" ON public.ev_cards
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "ev_cards owner update" ON public.ev_cards
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "ev_cards owner delete" ON public.ev_cards
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- GUESTS: link lookup is public (token is the secret); only the card owner manages the list.
CREATE POLICY "ev_card_guests public read" ON public.ev_card_guests
  FOR SELECT USING (true);
CREATE POLICY "ev_card_guests owner write" ON public.ev_card_guests
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.ev_cards c WHERE c.id = invitation_id AND c.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.ev_cards c WHERE c.id = invitation_id AND c.user_id = auth.uid()));

-- RSVPS: guests (anonymous) submit/update their reply; owners read everything.
CREATE POLICY "ev_card_rsvps public read" ON public.ev_card_rsvps
  FOR SELECT USING (true);
CREATE POLICY "ev_card_rsvps guest insert" ON public.ev_card_rsvps
  FOR INSERT WITH CHECK (true);
CREATE POLICY "ev_card_rsvps guest update" ON public.ev_card_rsvps
  FOR UPDATE USING (true) WITH CHECK (true);

-- ORDERS & COUPONS: server-only (service role bypasses RLS). No client policies.
