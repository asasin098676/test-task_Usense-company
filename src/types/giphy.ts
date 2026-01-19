export type GiphyGif = {
  id: string;
  title: string;
  url: string;
  username: string;
  import_datetime: string;
  rating?: string;
  source?: string;

  images: {
    fixed_width: { url: string; width: string; height: string };
    original: { url: string; width: string; height: string };
  };

  user?: {
    username: string;
    display_name?: string;
    profile_url?: string;
    avatar_url?: string;
    is_verified?: boolean;
  };
};

export type GiphySearchResponse = {
  data: GiphyGif[];
  pagination: { total_count: number; count: number; offset: number };
  meta: { status: number; msg: string; response_id?: string };
};
