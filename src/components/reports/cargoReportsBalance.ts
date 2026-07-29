import type { CargoReport } from './CargoReport';

export type CargoReportsBalance = {
  totalFullValue: number;
  totalExtraProfit: number;
  totalFuelCost: number;
  totalTollCost: number;
  totalOtherCost: number;
  totalDriverPayment: number;
  totalCosts: number;
  totalIncome: number; // entradas: valor completo + tambay
  totalNet: number; // neto: entradas − salidas (costos)
  loadCount: number;
};

export type PeriodBalance = {
  id?: string; // unique row id when the entry is a single report
  period: string; // yyyy-mm-dd for a day, yyyy-mm for a month
  detail?: string; // plate, load number, company or driver of a single report
  balance: CargoReportsBalance;
};

/**
 * Filters reports to a given month (yyyy-mm), or returns all reports when month is undefined.
 * @param reports - The reports to filter.
 * @param month - The month to filter by, in yyyy-mm format.
 * @returns The reports that fall within the given month.
 */
export const filterReportsByMonth = (reports: CargoReport[], month?: string) => {
  if (!month) {
    return reports;
  }

  return reports.filter((report) => report.date.startsWith(month));
};

/**
 * Computes income, costs, net result, and load count.
 * @param reports - The reports to summarize.
 * @returns The computed balance.
 */
export const calculateCargoReportsBalance = (reports: CargoReport[]): CargoReportsBalance => {
  let totalFullValue = 0;
  let totalExtraProfit = 0;
  let totalFuelCost = 0;
  let totalTollCost = 0;
  let totalOtherCost = 0;
  let totalDriverPayment = 0;

  for (const report of reports) {
    totalFullValue += report.fullValue;
    totalExtraProfit += report.extraProfit;
    totalFuelCost += report.fuelCost;
    totalTollCost += report.tollCost;
    totalOtherCost += report.otherCost;
    totalDriverPayment += report.driverPayment;
  }

  const totalCosts = totalFuelCost + totalTollCost + totalOtherCost + totalDriverPayment;
  const totalIncome = totalFullValue + totalExtraProfit;

  return {
    totalFullValue,
    totalExtraProfit,
    totalFuelCost,
    totalTollCost,
    totalOtherCost,
    totalDriverPayment,
    totalCosts,
    totalIncome,
    totalNet: totalIncome - totalCosts,
    loadCount: reports.length,
  };
};

/**
 * Filters reports to an inclusive date range. An empty bound is treated as open.
 * @param reports - The reports to filter.
 * @param from - The inclusive lower bound, in yyyy-mm-dd format (empty for open).
 * @param to - The inclusive upper bound, in yyyy-mm-dd format (empty for open).
 * @returns The reports within the range.
 */
export const filterReportsByRange = (reports: CargoReport[], from: string, to: string) =>
  reports.filter((report) => {
    if (from && report.date < from) {
      return false;
    }

    if (to && report.date > to) {
      return false;
    }

    return Boolean(report.date);
  });

/**
 * Lists the unique months (yyyy-mm) that have at least one report, oldest first.
 * @param reports - The reports to inspect.
 * @returns The sorted list of months with data.
 */
export const monthsWithReports = (reports: CargoReport[]): string[] =>
  [
    ...new Set(
      reports.flatMap((report) => {
        const month = report.date.slice(0, 7);

        return month ? [month] : [];
      }),
    ),
  ].toSorted();

const reportDetail = (report: CargoReport) =>
  [report.plate, report.loadNumber, report.company, report.driver].filter(Boolean).join(' · ');

/**
 * Lists one balance row per report, without grouping, oldest first.
 * @param reports - The reports to break down.
 * @param month - Optional month filter, in yyyy-mm format.
 * @returns One entry per report, each carrying its own id and detail.
 */
export const reportBalances = (reports: CargoReport[], month?: string): PeriodBalance[] =>
  reports
    .filter((report) => Boolean(report.date) && (!month || report.date.slice(0, 7) === month))
    .toSorted((left, right) => left.date.localeCompare(right.date))
    .map((report) => ({
      id: report.id,
      period: report.date,
      detail: reportDetail(report),
      balance: calculateCargoReportsBalance([report]),
    }));
