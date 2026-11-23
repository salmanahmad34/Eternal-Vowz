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
      },
    };
  }

  const couple = inv.design_config?.couple_names;
  const partner1 = couple?.partner1?.trim() || 'Bride';
  const partner2 = couple?.partner2?.trim() || 'Groom';
  const coupleText = `${partner1} weds ${partner2}`;

  const title = `Royal Wedding Invitation • ${coupleText} | Eternal Vowz`;

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

  const description = formattedDate
    ? `You are cordially invited to celebrate the Nikah and wedding ceremony of ${coupleText} on ${formattedDate}${
        venueCity ? ` in ${venueCity}` : ''
      }. Open to experience the 3D royal opening.`
    : `You are cordially invited to celebrate the Nikah & wedding of ${coupleText}. Tap to open.`;

  const themeMeta = THEME_PREVIEW_MAP[inv.theme_id] || {
    name: 'Royal Wedding Suite',
    heroImg: '/assets/kashmir-lotus/hero-kashmir-lotus.jpg',
  };

  const previewImage = `${baseUrl}${themeMeta.heroImg}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${slug}`,
      siteName: 'Eternal Vowz',
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: `${coupleText} Wedding Invitation`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [previewImage],
    },
  };
}

export default function DirectCoupleLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
