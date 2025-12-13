import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Hotels.css";

function Hotels() {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedCity, setSelectedCity] = useState("");
  const [apiHotels, setApiHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Load destination from flights page
  useEffect(() => {
    const savedDestination = localStorage.getItem("selectedDestination");
    if (savedDestination && savedDestination.trim() !== "") {
      const city = savedDestination.split(",")[0].trim();
      setSearch(`${city}, ${savedDestination.split(",")[1]?.trim() || ""}`);
      setSelectedCity(city.toLowerCase());
      fetchHotels(city);
      localStorage.removeItem("selectedDestination");
    }
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch hotels from backend
  const fetchHotels = async (city) => {
    if (!city) return;

    setLoading(true);
    setApiHotels([]);

    try {
      const response = await fetch(
        `http://localhost:5000/api/hotels?q=${encodeURIComponent(city)}`
      );
      const json = await response.json();

      // Check both possible locations
      let hotelsData = [];
      if (json.locations) {
        hotelsData = json.locations.filter(
          (loc) => loc.location_type === "ACCOMMODATION"
        );
      } else if (json.organic_results) {
        hotelsData = json.organic_results.filter(
          (item) => item.type === "hotel" || item.hotel_id
        );
      }

      const hotels = hotelsData.map((h) => ({
        id: h.location_id || h.hotel_id || h.position || Math.random(),
        name: h.title || h.name || "Unknown Hotel",
        city,
        country: h.location?.split(", ").pop() || "",
        stars: h.rating || 0,
        reviewsCount: h.reviews || 0,
        image: h.thumbnail || h.image || null,
        reviews: h.highlighted_review
          ? [{ user: "TripAdvisor User", comment: h.highlighted_review.text }]
          : [],
      }));

      setApiHotels(hotels);
    } catch (err) {
      console.error("TripAdvisor Fetch Error:", err.message);
    }

    setLoading(false);
  };

  // Autocomplete suggestions (based on current search)
  const suggestions = search.trim()
    ? [`${search.split(",")[0].trim()}, ${search.split(",")[1] || ""}`]
    : [];

  const handleSelectSuggestion = (value) => {
    const [city] = value.split(",").map((v) => v.trim());
    setSearch(value);
    setSelectedCity(city.toLowerCase());
    fetchHotels(city);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex]);
    }
  };

  // Book hotel
  const handleBook = (hotel) => {
    const flightDetails = JSON.parse(localStorage.getItem("bookedFlight") || "{}");

    if (!flightDetails.destination) {
      alert("Please select a flight first to associate this hotel with a trip.");
      return;
    }

    const hotelToSave = {
      ...hotel,
      bookedForTrip: flightDetails.destination,
      flightInfo: flightDetails // pass full flight info
    };

    localStorage.setItem("selectedHotel", JSON.stringify(hotelToSave));
    navigate("/booking-details", { state: { hotel: hotelToSave } });
  };


  return (
    <div className="hotels-page">
      {/* HERO */}
      <div className="hotels-hero">
        <div className="hotels-hero-content">
          <h1>Find Your Hotel</h1>
          <p>Discover the best stays around the world</p>

          {/* SEARCH */}
          <div className="search-bar" ref={searchRef}>
            <input
              type="text"
              placeholder="Enter a country or city (e.g., Tokyo, Manila)"
              value={search || ""}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedCity(
                  e.target.value.split(",")[0]?.trim().toLowerCase() || ""
                );
                setShowSuggestions(true);
                setActiveIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />

            {/* AUTOCOMPLETE */}
            {showSuggestions && search && (
              <>
                {suggestions.length > 0 ? (
                  <div className="suggestions">
                    {suggestions.map((loc, idx) => (
                      <div
                        key={idx}
                        className={`suggestion-item ${
                          idx === activeIndex ? "active" : ""
                        }`}
                        onClick={() => handleSelectSuggestion(loc)}
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">No results found</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && <p className="loading">Fetching hotels...</p>}

      {/* HOTELS */}
      {!loading && apiHotels.length > 0 && (
        <div>
          <h2 className="country-title">
            Available Hotels in{" "}
            {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
          </h2>

          <div className="hotels-grid">
            {apiHotels.map((hotel) => (
              <div className="hotel-card" key={hotel.id}>
                <img
                  src={hotel.image || "/fallback-hotel.jpg"}
                  alt={hotel.name}
                  onError={(e) => (e.target.src = "/fallback-hotel.jpg")}
                />
                <h3>{hotel.name}</h3>
                <p>⭐ {hotel.stars} stars</p>
                <p>{hotel.reviewsCount} reviews</p>

                <div className="reviews">
                  {hotel.reviews.map((rev, idx) => (
                    <p key={idx}>
                      <strong>{rev.user}:</strong> {rev.comment}
                    </p>
                  ))}
                </div>

                <button className="book-btn" onClick={() => handleBook(hotel)}>
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NO RESULTS */}
      {!loading && apiHotels.length === 0 && selectedCity && (
        <p className="no-results">No hotels found for this location.</p>
      )}
    </div>
  );
}

export default Hotels;
