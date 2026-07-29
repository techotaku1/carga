import type { CargoReport } from './CargoReport';

export type ReportSearchFilters = {
  query: string;
  from: string;
  to: string;
};

export const EMPTY_SEARCH_FILTERS: ReportSearchFilters = {
  query: '',
  from: '',
  to: '',
};

/**
 * Checks whether any search filter is active.
 * @param filters - The current search filters.
 * @returns True when at least one filter has a value.
 */
export const hasActiveFilters = (filters: ReportSearchFilters) =>
  filters.query.trim() !== '' || filters.from !== '' || filters.to !== '';

const monthStart = (value: string) => `${value.slice(0, 7)}-01`;

const monthEnd = (value: string) => {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return `${value.slice(0, 7)}-${String(lastDay).padStart(2, '0')}`;
};

/**
 * Filters reports by free text and date range, newest first.
 * @param reports - The reports to search.
 * @param filters - The text query and date range to apply.
 * @param rangeUnit - The granularity used for the date range.
 * @returns The matching reports sorted by date descending.
 */
export const searchReports = (
  reports: CargoReport[],
  filters: ReportSearchFilters,
  rangeUnit: 'day' | 'month' = 'day',
) => {
  const query = filters.query.trim().toLowerCase();
  const from = filters.from && rangeUnit === 'month' ? monthStart(filters.from) : filters.from;
  const to = filters.to && rangeUnit === 'month' ? monthEnd(filters.to) : filters.to;

  const matches = reports.filter((report) => {
    if (from && report.date < from) {
      return false;
    }

    if (to && report.date > to) {
      return false;
    }

    if (query === '') {
      return true;
    }

    const haystack = [
      report.plate,
      report.loadNumber,
      report.company,
      report.city,
      report.driver,
      report.note,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });

  return [...matches].toSorted((a, b) => b.date.localeCompare(a.date));
};
