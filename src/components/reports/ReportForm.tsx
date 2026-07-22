'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import {
  FiBriefcase,
  FiCalendar,
  FiEdit3,
  FiFileText,
  FiHash,
  FiMapPin,
  FiTruck,
} from 'react-icons/fi';
import type { CargoReport } from './CargoReport';
import { COLOMBIA_CITIES } from './colombiaCities';
import { DriverSelect } from './DriverSelect';
import type { ReportFormValues } from './reportFormModel';
import {
  defaultReportFormValues,
  OTHER_PLATE_VALUE,
  PLATE_OPTIONS,
  reportFormSchema,
  reportToFormValues,
} from './reportFormModel';
import { ReportMoneyFields } from './ReportMoneyFields';

const fieldLabelClass = 'text-sm font-medium text-gray-700';
const textInputClass =
  'w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 focus:border-[#0c2434] focus:outline-none';
const fieldIconClass = 'pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400';

export const ReportForm = (props: {
  onSubmit: (report: CargoReport) => void;
  editingReport?: CargoReport | null;
}) => {
  const t = useTranslations('ReportsBoard');
  const editingReport = props.editingReport ?? null;
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: editingReport ? reportToFormValues(editingReport) : defaultReportFormValues,
  });
  const selectedPlate = form.watch('plate');

  const onSubmit = form.handleSubmit((values) => {
    const plate = values.plate === OTHER_PLATE_VALUE ? values.otherPlate.trim() : values.plate;

    props.onSubmit({
      id: editingReport?.id ?? crypto.randomUUID(),
      plate,
      date: values.date,
      loadNumber: values.loadNumber,
      company: values.company,
      city: values.city,
      driver: values.driver,
      note: values.note,
      fullValue: values.fullValue,
      extraProfit: values.extraProfit,
      fuelCost: values.fuelCost,
      tollCost: values.tollCost,
      otherCost: values.otherCost,
      driverPayment: values.driverPayment,
      paid: editingReport?.paid ?? false,
    });

    if (!editingReport) {
      form.reset({ ...defaultReportFormValues, driver: values.driver });
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="plate" className={fieldLabelClass}>
            {t('field_plate')}
          </label>
          <div className="relative">
            <FiTruck className={fieldIconClass} aria-hidden="true" />
            <select id="plate" className={textInputClass} {...form.register('plate')}>
              {PLATE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value={OTHER_PLATE_VALUE}>{t('field_plate_other')}</option>
            </select>
          </div>
        </div>

        {selectedPlate === OTHER_PLATE_VALUE && (
          <div className="flex flex-col gap-1">
            <label htmlFor="otherPlate" className={fieldLabelClass}>
              {t('field_plate_other_label')}
            </label>
            <div className="relative">
              <FiEdit3 className={fieldIconClass} aria-hidden="true" />
              <input
                id="otherPlate"
                type="text"
                className={textInputClass}
                {...form.register('otherPlate')}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="date" className={fieldLabelClass}>
            {t('field_date')}
          </label>
          <div className="relative">
            <FiCalendar className={fieldIconClass} aria-hidden="true" />
            <input id="date" type="date" className={textInputClass} {...form.register('date')} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="loadNumber" className={fieldLabelClass}>
            {t('field_load_number')}
          </label>
          <div className="relative">
            <FiHash className={fieldIconClass} aria-hidden="true" />
            <input
              id="loadNumber"
              type="text"
              className={textInputClass}
              {...form.register('loadNumber')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="company" className={fieldLabelClass}>
            {t('field_company')}
          </label>
          <div className="relative">
            <FiBriefcase className={fieldIconClass} aria-hidden="true" />
            <input
              id="company"
              type="text"
              className={textInputClass}
              {...form.register('company')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="city" className={fieldLabelClass}>
            {t('field_city')}
          </label>
          <div className="relative">
            <FiMapPin className={fieldIconClass} aria-hidden="true" />
            <input
              id="city"
              type="text"
              list="colombia-cities"
              autoComplete="off"
              placeholder={t('field_city_placeholder')}
              className={textInputClass}
              {...form.register('city')}
            />
            <datalist id="colombia-cities">
              {COLOMBIA_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </datalist>
          </div>
        </div>

        <DriverSelect form={form} />
      </div>

      <ReportMoneyFields control={form.control} />

      <div className="flex flex-col gap-1">
        <label htmlFor="note" className={fieldLabelClass}>
          {t('field_note')}
        </label>
        <div className="relative">
          <FiFileText
            className="pointer-events-none absolute top-3 left-3 text-gray-400"
            aria-hidden="true"
          />
          <textarea id="note" rows={2} className={textInputClass} {...form.register('note')} />
        </div>
      </div>

      <button
        type="submit"
        className="self-start rounded-lg bg-[#0c2434] px-4 py-2 font-semibold text-[#f7f5ef] transition-colors hover:bg-[#14161b]"
      >
        {editingReport ? t('save_report') : t('add_report')}
      </button>
    </form>
  );
};
