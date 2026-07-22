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

/**
 * Filters reports by free text and date range, newest first.
 * @param reports - The reports to search.
 * @param filters - The text query and date range to apply.
 * @returns The matching reports sorted by date descending.
 */
export const searchReports = (reports: CargoReport[], filters: ReportSearchFilters) => {
  const query = filters.query.trim().toLowerCase();

  const matches = reports.filter((report) => {
    if (filters.from && report.date < filters.from) {
      return false;
    }

    if (filters.to && report.date > filters.to) {
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
