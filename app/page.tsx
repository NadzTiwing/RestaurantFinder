"use client";

import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { RestaurantCard } from "./components/RestaurantCard";
import type { Restaurant, ApiResponse } from "./types";
import { RestaurantsSkeleton } from "./components/RestaurantsSkeleton";
import Pagination from "./components/Pagination";
import { ResultState } from "./components/ResultState";

const LIMIT = 20;

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [searched, setSearched] = useState(false);

  async function fetchRestaurants(searchCity: string, nextOffset: number) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/restaurants?city=${encodeURIComponent(searchCity)}&offset=${nextOffset}`,
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        let errorMessage = body.error || `Request failed (${res.status})`;
        console.log({ body })
        if (body.detail) {
          const parsedDetail = JSON.parse(body.detail);
          errorMessage = parsedDetail.error?.description || errorMessage;
        }
        throw new Error(errorMessage);
      }
      const data: ApiResponse = await res.json();
      setRestaurants(data.restaurants);
      setTotal(data.total);
      setOffset(nextOffset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(searchCity: string) {
    setCity(searchCity);
    setSearched(true);
    setOffset(0);
    fetchRestaurants(searchCity, 0);
  }

  function handlePrev() {
    if (!city || offset === 0) return;
    const nextOffset = Math.max(0, offset - LIMIT);
    setOffset(nextOffset);
    fetchRestaurants(city, nextOffset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    if (!city || offset + LIMIT >= total) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchRestaurants(city, nextOffset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(total / LIMIT);
  const hasPrev = offset > 0;
  const hasNext = offset + LIMIT < total;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero / Search header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <h1 className="text-2xl font-semibold text-stone-900 mb-1">
            🍽 YelpFinder
          </h1>
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-6">
            Discover top restaurants in any city
          </p>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </header>

      {/* Results */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Error */}
        {error && <ResultState type="empty" message={error} />}

        {/* Loading */}
        {loading && <RestaurantsSkeleton />}

        {/* Empty initial state */}
        {!loading && !searched && (
          <ResultState
            type="idle"
            message="Search a city to find restaurants"
          />
        )}

        {/* No results */}
        {!loading && !error && searched && restaurants.length === 0 && (
          <ResultState
            type="empty"
            message={`No restaurants found for "${city}". Try a different city.`}
          />
        )}

        {/* Results grid */}
        {!error && !loading && restaurants.length > 0 && (
          <>
            {/* Summary + pagination top */}
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <p className="text-xs text-stone-400">
                Showing{" "}
                <span className="font-medium">
                  {offset + 1}–{Math.min(offset + LIMIT, total)}
                </span>{" "}
                of <span className="font-medium">{total.toLocaleString()}</span>{" "}
                restaurants in <span className="font-medium">{city}</span>
              </p>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((r) => (
                <RestaurantCard key={`restaurant-${r.id}`} restaurant={r} />
              ))}
            </div>

            {/* Pagination bottom */}
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
