import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eternal-vowz.onrender.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/google9d1eb35adfd63784.html',
          '/invite/',
          '/contact',
          '/privacy',
          '/terms',
          '/refund',
          '/shipping',
          '/login',
        ],
        disallow: ['/dashboard', '/editor/', '/api/', '/auth/'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Amazonbot', 'Applebot-Extended'],
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/invite/',
          '/contact',
          '/privacy',
          '/terms',
          '/refund',
          '/shipping',
        ],
        disallow: ['/dashboard', '/editor/', '/api/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
