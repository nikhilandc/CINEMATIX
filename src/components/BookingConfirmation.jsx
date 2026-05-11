import React, { useState, useEffect } from "react";
import {
  CheckCircle, Download, Share2, Home, Film,
  MapPin, Calendar, Clock, Ticket, QrCode, Star
} from "lucide-react";

export default function BookingConfirmation({ booking, navigate }) {
  const [revealed, setRevealed] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setTimeout(() => setRevealed(true), 100);
    setTimeout(() => setShowQR(true), 800);
  }, []);

  const { movie, theater, date, time, seats, totalPrice, bookingId } = booking;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-cinema-black pt-16 flex items-center justify-center px-4 py-16">
      {/* Success particle burst */}
      <ParticleBurst />

      <div
        className={`w-full max-w-lg transition-all duration-700 ${
          revealed ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex">
            <div className="w-20 h-20 rounded-full bg-cinema-red/20 border-2 border-cinema-red flex items-center justify-center animate-pulse-red">
              <CheckCircle className="w-10 h-10 text-cinema-red" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">✓</span>
            </div>
          </div>
          <h1 className="font-display text-4xl text-white tracking-wide mt-4 mb-1">BOOKING CONFIRMED</h1>
          <p className="text-cinema-muted text-sm">Your movie experience is all set!</p>
        </div>

        {/* Ticket card */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute -inset-4 bg-cinema-red/10 rounded-3xl blur-xl" />

          <div className="relative bg-cinema-dark border border-cinema-border rounded-2xl overflow-hidden">
            {/* Top section */}
            <div className="bg-gradient-to-br from-cinema-card to-cinema-dark p-6">
              {/* Booking ID */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-cinema-red" />
                  <span className="text-cinema-muted text-xs font-mono">BOOKING ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cinema-red font-mono font-bold text-sm tracking-widest">
                    {bookingId}
                  </span>
                  <button className="text-cinema-muted hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Movie info */}
              <div className="flex gap-4">
                <div className="w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 border border-cinema-border">
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-2xl text-white tracking-wide leading-tight mb-2">
                    {movie.title}
                  </h2>
                  <div
                    className="inline-block text-xs font-mono font-bold px-2 py-0.5 rounded mb-3"
                    style={{ background: movie.badgeColor + "33", color: movie.badgeColor, border: `1px solid ${movie.badgeColor}44` }}
                  >
                    {movie.badge}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-cinema-muted text-xs">
                      <Star className="w-3 h-3 fill-cinema-gold text-cinema-gold" />
                      {movie.rating} · {movie.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-cinema-muted text-xs">
                      <MapPin className="w-3 h-3" />
                      {theater?.name.split("—")[0].trim()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider with cutouts */}
            <TicketDivider />

            {/* Middle section */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4">
              <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date" value={formattedDate} />
              <InfoItem icon={<Clock className="w-4 h-4" />} label="Show Time" value={time} />
              <InfoItem
                icon={<Ticket className="w-4 h-4" />}
                label="Seats"
                value={seats.join(", ")}
              />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="Screen" value="Screen 4 · Row " />
            </div>

            {/* Divider */}
            <TicketDivider />

            {/* Bottom: QR + total */}
            <div className="px-6 py-5 flex items-center gap-6">
              {/* QR Code SVG */}
              <div
                className={`flex-shrink-0 transition-all duration-700 ${
                  showQR ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
              >
                <QRCodeSVG bookingId={bookingId} />
              </div>

              <div className="flex-1">
                <div className="text-cinema-muted text-xs font-mono mb-1">TOTAL AMOUNT</div>
                <div className="font-display text-4xl text-white leading-none">
                  ₹<span className="text-cinema-red">{totalPrice}</span>
                </div>
                <div className="text-cinema-muted text-xs mt-1">{seats.length} ticket{seats.length > 1 ? "s" : ""} · Tax included</div>

                <div className="mt-3 flex items-center gap-1.5 text-green-400 text-xs font-mono">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Payment Successful
                </div>
              </div>
            </div>

            {/* Scan line decoration */}
            <div className="h-1 bg-gradient-to-r from-transparent via-cinema-red/60 to-transparent" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 btn-outline flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => navigate("home")}
            className="flex-1 btn-red flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>

        {/* Rate experience */}
        <div className="mt-6 card-3d p-4 text-center">
          <p className="text-cinema-muted text-sm mb-3">Rate your booking experience</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-cinema-border hover:text-cinema-gold transition-colors">
                <Star className="w-6 h-6 hover:fill-cinema-gold" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-cinema-muted text-[10px] font-mono mb-1">
        <span className="text-cinema-red">{icon}</span>
        {label.toUpperCase()}
      </div>
      <div className="text-white text-sm font-medium leading-snug">{value}</div>
    </div>
  );
}

function TicketDivider() {
  return (
    <div className="relative flex items-center">
      <div className="w-5 h-5 rounded-full bg-cinema-black border-r border-cinema-border absolute -left-2.5" />
      <div className="flex-1 border-t border-dashed border-cinema-border mx-3" />
      <div className="w-5 h-5 rounded-full bg-cinema-black border-l border-cinema-border absolute -right-2.5" />
    </div>
  );
}

function QRCodeSVG({ bookingId }) {
  // Generate a pseudo-QR pattern based on bookingId
  const seed = bookingId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const grid = Array.from({ length: 21 }, (_, r) =>
    Array.from({ length: 21 }, (_, c) => {
      // Always-filled corner squares (position detection patterns)
      if ((r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7)) return true;
      // Timing patterns
      if (r === 6 || c === 6) return (r + c) % 2 === 0;
      // Data area
      return ((seed * (r + 1) * (c + 1)) % 3) === 0;
    })
  );

  return (
    <div className="relative p-2 bg-white rounded-xl">
      <svg width="80" height="80" viewBox="0 0 21 21">
        {grid.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width={1}
                height={1}
                fill="#0A0A0A"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

function ParticleBurst() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    distance: 80 + Math.random() * 60,
    size: 3 + Math.random() * 4,
    color: i % 3 === 0 ? "#E50914" : i % 3 === 1 ? "#FFD700" : "#FF6B6B",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            top: "40%",
            left: "50%",
            animation: `particle-float 3s ease-out ${p.id * 0.05}s 1 forwards`,
            transform: `translate(-50%, -50%) rotate(${p.angle}deg) translateY(-${p.distance}px)`,
          }}
        />
      ))}
    </div>
  );
}
