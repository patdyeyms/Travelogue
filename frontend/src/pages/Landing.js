import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Pages.css";
import planeImg from "../assets/plane.png";

// Constants
const DESTINATIONS = [
  { name: "Manila, Philippines", img: "/images/manila.jpg" },
  { name: "Dubai, UAE", img: "/images/dubai.jpeg" },
  { name: "Zurich, Switzerland", img: "/images/zurich.jpg" },
  { name: "Tokyo, Japan", img: "/images/tokyo.jpg" },
  { name: "Seoul, Korea", img: "/images/seoul.jpg" },
  { name: "Singapore", img: "/images/singapore.jpg" },
];

const INTERSECTION_OPTIONS = {
  threshold: 0.2,
  rootMargin: "0px",
};

function Landing() {
  const navigate = useNavigate();
  const featureRef = useRef(null);
  const searchRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [showDestinationInput, setShowDestinationInput] = useState(false);
  const [destination, setDestination] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Intersection Observer for animations
  useEffect(() => {
    const element = featureRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      INTERSECTION_OPTIONS
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized filtered destinations
  const filteredDestinations = React.useMemo(() => {
    if (!destination.trim()) return DESTINATIONS;
    
    const searchTerm = destination.toLowerCase();
    return DESTINATIONS.filter((d) =>
      d.name.toLowerCase().includes(searchTerm)
    );
  }, [destination]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (!destination.trim()) {
      alert("Please enter a destination");
      return;
    }

    const flightData = {
      from: "",
      to: destination,
      departure: "",
      return: "",
    };

    try {
      localStorage.setItem("flightDetails", JSON.stringify(flightData));
      navigate("/flights");
    } catch (error) {
      console.error("Failed to save flight details:", error);
      alert("An error occurred. Please try again.");
    }
  }, [destination, navigate]);

  // Handle destination selection
  const handleSelectDestination = useCallback((selectedDestination) => {
    setDestination(selectedDestination);
    setShowSuggestions(false);
  }, []);

  // Handle destination input change
  const handleDestinationChange = useCallback((e) => {
    setDestination(e.target.value);
    setShowSuggestions(true);
  }, []);

  // Handle Enter key
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="landing-page">
      {/* INTRO SECTION */}
      <section className="intro-section">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="background-video"
          poster="/video-poster.jpg"
        >
          <source src="/cinematic.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="intro-content">
          <h1>Welcome to Travelogue</h1>
          
          {!showDestinationInput ? (
            <button
              className="get-started-btn"
              onClick={() => setShowDestinationInput(true)}
              aria-label="Get started with your travel planning"
            >
              Get Started →
            </button>
          ) : (
            <div className="intro-input-wrapper fade-slide-enter-active">
              <p>Where do you want to go?</p>
              <div className="intro-search" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search destination..."
                  value={destination}
                  onChange={handleDestinationChange}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyPress={handleKeyPress}
                  className="destination-input"
                  aria-label="Search for destination"
                  autoComplete="off"
                />
                <button 
                  className="search-btn" 
                  onClick={handleSearch}
                  aria-label="Search for flights"
                >
                  Search Flights →
                </button>

                {showSuggestions && destination && (
                  <ul 
                    className="suggestions-list"
                    role="listbox"
                    aria-label="Destination suggestions"
                  >
                    {filteredDestinations.length > 0 ? (
                      filteredDestinations.map((d, i) => (
                        <li
                          key={i}
                          onClick={() => handleSelectDestination(d.name)}
                          className="suggestion-item"
                          role="option"
                          tabIndex={0}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleSelectDestination(d.name);
                          }}
                        >
                          {d.name}
                        </li>
                      ))
                    ) : (
                      <li className="no-suggestion">No matches found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HERO SECTION */}
      <section className="hero-section">
        <img 
          src={planeImg} 
          alt="Airplane flying" 
          className="plane-image"
          loading="lazy"
        />
        <h2>Organize your trips the easy way with Travelogue!</h2>
      </section>

      {/* FEATURES SECTION */}
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
          {[
            {
              icon: "/icons/flight.png",
              title: "Flight Planner",
              desc: "Automatic flight schedules for stress-free travel.",
            },
            {
              icon: "/icons/hotel.png",
              title: "Hotel Booking",
              desc: "Smart hotel booking with ratings and reviews.",
            },
            {
              icon: "/icons/journal.png",
              title: "Itinerary Journal",
              desc: "Keep track of every activity and plan.",
            },
            {
              icon: "/icons/map.png",
              title: "Interactive Maps",
              desc: "Explore nearby attractions with integrated maps.",
            },
          ].map((feature, i) => (
            <div key={i} className="objective-card">
              <img 
                src={feature.icon} 
                alt={feature.title} 
                className="icon"
                loading="lazy"
              />
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ITINERARY SECTION */}
      <section className="pro-section">
        <h1>
          Add Your Planned Trips in Your Journal <span>Itinerary</span>
        </h1>
        <p className="pro-desc">Organize all your adventures in one place</p>

        <div className="pro-features">
          {[
            {
              title: "Places to Visit",
              desc: "Keep track of all destinations you want to explore.",
            },
            {
              title: "Car Rentals",
              desc: "Record your car bookings and schedules.",
            },
            {
              title: "Tour Guides",
              desc: "Save details of guides and tours.",
            },
            {
              title: "Hiking Adventures",
              desc: "Track trails and hikes.",
            },
            {
              title: "Water Activities",
              desc: "Include scuba diving, snorkeling, and more.",
            },
            {
              title: "Additional Notes",
              desc: "Store any extra plans, attachments, or reminders.",
            },
          ].map((item, i) => (
            <div key={i} className="pro-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="explore-section">
        <h1>Explore hundreds of places to visit</h1>
        <p>for every corner of the world</p>
        
        <div className="explore-grid">
          {DESTINATIONS.map((d, i) => (
            <div
              key={i}
              className="explore-card"
              style={{ backgroundImage: `url(${d.img})` }}
              role="img"
              aria-label={`Explore ${d.name}`}
            >
              <div className="explore-overlay">{d.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default React.memo(Landing);