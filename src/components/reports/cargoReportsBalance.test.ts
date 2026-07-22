import { describe, expect, it } from 'vitest';
import type { CargoReport } from './CargoReport';
import {
  calculateCargoReportsBalance,
  dailyBalancesForMonth,
  filterReportsByMonth,
  filterReportsByRange,
  monthlyBalancesForYear,
  monthsWithReports,
  yearsWithReports,
} from './cargoReportsBalance';

const reports: CargoReport[] = [
  {
    id: '1',
    plate: 'NQL417',
    date: '2026-06-05',
    loadNumber: 'L-001',
    company: 'Acme',
    city: 'Bogotá',
    driver: 'Carlos',
    note: '',
    fullValue: 1_000_000,
    profit: 300_000,
    extraProfit: 50_000,
    fuelCost: 100_000,
    tollCost: 50_000,
    otherCost: 0,
    driverPayment: 80_000,
  },
  {
    id: '2',
    plate: 'ETL242',
    date: '2026-06-10',
    loadNumber: 'L-002',
    company: 'Acme',
    city: 'Medellín',
    driver: 'Maria',
    note: '',
    fullValue: 500_000,
    profit: 200_000,
    extraProfit: 0,
    fuelCost: 50_000,
    tollCost: 0,
    otherCost: 0,
    driverPayment: 20_000,
  },
  {
    id: '3',
    plate: 'NQL417',
    date: '2026-07-01',
    loadNumber: 'L-003',
    company: 'Beta',
    city: 'Cali',
    driver: 'Carlos',
    note: '',
    fullValue: 750_000,
    profit: 250_000,
    extraProfit: 100_000,
    fuelCost: 0,
    tollCost: 0,
    otherCost: 0,
    driverPayment: 0,
  },
];

describe('filterReportsByMonth', () => {
  it('keeps only reports within the given month', () => {
    const result = filterReportsByMonth(reports, '2026-06');

    expect(result).toHaveLength(2);
    expect(result.map((report) => report.id)).toEqual(['1', '2']);
  });

  it('returns all reports when month is undefined', () => {
    const result = filterReportsByMonth(reports);

    expect(result).toHaveLength(3);
  });
});

describe('calculateCargoReportsBalance', () => {
  it('sums full value, manual profit, value without profit, and costs for the month', () => {
    const monthReports = filterReportsByMonth(reports, '2026-06');
    const balance = calculateCargoReportsBalance(monthReports);

    expect(balance.totalFullValue).toBe(1_500_000);
    expect(balance.totalProfit).toBe(500_000);
    expect(balance.totalExtraProfit).toBe(50_000);
    expect(balance.totalValueWithoutProfit).toBe(1_000_000);
    expect(balance.totalDriverPayment).toBe(100_000);
    expect(balance.totalCosts).toBe(300_000);
    expect(balance.totalIncome).toBe(1_550_000);
    expect(balance.totalNet).toBe(1_250_000);
  });

  it('counts the loads for the month', () => {
    const monthReports = filterReportsByMonth(reports, '2026-06');
    const balance = calculateCargoReportsBalance(monthReports);

    expect(balance.loadCount).toBe(2);
  });

  it('groups per-plate profit subtotals for the month', () => {
    const monthReports = filterReportsByMonth(reports, '2026-06');
    const balance = calculateCargoReportsBalance(monthReports);

    expect(balance.plateSubtotals).toEqual([
      { plate: 'NQL417', profit: 300_000, count: 1 },
      { plate: 'ETL242', profit: 200_000, count: 1 },
    ]);
  });

  it('computes the all-time profit across every month', () => {
    const balance = calculateCargoReportsBalance(reports);

    expect(balance.totalProfit).toBe(750_000);
    expect(balance.loadCount).toBe(3);
  });
});

describe('filterReportsByRange', () => {
  it('keeps reports within an inclusive range', () => {
    const result = filterReportsByRange(reports, '2026-06-05', '2026-06-10');

    expect(result.map((report) => report.id)).toEqual(['1', '2']);
  });

  it('treats an empty bound as open', () => {
    expect(filterReportsByRange(reports, '', '2026-06-30')).toHaveLength(2);
    expect(filterReportsByRange(reports, '2026-07-01', '')).toHaveLength(1);
  });
});

describe('monthsWithReports', () => {
  it('lists unique months oldest first', () => {
    expect(monthsWithReports(reports)).toEqual(['2026-06', '2026-07']);
  });
});

describe('yearsWithReports', () => {
  it('lists unique years oldest first', () => {
    expect(yearsWithReports(reports)).toEqual(['2026']);
  });
});

describe('dailyBalancesForMonth', () => {
  it('breaks a month into per-day balances, oldest first', () => {
    const result = dailyBalancesForMonth(reports, '2026-06');

    expect(result.map((entry) => entry.period)).toEqual(['2026-06-05', '2026-06-10']);
    expect(result[0]?.balance.totalProfit).toBe(300_000);
    expect(result[1]?.balance.totalProfit).toBe(200_000);
  });
});

describe('monthlyBalancesForYear', () => {
  it('breaks a year into per-month balances, oldest first', () => {
    const result = monthlyBalancesForYear(reports, '2026');

    expect(result.map((entry) => entry.period)).toEqual(['2026-06', '2026-07']);
    expect(result[0]?.balance.totalProfit).toBe(500_000);
    expect(result[1]?.balance.totalProfit).toBe(250_000);
  });
});
