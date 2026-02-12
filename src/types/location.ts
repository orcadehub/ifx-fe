export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
  code?: string;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
  country_id: number;
}

export interface Niche {
  id: number;
  name: string;
  description?: string;
}

export interface Hashtag {
  id: number;
  name: string;
}

export interface Influencer {
  id: string;
  name: string;
  username?: string;
  bio?: string;
  image_url?: string;
  avatar_url?: string;
  profilePic?: string;
  email?: string;
  category?: string;
  followers_instagram?: number;
  followers_facebook?: number;
  followers_youtube?: number;
  followers_twitter?: number;
  engagement_rate?: number;
  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;
  niche_id?: number | null;
  is_blurred?: boolean;
  country?: Country;
  state?: State;
  city?: City;
  niche?: Niche;
  hashtags?: Hashtag[];
  social_platforms?: { platform_name: string }[];
  is_verified?: boolean;
  is_trending?: boolean;
  data?: {
    instagram?: { total_followers: number };
    facebook?: { total_followers: number };
    youtube?: { total_followers: number };
    twitter?: { total_followers: number };
  };
}

export interface LocationFilters {
  countryId?: number;
  stateId?: number;
  cityId?: number;
}
