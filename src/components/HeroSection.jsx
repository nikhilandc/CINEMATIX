import React, { useState, useEffect } from "react";
import { Play, Star, Clock, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { fetchMovieDetail } from "../services/tmdb";

function TicketIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z" />
    </svg>
  );
}

function SkeletonHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cinema-black">
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-black to-cinema-dark animate-pulse" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-5">
            <div className="h-5 w-36 bg-cinema-card rounded-full" />
            <div className="h-20 w-3/4 bg-cinema-card rounded-xl" />
            <div className="h-5 w-48 bg-cinema-card rounded-full" />
            <div className="h-16 w-full bg-cinema-card rounded-xl" />
            <div className="flex gap-4">
              <div className="h-12 w-36 bg-cinema-red/30 rounded-lg" />
              <div className="h-12 w-36 bg-cinema-card rounded-lg" />
            </div>
          </div>
          <div className="w-52 sm:w-64 aspect-[2/3] bg-cinema-card rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

export default function HeroSection({ navigate, movies = [], loading }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [detailedMovie, setDetailedMovie] = useState(null);

  const featured = movies.slice(0, 5);
  const movie = detailedMovie || featured[current];

  // Fetch full detail for hero movie (trailer, runtime, etc.)
  useEffect(() => {
    if (!featured[current]) return;
    setDetailedMovie(null);
    fetchMovieDetail(featured[current].tmdbId || featured[current].id)
      .then(setDetailedMovie)
      .catch(() => setDetailedMovie(featured[current]));
  }, [current, movies]);

  const goTo = (index) => {
    if (animating || index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 350);
  };

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => goTo((current + 1) % featured.length), 6000);
    return () => clearInterval(timer);
  }, [current, featured.length]);

  if (loading || featured.length === 0) return <SkeletonHero />;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundImage: `url(${movie?.backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.15) saturate(1.5)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-cinema-black/40" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cinema-red to-transparent opacity-60" />
      <Particles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text */}
          <div className={`flex-1 transition-all duration-500 ${animating ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 bg-cinema-red/20 border border-cinema-red/30 text-cinema-red text-xs font-mono font-medium px-3 py-1.5 rounded-full">
                <Zap className="w-3 h-3" /> NOW TRENDING
              </div>
              {movie?.badge && (
                <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-full text-white"
                  style={{ background: (movie.badgeColor || "#E50914") + "33", border: `1px solid ${movie.badgeColor || "#E50914"}66`, color: movie.badgeColor || "#E50914" }}>
                  {movie.badge}
                </div>
              )}
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-white leading-none tracking-wider mb-4">
              {(movie?.title || "").split(" ").map((word, i) => (
                <span key={i} className={i === 0 ? "text-gradient" : ""}>{word} </span>
              ))}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1.5 text-cinema-gold font-semibold">
                <Star className="w-4 h-4 fill-cinema-gold" />
                {movie?.rating}
              </div>
              <span className="text-cinema-muted">|</span>
              {movie?.duration && (
                <div className="flex items-center gap-1.5 text-cinema-muted">
                  <Clock className="w-4 h-4" />{movie.duration}
                </div>
              )}
              <span className="text-cinema-muted">|</span>
              <div className="flex gap-2 flex-wrap">
                {(movie?.genre || []).map((g) => (
                  <span key={g} className="text-cinema-muted bg-white/5 px-2 py-0.5 rounded text-xs">{g}</span>
                ))}
              </div>
            </div>

            <p className="text-cinema-muted leading-relaxed max-w-lg text-sm sm:text-base mb-8 line-clamp-3">
              {movie?.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("detail", { movie })}
                className="btn-red flex items-center gap-2 text-base px-8 py-3.5 animate-pulse-red"
              >
                <TicketIcon className="w-5 h-5" /> Book Now
              </button>
              {movie?.trailerKey && (
                <a
                  href={`https://youtube.com/watch?v=${movie.trailerKey}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2 text-base px-8 py-3.5"
                >
                  <Play className="w-5 h-5 fill-current" /> Watch Trailer
                </a>
              )}
            </div>
          </div>

          {/* 3D Poster */}
          <div className="flex-shrink-0 perspective-1000">
            <div
              className={`relative transition-all duration-700 ${animating ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
              style={{ transform: "rotateY(-5deg)", transformStyle: "preserve-3d", animation: "float 6s ease-in-out infinite" }}
            >
              <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
                style={{ background: `radial-gradient(ellipse, ${movie?.badgeColor || "#E50914"}, transparent)` }} />

              <div className="relative w-52 sm:w-64 lg:w-72 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)]"
                style={{ border: "2px solid rgba(255,255,255,0.1)" }}>
                <img src={movie?.poster} alt={movie?.title} className="w-full aspect-[2/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-cinema-black/80 backdrop-blur border border-cinema-gold/40 rounded-xl px-3 py-2 text-center">
                  <div className="text-cinema-gold font-display text-xl leading-none">{movie?.rating}</div>
                  <div className="text-cinema-muted text-[10px] font-mono">TMDB</div>
                </div>
                {movie?.year && (
                  <div className="absolute bottom-4 left-4 bg-cinema-black/80 backdrop-blur rounded-lg px-2 py-1">
                    <span className="text-cinema-muted text-xs font-mono">{movie.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-6 mt-12">
          <button onClick={() => goTo((current - 1 + featured.length) % featured.length)}
            className="p-2 rounded-full border border-cinema-border hover:border-cinema-red hover:text-cinema-red transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-3 items-center">
            {featured.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="flex items-center gap-2">
                <div className={`h-1 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-cinema-red" : "w-4 bg-cinema-border"}`} />
              </button>
            ))}
          </div>
          <button onClick={() => goTo((current + 1) % featured.length)}
            className="p-2 rounded-full border border-cinema-border hover:border-cinema-red hover:text-cinema-red transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="hidden sm:block text-cinema-muted text-xs font-mono ml-2">
            {current + 1} / {featured.length}
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cinema-black to-transparent" />
    </section>
  );
}

function Particles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i, size: Math.random() * 3 + 1, left: Math.random() * 100,
    duration: Math.random() * 15 + 10, delay: Math.random() * 10,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full bg-cinema-red/30"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, bottom: "-10px",
            animation: `particle-float ${p.duration}s linear ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}