'use client';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
  FiCalendar,
  FiCheckSquare,
  FiClipboard,
  FiEdit2,
  FiFileText,
  FiMapPin,
  FiMoreHorizontal,
  FiSettings,
  FiTruck,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';
import {
  PiCoins,
  PiGasPump,
  PiHandCoins,
  PiHandWithdraw,
  PiMoneyWavy,
  PiRoadHorizon,
} from 'react-icons/pi';
import type { CargoReport } from './CargoReport';
import { reportNet } from './CargoReport';
import { DeleteReportDialog } from './DeleteReportDialog';
import { loadOtherCostLabel } from './otherCostLabelStorage';
import { ReportDrawer } from './ReportDrawer';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

type ReportsTableText = {
  columnPaid: string;
  columnDate: string;
  columnPlate: string;
  columnLoadNumber: string;
  columnCompany: string;
  columnCity: string;
  columnDriver: string;
  columnNote: string;
  columnFullValue: string;
  fieldExtraProfit: string;
  fieldFuelCost: string;
  fieldTollCost: string;
  fieldDriverPayment: string;
  columnNet: string;
  columnActions: string;
  viewNote: string;
  editReport: string;
  deleteReport: string;
  paidUpdateError: string;
};

export type ReportsTableMeta = {
  text: ReportsTableText;
  otherCostHeader: string;
  pendingPaidIds: Set<string>;
  onDeleteRequest: (report: CargoReport) => void;
  onEdit: (report: CargoReport) => void;
  onPaidChange: (report: CargoReport, paid: boolean) => Promise<void>;
  onViewNote: (report: CargoReport) => void;
  paidStatusLabel: (report: CargoReport) => string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isReportsTableText = (value: unknown): value is ReportsTableText => {
  if (!isRecord(value)) {
    return false;
  }

  const {
    columnActions,
    columnCity,
    columnCompany,
    columnDate,
    columnDriver,
    columnFullValue,
    columnLoadNumber,
    columnNet,
    columnNote,
    columnPaid,
    columnPlate,
    deleteReport,
    editReport,
    fieldDriverPayment,
    fieldExtraProfit,
    fieldFuelCost,
    fieldTollCost,
    paidUpdateError,
    viewNote,
  } = value;

  return [
    columnActions,
    columnCity,
    columnCompany,
    columnDate,
    columnDriver,
    columnFullValue,
    columnLoadNumber,
    columnNet,
    columnNote,
    columnPaid,
    columnPlate,
    deleteReport,
    editReport,
    fieldDriverPayment,
    fieldExtraProfit,
    fieldFuelCost,
    fieldTollCost,
    paidUpdateError,
    viewNote,
  ].every((item) => typeof item === 'string');
};

const isReportsTableMeta = (value: unknown): value is ReportsTableMeta => {
  if (!isRecord(value)) {
    return false;
  }

  const {
    onDeleteRequest,
    onEdit,
    onPaidChange,
    onViewNote,
    otherCostHeader,
    paidStatusLabel,
    pendingPaidIds,
    text,
  } = value;

  if (typeof onDeleteRequest !== 'function') {
    return false;
  }

  if (typeof onEdit !== 'function') {
    return false;
  }

  if (typeof onPaidChange !== 'function') {
    return false;
  }

  if (typeof onViewNote !== 'function') {
    return false;
  }

  if (typeof otherCostHeader !== 'string') {
    return false;
  }

  if (typeof paidStatusLabel !== 'function') {
    return false;
  }

  if (!(pendingPaidIds instanceof Set)) {
    return false;
  }

  return [...pendingPaidIds].every((id) => typeof id === 'string') && isReportsTableText(text);
};

const reportsTableMeta = (value: unknown): ReportsTableMeta | undefined => {
  if (!isRecord(value) || !('reportsTable' in value)) {
    return undefined;
  }

  const { reportsTable } = value;

  return isReportsTableMeta(reportsTable) ? reportsTable : undefined;
};

const headerClass =
  'whitespace-nowrap border-l border-slate-200 px-1.5 py-2 text-center text-[10px] font-bold tracking-tight text-[#0c2434] uppercase';
const cellClass =
  'whitespace-nowrap border-l border-slate-200 px-1.5 py-2 text-center align-middle text-[13px]';
const numberCellClass = `${cellClass} tabular-nums`;
const costCellClass = `${numberCellClass} text-amber-700`;

const earningClass = (amount: number) =>
  amount >= 0 ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-600';

const reportIdentifier = (report: CargoReport) => {
  if (report.loadNumber === '') {
    return report.id;
  }

  return report.loadNumber;
};

const Header = (props: { children: string; icon: React.ReactNode }) => (
  <span className="flex flex-col items-center justify-center gap-0.5 leading-none">
    <span className="text-base leading-none">{props.icon}</span>
    <span>{props.children}</span>
  </span>
);

const columns: ColumnDef<CargoReport>[] = [
  {
    id: 'paid',
    header: (context) => (
      <Header icon={<FiCheckSquare aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnPaid ?? ''}
      </Header>
    ),
    cell: (context) => {
      const meta = reportsTableMeta(context.table.options.meta);
      const { original: report } = context.row;
      const pending = meta?.pendingPaidIds.has(report.id) ?? false;

      return (
        <input
          aria-label={meta?.paidStatusLabel(report)}
          checked={report.paid}
          className="h-4 w-4 cursor-pointer accent-emerald-700 disabled:cursor-wait disabled:opacity-60"
          disabled={pending}
          onChange={(event) => {
            if (meta) {
              void meta.onPaidChange(report, event.target.checked);
            }
          }}
          type="checkbox"
        />
      );
    },
  },
  {
    accessorKey: 'date',
    header: (context) => (
      <Header icon={<FiCalendar aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnDate ?? ''}
      </Header>
    ),
  },
  {
    accessorKey: 'plate',
    header: (context) => (
      <Header icon={<FiTruck aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnPlate ?? ''}
      </Header>
    ),
    cell: (context) => (
      <span className="font-bold text-[#0c2434]">{context.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'loadNumber',
    header: (context) => (
      <Header icon={<FiClipboard aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnLoadNumber ?? ''}
      </Header>
    ),
  },
  {
    accessorKey: 'company',
    header: (context) => (
      <Header icon={<FiFileText aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnCompany ?? ''}
      </Header>
    ),
  },
  {
    accessorKey: 'city',
    header: (context) => (
      <Header icon={<FiMapPin aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnCity ?? ''}
      </Header>
    ),
  },
  {
    accessorKey: 'driver',
    header: (context) => (
      <Header icon={<FiUser aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnDriver ?? ''}
      </Header>
    ),
  },
  {
    accessorKey: 'note',
    header: (context) => (
      <Header icon={<FiFileText aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnNote ?? ''}
      </Header>
    ),
    cell: (context) => {
      const note = context.getValue<string>();
      const meta = reportsTableMeta(context.table.options.meta);

      return note ? (
        <button
          aria-label={meta?.text.viewNote}
          className="mx-auto block w-[11ch] truncate text-center text-[#0c2434] hover:underline"
          onClick={() => {
            meta?.onViewNote(context.row.original);
          }}
          type="button"
        >
          {note}
        </button>
      ) : (
        <span className="text-gray-400">—</span>
      );
    },
  },
  {
    accessorKey: 'fullValue',
    header: (context) => (
      <Header icon={<PiMoneyWavy aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnFullValue ?? ''}
      </Header>
    ),
    cell: (context) => currencyFormatter.format(context.getValue<number>()),
  },
  {
    accessorKey: 'extraProfit',
    header: (context) => (
      <Header icon={<PiHandCoins aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.fieldExtraProfit ?? ''}
      </Header>
    ),
    cell: (context) => (
      <span className={earningClass(context.getValue<number>())}>
        {currencyFormatter.format(context.getValue<number>())}
      </span>
    ),
  },
  {
    accessorKey: 'fuelCost',
    header: (context) => (
      <Header icon={<PiGasPump aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.fieldFuelCost ?? ''}
      </Header>
    ),
    cell: (context) => currencyFormatter.format(context.getValue<number>()),
  },
  {
    accessorKey: 'tollCost',
    header: (context) => (
      <Header icon={<PiRoadHorizon aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.fieldTollCost ?? ''}
      </Header>
    ),
    cell: (context) => currencyFormatter.format(context.getValue<number>()),
  },
  {
    accessorKey: 'otherCost',
    header: (context) => (
      <Header icon={<FiMoreHorizontal aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.otherCostHeader ?? ''}
      </Header>
    ),
    cell: (context) => currencyFormatter.format(context.getValue<number>()),
  },
  {
    accessorKey: 'driverPayment',
    header: (context) => (
      <Header icon={<PiHandWithdraw aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.fieldDriverPayment ?? ''}
      </Header>
    ),
    cell: (context) => currencyFormatter.format(context.getValue<number>()),
  },
  {
    id: 'net',
    header: (context) => (
      <Header icon={<PiCoins aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnNet ?? ''}
      </Header>
    ),
    cell: (context) => {
      const net = reportNet(context.row.original);

      return <span className="font-bold text-[#f5c518]">{currencyFormatter.format(net)}</span>;
    },
  },
  {
    id: 'actions',
    header: (context) => (
      <Header icon={<FiSettings aria-hidden="true" />}>
        {reportsTableMeta(context.table.options.meta)?.text.columnActions ?? ''}
      </Header>
    ),
    cell: (context) => {
      const meta = reportsTableMeta(context.table.options.meta);
      const { original: report } = context.row;

      return (
        <div className="flex items-center justify-center gap-1">
          <button
            aria-label={meta?.text.editReport}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-slate-100 hover:text-[#0c2434]"
            onClick={() => {
              meta?.onEdit(report);
            }}
            type="button"
          >
            <FiEdit2 aria-hidden="true" />
          </button>
          <button
            aria-label={meta?.text.deleteReport}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
            onClick={() => {
              meta?.onDeleteRequest(report);
            }}
            type="button"
          >
            <FiTrash2 aria-hidden="true" />
          </button>
        </div>
      );
    },
  },
];

const cellClassFor = (columnId: string) => {
  if (columnId === 'paid') {
    return 'whitespace-nowrap px-1.5 py-2 text-center align-middle';
  }

  if (columnId === 'date') {
    return `${cellClass} border-l-2 border-[#0c2434] text-gray-600`;
  }

  if (columnId === 'net') {
    return `${numberCellClass} border-l-2 border-[#0c2434] bg-[#14161b]`;
  }

  if (columnId === 'fullValue' || columnId === 'extraProfit') {
    return numberCellClass;
  }

  if (['fuelCost', 'tollCost', 'otherCost', 'driverPayment'].includes(columnId)) {
    return costCellClass;
  }

  return cellClass;
};

export const ReportsTable = (props: {
  reports: CargoReport[];
  onDelete: (id: string) => void;
  onEdit: (report: CargoReport) => void;
  onPaidChange: (report: CargoReport, paid: boolean) => Promise<void>;
}) => {
  const t = useTranslations('ReportsBoard');
  const [viewingNote, setViewingNote] = useState<CargoReport | null>(null);
  const [reportToDelete, setReportToDelete] = useState<CargoReport | null>(null);
  const [otherLabel, setOtherLabel] = useState('');
  const [pendingPaidIds, setPendingPaidIds] = useState<Set<string>>(() => new Set());
  const [paidUpdateError, setPaidUpdateError] = useState(false);

  useEffect(() => {
    setOtherLabel(loadOtherCostLabel());
  }, []);

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

  const table = useReactTable({
    columns,
    data: props.reports,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (report) => report.id,
    meta: {
      reportsTable: {
        otherCostHeader: otherLabel || t('field_other_cost'),
        onDeleteRequest: setReportToDelete,
        onEdit: props.onEdit,
        onPaidChange: updatePaidStatus,
        onViewNote: setViewingNote,
        paidStatusLabel: (report: CargoReport) =>
          report.paid
            ? t('paid_status_unmark', {
                loadNumber: reportIdentifier(report),
              })
            : t('paid_status_mark', {
                loadNumber: reportIdentifier(report),
              }),
        pendingPaidIds,
        text: {
          columnActions: t('column_actions'),
          columnCity: t('column_city'),
          columnCompany: t('column_company'),
          columnDate: t('column_date'),
          columnDriver: t('column_driver'),
          columnFullValue: t('column_full_value'),
          columnLoadNumber: t('column_load_number'),
          columnNet: t('column_net'),
          columnNote: t('column_note'),
          columnPaid: t('column_paid'),
          columnPlate: t('column_plate'),
          deleteReport: t('delete_report'),
          editReport: t('edit_report'),
          fieldDriverPayment: t('field_driver_payment'),
          fieldExtraProfit: t('field_extra_profit'),
          fieldFuelCost: t('field_fuel_cost'),
          fieldTollCost: t('field_toll_cost'),
          paidUpdateError: t('paid_update_error'),
          viewNote: t('view_note'),
        },
      },
    },
  });

  if (props.reports.length === 0) {
    return <p className="text-gray-700">{t('empty_state')}</p>;
  }

  return (
    <div className="overflow-x-auto">
      {paidUpdateError && (
        <p className="mb-3 text-sm text-red-700" role="alert">
          {t('paid_update_error')}
        </p>
      )}
      <table className="w-full border-collapse text-center">
        <thead className="bg-[#f7f5ef]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="border-b-2 border-[#0c2434]" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className={`${headerClass}${header.column.id === 'paid' ? ' border-l-0' : ''}${header.column.id === 'date' || header.column.id === 'net' ? ' border-l-2 border-[#0c2434]' : ''}`}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const pending = pendingPaidIds.has(row.id);

            return (
              <tr
                aria-busy={pending}
                className={`border-b border-slate-200 text-gray-900 transition-colors hover:bg-amber-50/60 ${
                  row.original.paid ? 'bg-emerald-50' : 'bg-white'
                }`}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className={cellClassFor(cell.column.id)} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
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

      <DeleteReportDialog
        onCancel={() => {
          setReportToDelete(null);
        }}
        onConfirm={(id) => {
          setReportToDelete(null);
          props.onDelete(id);
        }}
        report={reportToDelete}
      />
    </div>
  );
};
