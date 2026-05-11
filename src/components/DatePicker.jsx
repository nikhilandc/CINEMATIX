import React from "react";

function getDates(numDays = 14) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < numDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DatePicker({ selectedDate, onSelect }) {
  const dates = getDates(14);

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {dates.map((date, i) => {
        const dateStr = date.toISOString().split("T")[0];
        const isSelected = selectedDate === dateStr;
        const isToday = i === 0;
        const dayName = DAY_NAMES[date.getDay()];
        const dayNum = date.getDate();
        const month = MONTH_NAMES[date.getMonth()];

        return (
          <button
            key={dateStr}
            onClick={() => onSelect(dateStr)}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all duration-200 min-w-[64px] ${
              isSelected
                ? "bg-cinema-red border-cinema-red text-white shadow-red-glow-sm"
                : isToday
                ? "border-cinema-red/40 bg-cinema-red/5 text-cinema-text"
                : "border-cinema-border bg-cinema-dark text-cinema-muted hover:border-cinema-red/40 hover:text-white"
            }`}
          >
            <span className="text-[10px] font-mono uppercase tracking-wider mb-1">
              {isToday ? "TODAY" : dayName}
            </span>
            <span className={`text-xl font-display leading-none ${isSelected ? "text-white" : ""}`}>
              {dayNum}
            </span>
            <span className="text-[10px] font-mono mt-1 uppercase">{month}</span>
          </button>
        );
      })}
    </div>
  );
}
