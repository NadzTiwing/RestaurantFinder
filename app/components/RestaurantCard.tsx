import type { Restaurant } from "./../types";
import Image from "next/image";
interface Props {
  restaurant: Restaurant;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="text-amber-500 text-sm tracking-wide" aria-label={`${rating} stars`}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

export function RestaurantCard({ restaurant }: Props) {
  const {
    name, rating, reviewCount, price,
    address, coordinates, imageUrl,
    url, categories, isClosed,
  } = restaurant;

  return (
    <article className="flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden transition hover:border-stone-300 hover:-translate-y-0.5">
      {/* Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="w-full h-40 object-cover bg-stone-100"
        />
      ) : (
        <div className="w-full h-40 bg-stone-100 flex items-center justify-center text-3xl text-stone-300">
          🍴
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Name + status */}
        <div className="flex items-start justify-between gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-stone-900 leading-snug hover:text-orange-600 transition"
          >
            {name}
          </a>
          <span
            className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-md ${
              isClosed
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-700"
            }`}
          >
            {isClosed ? "Closed" : "Open"}
          </span>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Stars rating={rating} />
          <span className="text-xs text-stone-400">
            {rating.toFixed(1)} ({reviewCount.toLocaleString()} reviews)
          </span>
          {price && (
            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
              {price}
            </span>
          )}
        </div>

        {/* Categories */}
        <p className="text-xs text-stone-400">{categories.join(" · ")}</p>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs text-stone-500">
          <span className="mt-px shrink-0">📍</span>
          <span>{address}</span>
        </div>

        {/* Coordinates */}
        <p className="text-xs text-stone-400 tabular-nums">
          🌐 {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
        </p>
      </div>
    </article>
  );
}