import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Flights.css";

function Flights() {
  const navigate = useNavigate();

  const destinations = {
    "Manila, Philippines": "MNL",
    "Dubai, UAE": "DXB",
    "Zurich, Switzerland": "ZRH",
    "Tokyo, Japan": "HND",
    "Seoul, Korea": "ICN",
    "Singapore": "SIN",
  };

  const airlines = [
    { name: "Any Airline", code: "" },
    { name: "Philippine Airlines", code: "PR" },
    { name: "Cebu Pacific", code: "5J" },
    { name: "AirAsia", code: "Z2" },
    { name: "ANA", code: "NH" },
    { name: "Emirates", code: "EK" },
    { name: "Singapore Airlines", code: "SQ" },
  ];

  const [flightDetails, setFlightDetails] = useState({
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
  });

  useEffect(() => {
    const savedFlight = JSON.parse(localStorage.getItem("flightDetails"));
    if (savedFlight) setFlightDetails(savedFlight);
  }, []);


  const handleChange = e => {
    const { name, value } = e.target;
    setFlightDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitch = () => {
    setFlightDetails(prev => ({
      ...prev,
      isRoundTrip: !prev.isRoundTrip,
      return: "",
    }));
  };

  const handleSearch = async () => {
    const {
      from,
      to,
      departure,
      return: returnDate,
      isRoundTrip,
      travelClass,
      adults,
      children,
      infants,
      airline,
      nonstop,
    } = flightDetails;

    if (!from || !to) return alert("Please select both From and To cities.");
    if (!departure) return alert("Please select a departure date.");

    const departure_id = destinations[from];
    const arrival_id = destinations[to];

    try {
      const response = await axios.get("http://localhost:5000/api/flights", {
        params: {
          departure_id,
          arrival_id,
          outbound_date: departure,
          return_date: isRoundTrip ? returnDate : undefined,
          travel_class: travelClass,
          adults,
          children,
          infants_in_seat: infants,
          airlines: airline,
          nonstop,
        },
      });

      const flightsData = response.data?.best_flights || [];

      if (!flightsData.length) {
        alert("No flights found.");
        return;
      }

      localStorage.setItem("flightDetails", JSON.stringify(flightDetails));

      navigate("/flights/results", {
        state: { flightDetails, flights: flightsData },
      });
    } catch (err) {
      console.error("Error fetching flights:", err);
      alert("Failed to fetch flights.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flights-page">
      <section className="flights-hero">
        <div className="hero-overlay" />
        <div className="flights-hero-content">
          <h1>Book Your Next Adventure</h1>
          <p>
            Find flights across <strong>Asia, Middle East, and Europe</strong>.
          </p>
        </div>
      </section>

      <div className="search-container">
        <div className="flight-search-box">

          {/* TRIP TYPE SWITCH */}
          <div className="trip-toggle">
            <button
              className={flightDetails.isRoundTrip ? "active" : ""}
              onClick={() =>
                setFlightDetails(prev => ({ ...prev, isRoundTrip: true }))
              }
            >
              Round Trip
            </button>
            <button
              className={!flightDetails.isRoundTrip ? "active" : ""}
              onClick={() =>
                setFlightDetails(prev => ({ ...prev, isRoundTrip: false }))
              }
            >
              One Way
            </button>
          </div>

          {/* FROM */}
          <div className="input-group">
            <label>From</label>
            <select name="from" value={flightDetails.from} onChange={handleChange}>
              <option value="">Select city</option>
              {Object.keys(destinations).map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div className="input-group">
            <label>To</label>
            <select name="to" value={flightDetails.to} onChange={handleChange}>
              <option value="">Select city</option>
              {Object.keys(destinations).map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* DEPARTURE */}
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

          {/* RETURN (only if round trip) */}
          {flightDetails.isRoundTrip && (
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
          )}

          {/* CLASS */}
          <div className="input-group">
            <label>Class</label>
            <select
              name="travelClass"
              value={flightDetails.travelClass}
              onChange={handleChange}
            >
              <option value="1">Economy</option>
              <option value="2">Premium Economy</option>
              <option value="3">Business Class</option>
              <option value="4">First Class</option>
            </select>
          </div>

          {/* PASSENGERS */}
          <div className="passengers-group">
            <div className="input-group">
              <label>Adults</label>
              <select name="adults" value={flightDetails.adults} onChange={handleChange}>
                {[...Array(6)].map((_, i) => (
                  <option key={i}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Children</label>
              <select name="children" value={flightDetails.children} onChange={handleChange}>
                {[...Array(6)].map((_, i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Infants</label>
              <select name="infants" value={flightDetails.infants} onChange={handleChange}>
                {[...Array(4)].map((_, i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>


          {/* AIRLINE FILTER */}
          <div className="input-group">
            <label>Airline</label>
            <select name="airline" value={flightDetails.airline} onChange={handleChange}>
              {airlines.map((a, i) => (
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
                onChange={() =>
                  setFlightDetails(prev => ({
                    ...prev,
                    nonstop: !prev.nonstop,
                  }))
                }
              />
              Non-stop only
            </label>
          </div>

          {/* SEARCH BUTTON */}
          <button className="search-btn" onClick={handleSearch}>
            Search Flights
          </button>
        </div>
      </div>
    </div>
  );
}

export default Flights;
