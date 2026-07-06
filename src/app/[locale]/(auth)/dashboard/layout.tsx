import { UserButton } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Link } from '@/libs/I18nNavigation';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'DashboardLayout',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-black/30 bg-[#14161b]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard/" className="flex items-center gap-3">
            <span className="rounded-sm border border-black/60 bg-[#f5c518] px-2 py-0.5 font-mono text-sm font-bold tracking-[0.15em] text-black">
              CARGA
            </span>
            <span className="hidden text-sm font-medium text-[#f7f5ef]/70 sm:inline">
              {t('header_subtitle')}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{props.children}</main>
    </div>
  );
}
