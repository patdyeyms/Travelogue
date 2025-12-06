import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Pages.css";
import planeImg from "../assets/plane.png";

function Landing() {
  const featureRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const [showDestinationInput, setShowDestinationInput] = useState(false);
  const [destination, setDestination] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const destinations = [
    { name: "Manila, Philippines", img: "/images/manila.jpg" },
    { name: "Dubai, UAE", img: "/images/dubai.jpeg" },
    { name: "Zurich, Switzerland", img: "/images/zurich.jpg" },
    { name: "Tokyo, Japan", img: "/images/tokyo.jpg" },
    { name: "Seoul, Korea", img: "/images/seoul.jpg" },
    { name: "Singapore", img: "/images/singapore.jpg" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.2 }
    );
    if (featureRef.current) observer.observe(featureRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".intro-search")) setShowSuggestions(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!destination) return;

    // Save a full flightDetails object with empty departure/return
    const flightData = {
      from: "", // user can select later
      to: destination,
      departure: "",
      return: "",
    };

    localStorage.setItem("flightDetails", JSON.stringify(flightData));
    navigate("/flights");
  };

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <div className="landing-page">
      <section className="intro-section">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/cinematic.mp4" type="video/mp4" />
        </video>
        <div className="intro-content">
          <h1>Welcome to Travelogue</h1>
          {!showDestinationInput ? (
            <button
              className="get-started-btn"
              onClick={() => setShowDestinationInput(true)}
            >
              Get Started →
            </button>
          ) : (
            <div className="intro-input-wrapper fade-slide-enter-active">
              <p>Where do you want to go?</p>
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
                    {filteredDestinations.map((d, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setDestination(d.name);
                          setShowSuggestions(false);
                        }}
                        className="suggestion-item"
                      >
                        {d.name}
                      </li>
                    ))}
                    {filteredDestinations.length === 0 && (
                      <li className="no-suggestion">No matches found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HERO */}
      <section className="hero-section">
        <img src={planeImg} alt="plane" className="plane-image" />
        <h2>Organize your trips the easy way with Travelogue!</h2>
      </section>

      {/* FEATURES */}
      <section
        ref={featureRef}
        className={`feature-section ${isVisible ? "fade-in" : ""}`}
      >
        <h1 className="feature-title">Travelogue: Your Travel Companion</h1>
        <p className="objectives-desc">
          Organize your trips effortlessly with flight schedules, hotel
          bookings, itineraries, and maps—all in one place.
        </p>
        <div className="objectives-grid">
          <div className="objective-card">
            <img src="/icons/flight.png" alt="flight" className="icon" />
            <h3>Flight Planner</h3>
            <p>Automatic flight schedules for stress-free travel.</p>
          </div>
          <div className="objective-card">
            <img src="/icons/hotel.png" alt="hotel" className="icon" />
            <h3>Hotel Booking</h3>
            <p>Smart hotel booking with ratings and reviews.</p>
          </div>
          <div className="objective-card">
            <img src="/icons/journal.png" alt="journal" className="icon" />
            <h3>Itinerary Journal</h3>
            <p>Keep track of every activity and plan.</p>
          </div>
          <div className="objective-card">
            <img src="/icons/map.png" alt="map" className="icon" />
            <h3>Interactive Maps</h3>
            <p>Explore nearby attractions with integrated maps.</p>
          </div>
        </div>
      </section>

      {/* ITINERARY SECTION */}
      <section className="pro-section">
        <h1>
          Add Your Planned Trips in Your Journal <span>Itinerary</span>
        </h1>
        <p className="pro-desc">Organize all your adventures in one place</p>

        <div className="pro-features">
          <div className="pro-card">
            <h3>Places to Visit</h3>
            <p>Keep track of all destinations you want to explore.</p>
          </div>
          <div className="pro-card">
            <h3>Car Rentals</h3>
            <p>Record your car bookings and schedules.</p>
          </div>
          <div className="pro-card">
            <h3>Tour Guides</h3>
            <p>Save details of guides and tours.</p>
          </div>
          <div className="pro-card">
            <h3>Hiking Adventures</h3>
            <p>Track trails and hikes.</p>
          </div>
          <div className="pro-card">
            <h3>Water Activities</h3>
            <p>Include scuba diving, snorkeling, and more.</p>
          </div>
          <div className="pro-card">
            <h3>Additional Notes</h3>
            <p>Store any extra plans, attachments, or reminders.</p>
          </div>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="explore-section">
        <h1>Explore hundreds of places to visit</h1>
        <p>for every corner of the world</p>
        <div className="explore-grid">
          {destinations.map((d, i) => (
            <div
              key={i}
              className="explore-card"
              style={{ backgroundImage: `url(${d.img})` }}
            >
              <div className="explore-overlay">{d.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Landing;
