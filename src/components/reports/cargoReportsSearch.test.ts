import { describe, expect, it } from 'vitest';
import type { CargoReport } from './CargoReport';
import { EMPTY_SEARCH_FILTERS, hasActiveFilters, searchReports } from './cargoReportsSearch';

const report = (overrides: Partial<CargoReport>): CargoReport => ({
  id: 'id',
  plate: 'NQL417',
  date: '2026-07-06',
  loadNumber: 'C-100',
  company: 'Molinos Santa Rosa',
  driver: 'Pedro Ramírez',
  note: '',
  freightValue: 1000,
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
        query: '',
        from: '2026-07-06',
        to: '2026-08-02',
      });

      expect(result.map((item) => item.id)).toStrictEqual(['c', 'b']);
    });

    it('combines text and date filters', () => {
      const result = searchReports(reports, {
        query: 'nql417',
        from: '2026-07-02',
        to: '',
      });

      expect(result.map((item) => item.id)).toStrictEqual(['b']);
    });

    it('sorts results newest first', () => {
      const result = searchReports(reports, EMPTY_SEARCH_FILTERS);

      expect(result.map((item) => item.id)).toStrictEqual(['c', 'b', 'a']);
    });
  });
});
