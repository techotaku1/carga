'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import { Link } from '@/libs/I18nNavigation';
import { logger } from '@/libs/Logger';
import type { CargoReport } from './CargoReport';
import {
  createCargoReport,
  deleteCargoReport,
  listCargoReports,
  updateCargoReport,
} from './cargoReportsActions';
import { calculateCargoReportsBalance } from './cargoReportsBalance';
import type { ReportSearchFilters } from './cargoReportsSearch';
import { EMPTY_SEARCH_FILTERS, hasActiveFilters, searchReports } from './cargoReportsSearch';
import { DashboardSkeleton } from './DashboardSkeleton';
import { DayNavigator } from './DayNavigator';
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

const removeReportById = (reports: CargoReport[], id: string) =>
  reports.filter((report) => report.id !== id);

const replaceReport = (reports: CargoReport[], report: CargoReport) =>
  reports.map((existing) => (existing.id === report.id ? report : existing));

export const ReportsBoard = () => {
  const t = useTranslations('ReportsBoard');
  const tDashboard = useTranslations('Dashboard');
  const [reports, setReports] = useState<CargoReport[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<CargoReport | null>(null);
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

  const recordDays = [...new Set(reports.map((report) => report.date))].toSorted();
  const latestDay = recordDays.at(-1);
  const activeDay =
    selectedDay && recordDays.includes(selectedDay) ? selectedDay : (latestDay ?? todayIsoDate());
  const dayIndex = recordDays.indexOf(activeDay);
  const previousDay = dayIndex > 0 ? recordDays[dayIndex - 1] : undefined;
  const nextDay =
    dayIndex !== -1 && dayIndex < recordDays.length - 1 ? recordDays[dayIndex + 1] : undefined;

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingReport(null);
  };

  const createReport = (report: CargoReport) => {
    setReports((previous) => [...previous, report]);

    const persistReport = async () => {
      try {
        await createCargoReport(report);
      } catch (error) {
        setReports((previous) => removeReportById(previous, report.id));
        logger.error(`Failed to create cargo report: ${String(error)}`);
      }
    };

    void persistReport();
  };

  const editReport = (report: CargoReport, previousReport: CargoReport) => {
    setReports((previous) => replaceReport(previous, report));

    const persistReport = async () => {
      try {
        await updateCargoReport(report);
      } catch (error) {
        setReports((previous) => replaceReport(previous, previousReport));
        logger.error(`Failed to update cargo report: ${String(error)}`);
      }
    };

    void persistReport();
  };

  const handleSubmitReport = (report: CargoReport) => {
    const previousReport = reports.find((existing) => existing.id === report.id);
    setSelectedDay(report.date);
    closeDrawer();

    if (previousReport) {
      editReport(report, previousReport);
    } else {
      createReport(report);
    }
  };

  const handleDelete = (id: string) => {
    const removedReport = reports.find((report) => report.id === id);
    setReports((previous) => removeReportById(previous, id));

    const removeReport = async () => {
      try {
        await deleteCargoReport(id);
      } catch (error) {
        if (removedReport) {
          setReports((previous) => [...previous, removedReport]);
        }

        logger.error(`Failed to delete cargo report: ${String(error)}`);
      }
    };

    void removeReport();
  };

  if (!hydrated) {
    return <DashboardSkeleton label={tDashboard('loading_label')} />;
  }

  const searchActive = hasActiveFilters(filters);
  const searchResults = searchActive ? searchReports(reports, filters) : [];
  const dayReports = reports.filter((report) => report.date === activeDay);
  const dayBalance = calculateCargoReportsBalance(dayReports);
  const resultsProfit = calculateCargoReportsBalance(searchResults).totalProfit;

  return (
    <div className="flex flex-col gap-6">
      {!searchActive && (
        <DayNavigator
          day={activeDay}
          loadCount={dayBalance.loadCount}
          dayProfit={dayBalance.totalProfit}
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
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/balance/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#0c2434] px-4 py-2 font-semibold text-[#0c2434] shadow-sm transition-colors hover:bg-[#0c2434] hover:text-[#f7f5ef]"
          >
            <FiBarChart2 aria-hidden="true" />
            {t('view_balance')}
          </Link>
          <button
            type="button"
            className="rounded-lg bg-[#f5c518] px-4 py-2 font-semibold text-black shadow-sm transition-colors hover:bg-[#e3b512]"
            onClick={() => {
              setEditingReport(null);
              setDrawerOpen(true);
            }}
          >
            {`+ ${t('form_title')}`}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {searchActive && (
          <p className="mb-4 text-sm text-gray-600">
            {`${t('search_results')}: ${searchResults.length} · ${currencyFormatter.format(resultsProfit)}`}
          </p>
        )}
        <ReportsTable
          reports={searchActive ? searchResults : dayReports}
          onDelete={handleDelete}
          onEdit={(report) => {
            setEditingReport(report);
            setDrawerOpen(true);
          }}
        />
      </section>

      <ReportDrawer
        open={drawerOpen}
        title={editingReport ? t('edit_report_title') : t('form_title')}
        onClose={closeDrawer}
      >
        <ReportForm
          key={editingReport?.id ?? 'new'}
          editingReport={editingReport}
          onSubmit={handleSubmitReport}
        />
      </ReportDrawer>
    </div>
  );
};
