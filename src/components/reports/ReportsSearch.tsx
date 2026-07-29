'use client';

import { useTranslations } from 'next-intl';
import type { ReportSearchFilters, SearchRangeUnit } from './cargoReportsSearch';
import { hasActiveFilters, hasInvertedRange } from './cargoReportsSearch';

const RANGE_UNITS: SearchRangeUnit[] = ['day', 'week', 'month'];

const INPUT_TYPES: Record<SearchRangeUnit, string> = {
  day: 'date',
  week: 'week',
  month: 'month',
};

const isRangeUnit = (value: string): value is SearchRangeUnit =>
  RANGE_UNITS.some((unit) => unit === value);

export const ReportsSearch = (props: {
  filters: ReportSearchFilters;
  onFiltersChange: (filters: ReportSearchFilters) => void;
  variant?: 'default' | 'range';
}) => {
  const t = useTranslations('ReportsBoard');
  const inputClass = 'rounded-lg border border-gray-300 px-3 py-2 text-sm';
  const showQuery = props.variant !== 'range';
  const { rangeUnit } = props.filters;
  const invalidRange = hasInvertedRange(props.filters);
  const unitLabels: Record<SearchRangeUnit, string> = {
    day: t('search_unit_day'),
    week: t('search_unit_week'),
    month: t('search_unit_month'),
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-3">
        {showQuery && (
          <div className="flex min-w-55 flex-1 flex-col gap-1">
            <label className="text-xs font-medium text-gray-500" htmlFor="search-query">
              {t('search_label')}
            </label>
            <input
              aria-label={t('search_label')}
              className={inputClass}
              id="search-query"
              onChange={(event) => {
                props.onFiltersChange({ ...props.filters, query: event.target.value });
              }}
              placeholder={t('search_placeholder')}
              type="search"
              value={props.filters.query}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500" htmlFor="search-range-unit">
            {t('search_range_unit')}
          </label>
          <select
            className={inputClass}
            id="search-range-unit"
            onChange={(event) => {
              if (isRangeUnit(event.target.value)) {
                // Bounds are cleared because each unit uses an incompatible input value format.
                props.onFiltersChange({
                  ...props.filters,
                  from: '',
                  rangeUnit: event.target.value,
                  to: '',
                });
              }
            }}
            value={rangeUnit}
          >
            {RANGE_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unitLabels[unit]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500" htmlFor="search-from">
            {t('search_from')}
          </label>
          <input
            aria-invalid={invalidRange}
            aria-label={t('search_from')}
            className={`${inputClass}${invalidRange ? ' border-red-500' : ''}`}
            id="search-from"
            max={props.filters.to || undefined}
            onChange={(event) => {
              props.onFiltersChange({ ...props.filters, from: event.target.value });
            }}
            type={INPUT_TYPES[rangeUnit]}
            value={props.filters.from}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500" htmlFor="search-to">
            {t('search_to')}
          </label>
          <input
            aria-invalid={invalidRange}
            aria-label={t('search_to')}
            className={`${inputClass}${invalidRange ? ' border-red-500' : ''}`}
            id="search-to"
            min={props.filters.from || undefined}
            onChange={(event) => {
              props.onFiltersChange({ ...props.filters, to: event.target.value });
            }}
            type={INPUT_TYPES[rangeUnit]}
            value={props.filters.to}
          />
        </div>

        {hasActiveFilters(props.filters) && (
          <button
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
            onClick={() => {
              props.onFiltersChange({ ...props.filters, from: '', query: '', to: '' });
            }}
            type="button"
          >
            {t('search_clear')}
          </button>
        )}
      </div>

      {invalidRange && (
        <p className="text-sm text-red-700" role="alert">
          {t('search_range_invalid')}
        </p>
      )}
    </div>
  );
};
