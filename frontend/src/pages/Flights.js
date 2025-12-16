import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Flights.css";

// Constants
const DESTINATIONS = {
  "Manila, Philippines": "MNL",
  "Dubai, UAE": "DXB",
  "Zurich, Switzerland": "ZRH",
  "Tokyo, Japan": "HND",
  "Seoul, Korea": "ICN",
  "Singapore": "SIN",
};

const AIRLINES = [
  { name: "Any Airline", code: "" },
  { name: "Philippine Airlines", code: "PR" },
  { name: "Cebu Pacific", code: "5J" },
  { name: "AirAsia", code: "Z2" },
  { name: "ANA", code: "NH" },
  { name: "Emirates", code: "EK" },
  { name: "Singapore Airlines", code: "SQ" },
];

const TRAVEL_CLASSES = [
  { value: "1", label: "Economy" },
  { value: "2", label: "Premium Economy" },
  { value: "3", label: "Business Class" },
  { value: "4", label: "First Class" },
];

const INITIAL_FLIGHT_STATE = {
  from: "",
  to: "",
  departure: "",
  return: "",
  isRoundTrip: true,
  travelClass: "1",
  adults: "1",
  children: "0",
  infants: "0",
  airline: "",
  nonstop: false,
};

function Flights() {
  const navigate = useNavigate();
  const [flightDetails, setFlightDetails] = useState(INITIAL_FLIGHT_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved flight details
  useEffect(() => {
    try {
      const savedFlight = localStorage.getItem("flightDetails");
      if (savedFlight) {
        const parsed = JSON.parse(savedFlight);
        setFlightDetails((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error("Error loading saved flight details:", error);
    }
  }, []);

  // Get today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFlightDetails((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  // Toggle round trip
  const toggleRoundTrip = useCallback((isRoundTrip) => {
    setFlightDetails((prev) => ({
      ...prev,
      isRoundTrip,
      return: isRoundTrip ? prev.return : "",
    }));
  }, []);

  // Toggle nonstop
  const toggleNonstop = useCallback(() => {
    setFlightDetails((prev) => ({
      ...prev,
      nonstop: !prev.nonstop,
    }));
  }, []);

  // Validate search
  const validateSearch = useCallback(() => {
    const errors = [];

    if (!flightDetails.from) {
      errors.push("Please select a departure city");
    }

    if (!flightDetails.to) {
      errors.push("Please select a destination");
    }

    if (flightDetails.from === flightDetails.to) {
      errors.push("Departure and destination cannot be the same");
    }

    if (!flightDetails.departure) {
      errors.push("Please select a departure date");
    }

    if (flightDetails.isRoundTrip && !flightDetails.return) {
      errors.push("Please select a return date for round trip");
    }

    if (flightDetails.isRoundTrip && flightDetails.return) {
      const departureDate = new Date(flightDetails.departure);
      const returnDate = new Date(flightDetails.return);
      
      if (returnDate <= departureDate) {
        errors.push("Return date must be after departure date");
      }
    }

    return errors;
  }, [flightDetails]);

  // Handle search
  const handleSearch = useCallback(async () => {
    // Validate
    const errors = validateSearch();
    if (errors.length > 0) {
      setError(errors.join("\n"));
      alert(errors.join("\n"));
      return;
    }

    setLoading(true);
    setError(null);

    const departure_id = DESTINATIONS[flightDetails.from];
    const arrival_id = DESTINATIONS[flightDetails.to];

    try {
      const response = await axios.get("http://localhost:5000/api/flights", {
        params: {
          departure_id,
          arrival_id,
          outbound_date: flightDetails.departure,
          return_date: flightDetails.isRoundTrip ? flightDetails.return : "",
          travel_class: flightDetails.travelClass,
          adults: flightDetails.adults,
          children: flightDetails.children,
          infants_in_seat: flightDetails.infants,
          airlines: flightDetails.airline || undefined,
          nonstop: flightDetails.nonstop,
        },
      });

      const flightsData = response.data?.best_flights || [];

      if (!flightsData.length) {
        setError("No flights found for your search criteria.");
        alert("No flights found. Please try different dates or destinations.");
        return;
      }

      // Save to localStorage
      localStorage.setItem("flightDetails", JSON.stringify(flightDetails));

      // Navigate to results
      navigate("/flights/results", {
        state: { flightDetails, flights: flightsData },
      });
    } catch (err) {
      console.error("Error fetching flights:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch flights. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [flightDetails, validateSearch, navigate]);

  return (
    <div className="flights-page">
      {/* HERO SECTION */}
      <section className="flights-hero">
        <div className="hero-overlay" />
        <div className="flights-hero-content">
          <h1>Book Your Next Adventure</h1>
          <p>
            Find flights across <strong>Asia, Middle East, and Europe</strong>.
          </p>
        </div>
      </section>

      {/* SEARCH CONTAINER */}
      <div className="search-container">
        <div className="flight-search-box">
          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* TRIP TYPE TOGGLE */}
          <div className="trip-toggle" role="group" aria-label="Trip type">
            <button
              type="button"
              className={flightDetails.isRoundTrip ? "active" : ""}
              onClick={() => toggleRoundTrip(true)}
              aria-pressed={flightDetails.isRoundTrip}
            >
              Round Trip
            </button>
            <button
              type="button"
              className={!flightDetails.isRoundTrip ? "active" : ""}
              onClick={() => toggleRoundTrip(false)}
              aria-pressed={!flightDetails.isRoundTrip}
            >
              One Way
            </button>
          </div>

          {/* FROM */}
          <div className="input-group">
            <label htmlFor="from">From</label>
            <select
              id="from"
              name="from"
              value={flightDetails.from}
              onChange={handleChange}
              aria-required="true"
            >
              <option value="">Select city</option>
              {Object.keys(DESTINATIONS).map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div className="input-group">
            <label htmlFor="to">To</label>
            <select
              id="to"
              name="to"
              value={flightDetails.to}
              onChange={handleChange}
              aria-required="true"
            >
              <option value="">Select city</option>
              {Object.keys(DESTINATIONS).map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* DEPARTURE */}
          <div className="input-group">
            <label htmlFor="departure">Departure</label>
            <input
              id="departure"
              type="date"
              name="departure"
              value={flightDetails.departure}
              min={today}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          {/* RETURN (only if round trip) */}
          {flightDetails.isRoundTrip && (
            <div className="input-group">
              <label htmlFor="return">Return</label>
              <input
                id="return"
                type="date"
                name="return"
                value={flightDetails.return}
                min={flightDetails.departure || today}
                onChange={handleChange}
                aria-required="true"
              />
            </div>
          )}

          {/* CLASS */}
          <div className="input-group">
            <label htmlFor="travelClass">Class</label>
            <select
              id="travelClass"
              name="travelClass"
              value={flightDetails.travelClass}
              onChange={handleChange}
            >
              {TRAVEL_CLASSES.map((tc, i) => (
                <option key={i} value={tc.value}>
                  {tc.label}
                </option>
              ))}
            </select>
          </div>

          {/* PASSENGERS */}
          <div className="passengers-group">
            <div className="input-group">
              <label htmlFor="adults">Adults</label>
              <select
                id="adults"
                name="adults"
                value={flightDetails.adults}
                onChange={handleChange}
              >
                {[...Array(6)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="children">Children</label>
              <select
                id="children"
                name="children"
                value={flightDetails.children}
                onChange={handleChange}
              >
                {[...Array(6)].map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="infants">Infants</label>
              <select
                id="infants"
                name="infants"
                value={flightDetails.infants}
                onChange={handleChange}
              >
                {[...Array(4)].map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AIRLINE FILTER */}
          <div className="input-group">
            <label htmlFor="airline">Airline</label>
            <select
              id="airline"
              name="airline"
              value={flightDetails.airline}
              onChange={handleChange}
            >
              {AIRLINES.map((a, i) => (
                <option key={i} value={a.code}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* NONSTOP */}
          <div className="input-group checkbox">
            <label>
              <input
                type="checkbox"
                name="nonstop"
                checked={flightDetails.nonstop}
                onChange={toggleNonstop}
              />
              Non-stop only
            </label>
          </div>

          {/* SEARCH BUTTON */}
          <button
            className={`search-btn ${loading ? "loading" : ""}`}
            onClick={handleSearch}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Flights);