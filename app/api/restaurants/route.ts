import { NextRequest, NextResponse } from "next/server";
import type { YelpBusiness, ApiResponse } from "@/app/types";

const YELP_API_KEY = process.env.NEXT_PUBLIC_YELP_API_KEY;
const MILES_IN_METERS = "8000"; // ~5 miles in meters

interface ValidationResult {
  valid: boolean;
  error?: string;
  status: number;
}

function validate(city: string): ValidationResult {
  if (!YELP_API_KEY) {
    return {
      valid: false,
      error: "YELP_API_KEY is not configured",
      status: 500,
    };
  }

  if (!city || city.trim() === "") {
    return { valid: false, error: "City is required", status: 400 };
  }

  return { valid: true, status: 200 };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const city = searchParams.get("city")?.trim();
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  const { valid, error, status } = validate(city ?? "");
  if (!valid) {
    return NextResponse.json({ error }, { status });
  }

  const params = new URLSearchParams({
    location: city ?? "",
    categories: "restaurants",
    limit: String(limit),
    radius: MILES_IN_METERS,
    sort_by: "best_match",
  });

  const yelpRes = await fetch(
    `https://api.yelp.com/v3/businesses/search?${params}`,
    {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
        Accept: "application/json",
      },
      // Opt out of Next.js fetch cache — results should always be fresh
      cache: "no-store",
    },
  );

  if (!yelpRes.ok) {
    const detail = await yelpRes.text();
    console.error("Yelp API error:", yelpRes.status, detail);
    return NextResponse.json(
      { error: "Yelp API error", detail },
      { status: yelpRes.status },
    );
  }

  const data = await yelpRes.json();

  const restaurants = (data.businesses as YelpBusiness[]).map((biz) => ({
    id: biz.id,
    name: biz.name,
    rating: biz.rating,
    reviewCount: biz.review_count,
    price: biz.price ?? null,
    address: biz.location.display_address.join(", "),
    coordinates: biz.coordinates,
    imageUrl: biz.image_url ?? null,
    url: biz.url,
    categories: biz.categories.map((c) => c.title),
    isClosed: biz.is_closed,
  }));

  const body: ApiResponse = { total: data.total, restaurants };

  return NextResponse.json(body);
}
