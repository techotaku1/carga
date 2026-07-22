import * as z from 'zod';
import type { CargoReport } from './CargoReport';
import { DEFAULT_DRIVER } from './driversStorage';
import { todayIsoDate } from './reportDates';

export const PLATE_OPTIONS = ['NQL417', 'ETL242'] as const;
export const OTHER_PLATE_VALUE = 'other';

export const reportFormSchema = z.object({
  plate: z.string(),
  otherPlate: z.string(),
  date: z.string(),
  loadNumber: z.string(),
  company: z.string(),
  city: z.string(),
  driver: z.string(),
  note: z.string(),
  fullValue: z.number(),
  profit: z.number(),
  extraProfit: z.number(),
  fuelCost: z.number(),
  tollCost: z.number(),
  otherCost: z.number(),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;

export const defaultReportFormValues: ReportFormValues = {
  plate: PLATE_OPTIONS[0],
  otherPlate: '',
  date: todayIsoDate(),
  loadNumber: '',
  company: '',
  city: '',
  driver: DEFAULT_DRIVER,
  note: '',
  fullValue: 0,
  profit: 0,
  extraProfit: 0,
  fuelCost: 0,
  tollCost: 0,
  otherCost: 0,
};

/**
 * Maps a stored report into form values, unfolding a custom plate into the "other" option.
 * @param report - The report to edit.
 * @returns The matching form values.
 */
export const reportToFormValues = (report: CargoReport): ReportFormValues => {
  const isKnownPlate = PLATE_OPTIONS.some((option) => option === report.plate);

  return {
    plate: isKnownPlate ? report.plate : OTHER_PLATE_VALUE,
    otherPlate: isKnownPlate ? '' : report.plate,
    date: report.date,
    loadNumber: report.loadNumber,
    company: report.company,
    city: report.city,
    driver: report.driver,
    note: report.note,
    fullValue: report.fullValue,
    profit: report.profit,
    extraProfit: report.extraProfit,
    fuelCost: report.fuelCost,
    tollCost: report.tollCost,
    otherCost: report.otherCost,
  };
};
