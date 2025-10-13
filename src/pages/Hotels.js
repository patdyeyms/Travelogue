import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Hotels.css";

const hotels = [
  { id: 1, country: "Philippines", city: "Manila", name: "Okada Manila", stars: 5, reviews: [{ user: "Alice", comment: "Amazing stay!" }, { user: "Bob", comment: "Excellent service." }], image: require("../assets/hotels/okada-manila.jpg") },
  { id: 2, country: "Philippines", city: "Manila", name: "Kingsford Hotel Manila Bay", stars: 4, reviews: [{ user: "Charlie", comment: "Clean rooms." }, { user: "Dana", comment: "Great location." }], image: require("../assets/hotels/kingsford-manila.jpg") },
  { id: 9, country: "UAE", city: "Dubai", name: "Rove Downtown", stars: 3, reviews: [{ user: "Quinn", comment: "Affordable location." }, { user: "Rita", comment: "Friendly staff." }], image: require("../assets/hotels/rove-dubai.jpg") },
  { id: 10, country: "UAE", city: "Dubai", name: "Sonder by Marriott Bonvoy Business Bay Apartments", stars: 4, reviews: [{ user: "Steve", comment: "Spacious apartments." }, { user: "Tina", comment: "Great for business trips." }], image: require("../assets/hotels/sonder.jpeg") },
  { id: 3, country: "Switzerland", city: "Zurich", name: "Hyatt Place Zurich Airport The Circle", stars: 4, reviews: [{ user: "Emma", comment: "Convenient location." }, { user: "Frank", comment: "Friendly staff." }], image: require("../assets/hotels/hyatt-place.jpg") },
  { id: 4, country: "Switzerland", city: "Zurich", name: "Capsule Hotel - Alpine Garden Zurich Airport", stars: 4.5, reviews: [{ user: "Grace", comment: "Compact stay." }, { user: "Henry", comment: "Innovative capsule design." }], image: require("../assets/hotels/capsule-hotel.jpeg") },
  { id: 5, country: "Japan", city: "Tokyo", name: "Hotel Villa Fontaine Grand Haneda Airport", stars: 4, reviews: [{ user: "Isabel", comment: "Clean and convenient." }, { user: "Jack", comment: "Friendly staff." }], image: require("../assets/hotels/villa-fontaine.jpg") },
  { id: 6, country: "Japan", city: "Tokyo", name: "LANDABOUT TOKYO", stars: 3, reviews: [{ user: "Karen", comment: "Affordable stay." }, { user: "Leo", comment: "Good location." }], image: require("../assets/hotels/landabout-tokyo.jpg") },
  { id: 7, country: "South Korea", city: "Seoul", name: "Roynet Hotel Seoul Mapo", stars: 4, reviews: [{ user: "Mia", comment: "Clean rooms." }, { user: "Nate", comment: "Close to subway." }], image: require("../assets/hotels/roynet-hotel.jpg") },
  { id: 8, country: "South Korea", city: "Seoul", name: "GLAD MAPO", stars: 4, reviews: [{ user: "Olivia", comment: "Comfortable stay." }, { user: "Peter", comment: "Nice amenities." }], image: require("../assets/hotels/glad-mapo.jpg") },
  { id: 11, country: "Singapore", city: "Singapore", name: "Marina Bay Sands", stars: 5, reviews: [{ user: "Uma", comment: "Iconic hotel." }, { user: "Victor", comment: "Luxury experience." }], image: require("../assets/hotels/marina-bay.jpg") },
  { id: 12, country: "Singapore", city: "Singapore", name: "Orchard Rendezvous Hotel by Far East Hospitality", stars: 4, reviews: [{ user: "Wendy", comment: "Comfortable and central." }, { user: "Xander", comment: "Great value." }], image: require("../assets/hotels/orchard-rendezvous.jpg") },
];

function Hotels() {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedCity, setSelectedCity] = useState(""); // for filtering
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Autofill from Flights (extract city for filtering)
  useEffect(() => {
    const savedDestination = localStorage.getItem("selectedDestination");
    if (savedDestination && savedDestination.trim() !== "") {
      const city = savedDestination.split(",")[0].trim();
      setSearch(`${city}, ${savedDestination.split(",")[1]?.trim() || ""}`); // show full in input
      setSelectedCity(city.toLowerCase()); // use city only for filtering
      localStorage.removeItem("selectedDestination");
    }
  }, []);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter hotels by selected city or typed input
  const filteredHotels = selectedCity
    ? hotels.filter(h => h.city.toLowerCase().includes(selectedCity))
    : hotels;

  // Suggestions: full "City, Country"
  const query = search.trim().toLowerCase();
  const suggestions = query
    ? [...new Set(hotels.map(h => `${h.city}, ${h.country}`).filter(loc => loc.toLowerCase().includes(query)))]
    : [];

  const displayCountries = [...new Set(filteredHotels.map(h => h.country))];

  const handleBook = (hotel) => {
  const flightDetails = JSON.parse(localStorage.getItem("flightDetails") || "{}");
  if (!flightDetails.to) {
    alert("Please select a flight first to associate this hotel with a trip.");
    return;
  }

  const hotelToSave = { ...hotel, bookedForTrip: flightDetails.to };
  localStorage.setItem("selectedHotel", JSON.stringify(hotelToSave));

  navigate("/booking-details", { state: { hotel: hotelToSave } });
};



  const handleSelectSuggestion = (value) => {
    const [city] = value.split(",").map(v => v.trim());
    setSearch(value); // show full "City, Country"
    setSelectedCity(city.toLowerCase()); // filter by city
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex]);
    }
  };

  return (
    <div className="hotels-page">
      <div className="hotels-hero">
        <div className="hotels-hero-content">
          <h1>Find Your Hotel</h1>
          <p>Discover the best stays around the world</p>

          <div className="search-bar" ref={searchRef}>
            <input
              type="text"
              placeholder="Enter a country or city (e.g., Japan, Manila)"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true); setActiveIndex(-1); setSelectedCity(e.target.value.split(",")[0].trim().toLowerCase()); }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
            {showSuggestions && search && (
              <>
                {suggestions.length > 0 ? (
                  <div className="suggestions">
                    {suggestions.map((loc, idx) => (
                      <div key={idx} className={`suggestion-item ${idx === activeIndex ? "active" : ""}`} onClick={() => handleSelectSuggestion(loc)}>
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

      {displayCountries.map(country => (
        <div key={country}>
          <h2 className="country-title">{country}</h2>
          <div className="hotels-grid">
            {filteredHotels.filter(h => h.country === country).map(hotel => (
              <div className="hotel-card" key={hotel.id}>
                <img src={hotel.image} alt={hotel.name} />
                <h3>{hotel.name}</h3>
                <p>⭐ {hotel.stars} stars</p>
                <div className="reviews">
                  {hotel.reviews.map((review, idx) => (
                    <p key={idx}><strong>{review.user}:</strong> {review.comment}</p>
                  ))}
                </div>
                <button className="book-btn" onClick={() => handleBook(hotel)}>Book</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Hotels;
