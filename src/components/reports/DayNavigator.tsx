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
  dayNet: number;
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
    'flex h-full w-16 items-center justify-center rounded-lg border border-white/15 text-[#f7f5ef] transition-colors hover:border-[#f5c518] hover:text-[#f5c518] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-[#f7f5ef]';

  return (
    <section className="grid gap-4 rounded-xl bg-[#14161b] px-5 py-4 text-[#f7f5ef] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-stretch gap-2 sm:grid-cols-[auto_minmax(18rem,1fr)_auto]">
        <button
          type="button"
          aria-label={t('day_previous')}
          className={navButtonClass}
          disabled={!props.hasPrevious}
          onClick={props.onPrevious}
        >
          <svg
            aria-hidden="true"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M15 18 9 12l6-6" />
          </svg>
        </button>
        <div className="flex min-w-0 flex-col justify-center rounded-lg border border-white/15 px-4 py-2 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#f5c518] uppercase">
            {t('day_eyebrow')}
          </p>
          <p className="text-xl leading-tight font-semibold capitalize sm:text-2xl">{dayLabel}</p>
        </div>
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            aria-label={t('day_next')}
            className={navButtonClass}
            disabled={!props.hasNext}
            onClick={props.onNext}
          >
            <svg
              aria-hidden="true"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium transition-colors hover:border-[#f5c518] hover:text-[#f5c518] disabled:cursor-not-allowed disabled:opacity-30"
            disabled={!props.hasNext}
            onClick={props.onLatest}
          >
            {t('day_latest')}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div>
          <p className="text-xs text-[#f7f5ef]/60">{t('day_loads')}</p>
          <p className="text-xl font-bold">{props.loadCount}</p>
        </div>
        <div>
          <p className="text-xs text-[#f7f5ef]/60">{t('day_net')}</p>
          <p className="text-xl font-bold text-[#f5c518] tabular-nums">
            {currencyFormatter.format(props.dayNet)}
          </p>
        </div>
      </div>
    </section>
  );
};
