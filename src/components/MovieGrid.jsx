import React, { useState } from "react";
import { Star, Clock, Play, ChevronRight, Filter, TrendingUp, Loader2 } from "lucide-react";
import { fetchByGenre, GENRE_IDS } from "../services/tmdb";

const GENRES = ["All", "Action", "Sci-Fi", "Horror", "Romance", "Drama", "Thriller", "Animation", "Comedy"];

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-cinema-card border border-cinema-border animate-pulse">
      <div className="aspect-[2/3] bg-cinema-dark" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-cinema-dark rounded w-3/4" />
        <div className="h-3 bg-cinema-dark rounded w-1/2" />
        <div className="h-8 bg-cinema-dark rounded" />
      </div>
    </div>
  );
}

export default function MovieGrid({ navigate, movies = [], loading, searchQuery }) {
  const [activeGenre, setActiveGenre] = useState("All");
  const [hoveredId, setHoveredId]     = useState(null);
  const [genreMovies, setGenreMovies] = useState(null);
  const [genreLoading, setGenreLoading] = useState(false);
  const [sortBy, setSortBy]           = useState("default");

  const handleGenre = async (g) => {
    setActiveGenre(g);
    if (g === "All") { setGenreMovies(null); return; }
    setGenreLoading(true);
    try {
      const results = await fetchByGenre(GENRE_IDS[g] || 28);
      setGenreMovies(results);
    } catch (e) { console.error(e); }
    finally { setGenreLoading(false); }
  };

  // Which list to display
  let displayed = genreMovies || movies;
  if (sortBy === "rating") displayed = [...displayed].sort((a, b) => b.rating - a.rating);
  if (sortBy === "title")  displayed = [...displayed].sort((a, b) => a.title.localeCompare(b.title));

  const isLoading = loading || genreLoading;

  return (
    <section className="relative py-20 bg-cinema-black" id="movies">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-cinema-red" />
              <span className="text-cinema-red text-sm font-mono font-medium tracking-widest uppercase">
                {searchQuery ? `Results for "${searchQuery}"` : "Now Playing"}
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
              {searchQuery ? "SEARCH RESULTS" : "FEATURED FILMS"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-cinema-muted" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-cinema-dark border border-cinema-border text-cinema-text text-sm rounded-lg px-3 py-2 outline-none focus:border-cinema-red cursor-pointer">
              <option value="default">Default Order</option>
              <option value="rating">Sort by Rating</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Genre pills — hidden when searching */}
        {!searchQuery && (
          <div className="flex gap-2 flex-wrap mb-10">
            {GENRES.map((g) => (
              <button key={g} onClick={() => handleGenre(g)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeGenre === g
                    ? "bg-cinema-red text-white shadow-red-glow-sm"
                    : "bg-cinema-card border border-cinema-border text-cinema-muted hover:border-cinema-red/50 hover:text-white"
                }`}>
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : displayed.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  hovered={hoveredId === movie.id}
                  onHover={setHoveredId}
                  onBook={() => navigate("detail", { movie })}
                />
              ))
          }
        </div>

        {!isLoading && displayed.length === 0 && (
          <div className="text-center py-20 text-cinema-muted">
            <div className="text-5xl mb-4">🎬</div>
            <p className="text-lg">No movies found.</p>
          </div>
        )}

        {!isLoading && displayed.length > 0 && (
          <div className="text-center mt-10">
            <button className="btn-outline flex items-center gap-2 mx-auto">
              View All Movies <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function MovieCard({ movie, hovered, onHover, onBook }) {
  return (
    <div
      className="movie-card cursor-pointer group"
      onMouseEnter={() => onHover(movie.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onBook}
    >
      <div className="relative rounded-2xl overflow-hidden bg-cinema-card border border-cinema-border shadow-card-3d">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x450/111/E50914?text=No+Image"; }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/60 to-transparent transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-60"}`} />

          {/* Badge */}
          <div className="absolute top-3 left-3 text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
            style={{ background: (movie.badgeColor || "#00C9FF") + "33", border: `1px solid ${movie.badgeColor || "#00C9FF"}66`, color: movie.badgeColor || "#00C9FF" }}>
            {movie.badge}
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-cinema-black/70 backdrop-blur rounded-lg px-2 py-1">
            <Star className="w-3 h-3 fill-cinema-gold text-cinema-gold" />
            <span className="text-cinema-gold text-xs font-semibold">{movie.rating}</span>
          </div>

          {/* Play on hover */}
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-cinema-red/90 backdrop-blur flex items-center justify-center shadow-red-glow animate-pulse-red">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-display text-lg text-white tracking-wide leading-tight mb-1 line-clamp-2">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs text-cinema-muted flex-wrap">
              {movie.duration !== "2h 00m" && (
                <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{movie.duration}</div>
              )}
              <div className="flex gap-1 flex-wrap">
                {(movie.genre || []).slice(0, 2).map((g) => (
                  <span key={g} className="bg-white/10 px-1.5 py-0.5 rounded">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Book button */}
        <div className={`px-3 pb-3 pt-2 transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <button className="w-full btn-red text-sm py-2.5" onClick={(e) => { e.stopPropagation(); onBook(); }}>
            Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
}