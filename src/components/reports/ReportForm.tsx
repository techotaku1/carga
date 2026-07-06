'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { CargoReport } from './CargoReport';
import { todayIsoDate } from './reportDates';

const PLATE_OPTIONS = ['NQL417', 'ETL242'] as const;
const OTHER_PLATE_VALUE = 'other';

const reportFormSchema = z
  .object({
    plate: z.string().min(1),
    otherPlate: z.string(),
    date: z.string().min(1),
    loadNumber: z.string().min(1),
    company: z.string().min(1),
    driver: z.string().min(1),
    note: z.string(),
    freightValue: z.number().positive(),
  })
  .refine((value) => value.plate !== OTHER_PLATE_VALUE || value.otherPlate.trim().length > 0, {
    message: 'required',
    path: ['otherPlate'],
  });

type ReportFormValues = z.infer<typeof reportFormSchema>;

const defaultValues: ReportFormValues = {
  plate: PLATE_OPTIONS[0],
  otherPlate: '',
  date: todayIsoDate(),
  loadNumber: '',
  company: '',
  driver: '',
  note: '',
  freightValue: 0,
};

export const ReportForm = (props: { onAdd: (report: CargoReport) => void }) => {
  const t = useTranslations('ReportsBoard');
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues,
  });
  const selectedPlate = form.watch('plate');

  const onSubmit = form.handleSubmit((values) => {
    const plate = values.plate === OTHER_PLATE_VALUE ? values.otherPlate.trim() : values.plate;

    props.onAdd({
      id: crypto.randomUUID(),
      plate,
      date: values.date,
      loadNumber: values.loadNumber,
      company: values.company,
      driver: values.driver,
      note: values.note,
      freightValue: values.freightValue,
    });
    form.reset(defaultValues);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="plate" className="text-sm font-medium text-gray-700">
            {t('field_plate')}
          </label>
          <select
            id="plate"
            className="rounded-lg border border-gray-300 px-3 py-2"
            {...form.register('plate')}
          >
            {PLATE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value={OTHER_PLATE_VALUE}>{t('field_plate_other')}</option>
          </select>
        </div>

        {selectedPlate === OTHER_PLATE_VALUE && (
          <div className="flex flex-col gap-1">
            <label htmlFor="otherPlate" className="text-sm font-medium text-gray-700">
              {t('field_plate_other_label')}
            </label>
            <input
              id="otherPlate"
              type="text"
              className="rounded-lg border border-gray-300 px-3 py-2"
              {...form.register('otherPlate')}
            />
            {form.formState.errors.otherPlate && (
              <span className="text-sm text-red-600">{t('error_required')}</span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">
            {t('field_date')}
          </label>
          <input
            id="date"
            type="date"
            className="rounded-lg border border-gray-300 px-3 py-2"
            {...form.register('date')}
          />
          {form.formState.errors.date && (
            <span className="text-sm text-red-600">{t('error_required')}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="loadNumber" className="text-sm font-medium text-gray-700">
            {t('field_load_number')}
          </label>
          <input
            id="loadNumber"
            type="text"
            className="rounded-lg border border-gray-300 px-3 py-2"
            {...form.register('loadNumber')}
          />
          {form.formState.errors.loadNumber && (
            <span className="text-sm text-red-600">{t('error_required')}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="company" className="text-sm font-medium text-gray-700">
            {t('field_company')}
          </label>
          <input
            id="company"
            type="text"
            className="rounded-lg border border-gray-300 px-3 py-2"
            {...form.register('company')}
          />
          {form.formState.errors.company && (
            <span className="text-sm text-red-600">{t('error_required')}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="driver" className="text-sm font-medium text-gray-700">
            {t('field_driver')}
          </label>
          <input
            id="driver"
            type="text"
            className="rounded-lg border border-gray-300 px-3 py-2"
            {...form.register('driver')}
          />
          {form.formState.errors.driver && (
            <span className="text-sm text-red-600">{t('error_required')}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="freightValue" className="text-sm font-medium text-gray-700">
            {t('field_freight_value')}
          </label>
          <input
            id="freightValue"
            type="number"
            min="0"
            step="1"
            className="rounded-lg border border-gray-300 px-3 py-2"
            {...form.register('freightValue', { valueAsNumber: true })}
          />
          {form.formState.errors.freightValue && (
            <span className="text-sm text-red-600">{t('error_freight_value_positive')}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="note" className="text-sm font-medium text-gray-700">
          {t('field_note')}
        </label>
        <textarea
          id="note"
          rows={2}
          className="rounded-lg border border-gray-300 px-3 py-2"
          {...form.register('note')}
        />
      </div>

      <button
        type="submit"
        className="self-start rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
      >
        {t('add_report')}
      </button>
    </form>
  );
};
