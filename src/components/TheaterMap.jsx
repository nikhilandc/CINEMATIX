import React, { useState } from "react";
import { MapPin, Star, Navigation, Wifi, Coffee, Car, Layers } from "lucide-react";
import { theaters } from "../data/movies";

// Lightweight map using SVG-based visualization (no external deps needed)
export default function TheaterMap({ navigate }) {
  const [selected, setSelected] = useState(theaters[0]);
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section className="py-20 bg-cinema-dark relative overflow-hidden" id="cinemas">
      {/* BG decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cinema-red/40 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-cinema-red/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Navigation className="w-5 h-5 text-cinema-red" />
          <span className="text-cinema-red text-sm font-mono font-medium tracking-widest uppercase">
            Find Cinemas
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-10">
          NEARBY THEATERS
        </h2>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map panel */}
          <div className="relative rounded-2xl overflow-hidden border border-cinema-border bg-cinema-card" style={{ minHeight: 420 }}>
            <LeafletMapEmbed theaters={theaters} selected={selected} onSelect={setSelected} />
          </div>

          {/* Theater list */}
          <div className="space-y-4">
            {theaters.map((theater) => (
              <TheaterCard
                key={theater.id}
                theater={theater}
                selected={selected?.id === theater.id}
                onSelect={() => setSelected(theater)}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeafletMapEmbed({ theaters, selected, onSelect }) {
  // Use an iframe with OpenStreetMap since react-leaflet requires separate install
  // We'll build a rich SVG map visualization instead
  const [hoveredPin, setHoveredPin] = useState(null);

  // Project lat/lng to our SVG viewport
  const bounds = {
    minLat: 28.45, maxLat: 28.67,
    minLng: 77.05, maxLng: 77.37,
  };
  const project = (lat, lng, w = 600, h = 400) => ({
    x: ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * w,
    y: h - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * h,
  });

  // Map grid lines
  const gridLines = [];
  for (let i = 0; i <= 6; i++) {
    gridLines.push(
      <line key={`h${i}`} x1="0" y1={i * 400 / 6} x2="600" y2={i * 400 / 6} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />,
      <line key={`v${i}`} x1={i * 600 / 6} y1="0" x2={i * 600 / 6} y2="400" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    );
  }

  // Roads (approximate paths)
  const roads = [
    { d: "M 60 200 L 540 200", width: 4 },
    { d: "M 300 20 L 300 380", width: 4 },
    { d: "M 60 300 Q 200 280 300 200 Q 400 120 540 100", width: 2.5 },
    { d: "M 60 120 Q 180 140 300 200 Q 420 260 540 280", width: 2.5 },
    { d: "M 150 20 L 100 380", width: 2 },
    { d: "M 450 20 L 500 380", width: 2 },
    { d: "M 0 80 L 600 80", width: 1.5 },
    { d: "M 0 320 L 600 320", width: 1.5 },
  ];

  return (
    <div className="relative w-full h-full bg-[#0d1117]" style={{ minHeight: 420 }}>
      {/* Dark map background with grid */}
      <svg width="100%" height="100%" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
        {/* Background zones */}
        <rect width="600" height="420" fill="#0d1117" />
        <rect x="50" y="50" width="200" height="150" rx="8" fill="rgba(229,9,20,0.03)" />
        <rect x="350" y="200" width="180" height="120" rx="8" fill="rgba(229,9,20,0.03)" />

        {/* Grid */}
        {gridLines}

        {/* Roads */}
        {roads.map((r, i) => (
          <path key={i} d={r.d} stroke="rgba(255,255,255,0.08)" strokeWidth={r.width} fill="none" strokeLinecap="round" />
        ))}

        {/* Yamuna river */}
        <path
          d="M 520 0 Q 480 100 500 200 Q 520 300 490 420"
          stroke="rgba(0,120,255,0.2)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />

        {/* District labels */}
        <text x="130" y="130" fill="rgba(255,255,255,0.15)" fontSize="10" fontFamily="monospace">CONNAUGHT PLACE</text>
        <text x="290" y="350" fill="rgba(255,255,255,0.15)" fontSize="10" fontFamily="monospace">SAKET</text>
        <text x="60" y="300" fill="rgba(255,255,255,0.15)" fontSize="10" fontFamily="monospace">GURGAON</text>
        <text x="420" y="170" fill="rgba(255,255,255,0.15)" fontSize="10" fontFamily="monospace">NOIDA</text>

        {/* Theater pins */}
        {theaters.map((t) => {
          const { x, y } = project(t.lat, t.lng);
          const isSelected = selected?.id === t.id;
          const isHovered = hoveredPin === t.id;
          const scale = isSelected ? 1.4 : isHovered ? 1.2 : 1;

          return (
            <g
              key={t.id}
              transform={`translate(${x}, ${y}) scale(${scale})`}
              style={{ cursor: "pointer", transformOrigin: `${x}px ${y}px`, transition: "all 0.3s" }}
              onClick={() => onSelect(t)}
              onMouseEnter={() => setHoveredPin(t.id)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              {/* Pulse ring */}
              {isSelected && (
                <>
                  <circle cx="0" cy="0" r="24" fill="rgba(229,9,20,0.1)" className="animate-ping" />
                  <circle cx="0" cy="0" r="18" fill="rgba(229,9,20,0.15)" />
                </>
              )}
              {/* Pin shadow */}
              <circle cx="2" cy="2" r="12" fill="rgba(0,0,0,0.4)" />
              {/* Pin */}
              <circle cx="0" cy="0" r="12" fill={isSelected ? "#E50914" : "#2A2A2A"} stroke={isSelected ? "#FF4444" : "#444"} strokeWidth="1.5" />
              {/* Film icon */}
              <text x="0" y="4" textAnchor="middle" fontSize="11" fill="white">🎬</text>
              {/* Dot */}
              <circle cx="0" cy="16" r="3" fill={isSelected ? "#E50914" : "#555"} />

              {/* Label */}
              {(isSelected || isHovered) && (
                <g transform="translate(0, -28)">
                  <rect x="-50" y="-14" width="100" height="18" rx="4" fill="rgba(17,17,17,0.95)" stroke="#E50914" strokeWidth="1" />
                  <text x="0" y="-2" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace">
                    {t.name.split("—")[0].trim()}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-cinema-card border border-cinema-border rounded-lg flex items-center justify-center text-cinema-text hover:border-cinema-red transition-all text-xs font-bold">+</button>
        <button className="w-8 h-8 bg-cinema-card border border-cinema-border rounded-lg flex items-center justify-center text-cinema-text hover:border-cinema-red transition-all text-xs font-bold">−</button>
        <button className="w-8 h-8 bg-cinema-card border border-cinema-border rounded-lg flex items-center justify-center text-cinema-muted hover:border-cinema-red transition-all">
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Location badge */}
      <div className="absolute bottom-4 left-4 glass rounded-xl px-4 py-2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-mono text-cinema-muted">Delhi, India</span>
      </div>

      {/* Scan line */}
      <div className="scan-line opacity-30" />
    </div>
  );
}

function TheaterCard({ theater, selected, onSelect, navigate }) {
  const amenityIcons = { IMAX: "🎬", "4DX": "⚡", "Dolby Atmos": "🔊", "VIP Lounge": "👑", Restaurant: "🍽️", Parking: "🅿️", "Food Court": "🥤", Café: "☕", "3D": "🥽", "Dolby Vision": "👁️", "Lounge Bar": "🍸", "ATMOS": "🔊" };

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 ${
        selected
          ? "border-cinema-red bg-cinema-red/5 shadow-red-glow-sm"
          : "border-cinema-border bg-cinema-card hover:border-cinema-red/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {selected && (
              <span className="w-2 h-2 rounded-full bg-cinema-red animate-pulse flex-shrink-0" />
            )}
            <h3 className="font-body font-semibold text-white text-sm leading-tight">
              {theater.name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-cinema-muted text-xs">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{theater.address}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-cinema-gold text-cinema-gold" />
            <span className="text-cinema-gold text-xs font-semibold">{theater.rating}</span>
          </div>
          <span className="text-cinema-muted text-xs">{theater.distance}</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {theater.amenities.slice(0, 4).map((a) => (
          <span
            key={a}
            className="text-xs bg-cinema-dark border border-cinema-border rounded-md px-2 py-0.5 text-cinema-muted flex items-center gap-1"
          >
            <span>{amenityIcons[a] || "✓"}</span>
            {a}
          </span>
        ))}
        {theater.amenities.length > 4 && (
          <span className="text-xs text-cinema-muted px-2 py-0.5">+{theater.amenities.length - 4}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-cinema-muted text-xs font-mono">{theater.screens} screens</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("detail", { theater });
          }}
          className="text-xs text-cinema-red hover:text-white font-semibold flex items-center gap-1 transition-colors"
        >
          Get Directions →
        </button>
      </div>
    </div>
  );
}
