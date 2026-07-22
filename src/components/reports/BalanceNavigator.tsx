'use client';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const navButtonClass =
  'flex w-12 shrink-0 items-center justify-center rounded-lg border border-white/15 text-[#f7f5ef] transition-colors hover:border-[#f5c518] hover:text-[#f5c518] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-[#f7f5ef]';

export const BalanceNavigator = (props: {
  eyebrow: string;
  label: string;
  previousLabel: string;
  nextLabel: string;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) => (
  <section className="flex items-stretch gap-2 rounded-xl bg-[#14161b] p-2 text-[#f7f5ef]">
    <button
      aria-label={props.previousLabel}
      className={navButtonClass}
      disabled={!props.hasPrevious}
      onClick={props.onPrevious}
      type="button"
    >
      <FiChevronLeft aria-hidden="true" className="h-5 w-5" />
    </button>

    <div className="flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-0 rounded-lg border border-white/15 px-4 py-2.5 text-center">
      <span className="text-xs font-semibold tracking-[0.2em] text-[#f5c518] uppercase">
        {props.eyebrow}
      </span>
      <span className="text-lg font-semibold capitalize sm:text-xl">{props.label}</span>
    </div>

    <button
      aria-label={props.nextLabel}
      className={navButtonClass}
      disabled={!props.hasNext}
      onClick={props.onNext}
      type="button"
    >
      <FiChevronRight aria-hidden="true" className="h-5 w-5" />
    </button>
  </section>
);
