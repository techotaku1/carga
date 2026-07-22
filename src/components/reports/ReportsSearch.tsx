'use client';

import { useTranslations } from 'next-intl';
import type { ReportSearchFilters } from './cargoReportsSearch';
import { hasActiveFilters } from './cargoReportsSearch';

export const ReportsSearch = (props: {
  filters: ReportSearchFilters;
  onFiltersChange: (filters: ReportSearchFilters) => void;
  variant?: 'default' | 'range';
}) => {
  const t = useTranslations('ReportsBoard');
  const inputClass = 'rounded-lg border border-gray-300 px-3 py-2 text-sm';
  const showQuery = props.variant !== 'range';

  return (
    <div className="flex flex-wrap items-end gap-3">
      {showQuery && (
        <div className="flex min-w-55 flex-1 flex-col gap-1">
          <label htmlFor="search-query" className="text-xs font-medium text-gray-500">
            {t('search_label')}
          </label>
          <input
            id="search-query"
            type="search"
            aria-label={t('search_label')}
            placeholder={t('search_placeholder')}
            className={inputClass}
            value={props.filters.query}
            onChange={(event) => {
              props.onFiltersChange({ ...props.filters, query: event.target.value });
            }}
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="search-from" className="text-xs font-medium text-gray-500">
          {t('search_from')}
        </label>
        <input
          id="search-from"
          type="date"
          aria-label={t('search_from')}
          className={inputClass}
          value={props.filters.from}
          onChange={(event) => {
            props.onFiltersChange({ ...props.filters, from: event.target.value });
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="search-to" className="text-xs font-medium text-gray-500">
          {t('search_to')}
        </label>
        <input
          id="search-to"
          type="date"
          aria-label={t('search_to')}
          className={inputClass}
          value={props.filters.to}
          onChange={(event) => {
            props.onFiltersChange({ ...props.filters, to: event.target.value });
          }}
        />
      </div>

      {hasActiveFilters(props.filters) && (
        <button
          type="button"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
          onClick={() => {
            props.onFiltersChange({ query: '', from: '', to: '' });
          }}
        >
          {t('search_clear')}
        </button>
      )}
    </div>
  );
};
