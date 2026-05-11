import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MovieGrid from "./components/MovieGrid";
import TheaterMap from "./components/TheaterMap";
import MovieDetail from "./components/MovieDetail";
import SeatBooking from "./components/SeatBooking";
import BookingConfirmation from "./components/BookingConfirmation";
import { fetchNowPlaying, fetchTrending, searchMovies } from "./services/tmdb";
import "./index.css";

export default function App() {
  const [page, setPage]                   = useState("home");
  const [movies, setMovies]               = useState([]);
  const [heroMovies, setHeroMovies]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState("");
  const [searching, setSearching]         = useState(false);

  const [selectedMovie, setSelectedMovie]     = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedDate, setSelectedDate]       = useState(null);
  const [selectedTime, setSelectedTime]       = useState(null);
  const [bookingData, setBookingData]         = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const [nowPlaying, trending] = await Promise.all([
          fetchNowPlaying(1),
          fetchTrending(),
        ]);
        setHeroMovies(trending.slice(0, 5));
        setMovies(nowPlaying);
      } catch (err) {
        console.error("TMDB fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchNowPlaying(1).then(setMovies).catch(console.error);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchMovies(searchQuery);
        setMovies(results);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navigate = useCallback((p, data = {}) => {
    setPage(p);
    if (data.movie)   setSelectedMovie(data.movie);
    if (data.theater) setSelectedTheater(data.theater);
    if (data.date)    setSelectedDate(data.date);
    if (data.time)    setSelectedTime(data.time);
    if (data.booking) setBookingData(data.booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-cinema-black font-body">
      <Navbar
        page={page}
        navigate={navigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {page === "home" && (
        <>
          <HeroSection navigate={navigate} movies={heroMovies} loading={loading} />
          <MovieGrid
            navigate={navigate}
            movies={movies}
            loading={loading || searching}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <TheaterMap navigate={navigate} />
        </>
      )}
      {page === "detail" && selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          navigate={navigate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedTheater={selectedTheater}
          setSelectedTheater={setSelectedTheater}
        />
      )}
      {page === "seats" && selectedMovie && (
        <SeatBooking
          movie={selectedMovie}
          theater={selectedTheater}
          date={selectedDate}
          time={selectedTime}
          navigate={navigate}
        />
      )}
      {page === "confirmation" && bookingData && (
        <BookingConfirmation booking={bookingData} navigate={navigate} />
      )}
    </div>
  );
}