'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';

export const ReportDrawer = (props: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const t = useTranslations('ReportsBoard');
  const dialogRef = useRef<HTMLDialogElement>(null);

  const setDialogRef = (dialog: HTMLDialogElement | null) => {
    dialogRef.current = dialog;

    const handleBackdropClick = (event: MouseEvent) => {
      if (!dialog) {
        return;
      }

      const bounds = dialog.getBoundingClientRect();
      const clickedBackdrop =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;

      if (clickedBackdrop && dialog.open) {
        dialog.close();
      }
    };
    const cleanup = () => {
      dialog?.removeEventListener('click', handleBackdropClick);
    };

    if (!dialog) {
      return cleanup;
    }

    dialog.addEventListener('click', handleBackdropClick);

    if (props.open && !dialog.open) {
      dialog.showModal();
    } else if (!props.open && dialog.open) {
      dialog.close();
    }

    return cleanup;
  };

  return (
    <dialog
      ref={setDialogRef}
      closedby="any"
      aria-label={props.title}
      className="drawer-slide-in fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-full max-w-md overflow-y-auto border-0 bg-white p-0 shadow-2xl backdrop:bg-black/50"
      onClose={() => {
        props.onClose();
      }}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{props.title}</h2>
        <button
          type="button"
          aria-label={t('drawer_close')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          ✕
        </button>
      </div>
      <div className="p-5">{props.children}</div>
    </dialog>
  );
};
