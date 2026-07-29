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
  setCargoReportPaid,
  updateCargoReport,
} from './cargoReportsActions';
import { calculateCargoReportsBalance, monthsWithReports } from './cargoReportsBalance';
import type { ReportSearchFilters } from './cargoReportsSearch';
import { EMPTY_SEARCH_FILTERS, hasActiveFilters, searchReports } from './cargoReportsSearch';
import { ReportsBoardSkeleton } from './DashboardSkeleton';
import { MonthNavigator } from './MonthNavigator';
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
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
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

  const recordMonths = monthsWithReports(reports);
  const latestMonth = recordMonths.at(-1);
  const activeMonth =
    selectedMonth && recordMonths.includes(selectedMonth)
      ? selectedMonth
      : (latestMonth ?? todayIsoDate().slice(0, 7));
  const monthIndex = recordMonths.indexOf(activeMonth);
  const previousMonth = monthIndex > 0 ? recordMonths[monthIndex - 1] : undefined;
  const nextMonth =
    monthIndex !== -1 && monthIndex < recordMonths.length - 1
      ? recordMonths[monthIndex + 1]
      : undefined;

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
    setSelectedMonth(report.date.slice(0, 7));
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

  const handlePaidChange = async (report: CargoReport, paid: boolean) => {
    setReports((previous) =>
      previous.map((existing) => (existing.id === report.id ? { ...existing, paid } : existing)),
    );

    try {
      await setCargoReportPaid(report.id, paid);
    } catch (error) {
      setReports((previous) =>
        previous.map((existing) =>
          existing.id === report.id ? { ...existing, paid: report.paid } : existing,
        ),
      );
      logger.error(`Failed to update cargo report paid status: ${String(error)}`);
      throw error;
    }
  };

  if (!hydrated) {
    return <ReportsBoardSkeleton label={tDashboard('loading_label')} />;
  }

  const searchActive = hasActiveFilters(filters);
  const searchResults = searchActive ? searchReports(reports, filters) : [];
  const monthReports = reports
    .filter((report) => report.date.startsWith(activeMonth))
    .toSorted((left, right) => left.date.localeCompare(right.date));
  const monthBalance = calculateCargoReportsBalance(monthReports);
  const resultsNet = calculateCargoReportsBalance(searchResults).totalNet;

  return (
    <div className="flex flex-col gap-6">
      {!searchActive && (
        <MonthNavigator
          hasNext={nextMonth !== undefined}
          hasPrevious={previousMonth !== undefined}
          loadCount={monthBalance.loadCount}
          month={activeMonth}
          monthNet={monthBalance.totalNet}
          onLatest={() => {
            if (latestMonth) {
              setSelectedMonth(latestMonth);
            }
          }}
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
            {`${t('search_results')}: ${searchResults.length} · ${currencyFormatter.format(resultsNet)}`}
          </p>
        )}
        <ReportsTable
          reports={searchActive ? searchResults : monthReports}
          onDelete={handleDelete}
          onPaidChange={handlePaidChange}
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
