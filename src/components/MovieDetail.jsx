import React, { useState, useEffect } from "react";
import {
  Star, Clock, Calendar, MapPin, Play, ChevronLeft,
  Globe, Award, Loader2, ExternalLink
} from "lucide-react";
import { theaters, showTimes } from "../data/theaters";
import { fetchMovieDetail } from "../services/tmdb";
import DatePicker from "./DatePicker";

export default function MovieDetail({
  movie, navigate,
  selectedDate, setSelectedDate,
  selectedTime, setSelectedTime,
  selectedTheater, setSelectedTheater,
}) {
  const [activeTab, setActiveTab]       = useState("book");
  const [fullMovie, setFullMovie]       = useState(movie);
  const [detailLoading, setDetailLoading] = useState(true);

  // Fetch full details (runtime, cast, director, trailer)
  useEffect(() => {
    setDetailLoading(true);
    fetchMovieDetail(movie.tmdbId || movie.id)
      .then((m) => setFullMovie(m))
      .catch(() => setFullMovie(movie))
      .finally(() => setDetailLoading(false));
  }, [movie.id]);

  const m = fullMovie;
  const canBook = selectedDate && selectedTime && selectedTheater;

  return (
    <div className="min-h-screen bg-cinema-black pt-16">
      {/* Backdrop */}
      <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <img src={m.backdrop} alt={m.title} className="w-full h-full object-cover"
          style={{ filter: "brightness(0.22) saturate(1.3)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/80 to-transparent" />

        <button onClick={() => navigate("home")}
          className="absolute top-6 left-4 sm:left-6 flex items-center gap-2 text-cinema-muted hover:text-white transition-colors glass rounded-xl px-4 py-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 w-full">
            <div className="flex flex-col sm:flex-row gap-6 items-end">
              {/* Poster */}
              <div className="hidden sm:block flex-shrink-0 w-36 lg:w-48 rounded-xl overflow-hidden border border-cinema-border shadow-card-3d -mb-16 relative z-10"
                style={{ animation: "float 6s ease-in-out infinite" }}>
                <img src={m.poster} alt={m.title} className="w-full aspect-[2/3] object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x450/111/E50914?text=No+Poster"; }} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {m.badge && (
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: (m.badgeColor || "#00C9FF") + "33", border: `1px solid ${m.badgeColor || "#00C9FF"}66`, color: m.badgeColor || "#00C9FF" }}>
                      {m.badge}
                    </span>
                  )}
                  {(m.genre || []).map((g) => (
                    <span key={g} className="text-xs bg-white/10 px-2 py-1 rounded text-cinema-muted">{g}</span>
                  ))}
                </div>

                <h1 className="font-display text-4xl sm:text-6xl text-white tracking-wide mb-3">{m.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-cinema-gold">
                    <Star className="w-4 h-4 fill-cinema-gold" />
                    <span className="font-semibold">{m.rating}</span>
                    <span className="text-cinema-muted">/10</span>
                  </div>
                  {m.duration && m.duration !== "2h 00m" && (
                    <div className="flex items-center gap-1.5 text-cinema-muted">
                      <Clock className="w-4 h-4" />{m.duration}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-cinema-muted">
                    <Globe className="w-4 h-4" />{m.language}
                  </div>
                  <div className="flex items-center gap-1.5 text-cinema-muted">
                    <Calendar className="w-4 h-4" />{m.year}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-20 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex gap-1 bg-cinema-dark rounded-xl p-1 w-fit">
              {["book", "about", "cast"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab === tab ? "bg-cinema-red text-white" : "text-cinema-muted hover:text-white"
                  }`}>
                  {tab === "book" ? "Book Tickets" : tab === "about" ? "About Film" : "Cast & Crew"}
                </button>
              ))}
            </div>

            {activeTab === "book" && (
              <BookingPanel
                theaters={theaters}
                selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                selectedTime={selectedTime} setSelectedTime={setSelectedTime}
                selectedTheater={selectedTheater} setSelectedTheater={setSelectedTheater}
              />
            )}
            {activeTab === "about" && <AboutPanel movie={m} loading={detailLoading} />}
            {activeTab === "cast" && <CastPanel movie={m} loading={detailLoading} />}
          </div>

          {/* Right summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card-3d p-6 space-y-6">
              <h3 className="font-display text-xl text-white tracking-wide">BOOKING SUMMARY</h3>
              <div className="space-y-3">
                <SummaryRow icon={<Award className="w-4 h-4" />} label="Movie" value={m.title} highlight />
                <SummaryRow icon={<MapPin className="w-4 h-4" />} label="Venue" value={selectedTheater?.name.split("—")[0].trim() || "—"} />
                <SummaryRow icon={<Calendar className="w-4 h-4" />} label="Date"
                  value={selectedDate ? new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"} />
                <SummaryRow icon={<Clock className="w-4 h-4" />} label="Time" value={selectedTime || "—"} />
                <SummaryRow icon={<Star className="w-4 h-4" />} label="Format" value={m.badge || "Standard"} />
              </div>

              <div className="border-t border-cinema-border pt-4">
                <p className="text-cinema-muted text-xs mb-2 font-mono">TICKET PRICES FROM</p>
                <div className="flex gap-3">
                  {Object.entries(m.price || { standard: 280, premium: 450, vip: 750 }).map(([type, price]) => (
                    <div key={type} className="flex-1 text-center bg-cinema-dark rounded-xl p-2 border border-cinema-border">
                      <div className="text-cinema-red font-semibold text-sm">₹{price}</div>
                      <div className="text-cinema-muted text-[10px] capitalize font-mono">{type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TMDB attribution */}
              <div className="flex items-center gap-2 text-[10px] text-cinema-muted border-t border-cinema-border pt-3">
                <ExternalLink className="w-3 h-3" />
                Data from The Movie Database (TMDB)
              </div>

              <button onClick={() => canBook && navigate("seats", { movie: m, theater: selectedTheater, date: selectedDate, time: selectedTime })}
                disabled={!canBook}
                className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                  canBook ? "bg-cinema-red text-white hover:bg-cinema-red-dark hover:shadow-red-glow animate-pulse-red" : "bg-cinema-border text-cinema-muted cursor-not-allowed"
                }`}>
                {canBook ? "→ Choose Seats" : "Select Date & Time"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ icon, label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-cinema-muted text-sm">{icon}{label}</div>
      <span className={`text-sm font-medium ${highlight ? "text-cinema-red" : "text-cinema-text"}`}>{value}</span>
    </div>
  );
}

function BookingPanel({ theaters, selectedDate, setSelectedDate, selectedTime, setSelectedTime, selectedTheater, setSelectedTheater }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-cinema-muted text-xs font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Select Date
        </h3>
        <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>
      <div>
        <h3 className="text-cinema-muted text-xs font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Select Showtime
        </h3>
        <div className="flex flex-wrap gap-3">
          {showTimes.map((time) => (
            <button key={time} onClick={() => setSelectedTime(time)}
              className={`px-5 py-3 rounded-xl border text-sm font-mono transition-all duration-200 ${
                selectedTime === time
                  ? "bg-cinema-red border-cinema-red text-white shadow-red-glow-sm"
                  : "border-cinema-border bg-cinema-dark text-cinema-text hover:border-cinema-red/50"
              }`}>
              {time}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-cinema-muted text-xs font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Select Theater
        </h3>
        <div className="space-y-3">
          {theaters.map((t) => (
            <button key={t.id} onClick={() => setSelectedTheater(t)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedTheater?.id === t.id ? "border-cinema-red bg-cinema-red/5" : "border-cinema-border bg-cinema-dark hover:border-cinema-red/40"
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white text-sm">{t.name}</span>
                <span className="text-cinema-muted text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{t.distance}</span>
              </div>
              <div className="text-cinema-muted text-xs mb-2">{t.address}</div>
              <div className="flex gap-1.5 flex-wrap">
                {t.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="text-[10px] bg-cinema-card border border-cinema-border px-1.5 py-0.5 rounded text-cinema-muted">{a}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPanel({ movie, loading }) {
  if (loading) return (
    <div className="space-y-4 animate-pulse">
      {[1,2,3,4].map(i => <div key={i} className="h-12 bg-cinema-card rounded-xl" />)}
    </div>
  );
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-body font-semibold text-white mb-3 flex items-center gap-2">
          <Play className="w-4 h-4 text-cinema-red" /> Synopsis
        </h3>
        <p className="text-cinema-muted leading-relaxed">{movie.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Director", value: movie.director || "—" },
          { label: "Language", value: movie.language },
          { label: "Duration", value: movie.duration },
          { label: "Release Year", value: movie.year },
        ].map(({ label, value }) => (
          <div key={label} className="bg-cinema-dark rounded-xl p-4 border border-cinema-border">
            <div className="text-cinema-muted text-xs font-mono mb-1">{label.toUpperCase()}</div>
            <div className="text-white font-semibold">{value}</div>
          </div>
        ))}
      </div>
      {movie.trailerKey && (
        <a href={`https://youtube.com/watch?v=${movie.trailerKey}`} target="_blank" rel="noreferrer"
          className="flex items-center gap-3 p-4 bg-cinema-dark rounded-xl border border-cinema-border hover:border-cinema-red/40 transition-all group">
          <div className="w-10 h-10 rounded-full bg-cinema-red/20 border border-cinema-red/40 flex items-center justify-center group-hover:bg-cinema-red transition-all">
            <Play className="w-4 h-4 text-cinema-red fill-cinema-red group-hover:text-white" />
          </div>
          <div>
            <div className="text-white font-medium text-sm">Watch Official Trailer</div>
            <div className="text-cinema-muted text-xs">YouTube · Opens in new tab</div>
          </div>
          <ExternalLink className="w-4 h-4 text-cinema-muted ml-auto" />
        </a>
      )}
    </div>
  );
}

function CastPanel({ movie, loading }) {
  const colors = ["#E50914","#7B2FBE","#00C9FF","#FF6B35","#00E676","#FFD700"];
  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-pulse">
      {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-cinema-card rounded-xl" />)}
    </div>
  );
  const cast = movie.cast?.length ? movie.cast : ["Actor 1","Actor 2","Actor 3"];
  return (
    <div className="space-y-4">
      <h3 className="font-body font-semibold text-white mb-4">Cast & Crew</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cast.map((name, i) => (
          <div key={name} className="flex flex-col items-center text-center p-4 bg-cinema-dark rounded-xl border border-cinema-border">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-display mb-3 border-2"
              style={{ background: colors[i % colors.length] + "33", borderColor: colors[i % colors.length] + "66" }}>
              {name.split(" ").map(n => n[0]).join("").slice(0,2)}
            </div>
            <div className="text-white font-medium text-sm">{name}</div>
            <div className="text-cinema-muted text-xs mt-1">Actor</div>
          </div>
        ))}
        {movie.director && movie.director !== "—" && (
          <div className="flex flex-col items-center text-center p-4 bg-cinema-dark rounded-xl border border-cinema-border">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-cinema-red text-xl font-display mb-3 border-2 border-cinema-red/30 bg-cinema-red/10">
              {movie.director.split(" ").map(n => n[0]).join("").slice(0,2)}
            </div>
            <div className="text-white font-medium text-sm">{movie.director}</div>
            <div className="text-cinema-red text-xs mt-1 font-mono">Director</div>
          </div>
        )}
      </div>
    </div>
  );
}