import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { Link } from '@/libs/I18nNavigation';

const UserNameSkeleton = () => (
  <span className="hidden h-4 w-24 animate-pulse rounded bg-[#f7f5ef]/20 sm:inline-block" />
);

/**
 * Renders the signed-in user's display name; reads the session, so it streams inside Suspense.
 * @returns The display name, or nothing when the user has none.
 */
const UserName = async () => {
  const user = await currentUser();
  const displayName = user?.fullName ?? user?.username ?? '';

  if (!displayName) {
    return null;
  }

  return <span className="hidden text-sm font-medium text-[#f7f5ef] sm:inline">{displayName}</span>;
};

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
        <div className="mx-auto flex h-14 max-w-[100rem] items-center justify-between px-3">
          <Link href="/dashboard/" className="flex items-center gap-3">
            <span className="rounded-sm border border-black/60 bg-[#f5c518] px-2 py-0.5 font-mono text-sm font-bold tracking-[0.15em] text-black">
              CARGA
            </span>
            <span className="hidden text-sm font-medium text-[#f7f5ef]/70 sm:inline">
              {t('header_subtitle')}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Suspense fallback={<UserNameSkeleton />}>
              <UserName />
            </Suspense>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[100rem] px-3 py-6">{props.children}</main>
    </div>
  );
}
