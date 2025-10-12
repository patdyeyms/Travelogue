import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Flights.css";
import pal from "../assets/flights/pal.png";
import cebu from "../assets/flights/cebupacific.png";
import singapore from "../assets/flights/singapore.png";
import swiss from "../assets/flights/swiss.png";
import emirates from "../assets/flights/emirates.png";
import airasia from "../assets/flights/airasia.png";
import ana from "../assets/flights/ana.png";

function FlightDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, flightDetails } = location.state || {};

  const airlineLogos = {
    "Philippine Airlines": pal,
    "Cebu Pacific": cebu,
    "Singapore Airlines": singapore,
    "Swiss International Air Lines": swiss,
    "Emirates": emirates,
    "AirAsia": airasia,
    "ANA": ana,
  };

  if (!flight || !flightDetails) {
    return (
      <div className="results-section">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Flights
        </button>
        <h1>No flight selected</h1>
        <p>Please go back and choose a flight to view details.</p>
      </div>
    );
  }

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Results
      </button>

      <div className="flight-details-card">
        <div className="flight-details-header">
          <img
            src={airlineLogos[flight.airline]}
            alt={flight.airline}
            style={{ width: "70px", height: "auto" }}
          />
          <h2>{flight.airline}</h2>
        </div>

        <div className="flight-details-info">
          <p>
            <strong>{flight.departureTime}</strong> –{" "}
            <strong>{flight.arrivalTime}</strong>
          </p>
          <p>
            {flightDetails.from} → {flightDetails.to}
          </p>
          <p>
            {flight.stops} • {flight.duration}
          </p>
          <p>
            <strong>Cabin:</strong> {flight.cabin}
          </p>
          <p>
            <strong>Price:</strong> {flight.price}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FlightDetails;
