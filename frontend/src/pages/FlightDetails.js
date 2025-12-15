import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/FlightDetails.css";
import { getAirlineLogo } from "../utils/airlines";

function FlightDetails() {
  const navigate = useNavigate();
  const { flight, flightDetails } = useLocation().state || {};

  const [formData, setFormData] = useState({
    passportNumber: "",
    passportExpiryYear: "",
    passportExpiryMonth: "",
    passportExpiryDay: "",
    nationality: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    firstName: "",
    lastName: "",
    countryCode: "",
    phone: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);
  const [openLegIndex, setOpenLegIndex] = useState(null);

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

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const toggleLegDetails = (index) =>
    setOpenLegIndex(openLegIndex === index ? null : index);

  const handleConfirm = (e) => {
    e.preventDefault();

    const requiredFields = [
      "passportNumber",
      "firstName",
      "lastName",
      "email",
      "phone",
      "nationality",
      "birthYear",
      "birthMonth",
      "birthDay",
      "gender",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert("Please fill in all required fields.");
        return;
      }
    }

    setSaving(true);

    const firstLeg = flight.flights?.[0] || {};
    const lastLeg = flight.flights?.[flight.flights.length - 1] || {};
    const totalDuration = flight.flights?.reduce(
      (sum, leg) => sum + (leg.duration || 0),
      0
    );

    const fullFlightData = {
      ...flight,
      airline: flight.airline || firstLeg.airline, // ← FIXED: Added airline name
      departureTime: firstLeg.departure_airport?.time,
      arrivalTime: lastLeg.arrival_airport?.time,
      stops: flight.flights?.length - 1 || 0,
      duration: totalDuration,
      cabin: firstLeg.travel_class || "Economy",
      airlineCode: firstLeg.airline_code,
    };

    setTimeout(() => {
      navigate("/flight-confirmation", {
        state: { flight: fullFlightData, flightDetails, formData },
      });
    }, 900);
  };

  const firstLeg = flight.flights?.[0] || {};
  const lastLeg = flight.flights?.[flight.flights.length - 1] || {};
  const totalDuration = flight.flights?.reduce(
    (sum, leg) => sum + (leg.duration || 0),
    0
  );

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Results
      </button>

      {/* ================= FLIGHT SUMMARY ================= */}
      <div className="flight-details-card">
        <div className="flight-details-header">
          <img
            src={getAirlineLogo(firstLeg.airline || firstLeg.airline_code)}
            alt={flight.airline}
            className="airline-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h2>{flight.airline}</h2>
        </div>

        <div className="flight-details-info">
          <p>
            <strong>{firstLeg.departure_airport?.time}</strong> –{" "}
            <strong>{lastLeg.arrival_airport?.time}</strong>
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

          {/* ================= LEGS DETAILS COLLAPSIBLE ================= */}
          {flight.flights.map((leg, idx) => (
            <div key={idx} className="flight-summary-card">
              <div
                className="flight-summary-top"
                onClick={() => toggleLegDetails(idx)}
              >
                <div className="flight-summary-left">
                  <img
                    src={getAirlineLogo(leg.airline || leg.airline_code)}
                    alt={leg.airline}
                    className="airline-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="flight-summary-info">
                    <span>{leg.airline} • {leg.flight_number}</span>
                    <span>
                      {leg.departure_airport?.id} {leg.departure_airport?.time} →{" "}
                      {leg.arrival_airport?.id} {leg.arrival_airport?.time}
                    </span>
                  </div>
                </div>
                <div className="flight-summary-right">
                  {formatDuration(leg.duration)}
                  <span className={`flight-summary-arrow ${openLegIndex === idx ? "open" : ""}`}>
                    ▼
                  </span>
                </div>
              </div>

              <div
                className={`flight-summary-details ${
                  openLegIndex === idx ? "open scrollable" : ""
                }`}
              >
                <p><strong>Airplane:</strong> {leg.airplane}</p>
                <p><strong>Travel Class:</strong> {leg.travel_class}</p>
                <p><strong>Legroom:</strong> {leg.legroom}</p>
                {leg.extensions?.length > 0 && (
                  <ul>
                    {leg.extensions.map((ext, i) => (
                      <li key={i}>{ext}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PASSENGER DETAILS ================= */}
      <form className="booking-form extended" onSubmit={handleConfirm}>
        <h3>Passenger Details</h3>
        <p>
          Passenger information must match exactly as shown on the passport.
        </p>

        <div className="booking-grid">
          <div className="input-group">
            <label>Passport Number *</label>
            <input
              name="passportNumber"
              placeholder="e.g. P12345678"
              value={formData.passportNumber}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Nationality / Country *</label>
            <input
              name="nationality"
              placeholder="e.g. Philippines"
              value={formData.nationality}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Passport Expiry (YYYY / MM / DD)</label>
            <input
              name="passportExpiryYear"
              placeholder="Year"
              value={formData.passportExpiryYear}
              onChange={handleChange}
            />
            <input
              name="passportExpiryMonth"
              placeholder="Month"
              value={formData.passportExpiryMonth}
              onChange={handleChange}
            />
            <input
              name="passportExpiryDay"
              placeholder="Day"
              value={formData.passportExpiryDay}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Date of Birth (YYYY / MM / DD) *</label>
            <input
              name="birthYear"
              placeholder="Year"
              value={formData.birthYear}
              onChange={handleChange}
            />
            <input
              name="birthMonth"
              placeholder="Month"
              value={formData.birthMonth}
              onChange={handleChange}
            />
            <input
              name="birthDay"
              placeholder="Day"
              value={formData.birthDay}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Please select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>

        <h3 style={{ marginTop: "2rem" }}>Contact Details</h3>
        <div className="booking-grid">
          <div className="input-group">
            <label>First Name *</label>
            <input
              name="firstName"
              placeholder="e.g. Juan"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Last Name *</label>
            <input
              name="lastName"
              placeholder="e.g. Dela Cruz"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Country / Region Code *</label>
            <input
              name="countryCode"
              placeholder="+63"
              value={formData.countryCode}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Phone Number *</label>
            <input
              name="phone"
              placeholder="9123456789"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email Address *</label>
            <input
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="confirm-btn" disabled={saving}>
          {saving ? "Saving..." : "Confirm Flight"}
        </button>
      </form>
    </div>
  );
}

export default FlightDetails;