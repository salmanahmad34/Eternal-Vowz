import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/server-auth';
import { checkRateLimit, getClientIp, sanitizeText } from '@/lib/security';
import { RsvpStatus } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service unavailable.' },
        { status: 503 }
      );
    }

    const linkedUids = [authUser.id];
    const uemail = authUser.email?.toLowerCase().trim();
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

    const { data: cards, error: cardsErr } = await supabaseAdmin
      .from('ev_cards')
      .select('id')
      .in('user_id', linkedUids);

    if (cardsErr) {
      console.error('[RSVP GET] Error querying cards:', cardsErr.message);
      return NextResponse.json({ error: 'Failed to load cards.' }, { status: 500 });
    }

    const cardIds = (cards || []).map((c: { id: string }) => c.id);
    if (cardIds.length === 0) {
      return NextResponse.json({ success: true, guests: [] });
    }

    const { data: guests, error: guestsErr } = await supabaseAdmin
      .from('ev_card_guests')
      .select('*, ev_card_rsvps(*)')
      .in('invitation_id', cardIds)
      .order('created_at', { ascending: false });

    if (guestsErr) {
      console.error('[RSVP GET] Error loading guests:', guestsErr.message);
      return NextResponse.json({ error: 'Failed to load RSVPs.' }, { status: 500 });
    }

    const formatted = (guests || []).map(
      (g: Record<string, unknown> & { ev_card_rsvps?: Record<string, unknown>[] | Record<string, unknown> }) => {
        const rawRsvp = Array.isArray(g.ev_card_rsvps) ? g.ev_card_rsvps[0] : g.ev_card_rsvps;
        const clean = { ...g };
        delete clean.ev_card_rsvps;
        return {
          ...clean,
          rsvp: rawRsvp || null,
        };
      }
    );

    return NextResponse.json({ success: true, guests: formatted });
  } catch (err) {
    console.error('[RSVP GET] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(clientIp, 'public-rsvp-submit', 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many RSVP requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const invitationId = typeof body.invitation_id === 'string' ? body.invitation_id.trim() : '';
    const guestId = typeof body.guest_id === 'string' ? body.guest_id.trim() : '';
    const guestName = sanitizeText(body.guest_name, 100) || 'Honored Guest';
    const phone = sanitizeText(body.phone, 30);
    const email = sanitizeText(body.email, 120);
    const message = sanitizeText(body.message, 800);
    const mealChoice = sanitizeText(body.meal_choice, 120);

    const status: RsvpStatus =
      body.status === 'attending' || body.status === 'declined'
        ? body.status
        : 'pending';

    const headcount =
      status === 'attending'
        ? Math.max(1, Math.min(20, Math.floor(Number(body.headcount) || 1)))
        : 0;

    // Non-UUID invitation IDs (e.g. unsaved drafts or unseeded showcase demos) succeed gracefully in preview
    if (invitationId && !UUID_REGEX.test(invitationId)) {
      return NextResponse.json({
        success: true,
        demo: true,
        guest_id: guestId || `demo-guest-${Date.now()}`,
        status,
        headcount,
        message,
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service is temporarily unavailable.' },
        { status: 503 }
      );
    }

    let targetGuestId = guestId && UUID_REGEX.test(guestId) ? guestId : '';

    // Verify existing guest ID if provided
    if (targetGuestId) {
      const { data: existingGuest } = await supabaseAdmin
        .from('ev_card_guests')
        .select('id, invitation_id')
        .eq('id', targetGuestId)
        .maybeSingle();

      if (!existingGuest) {
        targetGuestId = '';
      }
    }

    // Check if the card exists in ev_cards (if not, e.g. showcase sample ID, return clean demo success)
    if (!targetGuestId && invitationId) {
      const { data: cardExists } = await supabaseAdmin
        .from('ev_cards')
        .select('id')
        .eq('id', invitationId)
        .maybeSingle();

      if (!cardExists) {
        return NextResponse.json({
          success: true,
          demo: true,
          guest_id: `demo-guest-${Date.now()}`,
          status,
          headcount,
          message,
        });
      }
    }

    // If no existing guest, create a new guest record under this invitation
    if (!targetGuestId) {
      if (!invitationId) {
        return NextResponse.json(
          { error: 'Invitation ID is required to submit an RSVP.' },
          { status: 400 }
        );
      }

      const newId = crypto.randomUUID();
      const tokenSlug = guestName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'guest';
      const uniqueToken = `${tokenSlug}-${crypto.randomBytes(3).toString('hex')}`;
      const nowIso = new Date().toISOString();

      const { data: newGuest, error: guestInsertError } = await supabaseAdmin
        .from('ev_card_guests')
        .insert({
          id: newId,
          invitation_id: invitationId,
          guest_name: guestName,
          phone: phone || null,
          email: email || null,
          unique_token: uniqueToken,
          max_allowed_guests: Math.max(headcount, 2),
          group_tag: 'RSVP Form',
          link_opened_at: nowIso,
          created_at: nowIso,
        })
        .select('id')
        .single();

      if (guestInsertError || !newGuest) {
        console.error('[RSVP API] Error creating guest:', guestInsertError?.message);
        return NextResponse.json(
          { error: 'Failed to record guest information.' },
          { status: 500 }
        );
      }

      targetGuestId = newGuest.id;
    } else {
      // Update existing guest details
      await supabaseAdmin
        .from('ev_card_guests')
        .update({
          guest_name: guestName,
          ...(phone ? { phone } : {}),
          ...(email ? { email } : {}),
        })
        .eq('id', targetGuestId);
    }

    // Upsert the RSVP record into ev_card_rsvps
    const nowIso = new Date().toISOString();
    const rsvpPayload = {
      guest_id: targetGuestId,
      status,
      headcount,
      meal_choice: mealChoice || null,
      message: message || null,
      updated_at: nowIso,
    };

    const { error: rsvpError } = await supabaseAdmin
      .from('ev_card_rsvps')
      .upsert(rsvpPayload, { onConflict: 'guest_id' });

    if (rsvpError) {
      console.error('[RSVP API] Error saving RSVP:', rsvpError.message);
      return NextResponse.json(
        { error: 'Failed to save RSVP response.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      guest_id: targetGuestId,
      status,
      headcount,
      meal_choice: mealChoice || null,
      message,
    });
  } catch (err) {
    console.error('[RSVP API] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing RSVP.' },
      { status: 500 }
    );
  }
}
