import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eternal-vowz.onrender.com';

  const publicRoutes = [
    '/',
    '/about',
    '/guide',
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

  return {
    rules: [
      // 1. Block aggressive scrapers entirely
      {
        userAgent: ['Bytespider', 'ByteDance'],
        disallow: ['/'],
      },
      // 2. Allow verified AI crawlers only on public content (protect customer /invite/ cards)
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Amazonbot',
          'Applebot-Extended',
          'cohere-ai',
          'CCBot',
        ],
        allow: publicRoutes,
        disallow: ['/dashboard', '/editor/', '/api/', '/auth/', '/invite/'],
      },
      // 3. Default search engines rule
      {
        userAgent: '*',
        allow: publicRoutes,
        disallow: ['/dashboard', '/editor/', '/api/', '/auth/', '/invite/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
