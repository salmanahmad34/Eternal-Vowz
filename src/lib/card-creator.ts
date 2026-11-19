import crypto from 'crypto';
import { SupabaseClient } from '@supabase/supabase-js';
import { Invitation } from '@/types/database';

const CARD_VALIDITY_DAYS = 30;

export interface CardCreatePayload {
  slug?: string;
  theme_id?: string;
  title?: string;
  event_date?: string;
  venue_details?: Record<string, unknown>;
  design_config?: Record<string, unknown>;
}

/**
 * Server-only helper that inserts a brand-new PAID invitation card into public.ev_cards
 * and seeds one starter VIP guest into public.ev_card_guests.
 * Should ONLY be called after Razorpay payment verification or a validated 100% free coupon.
 */
export async function createPaidCardInDb(
  supabaseAdmin: SupabaseClient,
  payload: CardCreatePayload
): Promise<Invitation> {
  const designConfig = (payload.design_config || {}) as {
    couple_names?: { partner1?: string; partner2?: string };
  };
  const p1 = designConfig?.couple_names?.partner1?.trim() || 'Bride';
  const p2 = designConfig?.couple_names?.partner2?.trim() || 'Groom';

  const baseSlug = (payload.slug || `${p1}-${p2}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'wedding-card';

  const suffix = crypto.randomBytes(3).toString('hex');
  const uniqueSlug = `${baseSlug.slice(0, 48)}-${suffix}`;

  const nowMs = Date.now();
  const nowIso = new Date(nowMs).toISOString();
  const expiresAtIso = new Date(
    nowMs + CARD_VALIDITY_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const cardId = crypto.randomUUID();
  const eventDate =
    payload.event_date && !Number.isNaN(Date.parse(payload.event_date))
      ? new Date(payload.event_date).toISOString()
      : new Date(nowMs + 30 * 24 * 60 * 60 * 1000).toISOString();

  const insertRow = {
    id: cardId,
    slug: uniqueSlug,
    theme_id: payload.theme_id || 'royal-emerald',
    title: payload.title?.trim() || `Wedding of ${p1} & ${p2}`,
    event_date: eventDate,
    venue_details: payload.venue_details || {},
    design_config: payload.design_config || {},
    is_published: true,
    is_paid: true,
    created_at: nowIso,
    expires_at: expiresAtIso,
    updated_at: nowIso,
  };

  const { data: createdCard, error: insertError } = await supabaseAdmin
    .from('ev_cards')
    .insert(insertRow)
    .select('*')
    .single();

  if (insertError || !createdCard) {
    throw new Error(
      `Failed to insert paid card into ev_cards: ${insertError?.message || 'unknown error'}`
    );
  }

  // Seed 1 default VIP sample guest so the host immediately has a personalized link
  const guestToken = `vip-guest-${crypto.randomBytes(3).toString('hex')}`;
  await supabaseAdmin.from('ev_card_guests').insert({
    id: crypto.randomUUID(),
    invitation_id: cardId,
    guest_name: 'Special Guest & Family',
    phone: null,
    email: null,
    unique_token: guestToken,
    max_allowed_guests: 4,
    group_tag: 'VIP Family',
    link_opened_at: null,
    created_at: nowIso,
  });

  return createdCard as Invitation;
}
