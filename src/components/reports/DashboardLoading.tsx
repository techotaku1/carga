'use client';

import { useTranslations } from 'next-intl';
import { BalanceBoardSkeleton, ReportsBoardSkeleton } from './DashboardSkeleton';

/**
 * Route fallback for the reports dashboard.
 * Reads messages from the client provider so the prerendered shell needs no request data.
 * @returns The reports skeleton with its localized loading label.
 */
export const ReportsBoardLoading = () => {
  const t = useTranslations('Dashboard');

  return (
    <div className="py-5">
      <ReportsBoardSkeleton label={t('loading_label')} />
    </div>
  );
};

/**
 * Route fallback for the balance dashboard.
 * Reads messages from the client provider so the prerendered shell needs no request data.
 * @returns The balance skeleton with its localized loading label.
 */
export const BalanceBoardLoading = () => {
  const t = useTranslations('Dashboard');

  return (
    <div className="py-5">
      <BalanceBoardSkeleton label={t('loading_label')} />
    </div>
  );
};
