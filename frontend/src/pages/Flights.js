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

  const [flightDetails, setFlightDetails] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
  });

  // Load saved selections
  useEffect(() => {
    const savedFlight = JSON.parse(localStorage.getItem("flightDetails"));
    if (savedFlight) setFlightDetails(savedFlight);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    const { from, to, departure, return: returnDate } = flightDetails;

    if (!from || !to) return alert("Please select both From and To cities.");
    if (!departure) return alert("Please select a departure date.");

    const departure_id = destinations[from];
    const arrival_id = destinations[to];

    const apiKey = "c8b6fbe00d6808a893bdf7dc69f12123ca0fb4f373bca58291a6ceeb1055e7fb"; // <-- replace with your actual key

    try {
      const response = await axios.get("http://localhost:5000/api/flights", {
        params: {
          departure_id,
          arrival_id,
          outbound_date: departure,
          return_date: returnDate || undefined,
        },
      });

      const flightsData = response.data?.best_flights || [];


      if (!flightsData.length) {
        alert("No flights found.");
        return;
      }

      // Save selections
      localStorage.setItem("flightDetails", JSON.stringify(flightDetails));
      localStorage.setItem("selectedDestination", to);

      navigate("/flights/results", {
        state: { flightDetails, flights: flightsData },
      });
    } catch (error) {
      console.error("Error fetching flights:", error);
      alert("Failed to fetch flights from SerpApi.");
    }
  };


  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flights-page">
      <section className="flights-hero">
        <div className="hero-overlay"></div>
        <div className="flights-hero-content">
          <h1>Book Your Next Adventure</h1>
          <p>Fly to <strong>Japan, Dubai, Switzerland, Singapore</strong>, or anywhere in the Philippines.</p>
        </div>
      </section>

      <div className="search-container">
        <div className="flight-search-box">
          <div className="input-group">
            <label>From</label>
            <select name="from" value={flightDetails.from} onChange={handleChange}>
              <option value="">Select city</option>
              {Object.keys(destinations).map((city, i) => <option key={i} value={city}>{city}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>To</label>
            <select name="to" value={flightDetails.to} onChange={handleChange}>
              <option value="">Select city</option>
              {Object.keys(destinations).map((city, i) => <option key={i} value={city}>{city}</option>)}
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
            <label>Return (optional)</label>
            <input
              type="date"
              name="return"
              value={flightDetails.return}
              min={flightDetails.departure || today}
              onChange={handleChange}
            />
          </div>

          <button className="search-btn" onClick={handleSearch}>Search Flights</button>
        </div>
      </div>
    </div>
  );
}

export default Flights;
