import { getTranslations } from 'next-intl/server';
import { BalanceBoardSkeleton } from '@/components/reports/DashboardSkeleton';

export default async function BalanceLoading() {
  const t = await getTranslations('Dashboard');

  return (
    <div className="py-5">
      <BalanceBoardSkeleton label={t('loading_label')} />
    </div>
  );
}
