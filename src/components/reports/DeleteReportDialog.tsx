'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import type { CargoReport } from './CargoReport';

export const DeleteReportDialog = (props: {
  report: CargoReport | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}) => {
  const t = useTranslations('ReportsBoard');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmedRef = useRef(false);

  const setDialogRef = (dialog: HTMLDialogElement | null) => {
    dialogRef.current = dialog;

    if (dialog && props.report && !dialog.open) {
      dialog.showModal();
      cancelButtonRef.current?.focus();
    }
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    const handleBackdropClick = (event: MouseEvent) => {
      if (!dialog || !dialog.open) {
        return;
      }

      const bounds = dialog.getBoundingClientRect();
      const clickedBackdrop =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;

      if (clickedBackdrop) {
        dialog.close();
      }
    };

    dialog?.addEventListener('click', handleBackdropClick);

    return () => {
      dialog?.removeEventListener('click', handleBackdropClick);
    };
  }, []);
  return (
    <dialog
      ref={setDialogRef}
      aria-describedby="delete-report-description"
      aria-labelledby="delete-report-title"
      closedby="any"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[0.95rem] border border-slate-200 bg-white p-0 text-left shadow-2xl backdrop:bg-[#0c2434]/60"
      onClose={() => {
        if (confirmedRef.current) {
          confirmedRef.current = false;
          return;
        }

        props.onCancel();
      }}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl text-red-700"
            aria-hidden="true"
          >
            <FaTriangleExclamation />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#0c2434]" id="delete-report-title">
              {t('delete_report_title')}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600" id="delete-report-description">
              {t('delete_report_description', {
                loadNumber: props.report?.loadNumber ?? props.report?.id ?? '',
              })}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            className="rounded-lg border border-[#0c2434] px-4 py-2 font-semibold text-[#0c2434] transition-colors hover:bg-[#f7f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c2434]"
            onClick={closeDialog}
            type="button"
          >
            {t('delete_report_cancel')}
          </button>
          <button
            className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            onClick={() => {
              if (!props.report || confirmedRef.current) {
                return;
              }

              confirmedRef.current = true;
              closeDialog();
              props.onConfirm(props.report.id);
            }}
            type="button"
          >
            {t('delete_report_confirm')}
          </button>
        </div>
      </div>
    </dialog>
  );
};
