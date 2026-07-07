'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { CargoReport } from './CargoReport';
import { calculateCargoReportsBalance, filterReportsByMonth } from './cargoReportsBalance';
import type { ReportSearchFilters } from './cargoReportsSearch';
import { EMPTY_SEARCH_FILTERS, hasActiveFilters, searchReports } from './cargoReportsSearch';
import { loadCargoReports, saveCargoReports } from './cargoReportsStorage';
import { DayNavigator } from './DayNavigator';
import { MonthlyBalance } from './MonthlyBalance';
import { todayIsoDate } from './reportDates';
import { ReportDrawer } from './ReportDrawer';
import { ReportForm } from './ReportForm';
import { ReportsSearch } from './ReportsSearch';
import { ReportsTable } from './ReportsTable';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const ReportsBoard = () => {
  const t = useTranslations('ReportsBoard');
  const [reports, setReports] = useState<CargoReport[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ReportSearchFilters>(EMPTY_SEARCH_FILTERS);

  useEffect(() => {
    setReports(loadCargoReports());
  }, []);

  const recordDays = [...new Set(reports.map((report) => report.date))].toSorted();
  const latestDay = recordDays.at(-1);
  const activeDay =
    selectedDay && recordDays.includes(selectedDay) ? selectedDay : (latestDay ?? todayIsoDate());
  const dayIndex = recordDays.indexOf(activeDay);
  const previousDay = dayIndex > 0 ? recordDays[dayIndex - 1] : undefined;
  const nextDay =
    dayIndex !== -1 && dayIndex < recordDays.length - 1 ? recordDays[dayIndex + 1] : undefined;

  const handleAdd = (report: CargoReport) => {
    setReports((previous) => {
      const next = [...previous, report];
      saveCargoReports(next);
      return next;
    });
    setSelectedDay(report.date);
    setDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    setReports((previous) => {
      const next = previous.filter((report) => report.id !== id);
      saveCargoReports(next);
      return next;
    });
  };

  const searchActive = hasActiveFilters(filters);
  const searchResults = searchActive ? searchReports(reports, filters) : [];
  const dayReports = reports.filter((report) => report.date === activeDay);
  const dayBalance = calculateCargoReportsBalance(dayReports);
  const monthBalance = calculateCargoReportsBalance(
    filterReportsByMonth(reports, activeDay.slice(0, 7)),
  );
  const overallTotal = calculateCargoReportsBalance(reports).totalFreightValue;
  const resultsTotal = calculateCargoReportsBalance(searchResults).totalFreightValue;

  return (
    <div className="flex flex-col gap-6">
      {!searchActive && (
        <DayNavigator
          day={activeDay}
          loadCount={dayBalance.loadCount}
          dayTotal={dayBalance.totalFreightValue}
          hasPrevious={previousDay !== undefined}
          hasNext={nextDay !== undefined}
          onPrevious={() => {
            if (previousDay) {
              setSelectedDay(previousDay);
            }
          }}
          onNext={() => {
            if (nextDay) {
              setSelectedDay(nextDay);
            }
          }}
          onLatest={() => {
            if (latestDay) {
              setSelectedDay(latestDay);
            }
          }}
        />
      )}

      <section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <ReportsSearch filters={filters} onFiltersChange={setFilters} />
        </div>
        <button
          type="button"
          className="rounded-lg bg-[#f5c518] px-4 py-2 font-semibold text-black shadow-sm transition-colors hover:bg-[#e3b512]"
          onClick={() => {
            setDrawerOpen(true);
          }}
        >
          {`+ ${t('form_title')}`}
        </button>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {searchActive && (
          <p className="mb-4 text-sm text-gray-600">
            {`${t('search_results')}: ${searchResults.length} · ${currencyFormatter.format(resultsTotal)}`}
          </p>
        )}
        <ReportsTable reports={searchActive ? searchResults : dayReports} onDelete={handleDelete} />
      </section>

      {!searchActive && <MonthlyBalance monthBalance={monthBalance} overallTotal={overallTotal} />}

      <ReportDrawer
        open={drawerOpen}
        title={t('form_title')}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <ReportForm onAdd={handleAdd} />
      </ReportDrawer>
    </div>
  );
};
