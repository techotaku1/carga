export type CargoReport = {
  id: string;
  plate: string;
  date: string; // ISO yyyy-mm-dd
  loadNumber: string;
  company: string;
  city: string; // ciudad de destino
  driver: string;
  note: string;
  fullValue: number; // valor completo del flete (total, con ganancia incluida)
  profit: number; // ganancia (manual, varía por carga)
  extraProfit: number; // ganancia extra (ingreso adicional)
  fuelCost: number; // gasolina
  tollCost: number; // peajes
  otherCost: number; // otros costos
};

/**
 * Sums the cost components (fuel, tolls, other) for a report.
 * @param report - The report to total costs for.
 * @returns The combined cost amount.
 */
const reportCosts = (report: CargoReport) => report.fuelCost + report.tollCost + report.otherCost;

/**
 * Returns the manually entered profit for a report.
 * @param report - The report to read profit from.
 * @returns The profit amount.
 */
export const reportProfit = (report: CargoReport) => report.profit;

/**
 * Computes the full value minus the profit (the value without the margin).
 * @param report - The report to compute from.
 * @returns The value without profit.
 */
export const reportValueWithoutProfit = (report: CargoReport) => report.fullValue - report.profit;

/**
 * Total inflows for a report: full value plus extra income.
 * @param report - The report to compute from.
 * @returns The income amount.
 */
const reportIncome = (report: CargoReport) => report.fullValue + report.extraProfit;

/**
 * Net result for a report: inflows minus outflows (costs).
 * @param report - The report to compute from.
 * @returns The net amount, which may be negative.
 */
export const reportNet = (report: CargoReport) => reportIncome(report) - reportCosts(report);
