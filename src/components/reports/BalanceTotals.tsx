'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import type { CargoReportsBalance } from './cargoReportsBalance';
import { loadOtherCostLabel } from './otherCostLabelStorage';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const tileClass = 'rounded-lg border border-gray-200 bg-white px-3 py-2';
const labelClass = 'flex items-center gap-1 text-[0.7rem] text-gray-500 uppercase tracking-wide';
const valueClass = 'font-bold text-base tabular-nums';

export const BalanceTotals = (props: { balance: CargoReportsBalance }) => {
  const t = useTranslations('ReportsBoard');
  const [otherLabel, setOtherLabel] = useState('');

  useEffect(() => {
    setOtherLabel(loadOtherCostLabel());
  }, []);

  const net = props.balance.totalNet;
  const otherCostLabel = otherLabel || t('field_other_cost');

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <p className={`${labelClass} text-emerald-700`}>{t('balance_income')}</p>
          <p className={`${valueClass} text-emerald-700`}>
            {currencyFormatter.format(props.balance.totalIncome)}
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <p className={`${labelClass} text-amber-700`}>{t('balance_expenses')}</p>
          <p className={`${valueClass} text-amber-700`}>
            {currencyFormatter.format(props.balance.totalCosts)}
          </p>
        </div>

        <div className="rounded-lg bg-[#0c2434] px-3 py-2 text-[#f7f5ef]">
          <p className={`${labelClass} text-[#f7f5ef]/60`}>{t('balance_net')}</p>
          <p className={`${valueClass} ${net >= 0 ? 'text-[#f5c518]' : 'text-rose-400'}`}>
            {currencyFormatter.format(net)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <div className={tileClass}>
          <p className={labelClass}>{t('column_full_value')}</p>
          <p className={`${valueClass} text-gray-900`}>
            {currencyFormatter.format(props.balance.totalFullValue)}
          </p>
        </div>

        <div className={tileClass}>
          <p className={labelClass}>{t('column_value_without_profit')}</p>
          <p className={`${valueClass} text-gray-500`}>
            {currencyFormatter.format(props.balance.totalValueWithoutProfit)}
          </p>
        </div>

        <div className={tileClass}>
          <p className={labelClass}>{t('column_profit')}</p>
          <p className={`${valueClass} text-emerald-700`}>
            {currencyFormatter.format(props.balance.totalProfit)}
          </p>
        </div>

        <div className={tileClass}>
          <p className={labelClass}>
            <FiPlusCircle aria-hidden="true" className="text-emerald-600" />
            {t('field_extra_profit')}
          </p>
          <p className={`${valueClass} text-emerald-700`}>
            {currencyFormatter.format(props.balance.totalExtraProfit)}
          </p>
        </div>

        <div className={tileClass}>
          <p className={labelClass}>{t('field_fuel_cost')}</p>
          <p className={`${valueClass} text-amber-700`}>
            {currencyFormatter.format(props.balance.totalFuelCost)}
          </p>
        </div>

        <div className={tileClass}>
          <p className={labelClass}>{t('field_toll_cost')}</p>
          <p className={`${valueClass} text-amber-700`}>
            {currencyFormatter.format(props.balance.totalTollCost)}
          </p>
        </div>

        <div className={tileClass}>
          <p className={labelClass}>{otherCostLabel}</p>
          <p className={`${valueClass} text-amber-700`}>
            {currencyFormatter.format(props.balance.totalOtherCost)}
          </p>
        </div>

        <div className={tileClass}>
          <p className={labelClass}>{t('field_driver_payment')}</p>
          <p className={`${valueClass} text-amber-700`}>
            {currencyFormatter.format(props.balance.totalDriverPayment)}
          </p>
        </div>

        <div className={tileClass}>
          <p className={labelClass}>{t('balance_count')}</p>
          <p className={`${valueClass} text-gray-900`}>{props.balance.loadCount}</p>
        </div>
      </div>
    </div>
  );
};
