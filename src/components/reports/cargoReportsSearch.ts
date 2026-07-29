import type { CargoReport } from './CargoReport';
import { shiftIsoDate } from './reportDates';

export type SearchRangeUnit = 'day' | 'week' | 'month';

export type ReportSearchFilters = {
  query: string;
  from: string;
  to: string;
  rangeUnit: SearchRangeUnit;
};

export const EMPTY_SEARCH_FILTERS: ReportSearchFilters = {
  query: '',
  from: '',
  to: '',
  rangeUnit: 'day',
};

/**
 * Checks whether any search filter is active. The range unit alone is not a filter.
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

// A week input yields yyyy-Www. ISO weeks start on Monday and week 1 is the one holding January 4th.
const weekStart = (value: string) => {
  const year = Number(value.slice(0, 4));
  const week = Number(value.slice(6));

  if (!year || !week) {
    return '';
  }

  const january4 = new Date(Date.UTC(year, 0, 4));
  const isoWeekday = january4.getUTCDay() === 0 ? 7 : january4.getUTCDay();
  const firstMonday = new Date(Date.UTC(year, 0, 4 - (isoWeekday - 1)));
  firstMonday.setUTCDate(firstMonday.getUTCDate() + (week - 1) * 7);

  return firstMonday.toISOString().slice(0, 10);
};

const weekEnd = (value: string) => {
  const start = weekStart(value);

  return start === '' ? '' : shiftIsoDate(start, 6);
};

/**
 * Expands a range bound to the first day covered by it.
 * @param value - The raw input value (yyyy-mm-dd, yyyy-Www, or yyyy-mm).
 * @param unit - The granularity the value was entered with.
 * @returns The inclusive lower bound as yyyy-mm-dd, or an empty string when unset.
 */
export const rangeStart = (value: string, unit: SearchRangeUnit) => {
  if (value === '') {
    return '';
  }

  if (unit === 'month') {
    return monthStart(value);
  }

  return unit === 'week' ? weekStart(value) : value;
};

/**
 * Expands a range bound to the last day covered by it.
 * @param value - The raw input value (yyyy-mm-dd, yyyy-Www, or yyyy-mm).
 * @param unit - The granularity the value was entered with.
 * @returns The inclusive upper bound as yyyy-mm-dd, or an empty string when unset.
 */
export const rangeEnd = (value: string, unit: SearchRangeUnit) => {
  if (value === '') {
    return '';
  }

  if (unit === 'month') {
    return monthEnd(value);
  }

  return unit === 'week' ? weekEnd(value) : value;
};

/**
 * Checks whether both range bounds are set and the lower one starts after the upper one ends.
 * @param filters - The current search filters.
 * @returns True when the range is inverted and cannot match anything.
 */
export const hasInvertedRange = (filters: ReportSearchFilters) => {
  const from = rangeStart(filters.from, filters.rangeUnit);
  const to = rangeEnd(filters.to, filters.rangeUnit);

  return from !== '' && to !== '' && from > to;
};

/**
 * Filters reports by free text and date range, newest first. An inverted range matches nothing.
 * @param reports - The reports to search.
 * @param filters - The text query, date range, and range granularity to apply.
 * @returns The matching reports sorted by date descending.
 */
export const searchReports = (reports: CargoReport[], filters: ReportSearchFilters) => {
  if (hasInvertedRange(filters)) {
    return [];
  }

  const query = filters.query.trim().toLowerCase();
  const from = rangeStart(filters.from, filters.rangeUnit);
  const to = rangeEnd(filters.to, filters.rangeUnit);

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
