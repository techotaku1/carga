'use client';

import { useLocale, useTranslations } from 'next-intl';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const DayNavigator = (props: {
  day: string;
  loadCount: number;
  dayTotal: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onLatest: () => void;
}) => {
  const t = useTranslations('ReportsBoard');
  const locale = useLocale();
  const dayLabel = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${props.day}T00:00:00`));

  const navButtonClass =
    'flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-xl text-[#f7f5ef] transition-colors hover:border-[#f5c518] hover:text-[#f5c518] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-[#f7f5ef]';

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-[#14161b] px-5 py-4 text-[#f7f5ef] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={t('day_previous')}
          className={navButtonClass}
          disabled={!props.hasPrevious}
          onClick={props.onPrevious}
        >
          ‹
        </button>
        <div className="min-w-0 px-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#f5c518] uppercase">
            {t('day_eyebrow')}
          </p>
          <p className="text-lg leading-tight font-semibold capitalize">{dayLabel}</p>
        </div>
        <button
          type="button"
          aria-label={t('day_next')}
          className={navButtonClass}
          disabled={!props.hasNext}
          onClick={props.onNext}
        >
          ›
        </button>
        <button
          type="button"
          className="ml-1 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium transition-colors hover:border-[#f5c518] hover:text-[#f5c518] disabled:cursor-not-allowed disabled:opacity-30"
          disabled={!props.hasNext}
          onClick={props.onLatest}
        >
          {t('day_latest')}
        </button>
      </div>

      <div className="flex items-center gap-8">
        <div>
          <p className="text-xs text-[#f7f5ef]/60">{t('day_loads')}</p>
          <p className="text-xl font-bold">{props.loadCount}</p>
        </div>
        <div>
          <p className="text-xs text-[#f7f5ef]/60">{t('day_total')}</p>
          <p className="text-xl font-bold text-[#f5c518]">
            {currencyFormatter.format(props.dayTotal)}
          </p>
        </div>
      </div>
    </section>
  );
};
