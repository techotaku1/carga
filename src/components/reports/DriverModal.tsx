'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export const DriverModal = (props: {
  open: boolean;
  onCreate: (name: string) => void;
  onClose: () => void;
}) => {
  const t = useTranslations('ReportsBoard');
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);

  if (!props.open) {
    return null;
  }

  const handleClose = () => {
    setName('');
    setShowError(false);
    props.onClose();
  };

  const handleCreate = () => {
    const trimmed = name.trim();

    if (trimmed === '') {
      setShowError(true);
      return;
    }

    props.onCreate(trimmed);
    setName('');
    setShowError(false);
    props.onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('driver_cancel')}
        className="absolute inset-0 w-full bg-black/50"
        onClick={handleClose}
      />
      <dialog
        open
        aria-labelledby="driver-modal-title"
        className="relative m-0 w-full max-w-sm rounded-xl border-0 bg-white p-5 shadow-2xl"
        onCancel={(event) => {
          event.preventDefault();
          handleClose();
        }}
      >
        <h3 id="driver-modal-title" className="text-lg font-semibold text-gray-900">
          {t('driver_modal_title')}
        </h3>

        <div className="mt-4 flex flex-col gap-1">
          <label htmlFor="new-driver-name" className="text-sm font-medium text-gray-700">
            {t('driver_name_label')}
          </label>
          <input
            id="new-driver-name"
            type="text"
            aria-label={t('driver_name_label')}
            className="rounded-lg border border-gray-300 px-3 py-2"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleCreate();
              }
            }}
          />
          {showError && <span className="text-sm text-red-600">{t('error_required')}</span>}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400"
            onClick={handleClose}
          >
            {t('driver_cancel')}
          </button>
          <button
            type="button"
            className="rounded-lg bg-[#f5c518] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#e3b512]"
            onClick={handleCreate}
          >
            {t('driver_create')}
          </button>
        </div>
      </dialog>
    </div>
  );
};
