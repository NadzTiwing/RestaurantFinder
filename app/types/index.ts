export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: string | null;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  imageUrl: string | null;
  url: string;
  categories: string[];
  isClosed: boolean;
}

export interface ApiResponse {
  total: number;
  restaurants: Restaurant[];
}

// Shape of a Yelp business object (only fields we use)
export interface YelpBusiness {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  price?: string;
  location: { display_address: string[] };
  coordinates: { latitude: number; longitude: number };
  image_url?: string;
  url: string;
  categories: { title: string }[];
  is_closed: boolean;
}