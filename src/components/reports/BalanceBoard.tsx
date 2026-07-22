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
  dailyBalances,
  dailyBalancesForMonth,
  monthlyBalances,
  monthlyBalancesForYear,
  monthsWithReports,
  yearsWithReports,
} from './cargoReportsBalance';
import type { ReportSearchFilters } from './cargoReportsSearch';
import { EMPTY_SEARCH_FILTERS, hasActiveFilters, searchReports } from './cargoReportsSearch';
import { DashboardSkeleton } from './DashboardSkeleton';
import { PeriodBalanceTable } from './PeriodBalanceTable';
import { todayIsoDate } from './reportDates';
import { ReportsSearch } from './ReportsSearch';

type BalanceMode = 'daily' | 'monthly';

const MODES: BalanceMode[] = ['daily', 'monthly'];

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
  const [mode, setMode] = useState<BalanceMode>('daily');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportSearchFilters>(EMPTY_SEARCH_FILTERS);

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
    return <DashboardSkeleton label={tDashboard('loading_label')} />;
  }

  const searchActive = hasActiveFilters(filters);
  const filteredReports = searchActive ? searchReports(reports, filters) : reports;

  const months = monthsWithReports(reports);
  const years = yearsWithReports(reports);
  const activeMonth =
    selectedMonth && months.includes(selectedMonth)
      ? selectedMonth
      : (months.at(-1) ?? todayIsoDate().slice(0, 7));
  const activeYear =
    selectedYear && years.includes(selectedYear)
      ? selectedYear
      : (years.at(-1) ?? todayIsoDate().slice(0, 4));

  const monthDateFormatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const monthShortFormatter = new Intl.DateTimeFormat(locale, { month: 'long' });
  const dayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const formatMonth = (period: string) =>
    monthDateFormatter.format(new Date(`${period}-01T00:00:00`));
  const formatMonthName = (period: string) =>
    monthShortFormatter.format(new Date(`${period}-01T00:00:00`));
  const formatDay = (period: string) => dayFormatter.format(new Date(`${period}T00:00:00`));

  const isDaily = mode === 'daily';
  // Top totals show the all-time balance, or the filtered set when searching.
  const totalsBalance = calculateCargoReportsBalance(searchActive ? filteredReports : reports);

  const getEntries = () => {
    if (isDaily) {
      return searchActive
        ? dailyBalances(filteredReports)
        : dailyBalancesForMonth(reports, activeMonth);
    }

    return searchActive
      ? monthlyBalances(filteredReports)
      : monthlyBalancesForYear(reports, activeYear);
  };

  const previousMonth = shiftInList(months, activeMonth, -1);
  const nextMonth = shiftInList(months, activeMonth, 1);
  const previousYear = shiftInList(years, activeYear, -1);
  const nextYear = shiftInList(years, activeYear, 1);

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

      <BalanceTotals balance={totalsBalance} />

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <ReportsSearch filters={filters} onFiltersChange={setFilters} />
      </section>

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
        ) : (
          <BalanceNavigator
            eyebrow={t('monthly_eyebrow')}
            hasNext={nextYear !== undefined}
            hasPrevious={previousYear !== undefined}
            label={activeYear}
            nextLabel={t('next_year')}
            onNext={() => {
              if (nextYear) {
                setSelectedYear(nextYear);
              }
            }}
            onPrevious={() => {
              if (previousYear) {
                setSelectedYear(previousYear);
              }
            }}
            previousLabel={t('previous_year')}
          />
        ))}

      <PeriodBalanceTable
        emptyLabel={t('empty_balance')}
        entries={getEntries()}
        formatPeriod={isDaily ? formatDay : formatMonthName}
        periodHeader={isDaily ? t('column_day') : t('column_month')}
      />
    </div>
  );
};
