'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export const ReportDrawer = (props: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const t = useTranslations('ReportsBoard');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && props.open) {
        props.onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [props]);

  if (!props.open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t('drawer_close')}
        className="absolute inset-0 w-full bg-black/50"
        onClick={props.onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={props.title}
        className="drawer-slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{props.title}</h2>
          <button
            type="button"
            aria-label={t('drawer_close')}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            onClick={props.onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-5">{props.children}</div>
      </aside>
    </div>
  );
};
