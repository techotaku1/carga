'use client';

import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

const thousands = new Intl.NumberFormat('es-CO');

const toDigits = (raw: string) => raw.replaceAll(/\D/gu, '');

// Controlled currency input for COP amounts. Shows an empty field for zero (no
// default zero), formats live as `$ 10.000`, and reports a plain number to the form.
export const CurrencyInput = <TValues extends FieldValues>(props: {
  id: string;
  control: Control<TValues>;
  name: Path<TValues>;
  icon: React.ReactNode;
}) => (
  <Controller
    control={props.control}
    name={props.name}
    render={({ field }) => {
      const amount = typeof field.value === 'number' ? field.value : 0;

      return (
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            {props.icon}
          </span>
          <input
            id={props.id}
            type="text"
            inputMode="numeric"
            placeholder="$ 0"
            value={amount > 0 ? `$ ${thousands.format(amount)}` : ''}
            className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 tabular-nums focus:border-[#0c2434] focus:outline-none"
            onBlur={field.onBlur}
            onChange={(event) => {
              const digits = toDigits(event.target.value);
              field.onChange(digits === '' ? 0 : Number(digits));
            }}
          />
        </div>
      );
    }}
  />
);
