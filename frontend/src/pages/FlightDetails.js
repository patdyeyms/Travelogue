import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Flights.css";
import { getAirlineLogo } from "../utils/airlines";

function FlightDetails() {
  const navigate = useNavigate();
  const { flight, flightDetails } = useLocation().state || {};
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passport: "",
  });
  const [saving, setSaving] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Handle missing flight data
  if (!flight || !flightDetails) {
    return (
      <div className="results-section">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>No flight selected</h1>
        <p>Please go back and choose a flight to view details.</p>
      </div>
    );
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleConfirm = (e) => {
    e.preventDefault();
    const required = ["firstName", "lastName", "email", "phone"];
    for (const field of required) {
      if (!formData[field]) {
        alert("Please fill in all required fields.");
        return;
      }
    }
    setSaving(true);

    const fullFlightData = {
      ...flight,
      departureTime: flight.departureTime || flightDetails.departure,
      arrivalTime: flight.arrivalTime || flightDetails.return || "N/A",
    };

    setTimeout(
      () =>
        navigate("/flight-confirmation", {
          state: { flight: fullFlightData, flightDetails, formData },
        }),
      900
    );
  };

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Results
      </button>

      <div className="flight-details-card">
        <div className="flight-details-header">
          <img
          src={getAirlineLogo(flight.airlineCode)}
          alt={flight.airline}
          className="airline-img"
        />
          <h2>{flight.airline}</h2>
        </div>

        <div className="flight-details-info">
          <p>
            <strong>{flight.departureTime || "N/A"}</strong> –{" "}
            <strong>{flight.arrivalTime || "N/A"}</strong>
          </p>
          <p>
            {flightDetails.from} → {flightDetails.to}
          </p>
          <p>
            <strong>Stops:</strong> {flight.stops || "N/A"} •{" "}
            {flight.duration || "N/A"}
          </p>
          <p>
            <strong>Cabin:</strong> {flight.cabin || "Economy"}
          </p>
          <p>
            <strong>Price:</strong> ₱ {Number(flight.price || 0).toLocaleString()}
          </p>
        </div>

        <div
          className="flight-summary-card"
          onClick={() => setDetailsOpen(!detailsOpen)}
        >
          <div className="flight-summary-top">
            <div className="flight-summary-left">
              <span>Flight Details</span>
            </div>
            <div
              className={`flight-summary-arrow ${detailsOpen ? "open" : ""}`}
              aria-label={detailsOpen ? "Collapse details" : "Expand details"}
            >
              ▼
            </div>
          </div>
          <div
            className={`flight-summary-details ${detailsOpen ? "open scrollable" : ""}`}
          >
            <p>
              <strong>Departure:</strong> {flightDetails.from} at{" "}
              {flight.departureTime || "N/A"}
            </p>
            <p>
              <strong>Arrival:</strong> {flightDetails.to} at{" "}
              {flight.arrivalTime || "N/A"}
            </p>
            <p>
              <strong>Stops:</strong> {flight.stops || "N/A"}
            </p>
            <p>
              <strong>Duration:</strong> {flight.duration || "N/A"}
            </p>
            <p>
              <strong>Cabin:</strong> {flight.cabin || "Economy"}
            </p>
          </div>
        </div>
      </div>

      <form className="booking-form extended" onSubmit={handleConfirm}>
        <h3>Passenger Information</h3>
        <div className="booking-grid">
          {["firstName", "lastName", "email", "phone", "passport"].map(
            (field) => (
              <div key={field} className="input-group">
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field !== "passport"}
                  placeholder={field !== "passport" ? "Required" : "Optional"}
                />
              </div>
            )
          )}
        </div>
        <button type="submit" className="confirm-btn" disabled={saving}>
          {saving ? "Saving..." : "Confirm Flight"}
        </button>
      </form>
    </div>
  );
}

export default FlightDetails;
