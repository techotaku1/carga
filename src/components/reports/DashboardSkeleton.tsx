const TABLE_ROW_KEYS = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5'];

const BALANCE_CARD_KEYS = ['balance-1', 'balance-2', 'balance-3', 'balance-4'];

/**
 * Loading placeholder that mirrors the reports board layout so the dashboard
 * keeps its shape while data streams in or hydrates.
 * @param props - The component props.
 * @param props.label - The accessible loading label.
 * @returns The skeleton element.
 */
export const DashboardSkeleton = (props: { label: string }) => (
  <output
    aria-busy="true"
    aria-label={props.label}
    className="flex animate-pulse flex-col gap-6 motion-reduce:animate-none"
  >
    <div className="grid gap-4 rounded-xl bg-[#14161b] px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-stretch gap-2 sm:grid-cols-[auto_minmax(18rem,1fr)_auto]">
        <div className="h-16 w-16 rounded-lg border border-white/15" />
        <div className="flex flex-col justify-center gap-2 rounded-lg border border-white/15 px-4 py-3">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-6 w-40 rounded bg-white/15" />
        </div>
        <div className="flex items-stretch gap-2">
          <div className="h-16 w-16 rounded-lg border border-white/15" />
          <div className="w-20 rounded-lg border border-white/15" />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-16 rounded bg-white/10" />
          <div className="h-6 w-12 rounded bg-white/15" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="h-6 w-28 rounded bg-white/15" />
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
      <div className="h-10 flex-1 rounded-lg bg-gray-200" />
      <div className="h-10 w-full rounded-lg bg-gray-200 lg:w-40" />
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 grid grid-cols-4 gap-4 border-b border-gray-200 pb-3 sm:grid-cols-8">
        {[...BALANCE_CARD_KEYS, ...TABLE_ROW_KEYS.slice(0, 4)].map((key) => (
          <div className="h-4 rounded bg-gray-200" key={`head-${key}`} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {TABLE_ROW_KEYS.map((key) => (
          <div className="h-5 w-full rounded bg-gray-100" key={key} />
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {BALANCE_CARD_KEYS.map((key) => (
        <div className="flex flex-col gap-3 rounded-lg border border-gray-300 p-4" key={key}>
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-7 w-32 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  </output>
);
