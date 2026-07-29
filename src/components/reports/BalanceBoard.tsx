'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from '@/libs/I18nNavigation';
import { logger } from '@/libs/Logger';
import { BalanceNavigator } from './BalanceNavigator';
import { BalanceTotals } from './BalanceTotals';
import type { CargoReport } from './CargoReport';
import { listCargoReports } from './cargoReportsActions';
import {
  calculateCargoReportsBalance,
  monthsWithReports,
  reportBalances,
} from './cargoReportsBalance';
import type { ReportSearchFilters } from './cargoReportsSearch';
import { EMPTY_SEARCH_FILTERS, hasActiveFilters, searchReports } from './cargoReportsSearch';
import { BalanceBoardSkeleton } from './DashboardSkeleton';
import { PeriodBalanceTable } from './PeriodBalanceTable';
import { todayIsoDate } from './reportDates';
import { ReportsSearch } from './ReportsSearch';

type BalanceMode = 'daily' | 'monthly';

const MODES: BalanceMode[] = ['monthly', 'daily'];

const shiftInList = (list: string[], current: string, offset: number) => {
  const index = list.indexOf(current);

  return index === -1 ? undefined : list.at(index + offset);
};

export const BalanceBoard = () => {
  const t = useTranslations('ReportsBoard');
  const tDashboard = useTranslations('Dashboard');
  const locale = useLocale();
  const [reports, setReports] = useState<CargoReport[]>([]);
  const [hydrated, setHydrated] = useState(false);
  // The balance opens on the monthly overview; daily is the drill-down.
  const [mode, setMode] = useState<BalanceMode>('monthly');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportSearchFilters>({
    ...EMPTY_SEARCH_FILTERS,
    rangeUnit: 'month',
  });

  useEffect(() => {
    const loadReports = async () => {
      try {
        setReports(await listCargoReports());
      } catch (error) {
        logger.error(`Failed to load cargo reports: ${String(error)}`);
      } finally {
        setHydrated(true);
      }
    };

    void loadReports();
  }, []);

  if (!hydrated) {
    return <BalanceBoardSkeleton label={tDashboard('loading_label')} />;
  }

  const searchActive = hasActiveFilters(filters);
  const filteredReports = searchActive ? searchReports(reports, filters) : reports;

  const days = [
    ...new Set(reports.flatMap((report) => (report.date ? [report.date] : []))),
  ].toSorted();
  const months = monthsWithReports(reports);
  // Each mode opens on the most recent period that actually has a record.
  const activeDay =
    selectedDay && days.includes(selectedDay) ? selectedDay : (days.at(-1) ?? todayIsoDate());
  const activeMonth =
    selectedMonth && months.includes(selectedMonth)
      ? selectedMonth
      : (months.at(-1) ?? todayIsoDate().slice(0, 7));

  const monthLongFormatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const dayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const dayLongFormatter = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formatMonth = (period: string) =>
    monthLongFormatter.format(new Date(`${period}-01T00:00:00`));
  const formatDay = (period: string) => dayFormatter.format(new Date(`${period}T00:00:00`));
  const formatDayLong = (period: string) => dayLongFormatter.format(new Date(`${period}T00:00:00`));

  const isDaily = mode === 'daily';

  // A search overrides the period; otherwise each mode covers its own active period.
  const periodReports = () => {
    if (searchActive) {
      return filteredReports;
    }

    return isDaily
      ? reports.filter((report) => report.date === activeDay)
      : reports.filter((report) => report.date.startsWith(activeMonth));
  };

  // Totals and rows always describe the exact same set of reports.
  const visibleReports = periodReports();
  const totalsBalance = calculateCargoReportsBalance(visibleReports);

  const previousDay = shiftInList(days, activeDay, -1);
  const nextDay = shiftInList(days, activeDay, 1);
  const previousMonth = shiftInList(months, activeMonth, -1);
  const nextMonth = shiftInList(months, activeMonth, 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
          href="/dashboard/"
        >
          <FiArrowLeft aria-hidden="true" />
          {t('back_to_reports')}
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{t('balance_title')}</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {MODES.map((value) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              mode === value
                ? 'bg-[#0c2434] text-[#f7f5ef]'
                : 'border border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
            key={value}
            onClick={() => {
              setMode(value);
            }}
            type="button"
          >
            {value === 'daily' ? t('tab_daily') : t('tab_monthly')}
          </button>
        ))}
      </div>

      {!searchActive &&
        (isDaily ? (
          <BalanceNavigator
            eyebrow={t('daily_eyebrow')}
            hasNext={nextDay !== undefined}
            hasPrevious={previousDay !== undefined}
            label={formatDayLong(activeDay)}
            nextLabel={t('next_day')}
            onNext={() => {
              if (nextDay) {
                setSelectedDay(nextDay);
              }
            }}
            onPrevious={() => {
              if (previousDay) {
                setSelectedDay(previousDay);
              }
            }}
            previousLabel={t('previous_day')}
          />
        ) : (
          <BalanceNavigator
            eyebrow={t('monthly_eyebrow')}
            hasNext={nextMonth !== undefined}
            hasPrevious={previousMonth !== undefined}
            label={formatMonth(activeMonth)}
            nextLabel={t('next_month')}
            onNext={() => {
              if (nextMonth) {
                setSelectedMonth(nextMonth);
              }
            }}
            onPrevious={() => {
              if (previousMonth) {
                setSelectedMonth(previousMonth);
              }
            }}
            previousLabel={t('previous_month')}
          />
        ))}

      <BalanceTotals balance={totalsBalance} />

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <ReportsSearch filters={filters} onFiltersChange={setFilters} />
      </section>

      <PeriodBalanceTable
        emptyLabel={t('empty_balance')}
        entries={reportBalances(visibleReports)}
        formatPeriod={formatDay}
        periodHeader={t('column_day')}
      />
    </div>
  );
};
