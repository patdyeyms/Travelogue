import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Flights.css";

function Flights() {
  const navigate = useNavigate();
  const location = useLocation();

  const destinations = [
    "Manila, Philippines",
    "Dubai, UAE",
    "Zurich, Switzerland",
    "Tokyo, Japan",
    "Seoul, Korea",
    "Singapore",
  ];

  const [flightDetails, setFlightDetails] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
  });

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const toParam = query.get("to");
    if (toParam && destinations.includes(toParam)) {
      setFlightDetails((prev) => ({ ...prev, to: toParam }));
    }
    localStorage.removeItem("flightDetails");
    localStorage.removeItem("selectedDestination");
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails((prev) => ({ ...prev, [name]: value }));
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
    localStorage.setItem("flightDetails", JSON.stringify(flightDetails));
    localStorage.setItem("selectedDestination", flightDetails.to);
    navigate("/flights/results", { state: { flightDetails } });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flights-page">
      <section className="flights-hero">
        <div className="hero-overlay"></div>
        <div className="flights-hero-content">
          <h1>Book Your Next Adventure</h1>
          <p>
            Fly to <strong>Japan, Dubai, Switzerland, Singapore</strong>, or anywhere in the Philippines.
          </p>
        </div>
      </section>

      <div className="search-container">
        <div className="flight-search-box">
          <div className="input-group">
            <label>From</label>
            <select name="from" value={flightDetails.from} onChange={handleChange}>
              <option value="">Select city</option>
              {destinations.map((city, i) => <option key={i} value={city}>{city}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>To</label>
            <select name="to" value={flightDetails.to} onChange={handleChange}>
              <option value="">Select city</option>
              {destinations.map((city, i) => <option key={i} value={city}>{city}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>Departure</label>
            <input type="date" name="departure" value={flightDetails.departure} min={today} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Return</label>
            <input type="date" name="return" value={flightDetails.return} min={flightDetails.departure || today} onChange={handleChange} />
          </div>

          <button className="search-btn" onClick={handleSearch}>Search Flights</button>
        </div>
      </div>
    </div>
  );
}

export default Flights;
