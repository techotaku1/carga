'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FiUser } from 'react-icons/fi';
import { DriverModal } from './DriverModal';
import { DEFAULT_DRIVERS, loadDrivers, saveDrivers } from './driversStorage';
import type { ReportFormValues } from './reportFormModel';

const ADD_DRIVER_VALUE = 'add-driver';

const labelClass = 'text-sm font-medium text-gray-700';
const selectClass =
  'w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 focus:border-[#0c2434] focus:outline-none';
const iconClass = 'pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400';

export const DriverSelect = (props: { form: UseFormReturn<ReportFormValues> }) => {
  const t = useTranslations('ReportsBoard');
  const { form } = props;
  const [drivers, setDrivers] = useState<string[]>(DEFAULT_DRIVERS);
  const [modalOpen, setModalOpen] = useState(false);
  const selectedDriver = form.watch('driver');
  const driverField = form.register('driver');

  useEffect(() => {
    setDrivers(loadDrivers());
  }, []);

  // The report being edited may carry a driver that is not in the saved list yet.
  const driverOptions =
    selectedDriver && !drivers.includes(selectedDriver) ? [...drivers, selectedDriver] : drivers;

  const handleCreateDriver = (name: string) => {
    const trimmed = name.trim();
    const existing = drivers.find((driver) => driver.toLowerCase() === trimmed.toLowerCase());
    const driver = existing ?? trimmed;
    const nextDrivers = existing ? drivers : [...drivers, driver];

    setDrivers(nextDrivers);
    saveDrivers(nextDrivers);
    form.setValue('driver', driver, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="driver" className={labelClass}>
        {t('field_driver')}
      </label>
      <div className="relative">
        <FiUser className={iconClass} aria-hidden="true" />
        <select
          id="driver"
          name={driverField.name}
          ref={driverField.ref}
          value={selectedDriver}
          className={selectClass}
          onBlur={driverField.onBlur}
          onChange={(event) => {
            if (event.target.value === ADD_DRIVER_VALUE) {
              setModalOpen(true);
              return;
            }

            form.setValue('driver', event.target.value, { shouldValidate: true });
          }}
        >
          {driverOptions.map((driver) => (
            <option key={driver} value={driver}>
              {driver}
            </option>
          ))}
          <option value={ADD_DRIVER_VALUE}>{t('driver_add')}</option>
        </select>
      </div>

      <DriverModal
        open={modalOpen}
        onCreate={handleCreateDriver}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </div>
  );
};
