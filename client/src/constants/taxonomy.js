export const CATEGORIES = [
  { name: "Anime" },
  { name: "Gaming" },
  { name: "Movies" },
  { name: "TV Shows" },
  { name: "K-Pop" },
  { name: "Comics" },
  { name: "Manga" },
  { name: "Cosplay" },
];

export const CONTENT_TYPES = [
  { value: "anime", label: "Anime" },
  { value: "game", label: "Game" },
  { value: "movie", label: "Movie" },
  { value: "tv", label: "TV Show" },
  { value: "kpop", label: "K-Pop" },
  { value: "comic", label: "Comic" },
  { value: "manga", label: "Manga" },
  { value: "cosplay", label: "Cosplay" },
];

export const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
  "Romance", "Sci-Fi", "Slice of Life", "Thriller", "Mecha", "Sports",
];

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "alphabetical", label: "Alphabetical" },
];

export const RELEASE_YEARS = Array.from({ length: 2027 - 1990 }, (_, i) => 2026 - i);

export const POPULARITY_OPTIONS = [
  { value: "90", label: "90+ (Blockbuster)" },
  { value: "80", label: "80+ (Highly Popular)" },
  { value: "70", label: "70+ (Rising Favorite)" },
  { value: "50", label: "50+ (Community Hits)" },
];

export const MERCH_TAGS = ["Limited Edition", "Pre-Order", "Collectible"];
