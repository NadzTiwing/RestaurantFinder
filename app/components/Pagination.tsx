interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: PaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="h-8 px-3 text-xs font-medium rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>

      <span className="text-xs text-stone-400 px-1">
        Page{" "}
        <span className="font-medium">{currentPage}</span>
        {" "}of{" "}
        <span className="font-medium">{totalPages}</span>
      </span>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="h-8 px-3 text-xs font-medium rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}