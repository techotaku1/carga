/**
 * Formats a date as a local-timezone ISO day string (yyyy-mm-dd).
 * @param date - The date to format.
 * @returns The ISO day string in the local timezone.
 */
export const formatIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Returns today's date as a local-timezone ISO day string.
 * @returns The ISO day string for today.
 */
export const todayIsoDate = () => formatIsoDate(new Date());

/**
 * Shifts an ISO day string by a number of days, safe across month and year boundaries.
 * @param isoDate - The day to shift, in yyyy-mm-dd format.
 * @param days - The number of days to add (negative to go back).
 * @returns The shifted ISO day string.
 */
export const shiftIsoDate = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
};
