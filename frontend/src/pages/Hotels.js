import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Hotels.css";

// Constants
const API_ENDPOINT = "http://localhost:5000/api/hotels";
const FALLBACK_IMAGE = "/fallback-hotel.jpg";

function Hotels() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedCity, setSelectedCity] = useState("");
  const [apiHotels, setApiHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load destination from flights page
  useEffect(() => {
    const loadSavedDestination = () => {
      try {
        const savedDestination = localStorage.getItem("selectedDestination");
        
        if (savedDestination && savedDestination.trim() !== "") {
          const city = savedDestination.split(",")[0].trim();
          const country = savedDestination.split(",")[1]?.trim() || "";
          
          setSearch(`${city}, ${country}`);
          setSelectedCity(city.toLowerCase());
          fetchHotels(city);
          
          // Clean up
          localStorage.removeItem("selectedDestination");
        }
      } catch (error) {
        console.error("Error loading saved destination:", error);
      }
    };

    loadSavedDestination();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Process hotels data
  const processHotelsData = useCallback((json, city) => {
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

    return hotelsData.map((h) => ({
      id: h.location_id || h.hotel_id || h.position || `${Date.now()}-${Math.random()}`,
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
  }, []);

  // Fetch hotels from backend
  const fetchHotels = useCallback(async (city) => {
    if (!city?.trim()) return;

    setLoading(true);
    setApiHotels([]);
    setError(null);

    try {
      const response = await fetch(
        `${API_ENDPOINT}?q=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const hotels = processHotelsData(json, city);

      setApiHotels(hotels);
    } catch (err) {
      console.error("TripAdvisor Fetch Error:", err);
      setError("Failed to fetch hotels. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [processHotelsData]);

  // Autocomplete suggestions (based on current search)
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    
    const parts = search.split(",");
    const city = parts[0]?.trim() || "";
    const country = parts[1]?.trim() || "";
    
    return [`${city}, ${country}`];
  }, [search]);

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback((value) => {
    const [city] = value.split(",").map((v) => v.trim());
    setSearch(value);
    setSelectedCity(city.toLowerCase());
    fetchHotels(city);
    setShowSuggestions(false);
    setActiveIndex(-1);
  }, [fetchHotels]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
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
  }, [showSuggestions, suggestions, activeIndex, handleSelectSuggestion]);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);
    
    const city = value.split(",")[0]?.trim().toLowerCase() || "";
    setSelectedCity(city);
    setShowSuggestions(true);
    setActiveIndex(-1);
  }, []);

  // Book hotel
  const handleBook = useCallback((hotel) => {
    if (!hotel?.id) {
      console.error("Invalid hotel data");
      return;
    }

    try {
      const flightDetails = JSON.parse(
        localStorage.getItem("bookedFlight") || "{}"
      );

      if (!flightDetails.destination) {
        alert("Please select a flight first to associate this hotel with a trip.");
        return;
      }

      const hotelToSave = {
        ...hotel,
        bookedForTrip: flightDetails.destination,
        flightInfo: flightDetails,
      };

      localStorage.setItem("selectedHotel", JSON.stringify(hotelToSave));
      navigate("/booking-details", { state: { hotel: hotelToSave } });
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book hotel. Please try again.");
    }
  }, [navigate]);

  // Handle image error
  const handleImageError = useCallback((e) => {
    e.target.src = FALLBACK_IMAGE;
  }, []);

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
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              aria-label="Search for hotels"
              autoComplete="off"
            />

            {/* AUTOCOMPLETE */}
            {showSuggestions && search && (
              <>
                {suggestions.length > 0 ? (
                  <div className="suggestions" role="listbox">
                    {suggestions.map((loc, idx) => (
                      <div
                        key={idx}
                        className={`suggestion-item ${
                          idx === activeIndex ? "active" : ""
                        }`}
                        onClick={() => handleSelectSuggestion(loc)}
                        role="option"
                        aria-selected={idx === activeIndex}
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

      {/* ERROR */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <p className="loading" role="status" aria-live="polite">
          Fetching hotels...
        </p>
      )}

      {/* HOTELS */}
      {!loading && !error && apiHotels.length > 0 && (
        <div>
          <h2 className="country-title">
            Available Hotels in{" "}
            {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
          </h2>

          <div className="hotels-grid">
            {apiHotels.map((hotel) => (
              <div className="hotel-card" key={hotel.id}>
                <img
                  src={hotel.image || FALLBACK_IMAGE}
                  alt={hotel.name}
                  onError={handleImageError}
                  loading="lazy"
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

                <button 
                  className="book-btn" 
                  onClick={() => handleBook(hotel)}
                  aria-label={`Book ${hotel.name}`}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NO RESULTS */}
      {!loading && !error && apiHotels.length === 0 && selectedCity && (
        <p className="no-results">No hotels found for this location.</p>
      )}
    </div>
  );
}

export default React.memo(Hotels);