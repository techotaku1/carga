import { enUS, esES } from '@clerk/localizations';
import type { LocalizationResource } from '@clerk/shared/types';
import type { LocalePrefixMode } from 'next-intl/routing';

/** Locale prefix strategy for next-intl routing. */
const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Nextjs Starter',
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    localePrefix,
  },
};

const supportedLocales: Record<string, LocalizationResource> = {
  es: esES,
  en: enUS,
};

export const ClerkLocalizations = {
  defaultLocale: esES,
  supportedLocales,
};
