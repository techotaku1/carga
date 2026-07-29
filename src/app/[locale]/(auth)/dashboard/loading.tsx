import { getTranslations } from 'next-intl/server';
import { ReportsBoardSkeleton } from '@/components/reports/DashboardSkeleton';

export default async function DashboardLoading() {
  const t = await getTranslations('Dashboard');

  return (
    <div className="py-5">
      <ReportsBoardSkeleton label={t('loading_label')} />
    </div>
  );
}
