import React, { useState, useEffect } from "react";
import { Search, Menu, X, Film, MapPin, Ticket, User, Bell } from "lucide-react";

export default function Navbar({ page, navigate, searchQuery, setSearchQuery }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-[0_4px_30px_rgba(0,0,0,0.6)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 group"
        >
          <div className="relative">
            <Film className="w-7 h-7 text-cinema-red group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 blur-md bg-cinema-red/40 group-hover:bg-cinema-red/70 transition-all rounded-full" />
          </div>
          <span className="font-display text-2xl sm:text-3xl tracking-widest text-white group-hover:text-cinema-red transition-colors duration-300">
            CINEMATIX
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Movies", icon: Film, action: () => navigate("home") },
            { label: "Cinemas", icon: MapPin, action: () => navigate("home") },
            { label: "My Tickets", icon: Ticket, action: () => {} },
          ].map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex items-center gap-2 text-cinema-muted hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide group"
            >
              <Icon className="w-4 h-4 group-hover:text-cinema-red transition-colors" />
              {label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className={`flex items-center transition-all duration-300 ${searchOpen ? "w-40 sm:w-56" : "w-9"}`}>
            {searchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                autoFocus
                className="bg-cinema-dark border border-cinema-border rounded-l-lg px-3 py-2 text-sm text-white w-full outline-none focus:border-cinema-red transition-colors"
              />
            )}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (searchOpen) setSearchQuery("");
              }}
              className={`p-2 rounded-lg hover:bg-cinema-card transition-all ${searchOpen ? "rounded-l-none border border-l-0 border-cinema-border" : ""}`}
            >
              {searchOpen ? (
                <X className="w-5 h-5 text-cinema-red" />
              ) : (
                <Search className="w-5 h-5 text-cinema-muted hover:text-white transition-colors" />
              )}
            </button>
          </div>

          <button className="relative p-2 rounded-lg hover:bg-cinema-card transition-all">
            <Bell className="w-5 h-5 text-cinema-muted hover:text-white transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cinema-red rounded-full animate-pulse" />
          </button>

          <button className="hidden sm:flex items-center gap-2 bg-cinema-red hover:bg-cinema-red-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-red-glow-sm">
            <User className="w-4 h-4" />
            Sign In
          </button>

          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-cinema-card transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-cinema-border p-4 space-y-2">
          {["Movies", "Cinemas", "My Tickets", "Sign In"].map((item) => (
            <button
              key={item}
              onClick={() => setMenuOpen(false)}
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-cinema-card text-cinema-text transition-all"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
