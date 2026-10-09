import type { MetadataRoute } from 'next';
import { cacheLife } from 'next/cache';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl, getI18nPath } from '@/utils/Helpers';

// Cached so the sitemap stays prerendered; `lastModified` refreshes daily instead of per request.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache';

  cacheLife('days');

  const baseUrl = getBaseUrl();

  const routes = ['', '/about', '/counter', '/portfolio'];

  // Generate portfolio detail pages
  const portfolioRoutes = Array.from({ length: 6 }, (_, i) => `/portfolio/${i}`);
  const allRoutes = [...routes, ...portfolioRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales
          .filter((locale) => locale !== routing.defaultLocale)
          .map((locale) => [locale, `${baseUrl}${getI18nPath(route, locale)}`]),
      ),
    },
  }));
}
