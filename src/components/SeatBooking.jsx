import React, { useState, useMemo } from "react";
import { ChevronLeft, Info, ShoppingCart, Zap, Crown, Users, Minus, Plus } from "lucide-react";
import { seatConfig } from "../data/movies";

export default function SeatBooking({ movie, theater, date, time, navigate }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [perspective, setPerspective] = useState(true);
  const [step, setStep] = useState("seats"); // seats | summary

  const toggleSeat = (seatId, type) => {
    const booked = seatConfig.bookedSeats.includes(seatId);
    if (booked) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((acc, seatId) => {
      const row = seatConfig.rows.find((r) => seatId.startsWith(r.label + "-"));
      return acc + (row?.price || 0);
    }, 0);
  }, [selectedSeats]);

  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    navigate("confirmation", {
      booking: {
        movie,
        theater,
        date,
        time,
        seats: selectedSeats,
        totalPrice,
        bookingId: "CX" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-cinema-black pt-16">
      {/* Header */}
      <div className="sticky top-16 z-40 glass border-b border-cinema-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("detail", { movie })}
              className="p-2 rounded-lg hover:bg-cinema-card text-cinema-muted hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="font-display text-lg sm:text-xl text-white tracking-wide leading-none">{movie.title}</div>
              <div className="text-cinema-muted text-xs mt-0.5 font-mono">
                {theater?.name.split("—")[0].trim()} · {date ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""} · {time}
              </div>
            </div>
          </div>
          <button
            onClick={() => setPerspective(!perspective)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-red/40 text-xs transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            {perspective ? "Flat View" : "3D View"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
          {[
            { label: "VIP", color: "bg-cinema-gold/20 border-cinema-gold/60 text-cinema-gold" },
            { label: "Premium", color: "bg-purple-500/20 border-purple-500/60 text-purple-400" },
            { label: "Standard", color: "bg-white/10 border-white/20 text-white/70" },
            { label: "Booked", color: "bg-cinema-border/50 border-cinema-border/30 text-cinema-muted" },
            { label: "Selected", color: "bg-cinema-red border-cinema-red text-white" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-sm border ${color} flex items-center justify-center`}>
                <div className="w-2 h-2 rounded-full opacity-60" />
              </div>
              <span className="text-cinema-muted text-xs">{label}</span>
            </div>
          ))}
        </div>

        {/* Screen */}
        <div className="mb-2 text-center">
          <div className="relative inline-block w-full max-w-lg">
            <div
              className="h-3 rounded-t-full mx-auto screen-glow"
              style={{
                background: "linear-gradient(to right, transparent, rgba(229,9,20,0.3), rgba(255,200,200,0.6), rgba(229,9,20,0.3), transparent)",
                width: "85%",
                filter: "blur(1px)",
              }}
            />
            <div
              className="h-[2px] mx-auto"
              style={{
                background: "linear-gradient(to right, transparent, rgba(255,150,150,0.9), transparent)",
                width: "90%",
              }}
            />
          </div>
          <div className="text-cinema-muted text-xs font-mono tracking-widest mt-2 mb-8 opacity-50">
            — SCREEN —
          </div>
        </div>

        {/* Seat grid with 3D perspective */}
        <div className={perspective ? "theater-3d" : ""}>
          <div className={`${perspective ? "seat-rows-3d" : ""} space-y-2`}>
            {seatConfig.rows.map((row, rowIdx) => (
              <SeatRow
                key={row.label}
                row={row}
                rowIndex={rowIdx}
                perspective={perspective}
                selectedSeats={selectedSeats}
                bookedSeats={seatConfig.bookedSeats}
                onToggle={toggleSeat}
                totalRows={seatConfig.rows.length}
              />
            ))}
          </div>
        </div>

        {/* Spacer for floating bar */}
        <div className="h-32" />
      </div>

      {/* Floating booking bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-cinema-border z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          {selectedSeats.length === 0 ? (
            <div className="text-center text-cinema-muted text-sm py-1">
              Select seats to continue
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Seat chips */}
              <div className="flex flex-wrap gap-1.5 flex-1">
                {selectedSeats.slice(0, 6).map((s) => (
                  <span key={s} className="bg-cinema-red/20 border border-cinema-red/40 text-cinema-red text-xs px-2 py-1 rounded font-mono">
                    {s}
                  </span>
                ))}
                {selectedSeats.length > 6 && (
                  <span className="text-cinema-muted text-xs px-2 py-1">+{selectedSeats.length - 6} more</span>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-cinema-muted text-[10px] font-mono">TOTAL</div>
                  <div className="text-white font-display text-2xl leading-none text-cinema-red">₹{totalPrice}</div>
                  <div className="text-cinema-muted text-[10px] font-mono">{selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}</div>
                </div>

                <button
                  onClick={handleProceed}
                  className="btn-red px-8 py-3.5 flex items-center gap-2 text-base whitespace-nowrap"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Proceed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SeatRow({ row, rowIndex, perspective, selectedSeats, bookedSeats, onToggle, totalRows }) {
  const typeIcon = {
    vip: <Crown className="w-2.5 h-2.5" />,
    premium: <Zap className="w-2.5 h-2.5" />,
    standard: <Users className="w-2.5 h-2.5" />,
  };

  // Perspective scaling: front rows are bigger
  const scalePercent = perspective
    ? 85 + (rowIndex / totalRows) * 15
    : 100;

  return (
    <div
      className="flex items-center gap-2 sm:gap-4 justify-center"
      style={perspective ? { transform: `scale(${scalePercent / 100})`, transformOrigin: "center bottom" } : {}}
    >
      {/* Row label */}
      <div className="w-7 flex-shrink-0 text-right">
        <span className="text-cinema-muted text-xs font-mono">{row.label}</span>
      </div>

      {/* Left aisle gap */}
      {row.type === "vip" && <div className="w-3" />}

      {/* Seats */}
      <div className="flex gap-1 sm:gap-1.5">
        {Array.from({ length: row.seats }, (_, i) => {
          const seatId = `${row.label}-${i + 1}`;
          const isBooked = bookedSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);

          let cls = "w-7 h-6 sm:w-8 sm:h-7 rounded-t-lg border text-[9px] flex items-center justify-center cursor-pointer transition-all duration-200 ";

          if (isBooked) {
            cls += "seat-booked cursor-not-allowed opacity-40";
          } else if (isSelected) {
            cls += "seat-selected";
          } else if (row.type === "vip") {
            cls += "seat-vip";
          } else if (row.type === "premium") {
            cls += "seat-premium";
          } else {
            cls += "seat-standard";
          }

          return (
            <button
              key={seatId}
              className={cls}
              onClick={() => !isBooked && onToggle(seatId, row.type)}
              title={`${seatId} — ₹${row.price} ${row.type}`}
              disabled={isBooked}
            >
              {isSelected ? (
                <div className="w-2 h-2 rounded-full bg-white" />
              ) : isBooked ? (
                <div className="w-2 h-2 rounded-full bg-current opacity-30" />
              ) : (
                <span className="opacity-50 text-[8px]">{i + 1}</span>
              )}

              {/* Aisle gap in middle */}
              {i === Math.floor(row.seats / 2) - 1 && (
                <span className="sr-only">aisle</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right aisle gap */}
      {row.type === "vip" && <div className="w-3" />}

      {/* Row label right */}
      <div className="w-7 flex-shrink-0 flex items-center gap-1 text-cinema-muted">
        <span className="text-[9px] font-mono">{typeIcon[row.type]}</span>
      </div>
    </div>
  );
}
