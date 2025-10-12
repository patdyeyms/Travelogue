import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/BookingDetails.css";

function HotelConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  if (!booking) {
    return (
      <div className="thankyou-section">
        <h1>No booking data</h1>
        <p>Please go back and book a hotel first.</p>
        <button className="action-btn secondary" onClick={() => navigate("/hotels")}>
          Return to Hotels
        </button>
      </div>
    );
  }

  return (
    <div className="thankyou-section">
      <div className="thankyou-card">
        {/* Close button */}
        <button className="close-btn" onClick={() => navigate("/hotels")}>
          &times;
        </button>

        <h1>Thank You!</h1>
        <p className="small-muted">Your hotel booking has been confirmed.</p><br></br>

        <div className="thankyou-card-in">
          <div className="thank-summary">
            <p><strong>Hotel:</strong> {booking.hotel.name}</p>
            <p><strong>Location:</strong> {booking.hotel.city}, {booking.hotel.country}</p>
            <p><strong>Check-in:</strong> {booking.checkIn}</p>
            <p><strong>Check-out:</strong> {booking.checkOut}</p>
            <p><strong>Guests:</strong> {booking.adults} Adult(s){booking.children ? `, ${booking.children} Child(ren)` : ""}</p>
          </div>
        </div>

        <div className="confirm-actions">
          <button
            className="action-btn primary"
            onClick={() => navigate("/signup", { state: { booking } })}
          >
            Sign Up (Save details)
          </button>

          <button
            className="action-btn secondary"
            onClick={() => navigate("/itinerary", { state: { booking } })}
          >
            Continue to Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelConfirmation;
