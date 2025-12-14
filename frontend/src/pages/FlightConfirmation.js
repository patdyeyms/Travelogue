import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/FlightConfirmation.css";
import { getAirlineLogo } from "../utils/airlines";

function FlightConfirmation() {
  const navigate = useNavigate();
  const { flight, flightDetails, formData } = useLocation().state || {};
  const [openLegIndex, setOpenLegIndex] = useState(null);

  const bookingId = useMemo(() => Math.floor(Math.random() * 900000 + 100000), []);

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
    const itineraryData = {
      ...flight,
      ...flightDetails,
      ...formData,
      bookingId,
    };
    const existing = JSON.parse(localStorage.getItem("itinerary") || "[]");
    localStorage.setItem("itinerary", JSON.stringify([...existing, itineraryData]));

    localStorage.setItem("flightDetails", JSON.stringify(flightDetails));

    // Check if a hotel has been booked
    const bookedHotel = JSON.parse(localStorage.getItem("bookedHotel") || "null");

    navigate("/itinerary", { state: { flightDetails, hotel: bookedHotel } });
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

    navigate("/hotels", { state: { flightDetails } });
  };

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="flight-details-card">
        <div className="flight-details-header">
          <img
            src={getAirlineLogo(flight.airline)}
            alt={flight.airline}
            className="airline-img"
          />
          <h2>Booking Confirmed!</h2>
          <span>Booking ID: #{bookingId}</span>
          <img
            src={process.env.PUBLIC_URL + "/printer.png"}
            alt="Print"
            className="print-btn"
            onClick={() => window.print()}
            title="Print Confirmation"
          />
        </div>

        <div className="flight-details-info">
          <p>
            {flightDetails.from} → {flightDetails.to}
          </p>
          <p>
            <strong>Departure:</strong> {flightDetails.departureTime || flightDetails.departure} <br />
            <strong>Arrival:</strong> {flightDetails.arrivalTime || flightDetails.return} <br />
            <strong>Stops:</strong> {flight.stops || 0} • {formatDuration(flight.duration)}
          </p>
          <p>
            <strong>Cabin:</strong> {flight.cabin || "Economy"}
          </p>
          <p>
            <strong>Price:</strong> ₱ {Number(flight.price || 0).toLocaleString()}
          </p>

          <div className="booking-form extend">
            <h3>Passenger Details</h3>
            <p>Passenger information must match passport details.</p>
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

          <div>
            <button className="confirm-btn" onClick={handleGoToItinerary}>
              Itinerary
            </button>
            <button className="confirm-btn" onClick={handleGoToHotels}>
              Hotels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightConfirmation;
