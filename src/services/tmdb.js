// ─────────────────────────────────────────────────────────────
//  CINEMATIX  ·  TMDB API Service
//  Base URL : https://api.themoviedb.org/3
//  Docs     : https://developer.themoviedb.org/docs
// ─────────────────────────────────────────────────────────────

const BASE_URL = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p";

// Reads from .env first; falls back to the dev key below.
// ⚠️  Regenerate and move to .env before deploying publicly.
const API_KEY =
  process.env.REACT_APP_TMDB_KEY || "49cdca30167a011a3b546ad48e89101d";

async function get(path, params = {}) {
  const qs = new URLSearchParams({ api_key: API_KEY, ...params }).toString();
  const res = await fetch(`${BASE_URL}${path}?${qs}`);
  if (!res.ok) throw new Error(`TMDB ${res.status} on ${path}`);
  return res.json();
}

// ── Genre lookup ──────────────────────────────────────────────
const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 18: "Drama", 14: "Fantasy", 27: "Horror",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller",
  10402: "Music", 10751: "Family", 36: "History", 99: "Documentary",
};

export const GENRE_IDS = {
  Action: 28, Adventure: 12, Animation: 16, Comedy: 35,
  Crime: 80, Drama: 18, Fantasy: 14, Horror: 27,
  Mystery: 9648, Romance: 10749, "Sci-Fi": 878, Thriller: 53,
};

// ── Badge assignment ──────────────────────────────────────────
const BADGES = ["IMAX", "4DX", "DOLBY", "3D", "ATMOS"];
const BADGE_COLORS = {
  IMAX: "#00C9FF", "4DX": "#FF6B35", DOLBY: "#7B2FBE",
  "3D": "#00E676", ATMOS: "#FFD700",
};
function pickBadge(id) {
  const b = BADGES[id % BADGES.length];
  return { badge: b, badgeColor: BADGE_COLORS[b] };
}

// ── Shape a raw TMDB result into our app model ────────────────
export function formatMovie(m) {
  const { badge, badgeColor } = pickBadge(m.id);
  return {
    id:          m.id,
    tmdbId:      m.id,
    title:       m.title || m.name || "Untitled",
    description: m.overview || "No synopsis available.",
    poster:      m.poster_path
                   ? `${IMG_BASE}/w500${m.poster_path}`
                   : "https://placehold.co/300x450/111111/E50914?text=No+Poster",
    backdrop:    m.backdrop_path
                   ? `${IMG_BASE}/w1280${m.backdrop_path}`
                   : "https://placehold.co/1280x720/111111/E50914?text=CINEMATIX",
    rating:      m.vote_average ? Number(m.vote_average).toFixed(1) : "—",
    year:        m.release_date ? m.release_date.split("-")[0] : "—",
    genre:       m.genre_ids
                   ? m.genre_ids.slice(0, 3).map(id => GENRE_MAP[id]).filter(Boolean)
                   : (m.genres || []).slice(0, 3).map(g => g.name),
    duration:    m.runtime
                   ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m`
                   : null,
    language:    (m.original_language || "en").toUpperCase(),
    director:    null,
    cast:        [],
    trailerKey:  null,
    badge,
    badgeColor,
    price:       { standard: 280, premium: 450, vip: 750 },
  };
}

// ── Public functions ──────────────────────────────────────────

/** Movies currently in theatres (India region) */
export async function fetchNowPlaying(page = 1) {
  const d = await get("/movie/now_playing", { page, region: "IN", language: "en-US" });
  return (d.results || []).map(formatMovie);
}

/** Trending movies this week (used for Hero carousel) */
export async function fetchTrending() {
  const d = await get("/trending/movie/week", { language: "en-US" });
  return (d.results || []).map(formatMovie);
}

/** Popular movies */
export async function fetchPopular(page = 1) {
  const d = await get("/movie/popular", { page, language: "en-US" });
  return (d.results || []).map(formatMovie);
}

/** Live search */
export async function searchMovies(query, page = 1) {
  if (!query.trim()) return [];
  const d = await get("/search/movie", { query, page, language: "en-US" });
  return (d.results || []).map(formatMovie);
}

/** Full detail — runtime, director, cast, trailer */
export async function fetchMovieDetail(tmdbId) {
  const [detail, videos] = await Promise.all([
    get(`/movie/${tmdbId}`, { append_to_response: "credits", language: "en-US" }),
    get(`/movie/${tmdbId}/videos`, { language: "en-US" }),
  ]);

  const trailer =
    (videos.results || []).find(v => v.type === "Trailer" && v.site === "YouTube") ||
    (videos.results || [])[0] ||
    null;

  const directorObj = (detail.credits?.crew || []).find(c => c.job === "Director");
  const cast = (detail.credits?.cast || []).slice(0, 8).map(c => c.name);

  return {
    ...formatMovie(detail),
    director:   directorObj?.name || "Unknown",
    cast,
    trailerKey: trailer?.key || null,
  };
}

/** Discover movies by genre id */
export async function fetchByGenre(genreId, page = 1) {
  const d = await get("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
    language: "en-US",
  });
  return (d.results || []).map(formatMovie);
}