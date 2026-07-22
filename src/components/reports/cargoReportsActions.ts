'use server';

import { auth } from '@clerk/nextjs/server';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { cargoReportsSchema } from '@/models/Schema';
import type { CargoReport } from './CargoReport';

type EditableCargoReport = Omit<CargoReport, 'paid'>;

const editableFields = ({ paid: _paid, ...report }: EditableCargoReport & { paid?: boolean }) =>
  report;

const requireUserId = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
};

/**
 * Lists the authenticated user's cargo reports, oldest date first.
 * @returns The user's cargo reports.
 */
export const listCargoReports = async (): Promise<CargoReport[]> => {
  const userId = await requireUserId();

  const rows = await db
    .select()
    .from(cargoReportsSchema)
    .where(eq(cargoReportsSchema.userId, userId))
    .orderBy(asc(cargoReportsSchema.date));

  return rows.map(
    (row): CargoReport => ({
      id: row.id,
      plate: row.plate,
      date: row.date,
      loadNumber: row.loadNumber,
      company: row.company,
      city: row.city,
      driver: row.driver,
      note: row.note,
      fullValue: row.fullValue,
      extraProfit: row.extraProfit,
      fuelCost: row.fuelCost,
      tollCost: row.tollCost,
      otherCost: row.otherCost,
      driverPayment: row.driverPayment,
      paid: row.paid,
    }),
  );
};

/**
 * Persists a new cargo report owned by the authenticated user.
 * @param report - The report to create.
 */
export const createCargoReport = async (report: EditableCargoReport): Promise<void> => {
  const userId = await requireUserId();

  await db.insert(cargoReportsSchema).values({ ...editableFields(report), userId });
};

/**
 * Updates an existing cargo report owned by the authenticated user.
 * @param report - The report with its new values.
 */
export const updateCargoReport = async (report: EditableCargoReport): Promise<void> => {
  const userId = await requireUserId();

  await db
    .update(cargoReportsSchema)
    .set({
      plate: report.plate,
      date: report.date,
      loadNumber: report.loadNumber,
      company: report.company,
      city: report.city,
      driver: report.driver,
      note: report.note,
      fullValue: report.fullValue,
      extraProfit: report.extraProfit,
      fuelCost: report.fuelCost,
      tollCost: report.tollCost,
      otherCost: report.otherCost,
      driverPayment: report.driverPayment,
    })
    .where(and(eq(cargoReportsSchema.id, report.id), eq(cargoReportsSchema.userId, userId)));
};

/**
 * Updates only the paid status of a report owned by the authenticated user.
 * @param id - The report id.
 * @param paid - The new paid status.
 */
export const setCargoReportPaid = async (id: string, paid: boolean): Promise<void> => {
  const userId = await requireUserId();

  await db
    .update(cargoReportsSchema)
    .set({ paid })
    .where(and(eq(cargoReportsSchema.id, id), eq(cargoReportsSchema.userId, userId)));
};

/**
 * Deletes a cargo report owned by the authenticated user.
 * @param id - The id of the report to delete.
 */
export const deleteCargoReport = async (id: string): Promise<void> => {
  const userId = await requireUserId();

  await db
    .delete(cargoReportsSchema)
    .where(and(eq(cargoReportsSchema.id, id), eq(cargoReportsSchema.userId, userId)));
};
