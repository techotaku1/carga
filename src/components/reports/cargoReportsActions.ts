'use server';

import { auth } from '@clerk/nextjs/server';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { cargoReportsSchema } from '@/models/Schema';
import type { CargoReport } from './CargoReport';

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
      profit: row.profit,
      extraProfit: row.extraProfit,
      fuelCost: row.fuelCost,
      tollCost: row.tollCost,
      otherCost: row.otherCost,
    }),
  );
};

/**
 * Persists a new cargo report owned by the authenticated user.
 * @param report - The report to create.
 */
export const createCargoReport = async (report: CargoReport): Promise<void> => {
  const userId = await requireUserId();

  await db.insert(cargoReportsSchema).values({ ...report, userId });
};

/**
 * Updates an existing cargo report owned by the authenticated user.
 * @param report - The report with its new values.
 */
export const updateCargoReport = async (report: CargoReport): Promise<void> => {
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
      profit: report.profit,
      extraProfit: report.extraProfit,
      fuelCost: report.fuelCost,
      tollCost: report.tollCost,
      otherCost: report.otherCost,
    })
    .where(and(eq(cargoReportsSchema.id, report.id), eq(cargoReportsSchema.userId, userId)));
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
