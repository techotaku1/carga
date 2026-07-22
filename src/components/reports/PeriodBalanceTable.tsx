'use client';

import { useTranslations } from 'next-intl';
import type { PeriodBalance } from './cargoReportsBalance';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const earningClass = (amount: number) =>
  amount >= 0 ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-600';

const firstCol = 'px-4 py-3';
const col = 'border-gray-200 border-l px-4 py-3 text-right';

export const PeriodBalanceTable = (props: {
  entries: PeriodBalance[];
  periodHeader: string;
  formatPeriod: (period: string) => string;
  emptyLabel: string;
}) => {
  const t = useTranslations('ReportsBoard');

  if (props.entries.length === 0) {
    return <p className="text-gray-700">{props.emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-max border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-300 text-sm text-gray-700">
            <th className={firstCol}>{props.periodHeader}</th>
            <th className={col}>{t('balance_count')}</th>
            <th className={col}>{t('column_full_value')}</th>
            <th className={col}>{t('column_value_without_profit')}</th>
            <th className={col}>{t('column_profit')}</th>
            <th className={col}>{t('field_extra_profit')}</th>
            <th className={col}>{t('field_fuel_cost')}</th>
            <th className={col}>{t('field_toll_cost')}</th>
            <th className={col}>{t('field_other_cost')}</th>
            <th className={col}>{t('field_driver_payment')}</th>
            <th className={`${col} border-l-2 border-gray-300`}>{t('column_net')}</th>
          </tr>
        </thead>
        <tbody>
          {props.entries.map((entry) => (
            <tr className="border-b border-gray-200 text-gray-900 last:border-0" key={entry.period}>
              <td className={`${firstCol} font-bold text-[#0c2434] capitalize`}>
                {props.formatPeriod(entry.period)}
              </td>
              <td className={`${col} tabular-nums`}>{entry.balance.loadCount}</td>
              <td className={`${col} text-gray-900 tabular-nums`}>
                {currencyFormatter.format(entry.balance.totalFullValue)}
              </td>
              <td className={`${col} text-gray-500 tabular-nums`}>
                {currencyFormatter.format(entry.balance.totalValueWithoutProfit)}
              </td>
              <td className={`${col} tabular-nums ${earningClass(entry.balance.totalProfit)}`}>
                {currencyFormatter.format(entry.balance.totalProfit)}
              </td>
              <td className={`${col} tabular-nums ${earningClass(entry.balance.totalExtraProfit)}`}>
                {currencyFormatter.format(entry.balance.totalExtraProfit)}
              </td>
              <td className={`${col} text-amber-700 tabular-nums`}>
                {currencyFormatter.format(entry.balance.totalFuelCost)}
              </td>
              <td className={`${col} text-amber-700 tabular-nums`}>
                {currencyFormatter.format(entry.balance.totalTollCost)}
              </td>
              <td className={`${col} text-amber-700 tabular-nums`}>
                {currencyFormatter.format(entry.balance.totalOtherCost)}
              </td>
              <td className={`${col} text-amber-700 tabular-nums`}>
                {currencyFormatter.format(entry.balance.totalDriverPayment)}
              </td>
              <td
                className={`${col} border-l-2 border-gray-300 tabular-nums ${earningClass(entry.balance.totalNet)}`}
              >
                {currencyFormatter.format(entry.balance.totalNet)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
