import * as z from 'zod';

const STORAGE_KEY = 'cargo-drivers';
export const DEFAULT_DRIVER = 'Juan';
export const DEFAULT_DRIVERS = [DEFAULT_DRIVER];

const driversSchema = z.array(z.string().min(1));

/**
 * Reads the saved driver names from localStorage.
 * @returns The saved drivers, or the default list when unavailable or invalid.
 */
export const loadDrivers = (): string[] => {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return DEFAULT_DRIVERS;
  }

  const parsed = driversSchema.safeParse(JSON.parse(raw));

  return parsed.success && parsed.data.length > 0 ? parsed.data : DEFAULT_DRIVERS;
};

/**
 * Persists the driver names to localStorage.
 * @param drivers - The driver names to persist.
 */
export const saveDrivers = (drivers: string[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
};
