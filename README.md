# 🎬 CINEMATIX

> **The Future of Movie Booking — Dark, Immersive, and Cinematic**

<div align="center">

![CINEMATIX Banner](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80)

> 🔴 Live: [https://cinematix-tan.vercel.app/](https://cinematix-tan.vercel.app/)

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)

*A full-featured movie booking web application with 3D seat selection, interactive theater maps, animated UI, and a beautiful red-black design system.*

</div>

---

## ✨ Features

### 🎭 Immersive UI & Design
- **Full Red & Black Theme** — deep cinema noir aesthetic with crimson accents and glowing effects
- **3D Movie Poster Cards** — CSS perspective transforms with float animations and parallax hover effects
- **Noise Texture Overlays** — subtle film grain adds depth and atmosphere
- **Animated Scan Lines** — scrolling light sweep across the interface
- **Floating Particle System** — ember-like particles drift across the hero section
- **Glass Morphism Navbar** — blurs and darkens on scroll

### 🏠 Hero Section
- **Auto-rotating Carousel** — 5-second interval with smooth cross-fade transitions
- **Dynamic Backdrop** — movie backdrop fills the screen with cinematic blur/tint
- **3D Floating Poster** — perspective-rotated poster with continuous float animation
- **Animated Progress Indicators** — expanding pill indicators for carousel position
- **Badge System** — IMAX / 4DX / DOLBY / 3D / ATMOS labels with glow colors

### 🎬 Movie Grid
- **Genre Filter Pills** — animated active state with red glow shadow
- **Sort Controls** — by rating or alphabetically
- **Search Integration** — live filter from the navbar search bar
- **Card Hover 3D Lift** — `rotateX` + `translateY` on hover with play button reveal
- **Responsive Grid** — 2 cols → 3 cols on tablet/desktop

### 📅 Movie Detail & Booking Panel
- **Tabbed Interface** — Book Tickets / About Film / Cast & Crew
- **Horizontal Date Picker** — scrollable 14-day strip with "TODAY" highlight
- **Showtime Grid** — glowing red active state for selected times
- **Theater Selector** — card-based with amenity chips (IMAX, Dolby, VIP, etc.)
- **Sticky Summary Card** — live-updates with selected date, time, venue & price breakdown

### 🗺️ Theater Map
- **Custom SVG Map** — hand-crafted Delhi area map with roads, river, and district labels
- **Interactive Pins** — animated ping rings on selected theater, hover label popups
- **Theater Cards** — rating, distance, amenity badges, and direction links
- **Dark Cartography** — cinematic dark map aesthetic matching the overall theme

### 💺 3D Seat Booking
- **True 3D Perspective** — CSS `perspective` + `rotateX` gives the seat grid a stadium-like depth
- **Seat Type System:**
  - 👑 **VIP** — Gold seats (front rows, ₹750)
  - ⚡ **Premium** — Purple seats (middle rows, ₹450)
  - 👥 **Standard** — White seats (back rows, ₹280)
  - 🚫 **Booked** — Greyed out, non-interactive
  - ✅ **Selected** — Red glow with pulse animation
- **Toggle 3D/Flat View** — switch between perspective and flat layout
- **Floating Booking Bar** — fixed to bottom, shows selected seats + live total price
- **Aisle Gaps** — realistic center aisle spacing

### 🎫 Booking Confirmation
- **Animated Entry** — scale-up + fade reveal with staggered timing
- **Particle Burst** — celebration particles fire when page loads
- **Digital Ticket Design** — real torn-ticket cutouts with dashed divider
- **Procedural QR Code** — SVG QR-like grid generated from booking ID
- **Download & Share** — actions for saving the ticket
- **Rating Widget** — post-booking experience rating stars

---

## 🗂️ Project Structure

```
cinematix/
├── public/
│   └── index.html              # HTML shell with Google Fonts
│
├── src/
│   ├── index.js                # React entry point
│   ├── App.jsx                 # Root app + page router
│   ├── index.css               # Global styles + Tailwind layers
│   │
│   ├── data/
│   │   └── movies.js           # Movie data, theater data, seat config
│   │
│   └── components/
│       ├── Navbar.jsx           # Sticky glass navbar with search
│       ├── HeroSection.jsx      # Carousel hero with 3D poster
│       ├── MovieGrid.jsx        # Filterable movie card grid
│       ├── TheaterMap.jsx       # SVG map + theater list
│       ├── MovieDetail.jsx      # Detail page with booking panel
│       ├── DatePicker.jsx       # Horizontal scrollable date strip
│       ├── SeatBooking.jsx      # 3D interactive seat selection
│       └── BookingConfirmation.jsx  # Animated ticket confirmation
│
├── tailwind.config.js          # Custom cinema color system
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm 8+

### Installation

```bash
# 1. Clone or download the project
cd cinematix

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

### Build for Production

```bash
npm run build
```

Outputs optimized files to the `/build` directory.

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `cinema-black` | `#0A0A0A` | Page background |
| `cinema-dark` | `#111111` | Section backgrounds |
| `cinema-card` | `#181818` | Card backgrounds |
| `cinema-border` | `#2A2A2A` | Borders, dividers |
| `cinema-red` | `#E50914` | Primary accent, CTAs |
| `cinema-gold` | `#FFD700` | VIP seats, ratings |
| `cinema-muted` | `#666666` | Secondary text |
| `cinema-text` | `#F0F0F0` | Primary text |

### Typography

| Role | Font | Style |
|------|------|-------|
| Display / Headings | Bebas Neue | Wide, cinematic all-caps |
| Body / UI | DM Sans | Clean, readable |
| Monospace / Labels | JetBrains Mono | Technical labels, IDs |

### Custom Shadows

```css
shadow-red-glow     /* 0 0 30px rgba(229,9,20,0.4) */
shadow-red-glow-sm  /* 0 0 15px rgba(229,9,20,0.3) */
shadow-gold-glow    /* 0 0 20px rgba(255,215,0,0.3) */
shadow-card-3d      /* deep layered card shadow */
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| < 640px (mobile) | Single column, condensed nav |
| 640–1024px (tablet) | 2-3 column grid, full nav |
| 1024px+ (desktop) | Full layout, side panels |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | Component architecture, state management |
| **Tailwind CSS 3** | Utility-first styling, custom design tokens |
| **CSS Transforms** | 3D perspective seats, floating animations |
| **SVG** | Custom map visualization, QR code generation |
| **CSS Animations** | Scan lines, particles, pulses, float effects |
| **Google Fonts** | Bebas Neue, DM Sans, JetBrains Mono |

---

## 🎯 Key UX Decisions

1. **No modal overuse** — every "page" is a real route-like view for depth
2. **Progressive disclosure** — booking panel only activates after selecting date + time + theater
3. **Instant feedback** — every click has visual response within 150ms
4. **Sticky booking bar** — always visible total price while selecting seats
5. **Perspective as storytelling** — the 3D seat view mimics being in the theater looking up at the screen

---

## 📦 Adding Real Features

### Connect a Backend
Replace static `src/data/movies.js` with API calls:
```js
// Example: fetch movies
const movies = await fetch("/api/movies").then(r => r.json());
```

### Real Map Integration
Replace the SVG map in `TheaterMap.jsx` with Leaflet:
```bash
npm install leaflet react-leaflet
```

### Payment Gateway
Add Razorpay or Stripe on the confirmation step:
```bash
npm install razorpay
```

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

<div align="center">



</div>
