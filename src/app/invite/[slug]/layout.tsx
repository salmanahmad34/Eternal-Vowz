import type { Metadata } from 'next';
import { DataService } from '@/lib/data-service';
import { SITE_CONFIG } from '@/config/site';

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

const THEME_PREVIEW_MAP: Record<string, { name: string; heroImg: string }> = {
  'pearl-veil': {
    name: 'Pearl Botanical Veil',
    heroImg: '/assets/pearl-veil/hero-palace-corridor.jpg',
  },
  'blush-floral': {
    name: 'Shahi Palace Gates',
    heroImg: '/assets/shahi-gold/hero-mountain-pavilion.jpg',
  },
  'tuscan-sunset': {
    name: 'Tuscan Sunset Rose',
    heroImg: '/assets/tuscan-haveli/hero-haveli-courtyard.jpg',
  },
  'royal-emerald': {
    name: 'Royal Mughal Arch',
    heroImg: '/assets/mughal-silk/hero-mughal-courtyard.jpg',
  },
  'midnight-minimalist': {
    name: 'Celestial Starlight',
    heroImg: '/assets/celestial-box/hero-celestial-stage.jpg',
  },
  'kashmir-lotus': {
    name: 'Kashmir Chinar Lotus',
    heroImg: '/assets/kashmir-lotus/hero-kashmir-lotus.gif',
  },
  'shahi-crimson': {
    name: 'Shahi Crimson & Zari',
    heroImg: '/assets/shahi-crimson/hero-shahi-crimson.jpg',
  },
  'jodhpur-sapphire': {
    name: 'Jodhpur Sapphire Darbar',
    heroImg: '/assets/jodhpur-sapphire/hero-jodhpur-sapphire.jpg',
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params?.slug || 'wedding';
  const baseUrl = SITE_CONFIG.url;

  const inv = await DataService.getInvitationBySlug(slug);

  if (!inv) {
    return {
      title: 'Royal Wedding Invitation | Eternal Vowz',
      description: 'You are cordially invited to celebrate this sacred union. Tap to open your 3D digital invitation.',
      robots: {
        index: false,
        follow: false,
        nocache: true,
        noarchive: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
      alternates: {
        canonical: null,
      },
      openGraph: {
        title: 'Royal Wedding Invitation | Eternal Vowz',
        description: 'You are cordially invited to celebrate this sacred union. Tap to open your 3D digital invitation.',
        images: [`${baseUrl}/assets/pearl-veil/hero-palace-corridor.jpg`],
      },
    };
  }

  const couple = inv.design_config?.couple_names;
  const partner1 = couple?.partner1?.trim() || 'Bride';
  const partner2 = couple?.partner2?.trim() || 'Groom';
  const coupleText = `${partner1} weds ${partner2}`;

  // Attractive title with royal names
  const title = `Royal Wedding Invitation • ${coupleText} | Eternal Vowz`;

  // Attractive date and venue
  const eventDateObj = inv.event_date ? new Date(inv.event_date) : null;
  const formattedDate =
    eventDateObj && !isNaN(eventDateObj.getTime())
      ? eventDateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '';
  const venueCity = inv.venue_details?.city || inv.venue_details?.venue_name || '';

  const description = `✨ We cordially invite you and your family to celebrate the blessed wedding union of ${coupleText}${
    formattedDate ? ` on ${formattedDate}` : ''
  }${venueCity ? ` at ${venueCity}` : ''}. Tap to open your personal 3D royal interactive invitation & submit RSVP! 💌`;

  // Determine card hero image
  const themeId = inv.theme_id || 'tuscan-sunset';
  const themeMeta = THEME_PREVIEW_MAP[themeId] || THEME_PREVIEW_MAP['tuscan-sunset'];
  const rawImage =
    inv.design_config?.banner_image_url ||
    themeMeta.heroImg;

  const absoluteImageUrl = rawImage.startsWith('http')
    ? rawImage
    : `${baseUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

  const pageUrl = `${baseUrl}/invite/${slug}`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
    alternates: {
      canonical: null,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Eternal Vowz (E&V)',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `Royal Wedding Invitation • ${coupleText}`,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
  };
}

export default function InviteSlugLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
