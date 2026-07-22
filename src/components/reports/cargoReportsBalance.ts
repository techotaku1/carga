import type { CargoReport } from './CargoReport';
import { reportProfit } from './CargoReport';

type PlateSubtotal = {
  plate: string;
  profit: number;
  count: number;
};

export type CargoReportsBalance = {
  totalFullValue: number;
  totalProfit: number;
  totalExtraProfit: number;
  totalValueWithoutProfit: number;
  totalFuelCost: number;
  totalTollCost: number;
  totalOtherCost: number;
  totalDriverPayment: number;
  totalCosts: number;
  totalIncome: number; // entradas: valor completo + tambay
  totalNet: number; // neto: entradas − salidas (costos)
  loadCount: number;
  plateSubtotals: PlateSubtotal[];
};

export type PeriodBalance = {
  period: string; // yyyy-mm-dd for a day, yyyy-mm for a month
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
 * Computes full value, costs, profit, load count, and per-plate profit subtotals.
 * @param reports - The reports to summarize.
 * @returns The computed balance.
 */
export const calculateCargoReportsBalance = (reports: CargoReport[]): CargoReportsBalance => {
  const subtotalsByPlate = new Map<string, PlateSubtotal>();
  let totalFullValue = 0;
  let totalProfit = 0;
  let totalExtraProfit = 0;
  let totalFuelCost = 0;
  let totalTollCost = 0;
  let totalOtherCost = 0;
  let totalDriverPayment = 0;

  for (const report of reports) {
    const profit = reportProfit(report);
    totalFullValue += report.fullValue;
    totalProfit += profit;
    totalExtraProfit += report.extraProfit;
    totalFuelCost += report.fuelCost;
    totalTollCost += report.tollCost;
    totalOtherCost += report.otherCost;
    totalDriverPayment += report.driverPayment;

    const existing = subtotalsByPlate.get(report.plate);

    if (existing) {
      existing.profit += profit;
      existing.count += 1;
    } else {
      subtotalsByPlate.set(report.plate, {
        plate: report.plate,
        profit,
        count: 1,
      });
    }
  }

  const totalCosts = totalFuelCost + totalTollCost + totalOtherCost + totalDriverPayment;
  const totalIncome = totalFullValue + totalExtraProfit;

  return {
    totalFullValue,
    totalProfit,
    totalExtraProfit,
    totalValueWithoutProfit: totalFullValue - totalProfit,
    totalFuelCost,
    totalTollCost,
    totalOtherCost,
    totalDriverPayment,
    totalCosts,
    totalIncome,
    totalNet: totalIncome - totalCosts,
    loadCount: reports.length,
    plateSubtotals: [...subtotalsByPlate.values()],
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

/**
 * Lists the unique years (yyyy) that have at least one report, oldest first.
 * @param reports - The reports to inspect.
 * @returns The sorted list of years with data.
 */
export const yearsWithReports = (reports: CargoReport[]): string[] =>
  [
    ...new Set(
      reports.flatMap((report) => {
        const year = report.date.slice(0, 4);

        return year ? [year] : [];
      }),
    ),
  ].toSorted();

const groupBalances = (
  reports: CargoReport[],
  periodOf: (report: CargoReport) => string,
): PeriodBalance[] => {
  const groups = new Map<string, CargoReport[]>();

  for (const report of reports) {
    const period = periodOf(report);
    const bucket = groups.get(period) ?? [];
    bucket.push(report);
    groups.set(period, bucket);
  }

  return [...groups.keys()].toSorted().map((period) => ({
    period,
    balance: calculateCargoReportsBalance(groups.get(period) ?? []),
  }));
};

/**
 * Computes a per-day balance for every day with data inside the given month.
 * @param reports - The reports to summarize.
 * @param month - The month to break down, in yyyy-mm format.
 * @returns The per-day balances, oldest day first.
 */
export const dailyBalancesForMonth = (reports: CargoReport[], month: string): PeriodBalance[] =>
  groupBalances(
    reports.filter((report) => report.date.slice(0, 7) === month),
    (report) => report.date,
  );

/**
 * Computes a per-month balance for every month with data inside the given year.
 * @param reports - The reports to summarize.
 * @param year - The year to break down, in yyyy format.
 * @returns The per-month balances, oldest month first.
 */
export const monthlyBalancesForYear = (reports: CargoReport[], year: string): PeriodBalance[] =>
  groupBalances(
    reports.filter((report) => report.date.slice(0, 4) === year),
    (report) => report.date.slice(0, 7),
  );

/**
 * Groups any set of reports into per-day balances, oldest day first.
 * @param reports - The reports to summarize.
 * @returns The per-day balances.
 */
export const dailyBalances = (reports: CargoReport[]): PeriodBalance[] =>
  groupBalances(
    reports.filter((report) => Boolean(report.date)),
    (report) => report.date,
  );

/**
 * Groups any set of reports into per-month balances, oldest month first.
 * @param reports - The reports to summarize.
 * @returns The per-month balances.
 */
export const monthlyBalances = (reports: CargoReport[]): PeriodBalance[] =>
  groupBalances(
    reports.filter((report) => Boolean(report.date)),
    (report) => report.date.slice(0, 7),
  );
