const TABLE_ROW_KEYS = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5'];

const BALANCE_CARD_KEYS = ['balance-1', 'balance-2', 'balance-3', 'balance-4'];

const TableSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 grid min-w-[70rem] grid-cols-8 gap-3 border-b-2 border-[#0c2434] bg-[#f7f5ef] px-3 py-3">
      {[...TABLE_ROW_KEYS, 'head-6', 'head-7', 'head-8'].map((key) => (
        <div className="h-4 rounded bg-gray-200" key={key} />
      ))}
    </div>
    <div className="flex min-w-[70rem] flex-col gap-3 px-3 pb-1">
      {TABLE_ROW_KEYS.map((key) => (
        <div className="h-6 rounded bg-gray-100" key={key} />
      ))}
    </div>
  </div>
);

const BalanceTotalsSkeleton = () => (
  <div className="flex flex-col gap-2">
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {BALANCE_CARD_KEYS.slice(0, 3).map((key) => (
        <div className="h-[4.75rem] rounded-lg border border-gray-200 bg-gray-100" key={key} />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
      {[...BALANCE_CARD_KEYS, 'balance-5', 'balance-6', 'balance-7'].map((key) => (
        <div className="h-[4.5rem] rounded-lg border border-gray-200 bg-gray-100" key={key} />
      ))}
    </div>
  </div>
);

const SkeletonOutput = (props: { children: React.ReactNode; label: string }) => (
  <output
    aria-busy="true"
    aria-label={props.label}
    className="flex animate-pulse flex-col gap-4 motion-reduce:animate-none"
  >
    {props.children}
  </output>
);

/**
 * Loading placeholder that mirrors the reports board layout.
 * @param props - The component props.
 * @returns The reports board skeleton.
 */
export const ReportsBoardSkeleton = (props: { label: string }) => (
  <SkeletonOutput label={props.label}>
    <div className="grid gap-4 rounded-xl bg-[#14161b] px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="h-16 rounded-lg border border-white/15" />
      <div className="h-12 w-full rounded-lg border border-white/15 sm:w-48" />
    </div>
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
      <div className="h-10 flex-1 rounded-lg bg-gray-200" />
      <div className="h-10 w-full rounded-lg bg-gray-200 lg:w-52" />
    </div>
    <TableSkeleton />
  </SkeletonOutput>
);

/**
 * Loading placeholder that mirrors the balance board layout.
 * @param props - The component props.
 * @returns The balance board skeleton.
 */
export const BalanceBoardSkeleton = (props: { label: string }) => (
  <SkeletonOutput label={props.label}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-10 w-40 rounded-lg bg-gray-200" />
      <div className="h-7 w-28 rounded bg-gray-200" />
    </div>
    <div className="flex gap-2">
      <div className="h-10 w-24 rounded-lg bg-[#0c2434]" />
      <div className="h-10 w-24 rounded-lg bg-gray-200" />
    </div>
    <div className="h-20 rounded-xl bg-[#14161b]" />
    <BalanceTotalsSkeleton />
    <div className="h-[5.5rem] rounded-xl border border-gray-200 bg-white p-4 shadow-sm" />
    <TableSkeleton />
  </SkeletonOutput>
);
