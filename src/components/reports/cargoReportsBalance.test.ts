import { describe, expect, it } from 'vitest';
import type { CargoReport } from './CargoReport';
import {
  calculateCargoReportsBalance,
  filterReportsByMonth,
  filterReportsByRange,
  monthsWithReports,
  reportBalances,
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
    extraProfit: 50_000,
    fuelCost: 100_000,
    tollCost: 50_000,
    otherCost: 0,
    driverPayment: 80_000,
    paid: true,
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
    extraProfit: 0,
    fuelCost: 50_000,
    tollCost: 0,
    otherCost: 0,
    driverPayment: 20_000,
    paid: false,
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
    extraProfit: 100_000,
    fuelCost: 0,
    tollCost: 0,
    otherCost: 0,
    driverPayment: 0,
    paid: false,
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
  it('sums income, costs, and net value for the month', () => {
    const monthReports = filterReportsByMonth(reports, '2026-06');
    const balance = calculateCargoReportsBalance(monthReports);

    expect(balance.totalFullValue).toBe(1_500_000);
    expect(balance.totalExtraProfit).toBe(50_000);
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

  it('computes the all-time net across every month', () => {
    const balance = calculateCargoReportsBalance(reports);

    expect(balance.totalNet).toBe(2_100_000);
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

describe('reportBalances', () => {
  it('lists one entry per report inside a month, oldest first', () => {
    const result = reportBalances(reports, '2026-06');

    expect(result.map((entry) => entry.id)).toEqual(['1', '2']);
    expect(result[0]?.balance.totalNet).toBe(820_000);
    expect(result[1]?.balance.totalNet).toBe(430_000);
  });

  it('keeps reports of the same day on separate entries', () => {
    const sameDay = reports
      .filter((report) => report.date.startsWith('2026-06'))
      .map((report) => ({ ...report, date: '2026-06-05' }));
    const result = reportBalances(sameDay);

    expect(result).toHaveLength(2);
    expect(result.every((entry) => entry.balance.loadCount === 1)).toBe(true);
  });

  it('describes each entry with its plate, load number, company and driver', () => {
    const [entry] = reportBalances(reports, '2026-07');

    expect(entry?.detail).toBe('NQL417 · L-003 · Beta · Carlos');
  });
});
