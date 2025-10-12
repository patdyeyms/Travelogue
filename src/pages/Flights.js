import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Flights.css";

function Flights() {
  const navigate = useNavigate();
  const location = useLocation();

  // Destinations list
  const destinations = [
    "Manila, Philippines",
    "Dubai, UAE",
    "Zurich, Switzerland",
    "Tokyo, Japan",
    "Seoul, Korea",
    "Singapore",
  ];

  // Blank initial state
  const [flightDetails, setFlightDetails] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
  });

  // Prefill "to" from query parameter if present
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const toParam = query.get("to");

    if (toParam && destinations.includes(toParam)) {
      setFlightDetails(prev => ({ ...prev, to: toParam }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails(prev => ({ ...prev, [name]: value }));

    // Clear return date if before departure
    if (name === "departure" && flightDetails.return && value > flightDetails.return) {
      setFlightDetails(prev => ({ ...prev, return: "" }));
    }
  };

  const handleSearch = () => {
    if (!flightDetails.from || !flightDetails.to) {
      alert("Please select both From and To cities.");
      return;
    }
    if (!flightDetails.departure) {
      alert("Please select a departure date.");
      return;
    }
    navigate("/flights/results", { state: { flightDetails } });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flights-page">
      {/* HERO */}
      <section className="flights-hero">
        <div className="hero-overlay"></div>
        <div className="flights-hero-content">
          <h1>Book Your Next Adventure</h1>
          <p>
            Fly to <strong>Japan, Dubai, Switzerland, Singapore,</strong> or anywhere in the Philippines.
          </p>
        </div>
      </section>

      {/* SEARCH BOX */}
      <div className="search-container">
        <div className="flight-search-box">
          <div className="input-group">
            <label>From</label>
            <select name="from" value={flightDetails.from} onChange={handleChange}>
              <option value="">Select city</option>
              {destinations.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>To</label>
            <select name="to" value={flightDetails.to} onChange={handleChange}>
              <option value="">Select city</option>
              {destinations.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Departure</label>
            <input
              type="date"
              name="departure"
              value={flightDetails.departure}
              min={today}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Return</label>
            <input
              type="date"
              name="return"
              value={flightDetails.return}
              min={flightDetails.departure || today}
              onChange={handleChange}
            />
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Search Flights
          </button>
        </div>
      </div>
    </div>
  );
}

export default Flights;
