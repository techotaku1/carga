import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BalanceBoard } from '@/components/reports/BalanceBoard';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

type BalancePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: BalancePageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('balance_meta_title'),
  };
}

export default async function BalancePage(props: BalancePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="py-5">
      <BalanceBoard />
    </div>
  );
}
