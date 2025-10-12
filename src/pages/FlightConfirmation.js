import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Flights.css";

function FlightConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, flightDetails, formData } = location.state || {};

  // Redirect back if no booking data
  if (!flight || !flightDetails || !formData) {
    return (
      <div className="results-section">
        <h1>No booking data</h1>
        <p>Please go back and book a flight first.</p>
        <button className="action-btn secondary" onClick={() => navigate("/flights")}>
          Return to Flights
        </button>
      </div>
    );
  }

  return (
    <div className="thankyou-section">
      <div className="thankyou-card">
        {/* 🔹 Close / Return button */}
        <button className="close-btn" onClick={() => navigate("/flights")}>
          <i className="bi bi-x-lg"></i>
        </button>

        <h1>Thank You!</h1>
        <p className="small-muted">Your flight booking information has been saved.</p> <br></br>

        <div className="thankyou-card-in">
            <div className="thank-summary">
            <p><strong>Passenger:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Flight:</strong> {flight.airline} — {flightDetails.from} → {flightDetails.to}</p>
            <p><strong>When:</strong> {flightDetails.departure} {flightDetails.return ? ` | Return: ${flightDetails.return}` : ""}</p>
            <p><strong>Time:</strong> {flight.departureTime} – {flight.arrivalTime}</p>
            <p><strong>Fare:</strong> {flight.price}</p>
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
            onClick={() => navigate("/itinerary", { state: { flight, flightDetails, formData } })}
          >
            Continue to Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlightConfirmation;
