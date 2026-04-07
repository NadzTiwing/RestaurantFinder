const CARD_COUNT = 6;

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Image placeholder */}
      <div className="w-full h-40 bg-stone-200 animate-pulse" />

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Name + badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 w-3/5 rounded bg-stone-200 animate-pulse" />
          <div className="h-5 w-12 rounded-md bg-stone-200 animate-pulse shrink-0" />
        </div>

        {/* Stars + review count */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 rounded bg-stone-200 animate-pulse" />
          <div className="h-3 w-20 rounded bg-stone-200 animate-pulse" />
        </div>

        {/* Categories */}
        <div className="h-3 w-2/5 rounded bg-stone-200 animate-pulse" />

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full rounded bg-stone-200 animate-pulse" />
          <div className="h-3 w-4/5 rounded bg-stone-200 animate-pulse" />
        </div>

        {/* Coordinates */}
        <div className="h-3 w-2/5 rounded bg-stone-100 animate-pulse" />
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-stone-100 bg-stone-50">
        <div className="h-3 w-20 rounded bg-stone-200 animate-pulse" />
      </div>
    </div>
  );
}

export function RestaurantsSkeleton() {
  return (
    <div>
      {/* Summary bar placeholder */}
      <div className="h-3 w-48 rounded bg-stone-200 animate-pulse mb-5" />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}