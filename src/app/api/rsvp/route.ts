import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit, getClientIp, sanitizeText } from '@/lib/security';
import { RsvpStatus } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const message = sanitizeText(body.message, 500);
    const mealChoice = sanitizeText(body.meal_choice, 100);

    const status: RsvpStatus =
      body.status === 'attending' || body.status === 'declined'
        ? body.status
        : 'pending';

    const headcount =
      status === 'attending'
        ? Math.max(1, Math.min(20, Math.floor(Number(body.headcount) || 1)))
        : 0;

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service is temporarily unavailable.' },
        { status: 503 }
      );
    }

    let targetGuestId = guestId;

    // If existing guest ID is provided, verify it exists
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
      const uniqueToken = `${tokenSlug}-${crypto.randomBytes(2).toString('hex')}`;
      const nowIso = new Date().toISOString();

      const { data: newGuest, error: guestInsertError } = await supabaseAdmin
        .from('ev_card_guests')
        .insert({
          id: newId,
          invitation_id: invitationId,
          guest_name: guestName,
          phone: phone || null,
          unique_token: uniqueToken,
          max_allowed_guests: Math.max(headcount, 2),
          group_tag: 'General RSVP',
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
    } else if (guestName && phone) {
      // Update existing guest contact if provided
      await supabaseAdmin
        .from('ev_card_guests')
        .update({
          guest_name: guestName,
          phone: phone || null,
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
