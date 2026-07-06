'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/libs/I18nNavigation';
import { routing } from '@/libs/I18nRouting';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <select
      defaultValue={locale}
      onChange={(event) => {
        router.push(pathname, { locale: event.target.value });
        router.refresh();
      }}
      className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm font-medium text-[#f7f5ef] transition-colors hover:border-[#f5c518]"
      aria-label="lang-switcher"
    >
      {routing.locales.map((option) => (
        <option key={option} value={option} className="text-gray-900">
          {option.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
