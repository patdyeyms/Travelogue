import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Pages.css";
import planeImg from "../assets/plane.png";
import itineraryImg from "../assets/travel itinerary.png";

function Landing() {
  const featureRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const destinations = [
    "Manila, Philippines",
    "Dubai, UAE",
    "Zurich, Switzerland",
    "Tokyo, Japan",
    "Osaka, Japan",
    "Singapore",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (featureRef.current) observer.observe(featureRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    if (!destination) return;
    navigate(`/flights?to=${encodeURIComponent(destination)}`);
  };

  const filteredDestinations = destinations.filter((city) =>
    city.toLowerCase().includes(destination.toLowerCase())
  );

  const handleSelect = (city) => {
    setDestination(city);
    setShowSuggestions(false);
  };

  return (
    <div className="landing-page">
      {/* === INTRO SECTION === */}
      <section className="intro-section">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/cinematic.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="intro-overlay"></div>

        <div className="intro-content">
          <h1>Where do you want to go?</h1>
          <p>Search your dream destination and book your next flight effortlessly.</p>

          <div className="intro-search">
            <input
              type="text"
              placeholder="Search destination..."
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="destination-input"
            />
            <button className="search-btn" onClick={handleSearch}>
              Search Flights →
            </button>

            {showSuggestions && destination && (
              <ul className="suggestions-list">
                {filteredDestinations.map((city, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(city)}
                    className="suggestion-item"
                  >
                    {city}
                  </li>
                ))}
                {filteredDestinations.length === 0 && (
                  <li className="no-suggestion">No matches found</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* === HERO SECTION === */}
      <section className="hero-section">
        <img src={planeImg} alt="plane" className="plane-image" />
        <h2>Organize your trips the easy way with Travelogue!</h2>
      </section>

      {/* === FEATURE SECTION === */}
      <section
        ref={featureRef}
        className={`feature-section center-layout ${isVisible ? "fade-in" : ""}`}
      >
        <h1 className="feature-title">Travel itinerary planner</h1>
        <img
          src={itineraryImg}
          alt="Travel Itinerary"
          className="itinerary-image"
        />

        <div className="feature-text left-text">
          <h3>
            No more struggling with Word docs, spreadsheets, and Google Maps to
            plan a trip.
          </h3>
          <p>
            With the Travelogue planning tool, you have one simple way to
            organize your travel. Create a new trip or start with a ready-made
            itinerary. Add activities and accommodation, then drag and drop your
            daily schedule with ease.
          </p>
          <p>
            Print, publish, and share your itinerary — and take it with you on
            the road using the Travelogue viewer app. You’ll never be lost.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Landing;
