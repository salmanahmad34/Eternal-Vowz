import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eternal-vowz.onrender.com';
  const now = new Date();

  const routes = [
    '',
    '/login',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
    '/shipping',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : 0.7,
  }));
}
