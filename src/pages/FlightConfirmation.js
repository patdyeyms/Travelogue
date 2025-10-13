import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Flights.css";

import airasia from "../assets/flights/airasia.png";
import ana from "../assets/flights/ana.png";
import cebupacific from "../assets/flights/cebupacific.png";
import emirates from "../assets/flights/emirates.png";
import pal from "../assets/flights/pal.png";
import singapore from "../assets/flights/singapore.png";
import swiss from "../assets/flights/swiss.png";

const getAirlineLogo = (name) => {
  if (!name) return "";
  const key = name.toLowerCase().replace(/\s/g, "");
  const logos = {
    airasia,
    allnipponairways: ana,
    cebupacific,
    emirates,
    philippineairlines: pal,
    singaporeairlines: singapore,
    swissinternationalairlines: swiss,
  };
  return logos[key] || "";
};

function FlightConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, flightDetails, formData } = location.state || {};
  const [showDetails, setShowDetails] = useState(false);

  if (!flight || !flightDetails || !formData) {
    return (
      <div className="results-section">
        <h1>No booking data</h1>
        <p>Please go back and book a flight first.</p>
        <button
          className="action-btn secondary"
          onClick={() => navigate("/booking-details, ")}
        >
          Return to Flights
        </button>
      </div>
    );
  }

  const displayPrice = flight.price.toString().replace(/₱/g, "");

  return (
    <div className="thankyou-section">
      <div className="thankyou-card">
        {/* Fixed header part */}
        <div className="thankyou-header">
          <button className="close-btn" onClick={() => navigate("/flights")}>
            <i className="bi bi-x-lg"></i>
          </button>
          <h1>Thank You!</h1>
          <p className="small-muted">
            Your flight booking information has been saved.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="thankyou-content">
          <div className="flight-summary-card">
            {/* Summary top (clickable) */}
            <div
              className="flight-summary-top"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              <div className="flight-summary-left">
                <img
                  src={getAirlineLogo(flight.airline)}
                  alt={flight.airline}
                  className="flight-logo"
                />
                <div className="flight-summary-info">
                  <span>
                    <strong>{flight.airline}</strong>
                  </span>
                  <span>
                    {flightDetails.from} → {flightDetails.to}
                  </span>
                  <span>
                    {flightDetails.departureTime} – {flightDetails.arrivalTime}
                  </span>
                </div>
              </div>
              <div className="flight-summary-right">
                ₱ {displayPrice}
                <span
                  className={`flight-summary-arrow ${
                    showDetails ? "open" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>

            {/* Scrollable dropdown */}
            <div
              className={`flight-summary-details ${
                showDetails ? "open" : ""
              }`}
            >
              <p>
                <strong>Passenger:</strong> {formData.firstName}{" "}
                {formData.lastName}
              </p>
              <p>
                <strong>Flight:</strong> {flight.airline} — {flightDetails.from} →{" "}
                {flightDetails.to}
              </p>
              <p>
                <strong>When:</strong> {flightDetails.departure}{" "}
                {flightDetails.return
                  ? `| Return: ${flightDetails.return}`
                  : ""}
              </p>
              <p>
                <strong>Time:</strong> {flight.departureTime} –{" "}
                {flight.arrivalTime}
              </p>
              <p>
                <strong>Fare:</strong> ₱ {displayPrice}
              </p>
            </div>
          </div>

          <div className="confirm-actions">
            <button
              className="action-btn primary"
              onClick={() => navigate("/signup", { state: { formData } })}
            >
              Login (Save details)
            </button>

            <button
              className="action-btn secondary"
              onClick={() =>
                navigate("/itinerary", {
                  state: { flight, flightDetails, formData },
                })
              }
            >
              Continue to Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightConfirmation;
