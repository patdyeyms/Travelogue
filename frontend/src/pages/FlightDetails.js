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

  const firstLeg = flight.flights?.[0] || {};
  const lastLeg = flight.flights?.[flight.flights.length - 1] || {};

  const totalDuration = flight.flights?.reduce(
    (sum, leg) => sum + (leg.duration || 0),
    0
  );

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

    const totalDuration = flight.flights?.reduce(
      (sum, leg) => sum + (leg.duration || 0),
      0
    );

    const fullFlightData = {
      ...flight,
      departureTime: firstLeg.departure_airport?.time || flightDetails.departure,
      arrivalTime: lastLeg.arrival_airport?.time || flightDetails.return || "N/A",
      stops: flight.flights?.length > 1 ? flight.flights.length - 1 : 0,
      duration: totalDuration || "N/A",
      cabin: firstLeg.travel_class || "Economy",
      airlineCode: firstLeg.airline_code || flight.airlineCode || "",
    };

    setTimeout(
      () =>
        navigate("/flight-confirmation", {
          state: { flight: fullFlightData, flightDetails, formData },
        }),
      900
    );
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Results
      </button>

      {/* Flight Summary Card */}
      <div className="flight-details-card">
        <div className="flight-details-header">
          <img
            src={getAirlineLogo(firstLeg.airline_code || flight.airlineCode)}
            alt={flight.airline || firstLeg.airline}
            className="airline-img"
          />
          <h2>{flight.airline || firstLeg.airline}</h2>
        </div>

        <div className="flight-details-info">
          <p>
            <strong>{firstLeg.departure_airport?.time || "N/A"}</strong> –{" "}
            <strong>{lastLeg.arrival_airport?.time || "N/A"}</strong>
          </p>
          <p>
            {flightDetails.from} → {flightDetails.to}
          </p>
          <p>
            <strong>Stops:</strong> {flight.flights?.length - 1 || 0} •{" "}
            {formatDuration(totalDuration)}
          </p>
          <p>
            <strong>Cabin:</strong> {firstLeg.travel_class || "Economy"}
          </p>
          <p>
            <strong>Price:</strong> ₱ {Number(flight.price || 0).toLocaleString()}
          </p>
        </div>

        <br/>

        {/* Flight Legs Details - Expanded */}
        <div className="flight-summary-card">
          {flight.flights?.map((leg, idx) => (
            <div key={idx} className="flight-leg">
              <h4>
                {leg.airline} • {leg.flight_number} ({leg.travel_class})
              </h4>
              <p>
                {leg.departure_airport?.name} ({leg.departure_airport?.id}) at{" "}
                {leg.departure_airport?.time} → {leg.arrival_airport?.name} (
                {leg.arrival_airport?.id}) at {leg.arrival_airport?.time}
              </p>
              <p>Duration: {formatDuration(leg.duration)}</p>
              <p>Airplane: {leg.airplane || "N/A"}</p>
              {leg.legroom && <p>Legroom: {leg.legroom}</p>}
              {leg.extensions?.length > 0 && (
                <div>
                  <strong>Extensions:</strong>
                  <ul>
                    {leg.extensions.map((ext, i) => (
                      <li key={i}>{ext}</li>
                    ))}
                  </ul>
                </div>
              )}
              <hr />
            </div>
          ))}

          {/* Layovers */}
          {flight.layovers?.length > 0 && (
            <p>
              <strong>Layovers:</strong>{" "}
              {flight.layovers.map((layover, idx) => (
                <span key={idx}>
                  {layover.name} ({formatDuration(layover.duration)})
                  {layover.overnight ? " • Overnight" : ""}
                  {idx < flight.layovers.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          )}

          {/* Carbon Emissions */}
          {flight.carbon_emissions && (
            <p>
              <strong>Carbon Emissions:</strong>{" "}
              {(flight.carbon_emissions.this_flight / 1000).toFixed(2)} kg (
              {flight.carbon_emissions.difference_percent > 0 ? "+" : ""}
              {flight.carbon_emissions.difference_percent}% vs typical)
            </p>
          )}
        </div>
      </div>

      {/* Passenger Booking Form */}
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
