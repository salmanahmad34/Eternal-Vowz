import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eternal-vowz.onrender.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/invite/', '/contact', '/privacy', '/terms', '/refund', '/shipping', '/login'],
        disallow: ['/dashboard', '/editor/', '/api/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
