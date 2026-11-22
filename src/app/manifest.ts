import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Eternal Vowz (E&V)',
    short_name: 'Eternal Vowz',
    description: 'Bespoke 3D Digital Wedding Invitations & Live RSVP Platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF7F2',
    theme_color: '#291418',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
