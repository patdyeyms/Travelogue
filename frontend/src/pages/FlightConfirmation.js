import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/FlightConfirmation.css";
import { getAirlineLogo } from "../utils/airlines";

function FlightConfirmation() {
  const navigate = useNavigate();
  const { flight, flightDetails, formData } = useLocation().state || {};
  const [openLegIndex, setOpenLegIndex] = useState(null);

  const bookingId = useMemo(
    () => Math.floor(Math.random() * 900000 + 100000),
    []
  );

  if (!flight || !flightDetails || !formData) {
    return (
      <div className="results-section">
        <h2>No booking data</h2>
        <p>Please go back and book a flight first.</p>
        <button className="back-btn" onClick={() => navigate("/flights")}>
          ← Back to Flights
        </button>
      </div>
    );
  }

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const toggleLegDetails = (index) =>
    setOpenLegIndex(openLegIndex === index ? null : index);

  const handleGoToItinerary = () => {
    const itineraryData = { ...flight, ...flightDetails, ...formData, bookingId };
    const existing = JSON.parse(localStorage.getItem("itinerary")) || [];
    localStorage.setItem("itinerary", JSON.stringify([...existing, itineraryData]));
    navigate("/itinerary");
  };

  const handleGoToHotels = () => {
    localStorage.setItem("selectedDestination", flightDetails.to);
    localStorage.setItem(
      "bookedFlight",
      JSON.stringify({
        origin: flightDetails.from,
        destination: flightDetails.to,
        departureDate: flightDetails.departure,
        returnDate: flightDetails.return,
        airline: flight.airline,
        price: flight.price,
        passenger: `${formData.firstName} ${formData.lastName}`,
      })
    );
    navigate("/hotels");
  };

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* ================= BOOKING CONFIRMATION ================= */}
      <div className="flight-details-card">
        <div className="flight-details-header">
          <img
            src={getAirlineLogo(flight.airline)}
            alt={flight.airline}
            className="airline-img"
          />
          <h2>Booking Confirmed!</h2>
          <span>Booking ID: #{bookingId}</span>
        </div>

        {/* ================= FLIGHT SUMMARY ================= */}
        <div className="flight-details-info">
          <p>
            {flightDetails.from} → {flightDetails.to}
          </p>
          <p>
            <strong>Departure:</strong> {flight.departureTime || flightDetails.departure} <br />
            <strong>Arrival:</strong> {flight.arrivalTime || flightDetails.return} <br />
            <strong>Stops:</strong> {flight.stops || 0} • {formatDuration(flight.duration)}
          </p>
          <p>
            <strong>Cabin:</strong> {flight.cabin || "Economy"}
          </p>
          <p>
            <strong>Price:</strong> ₱ {Number(flight.price || 0).toLocaleString()}
          </p>

          {/* ================= FLIGHT LEGS ================= */}
          {flight.flights?.map((leg, idx) => (
            <div key={idx} className="flight-summary-card">
              <div
                className="flight-summary-top"
                onClick={() => toggleLegDetails(idx)}
              >
                <div className="flight-summary-left">
                  <img
                    src={getAirlineLogo(leg.airline_code)}
                    alt={leg.airline}
                    className="airline-img"
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
                className={`flight-summary-details ${openLegIndex === idx ? "open scrollable" : ""}`}
              >
                <p><strong>Airplane:</strong> {leg.airplane || "N/A"}</p>
                <p><strong>Travel Class:</strong> {leg.travel_class || "Economy"}</p>
                {leg.legroom && <p><strong>Legroom:</strong> {leg.legroom}</p>}
                {leg.extensions?.length > 0 && (
                  <ul>{leg.extensions.map((ext, i) => <li key={i}>{ext}</li>)}</ul>
                )}
              </div>
            </div>
          ))}

          {/* ================= PASSENGER DETAILS ================= */}
          <div className="booking-form extend">
            <h3>Passenger Details</h3>
            <p>
              Passenger information must match exactly as shown on the passport.
            </p>
            <div className="booking-grid">
              <div className="input-group">
                <label>Name</label>
                <input value={`${formData.firstName} ${formData.lastName}`} disabled />
              </div>
              <div className="input-group">
                <label>Gender</label>
                <input value={formData.gender || "N/A"} disabled />
              </div>
              <div className="input-group">
                <label>Date of Birth</label>
                <input value={`${formData.birthYear}/${formData.birthMonth}/${formData.birthDay}`} disabled />
              </div>
              <div className="input-group">
                <label>Nationality</label>
                <input value={formData.nationality} disabled />
              </div>
              <div className="input-group">
                <label>Passport Number</label>
                <input value={formData.passportNumber || "N/A"} disabled />
              </div>
              <div className="input-group">
                <label>Passport Expiry</label>
                <input value={`${formData.passportExpiryYear}/${formData.passportExpiryMonth}/${formData.passportExpiryDay}`} disabled />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input value={formData.email} disabled />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input value={`${formData.countryCode} ${formData.phone}`} disabled />
              </div>
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div>
            <button className="confirm-btn" onClick={handleGoToItinerary}>Itinerary</button>
            <button className="confirm-btn" onClick={handleGoToHotels}>Hotels</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightConfirmation;
