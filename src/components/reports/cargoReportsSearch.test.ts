import { describe, expect, it } from 'vitest';
import type { CargoReport } from './CargoReport';
import {
  EMPTY_SEARCH_FILTERS,
  hasActiveFilters,
  hasInvertedRange,
  searchReports,
} from './cargoReportsSearch';

const report = (overrides: Partial<CargoReport>): CargoReport => ({
  id: 'id',
  plate: 'NQL417',
  date: '2026-07-06',
  loadNumber: 'C-100',
  company: 'Molinos Santa Rosa',
  city: 'Bogotá',
  driver: 'Pedro Ramírez',
  note: '',
  fullValue: 1000,
  extraProfit: 0,
  fuelCost: 0,
  tollCost: 0,
  otherCost: 0,
  driverPayment: 0,
  paid: false,
  ...overrides,
});

const reports = [
  report({ id: 'a', date: '2026-07-01', company: 'Cementos del Norte' }),
  report({ id: 'b', date: '2026-07-06', driver: 'Luis Gómez' }),
  report({ id: 'c', date: '2026-08-02', plate: 'ETL242', note: 'Llanta pinchada' }),
];

describe('cargoReportsSearch', () => {
  describe('hasActiveFilters', () => {
    it('returns false for empty filters', () => {
      expect(hasActiveFilters(EMPTY_SEARCH_FILTERS)).toBe(false);
    });

    it('returns true when a text query is set', () => {
      expect(hasActiveFilters({ ...EMPTY_SEARCH_FILTERS, query: 'NQL' })).toBe(true);
    });

    it('returns true when a date bound is set', () => {
      expect(hasActiveFilters({ ...EMPTY_SEARCH_FILTERS, from: '2026-07-01' })).toBe(true);
    });

    it('returns false when only the range unit changed', () => {
      expect(hasActiveFilters({ ...EMPTY_SEARCH_FILTERS, rangeUnit: 'month' })).toBe(false);
    });
  });

  describe('hasInvertedRange', () => {
    it('detects a start month later than the end month', () => {
      expect(
        hasInvertedRange({
          ...EMPTY_SEARCH_FILTERS,
          from: '2026-08',
          rangeUnit: 'month',
          to: '2026-07',
        }),
      ).toBe(true);
    });

    it('accepts a single month as both bounds', () => {
      expect(
        hasInvertedRange({
          ...EMPTY_SEARCH_FILTERS,
          from: '2026-07',
          rangeUnit: 'month',
          to: '2026-07',
        }),
      ).toBe(false);
    });

    it('ignores an open bound', () => {
      expect(hasInvertedRange({ ...EMPTY_SEARCH_FILTERS, from: '2026-08-02' })).toBe(false);
    });
  });

  describe('searchReports', () => {
    it('matches text across plate, company, driver, and note', () => {
      expect(searchReports(reports, { ...EMPTY_SEARCH_FILTERS, query: 'cementos' })).toHaveLength(
        1,
      );
      expect(searchReports(reports, { ...EMPTY_SEARCH_FILTERS, query: 'gómez' })).toHaveLength(1);
      expect(searchReports(reports, { ...EMPTY_SEARCH_FILTERS, query: 'llanta' })).toHaveLength(1);
      expect(searchReports(reports, { ...EMPTY_SEARCH_FILTERS, query: 'etl242' })).toHaveLength(1);
    });

    it('filters by date range inclusively', () => {
      const result = searchReports(reports, {
        ...EMPTY_SEARCH_FILTERS,
        from: '2026-07-06',
        to: '2026-08-02',
      });

      expect(result.map((item) => item.id)).toStrictEqual(['c', 'b']);
    });

    it('filters monthly ranges with inclusive month boundaries', () => {
      const result = searchReports(
        [
          report({ id: 'start', date: '2026-07-01' }),
          report({ id: 'end', date: '2026-07-31' }),
          report({ id: 'outside', date: '2026-08-01' }),
        ],
        { ...EMPTY_SEARCH_FILTERS, from: '2026-07', rangeUnit: 'month', to: '2026-07' },
      );

      expect(result.map((item) => item.id)).toStrictEqual(['end', 'start']);
    });

    it('filters across multiple monthly bounds', () => {
      const result = searchReports(reports, {
        ...EMPTY_SEARCH_FILTERS,
        from: '2026-07',
        rangeUnit: 'month',
        to: '2026-08',
      });

      expect(result.map((item) => item.id)).toStrictEqual(['c', 'b', 'a']);
    });

    it('clears a monthly range with empty filters', () => {
      expect(
        searchReports(reports, { ...EMPTY_SEARCH_FILTERS, rangeUnit: 'month' }).map(
          (item) => item.id,
        ),
      ).toStrictEqual(['c', 'b', 'a']);
    });

    it('filters a weekly range from monday to sunday', () => {
      const week = [
        report({ id: 'sunday-before', date: '2026-06-28' }),
        report({ id: 'monday', date: '2026-06-29' }),
        report({ id: 'sunday', date: '2026-07-05' }),
        report({ id: 'monday-after', date: '2026-07-06' }),
      ];
      const result = searchReports(week, {
        ...EMPTY_SEARCH_FILTERS,
        from: '2026-W27',
        rangeUnit: 'week',
        to: '2026-W27',
      });

      expect(result.map((item) => item.id)).toStrictEqual(['sunday', 'monday']);
    });

    it('returns nothing when the range is inverted', () => {
      const result = searchReports(reports, {
        ...EMPTY_SEARCH_FILTERS,
        from: '2026-08-02',
        to: '2026-07-01',
      });

      expect(result).toStrictEqual([]);
    });

    it('combines text and date filters', () => {
      const result = searchReports(reports, {
        ...EMPTY_SEARCH_FILTERS,
        from: '2026-07-02',
        query: 'nql417',
      });

      expect(result.map((item) => item.id)).toStrictEqual(['b']);
    });

    it('sorts results newest first', () => {
      const result = searchReports(reports, EMPTY_SEARCH_FILTERS);

      expect(result.map((item) => item.id)).toStrictEqual(['c', 'b', 'a']);
    });
  });
});
