import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/FlightsResults.css";
import { getAirlineLogo } from "../utils/airlines";

function FlightResults() {
  const navigate = useNavigate();
  const { flightDetails, flights = [] } = useLocation().state || {};
  const [openIndex, setOpenIndex] = useState(null);
  const [openExtensions, setOpenExtensions] = useState({}); // track per leg

  if (!flightDetails || !flights.length) {
    return (
      <div className="results-section">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back to Search</button>
        <h1>No flight details found</h1>
        <p>Please go back to the Flights page and search again.</p>
      </div>
    );
  }

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const toggleExtensions = (flightIdx, legIdx) => {
    setOpenExtensions(prev => ({
      ...prev,
      [`${flightIdx}-${legIdx}`]: !prev[`${flightIdx}-${legIdx}`]
    }));
  };

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Search</button>
      <h1>Flights from {flightDetails.from} to {flightDetails.to}</h1>
      <p>
        Departure: {flightDetails.departure}
        {flightDetails.return && ` | Return: ${flightDetails.return}`}
      </p>

      <div className="results-list">
        {flights.map((flight, flightIdx) => {
          const price = Number(flight.price || 0).toLocaleString();
          return (
            <div key={flightIdx} className="flight-card">
              <div className="flight-logo">
                <img src={flight.airline_logo || getAirlineLogo(flight.airline)} alt={flight.airline} />
              </div>

              <div className="flight-details">
                {flight.flights.map((leg, legIdx) => {
                  const extOpen = openExtensions[`${flightIdx}-${legIdx}`];
                  return (
                    <div key={legIdx} className="flight-leg">
                      <h3>{leg.airline} • {leg.flight_number}</h3>
                      <p>
                        {leg.departure_airport?.name} ({leg.departure_airport?.id}) {leg.departure_airport?.time} → 
                        {leg.arrival_airport?.name} ({leg.arrival_airport?.id}) {leg.arrival_airport?.time}
                      </p>
                      <p>Duration: {formatDuration(leg.duration)}</p>
                      <p>Airplane: {leg.airplane}</p>
                      <p>Cabin: {leg.travel_class} • Legroom: {leg.legroom}</p>

                      {leg.extensions?.length > 0 && (
                        <div className="extensions-container">
                          <button
                            className="extensions-toggle"
                            onClick={() => toggleExtensions(flightIdx, legIdx)}
                          >
                            Extensions {extOpen ? "▲" : "▼"}
                          </button>
                          <div className={`extensions-list ${extOpen ? "open" : ""}`}>
                            <ul>
                              {leg.extensions.map((ext, idx) => <li key={idx}>{ext}</li>)}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flight-price-btn">
                <div className="flight-price">₱ {price}</div>
                <button
                  className="flight-book-btn"
                  onClick={() => navigate("/flight-details", { state: { flight, flightDetails } })}
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FlightResults;
