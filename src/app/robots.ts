import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.url;

  const publicRoutes = [
    '/',
    '/about',
    '/guide',
    '/demo',
    '/llms.txt',
    '/llms-full.txt',
    '/google9d1eb35adfd63784.html',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
    '/shipping',
    '/login',
  ];

  const protectedRoutes = ['/dashboard', '/editor/', '/api/', '/auth/', '/invite/'];

  return {
    rules: [
      // 1. Strictly block aggressive scrapers & indiscriminate crawlers
      {
        userAgent: ['Bytespider', 'ByteDance', 'CCBot'],
        disallow: ['/'],
      },
      // 2. Allow verified AI research crawlers only on public informational pages
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Amazonbot',
          'Applebot-Extended',
          'cohere-ai',
        ],
        allow: publicRoutes,
        disallow: protectedRoutes,
      },
      // 3. Search engines (Googlebot, Bingbot, default *)
      {
        userAgent: ['Googlebot', 'Bingbot', '*'],
        allow: publicRoutes,
        disallow: protectedRoutes,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
