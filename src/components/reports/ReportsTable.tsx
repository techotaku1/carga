'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { CargoReport } from './CargoReport';
import { reportNet } from './CargoReport';
import { loadOtherCostLabel } from './otherCostLabelStorage';
import { ReportDrawer } from './ReportDrawer';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const firstCol = 'whitespace-nowrap px-3 py-2';
const col = 'whitespace-nowrap border-gray-200 border-l px-3 py-2';
const numCol = 'whitespace-nowrap border-gray-200 border-l px-3 py-2 text-right tabular-nums';
const costCol = `${numCol} text-amber-700`;

const earningClass = (amount: number) =>
  amount >= 0 ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-600';

export const ReportsTable = (props: {
  reports: CargoReport[];
  onDelete: (id: string) => void;
  onEdit: (report: CargoReport) => void;
  onPaidChange: (report: CargoReport, paid: boolean) => Promise<void>;
}) => {
  const t = useTranslations('ReportsBoard');
  const [viewingNote, setViewingNote] = useState<CargoReport | null>(null);
  const [otherLabel, setOtherLabel] = useState('');
  const [pendingPaidIds, setPendingPaidIds] = useState<Set<string>>(() => new Set());
  const [paidUpdateError, setPaidUpdateError] = useState(false);

  useEffect(() => {
    setOtherLabel(loadOtherCostLabel());
  }, []);

  if (props.reports.length === 0) {
    return <p className="text-gray-700">{t('empty_state')}</p>;
  }

  const otherCostHeader = otherLabel || t('field_other_cost');

  const updatePaidStatus = async (report: CargoReport, paid: boolean) => {
    setPaidUpdateError(false);
    setPendingPaidIds((current) => new Set(current).add(report.id));

    try {
      await props.onPaidChange(report, paid);
    } catch {
      setPaidUpdateError(true);
    } finally {
      setPendingPaidIds((current) => {
        const next = new Set(current);
        next.delete(report.id);
        return next;
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      {paidUpdateError && (
        <p className="mb-3 text-sm text-red-700" role="alert">
          {t('paid_update_error')}
        </p>
      )}
      <table className="w-full min-w-max border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-300 text-sm text-gray-700">
            <th className={`${firstCol} text-center`}>{t('column_paid')}</th>
            <th className={firstCol}>{t('column_date')}</th>
            <th className={col}>{t('column_plate')}</th>
            <th className={col}>{t('column_load_number')}</th>
            <th className={col}>{t('column_company')}</th>
            <th className={col}>{t('column_city')}</th>
            <th className={col}>{t('column_driver')}</th>
            <th className={col}>{t('column_note')}</th>
            <th className={`${col} text-right`}>{t('column_full_value')}</th>
            <th className={`${col} text-right`}>{t('field_extra_profit')}</th>
            <th className={`${col} text-right`}>{t('field_fuel_cost')}</th>
            <th className={`${col} text-right`}>{t('field_toll_cost')}</th>
            <th className={`${col} text-right`}>{otherCostHeader}</th>
            <th className={`${col} text-right`}>{t('field_driver_payment')}</th>
            <th className={`${col} border-l-2 border-gray-300 text-right`}>{t('column_net')}</th>
            <th aria-label={t('column_actions')} className={col} />
          </tr>
        </thead>
        <tbody>
          {props.reports.map((report) => {
            const net = reportNet(report);
            const paidUpdatePending = pendingPaidIds.has(report.id);

            return (
              <tr
                aria-busy={paidUpdatePending}
                className={`border-b border-gray-200 text-gray-900 transition-colors ${
                  report.paid ? 'bg-emerald-100' : 'bg-white'
                }`}
                key={report.id}
              >
                <td className={`${firstCol} text-center`}>
                  <input
                    aria-label={
                      report.paid
                        ? t('paid_status_unmark', { loadNumber: report.loadNumber || report.id })
                        : t('paid_status_mark', { loadNumber: report.loadNumber || report.id })
                    }
                    checked={report.paid}
                    className="h-4 w-4 cursor-pointer accent-emerald-700 disabled:cursor-wait disabled:opacity-60"
                    disabled={paidUpdatePending}
                    onChange={(event) => {
                      void updatePaidStatus(report, event.target.checked);
                    }}
                    type="checkbox"
                  />
                </td>
                <td className={`${firstCol} text-gray-600`}>{report.date}</td>
                <td className={`${col} font-bold text-[#0c2434]`}>{report.plate}</td>
                <td className={col}>{report.loadNumber}</td>
                <td className={col}>{report.company}</td>
                <td className={col}>{report.city}</td>
                <td className={col}>{report.driver}</td>
                <td className="border-l border-gray-200 px-3 py-2">
                  {report.note ? (
                    <button
                      aria-label={t('view_note')}
                      className="block max-w-[16rem] truncate text-left hover:text-[#0c2434] hover:underline"
                      onClick={() => {
                        setViewingNote(report);
                      }}
                      type="button"
                    >
                      {report.note}
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className={`${numCol} text-gray-900`}>
                  {currencyFormatter.format(report.fullValue)}
                </td>
                <td className={`${numCol} ${earningClass(report.extraProfit)}`}>
                  {currencyFormatter.format(report.extraProfit)}
                </td>
                <td className={costCol}>{currencyFormatter.format(report.fuelCost)}</td>
                <td className={costCol}>{currencyFormatter.format(report.tollCost)}</td>
                <td className={costCol}>{currencyFormatter.format(report.otherCost)}</td>
                <td className={costCol}>{currencyFormatter.format(report.driverPayment)}</td>
                <td className={`${numCol} border-l-2 border-gray-300 ${earningClass(net)}`}>
                  {currencyFormatter.format(net)}
                </td>
                <td className="border-l border-gray-200 px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      aria-label={t('edit_report')}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#0c2434]"
                      onClick={() => {
                        props.onEdit(report);
                      }}
                      type="button"
                    >
                      <FiEdit2 aria-hidden="true" />
                    </button>
                    <button
                      aria-label={t('delete_report')}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                      onClick={() => {
                        props.onDelete(report.id);
                      }}
                      type="button"
                    >
                      <FiTrash2 aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ReportDrawer
        onClose={() => {
          setViewingNote(null);
        }}
        open={viewingNote !== null}
        title={t('field_note')}
      >
        <p className="break-words whitespace-pre-wrap text-gray-900">{viewingNote?.note}</p>
      </ReportDrawer>
    </div>
  );
};
