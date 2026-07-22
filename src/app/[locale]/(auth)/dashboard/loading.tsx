import { getTranslations } from 'next-intl/server';
import { DashboardSkeleton } from '@/components/reports/DashboardSkeleton';

export default async function DashboardLoading() {
  const t = await getTranslations('Dashboard');

  return (
    <div className="py-5">
      <DashboardSkeleton label={t('loading_label')} />
    </div>
  );
}
