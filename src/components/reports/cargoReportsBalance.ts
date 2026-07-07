import type { CargoReport } from './CargoReport';

type PlateSubtotal = {
  plate: string;
  total: number;
  count: number;
};

export type CargoReportsBalance = {
  totalFreightValue: number;
  loadCount: number;
  plateSubtotals: PlateSubtotal[];
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
 * Computes the total freight value, load count, and per-plate subtotals for a set of reports.
 * @param reports - The reports to summarize.
 * @returns The computed balance.
 */
export const calculateCargoReportsBalance = (reports: CargoReport[]): CargoReportsBalance => {
  const subtotalsByPlate = new Map<string, PlateSubtotal>();
  let totalFreightValue = 0;

  for (const report of reports) {
    totalFreightValue += report.freightValue;

    const existing = subtotalsByPlate.get(report.plate);

    if (existing) {
      existing.total += report.freightValue;
      existing.count += 1;
    } else {
      subtotalsByPlate.set(report.plate, {
        plate: report.plate,
        total: report.freightValue,
        count: 1,
      });
    }
  }

  return {
    totalFreightValue,
    loadCount: reports.length,
    plateSubtotals: [...subtotalsByPlate.values()],
  };
};
