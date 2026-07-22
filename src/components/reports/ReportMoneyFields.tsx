'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import {
  FiDollarSign,
  FiDroplet,
  FiMap,
  FiMoreHorizontal,
  FiPlusCircle,
  FiUserCheck,
} from 'react-icons/fi';
import { CurrencyInput } from './CurrencyInput';
import { loadOtherCostLabel, saveOtherCostLabel } from './otherCostLabelStorage';
import type { ReportFormValues } from './reportFormModel';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const labelClass = 'text-sm font-medium text-gray-700';

export const ReportMoneyFields = (props: { control: Control<ReportFormValues> }) => {
  const t = useTranslations('ReportsBoard');
  const fullValue = useWatch({ control: props.control, name: 'fullValue' });
  const extraProfit = useWatch({ control: props.control, name: 'extraProfit' });
  const fuelCost = useWatch({ control: props.control, name: 'fuelCost' });
  const tollCost = useWatch({ control: props.control, name: 'tollCost' });
  const otherCost = useWatch({ control: props.control, name: 'otherCost' });
  const driverPayment = useWatch({ control: props.control, name: 'driverPayment' });
  const net = fullValue + extraProfit - (fuelCost + tollCost + otherCost + driverPayment);
  const [otherLabel, setOtherLabel] = useState('');

  useEffect(() => {
    setOtherLabel(loadOtherCostLabel());
  }, []);

  return (
    <div className="flex flex-col gap-4 rounded-[0.95rem] border border-gray-200 bg-[#f7f5ef] p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullValue" className={labelClass}>
            {t('field_full_value')}
          </label>
          <CurrencyInput
            id="fullValue"
            control={props.control}
            name="fullValue"
            icon={<FiDollarSign aria-hidden="true" />}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="extraProfit" className={labelClass}>
            {t('field_extra_profit')}
          </label>
          <CurrencyInput
            id="extraProfit"
            control={props.control}
            name="extraProfit"
            icon={<FiPlusCircle aria-hidden="true" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="fuelCost" className={labelClass}>
            {t('field_fuel_cost')}
          </label>
          <CurrencyInput
            id="fuelCost"
            control={props.control}
            name="fuelCost"
            icon={<FiDroplet aria-hidden="true" />}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tollCost" className={labelClass}>
            {t('field_toll_cost')}
          </label>
          <CurrencyInput
            id="tollCost"
            control={props.control}
            name="tollCost"
            icon={<FiMap aria-hidden="true" />}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            aria-label={t('other_cost_label_edit')}
            className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium text-gray-700 hover:border-gray-300 focus:border-[#0c2434] focus:bg-white focus:outline-none"
            onChange={(event) => {
              setOtherLabel(event.target.value);
              saveOtherCostLabel(event.target.value);
            }}
            placeholder={t('field_other_cost')}
            type="text"
            value={otherLabel}
          />
          <span className="text-xs text-gray-400">{t('other_cost_label_hint')}</span>
        </div>
        <CurrencyInput
          id="otherCost"
          control={props.control}
          name="otherCost"
          icon={<FiMoreHorizontal aria-hidden="true" />}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="driverPayment" className={labelClass}>
          {t('field_driver_payment')}
        </label>
        <CurrencyInput
          id="driverPayment"
          control={props.control}
          name="driverPayment"
          icon={<FiUserCheck aria-hidden="true" />}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-[#0c2434] px-4 py-3 text-[#f7f5ef]">
        <p className="text-sm text-[#f7f5ef]/70">{t('column_net')}</p>
        <p
          className={`text-xl font-bold tabular-nums ${net >= 0 ? 'text-[#f5c518]' : 'text-rose-400'}`}
        >
          {currencyFormatter.format(net)}
        </p>
      </div>
    </div>
  );
};
