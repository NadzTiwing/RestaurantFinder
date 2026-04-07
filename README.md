# Restaurant Finder — Next.js 16

Discover top restaurants in any city, powered by the Yelp API.

## Project Structure

```
app/
├── api/
│   └── restaurants/
│       └── route.ts            # API Route — server-side Yelp queries
├── components/
│   ├── SearchBar.tsx           # Search input with validation
│   ├── RestaurantCard.tsx      # Individual restaurant display
│   ├── Pagination.tsx          # Previous-Next page navigation
│   ├── RestaurantsSkeleton.tsx # Loading skeleton
│   └── ResultState.tsx         # Empty/error state messages
├── types/
│   └── index.ts                # Shared TypeScript types
├── globals.css
├── layout.tsx
└── page.tsx                    # Home page (Client Component)
```

## Setup

### 1. Get a Yelp API Key
1. Go to https://www.yelp.com/developers/v3/manage_app
2. Create an app → copy the **API Key**

### 2. Configure environment
```bash
cp .env
# Open .env and paste your API key:
# NEXT_PUBLIC_YELP_API_KEY=your_key_here
```

### 3. Install & run
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## How It Works

### Architecture
- **API Route** (`app/api/restaurants/route.ts`): Server-side only — accepts city name, validates input, calls Yelp API, returns restaurants
- **Client Component** (`app/page.tsx`): Manages search state, pagination, loading/error states
- **UI Components**: Reusable cards, pagination, skeleton loaders, and empty states

### Security
The API key lives exclusively in `.env` and is read only server-side in the Route Handler.

### Data Flow
1. User enters city name → `SearchBar` validates (non-empty) → triggers fetch
2. Route Handler validates city, constructs request to Yelp with:
   - `location`: city name
   - `categories: restaurants`
   - `radius: 8000` (~5 miles)
   - `sort_by: best_match`
   - `cache: "no-store"` — always fresh
3. Yelp response → transformed into `Restaurant[]` → sent to client
4. Client renders paginated results (20 per page)

## Approaches & Techniques

### Input Validation
- **City field**: Checked for empty strings (trimmed) before API call
- **Rate limiting**: Max 50 results enforced (`Math.min(limit, 50)`)
- **Pagination**: Validated offset bounds to prevent out-of-range requests

### Error Handling
- **API errors**: Captures HTTP status from Yelp, parses JSON error details, shows human-readable messages
- **Network failures**: Catches and displays error messages
- **Missing data**: Gracefully handles null `price` and `image_url` fields (shows emoji placeholder)

### Performance
- **Image optimization**: image with lazy loading
- **No caching**: `cache: "no-store"` ensures fresh results from Yelp
- **Client-side pagination**: Reduces API calls (load 20–50 at a time)

### Accuracy & Edge Cases

| Scenario | Handling |
|----------|----------|
| **Empty search** | Rejected by validation; error shown |
| **No results** | "No restaurants found" message |
| **Yelp API down** | HTTP error + Yelp error detail displayed |
| **Missing price** | Shows as `null` → not rendered |
| **Missing image** | Shows fork & knife emoji (🍴) placeholder |
| **Closed restaurants** | Badge indicates "Closed" vs "Open" status |
| **Pagination bounds** | Prev/Next buttons disabled at edges (offset 0, end of results) |
| **Rating display** | Shows half-stars (e.g., 4½) for decimal ratings |

### Coordinates
All restaurants include latitude/longitude.