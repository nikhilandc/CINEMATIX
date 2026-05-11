// Static theater data (location-based, not from TMDB)
export const theaters = [
  {
    id: 1,
    name: "CINEMATIX PRIME — Delhi",
    address: "Connaught Place, New Delhi, 110001",
    lat: 28.6315, lng: 77.2167,
    rating: 4.9,
    amenities: ["IMAX", "4DX", "Dolby Atmos", "VIP Lounge", "Restaurant"],
    screens: 12,
    distance: "2.3 km",
  },
  {
    id: 2,
    name: "CINEMATIX NEXUS — Gurgaon",
    address: "Cyber Hub, DLF Phase 2, Gurgaon, 122002",
    lat: 28.4943, lng: 77.0893,
    rating: 4.8,
    amenities: ["IMAX", "3D", "Dolby Atmos", "Parking", "Food Court"],
    screens: 8,
    distance: "18.5 km",
  },
  {
    id: 3,
    name: "CINEMATIX ZENITH — Noida",
    address: "Sector 18, Noida, Uttar Pradesh, 201301",
    lat: 28.5676, lng: 77.3227,
    rating: 4.7,
    amenities: ["4DX", "3D", "VIP Lounge", "Café", "Parking"],
    screens: 10,
    distance: "22.1 km",
  },
  {
    id: 4,
    name: "CINEMATIX ARIA — South Delhi",
    address: "Select Citywalk, Saket, New Delhi, 110017",
    lat: 28.527, lng: 77.2191,
    rating: 4.6,
    amenities: ["IMAX", "Dolby Vision", "VIP Lounge", "Lounge Bar"],
    screens: 6,
    distance: "8.7 km",
  },
];

export const showTimes = [
  "10:30 AM", "1:15 PM", "4:00 PM", "7:45 PM", "10:30 PM",
];

export const seatConfig = {
  rows: [
    { label: "A", seats: 8,  type: "vip",      price: 750 },
    { label: "B", seats: 8,  type: "vip",      price: 750 },
    { label: "C", seats: 10, type: "premium",  price: 450 },
    { label: "D", seats: 10, type: "premium",  price: 450 },
    { label: "E", seats: 12, type: "premium",  price: 450 },
    { label: "F", seats: 12, type: "standard", price: 280 },
    { label: "G", seats: 14, type: "standard", price: 280 },
    { label: "H", seats: 14, type: "standard", price: 280 },
    { label: "I", seats: 14, type: "standard", price: 280 },
    { label: "J", seats: 14, type: "standard", price: 280 },
  ],
  bookedSeats: [
    "A-2","A-5","B-3","B-7","C-1","C-4","C-9",
    "D-2","D-5","D-8","E-3","E-6","E-11",
    "F-2","F-7","F-10","G-4","G-8","G-13",
    "H-1","H-5","H-9","I-3","I-7","I-12",
    "J-2","J-6","J-11",
  ],
};
