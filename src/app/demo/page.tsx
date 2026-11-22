'use client';

import React, { Suspense } from 'react';
import { INITIAL_DEMO_INVITATION } from '@/lib/data-service';
import { GuestWithRsvp } from '@/types/database';
import EnvelopeExperience from '@/components/envelope/EnvelopeExperience';
import { Loader2 } from 'lucide-react';

export default function DemoPage() {
  const demoGuest: GuestWithRsvp = {
    id: 'demo-sample-guest',
    invitation_id: INITIAL_DEMO_INVITATION.id,
    guest_name: 'Honored Guest & Family',
    unique_token: 'demo-guest',
    max_allowed_guests: 2,
    created_at: new Date().toISOString(),
  };

  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] paper-texture">
          <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mb-3" />
          <span className="font-serif italic text-stone-600 text-sm">
            Opening 3D royal invitation demo...
          </span>
        </div>
      }
    >
      <EnvelopeExperience invitation={INITIAL_DEMO_INVITATION} guest={demoGuest} />
    </Suspense>
  );
}
