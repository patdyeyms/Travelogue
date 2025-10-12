import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Hotels.css";

const hotels = [
  // Philippines
  {
    id: 1,
    country: "Philippines",
    city: "Manila",
    name: "Okada Manila",
    stars: 5,
    reviews: [
      { user: "Alice", comment: "Amazing stay, luxurious experience!" },
      { user: "Bob", comment: "Excellent service and amenities." }
    ],
    image: require("../assets/hotels/okada-manila.jpg")
  },
  {
    id: 2,
    country: "Philippines",
    city: "Manila",
    name: "Kingsford Hotel Manila Bay",
    stars: 4,
    reviews: [
      { user: "Charlie", comment: "Clean and comfortable rooms." },
      { user: "Dana", comment: "Great location near the bay." }
    ],
    image: require("../assets/hotels/kingsford-manila.jpg")
  },
  // Switzerland
  {
    id: 3,
    country: "Switzerland",
    city: "Zurich",
    name: "Hyatt Place Zurich Airport The Circle",
    stars: 4,
    reviews: [
      { user: "Emma", comment: "Convenient location and modern rooms." },
      { user: "Frank", comment: "Friendly staff and good breakfast." }
    ],
    image: require("../assets/hotels/hyatt-place.jpg")
  },
  {
    id: 4,
    country: "Switzerland",
    city: "Zurich",
    name: "Capsule Hotel - Alpine Garden Zurich Airport",
    stars: 4.5,
    reviews: [
      { user: "Grace", comment: "Compact and comfortable stay." },
      { user: "Henry", comment: "Innovative capsule design." }
    ],
    image: require("../assets/hotels/capsule-hotel.jpeg")
  },
  // Japan
  {
    id: 5,
    country: "Japan",
    city: "Tokyo",
    name: "Hotel Villa Fontaine Grand Haneda Airport",
    stars: 4,
    reviews: [
      { user: "Isabel", comment: "Clean and convenient for travelers." },
      { user: "Jack", comment: "Friendly staff and near the airport." }
    ],
    image: require("../assets/hotels/villa-fontaine.jpg")
  },
  {
    id: 6,
    country: "Japan",
    city: "Tokyo",
    name: "LANDABOUT TOKYO",
    stars: 3,
    reviews: [
      { user: "Karen", comment: "Affordable and comfortable." },
      { user: "Leo", comment: "Good location in Tokyo." }
    ],
    image: require("../assets/hotels/landabout-tokyo.jpg")
  },
  // South Korea
  {
    id: 7,
    country: "South Korea",
    city: "Seoul",
    name: "Roynet Hotel Seoul Mapo",
    stars: 4,
    reviews: [
      { user: "Mia", comment: "Clean, modern rooms." },
      { user: "Nate", comment: "Close to subway and attractions." }
    ],
    image: require("../assets/hotels/roynet-hotel.jpg")
  },
  {
    id: 8,
    country: "South Korea",
    city: "Seoul",
    name: "GLAD MAPO",
    stars: 4,
    reviews: [
      { user: "Olivia", comment: "Comfortable stay and great staff." },
      { user: "Peter", comment: "Nice amenities and location." }
    ],
    image: require("../assets/hotels/glad-mapo.jpg")
  },
  // UAE
  {
    id: 9,
    country: "UAE",
    city: "Dubai",
    name: "Rove Downtown",
    stars: 3,
    reviews: [
      { user: "Quinn", comment: "Affordable and convenient location." },
      { user: "Rita", comment: "Friendly staff and modern rooms." }
    ],
    image: require("../assets/hotels/rove-dubai.jpg")
  },
  {
    id: 10,
    country: "UAE",
    city: "Dubai",
    name: "Sonder by Marriott Bonvoy Business Bay Apartments",
    stars: 4,
    reviews: [
      { user: "Steve", comment: "Spacious and clean apartments." },
      { user: "Tina", comment: "Great for business trips." }
    ],
    image: require("../assets/hotels/sonder.jpeg")
  },
  // Singapore
  {
    id: 11,
    country: "Singapore",
    city: "Singapore",
    name: "Marina Bay Sands",
    stars: 5,
    reviews: [
      { user: "Uma", comment: "Iconic hotel with stunning views." },
      { user: "Victor", comment: "Luxury experience, excellent service." }
    ],
    image: require("../assets/hotels/marina-bay.jpg")
  },
  {
    id: 12,
    country: "Singapore",
    city: "Singapore",
    name: "Orchard Rendezvous Hotel by Far East Hospitality",
    stars: 4,
    reviews: [
      { user: "Wendy", comment: "Comfortable and central location." },
      { user: "Xander", comment: "Great value and nice rooms." }
    ],
    image: require("../assets/hotels/orchard-rendezvous.jpg")
  }
];

function Hotels() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredHotels = search
    ? hotels.filter(
        (hotel) =>
          hotel.country.toLowerCase().includes(search.toLowerCase()) ||
          hotel.city.toLowerCase().includes(search.toLowerCase())
      )
    : hotels;

  const suggestions = search
    ? [...new Set(
        hotels
          .map((h) => `${h.city}, ${h.country}`)
          .filter((loc) =>
            loc.toLowerCase().includes(search.toLowerCase())
          )
      )]
    : [];

  const displayCountries = [...new Set(filteredHotels.map(h => h.country))];

  const handleBook = (hotel) => {
    navigate("/booking-details", { state: { hotel } });
  };

  return (
    <div className="hotels-page">
      {/* Hero Section */}
      <div className="hotels-hero">
        <div className="hotels-hero-content">
          <h1>Find Your Hotel</h1>
          <p>Discover the best stays around the world</p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter a country or city (e.g., Japan, Manila)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((loc, idx) => (
                  <div
                    key={idx}
                    className="suggestion-item"
                    onClick={() => setSearch(loc)}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
            {search && suggestions.length === 0 && (
              <div className="no-results">No results found</div>
            )}
          </div>
        </div>
      </div>

      {/* Hotels Section */}
      {displayCountries.map((country) => (
        <div key={country}>
          <h2 className="country-title">{country}</h2>
          <div className="hotels-grid">
            {filteredHotels
              .filter(h => h.country === country)
              .map(hotel => (
                <div className="hotel-card" key={hotel.id}>
                  <img src={hotel.image} alt={hotel.name} />
                  <h3>{hotel.name}</h3>
                  <p>⭐ {hotel.stars} stars</p>
                  <div className="reviews">
                    {hotel.reviews.map((review, idx) => (
                      <p key={idx}><strong>{review.user}:</strong> {review.comment}</p>
                    ))}
                  </div>
                  <button className="book-btn" onClick={() => handleBook(hotel)}>
                    Book
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Hotels;
