'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import { Invitation, GuestWithRsvp } from '@/types/database';
import EnvelopeExperience from '@/components/envelope/EnvelopeExperience';
import { Loader2 } from 'lucide-react';

function GuestInviteContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = (params?.slug as string) || 'mir-weds-falak';
  const guestToken = searchParams?.get('guest') || null;

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [guest, setGuest] = useState<GuestWithRsvp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const inv = await DataService.getInvitationBySlug(slug);
        setInvitation(inv);

        if (guestToken && inv) {
          const foundGuest = await DataService.getGuestByToken(guestToken, inv.id);
          if (foundGuest) {
            setGuest(foundGuest);
            // Read receipt: Mark link opened
            DataService.markLinkOpened(foundGuest.id);
          }
        }
      } catch (err) {
        console.error('Error loading invite page:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, guestToken]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] paper-texture">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mb-3" />
        <span className="font-serif italic text-stone-600 text-sm">
          Preparing your royal invitation...
        </span>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] p-6 text-center">
        <h2 className="font-serif text-3xl text-stone-800 mb-2">Invitation Not Found</h2>
        <p className="font-sans text-sm text-stone-600 max-w-sm mb-6">
          This invitation link might have expired or the slug is incorrect.
        </p>
        <a
          href="/"
          className="px-6 py-2.5 rounded-full bg-stone-900 text-white font-sans text-xs font-semibold uppercase tracking-wider"
        >
          Return Home
        </a>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen">
      <EnvelopeExperience
        invitation={invitation}
        guest={guest}
        autoPlayAudio={true}
      />
    </main>
  );
}

export default function DirectCoupleInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] paper-texture">
          <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mb-3" />
          <span className="font-serif italic text-stone-600 text-sm">
            Unsealing envelope...
          </span>
        </div>
      }
    >
      <GuestInviteContent />
    </Suspense>
  );
}
