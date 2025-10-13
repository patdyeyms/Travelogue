import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/HotelConfirmation.css";

function HotelConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
  if (bookingData) {
    const flightDetails = JSON.parse(localStorage.getItem("flightDetails") || "{}");
    const hotelToSave = { ...bookingData.hotel, bookedForTrip: flightDetails.to };
    localStorage.setItem("selectedHotel", JSON.stringify(hotelToSave));
    }
  }, [bookingData]);



  if (!bookingData || !bookingData.hotel) {
    return (
      <div className="thankyou-section">
        <div className="thankyou-card">
          <h1>No booking data</h1>
          <p>Please go back and select a hotel first.</p>
          <button className="action-btn secondary" onClick={() => navigate("/hotels")}>
            Return to Hotels
          </button>
        </div>
      </div>
    );
  }

  const { hotel, checkIn, checkOut, adults, children, adultDetails, childDetails } = bookingData;

  return (
    <div className="thankyou-section">
      <div className="thankyou-card">
        <button className="close-btn" onClick={() => navigate("/hotels")}>
          <i className="bi bi-x-lg"></i>
        </button>

        <h1>Booking Confirmed!</h1>
        <p className="small-muted">Your hotel booking information has been saved.</p>

        <div
          className="hotel-summary-top"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          <div className="hotel-summary-left">
            <img src={hotel.image} alt={hotel.name} className="hotel-img" />
            <div className="hotel-info">
              <strong>{hotel.name}</strong>
              <span>
                {hotel.city}, {hotel.country}
              </span>
              <span>⭐ {hotel.stars} stars</span>
            </div>
          </div>
          <div className="hotel-summary-right">
            {showDetails ? "▲" : "▼"}
          </div>
        </div>

        <div className={`hotel-summary-details ${showDetails ? "open" : ""}`}>
          <p>
            <strong>Check-in:</strong> {checkIn}
          </p>
          <p>
            <strong>Check-out:</strong> {checkOut}
          </p>
          <p>
            <strong>Guests:</strong> {adults} adult(s), {children} child(ren)
          </p>
          {adultDetails?.length > 0 && (
            <div>
              <strong>Adult Details:</strong>
              <ul>
                {adultDetails.map((a, i) => (
                  <li key={i}>
                    {a.name} ({a.age} yrs)
                  </li>
                ))}
              </ul>
            </div>
          )}
          {childDetails?.length > 0 && (
            <div>
              <strong>Child Details:</strong>
              <ul>
                {childDetails.map((c, i) => (
                  <li key={i}>
                    {c.name} ({c.age} yrs)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="confirm-actions">
          <button
            className="action-btn primary"
            onClick={() => navigate("/itinerary")}
          >
            Go to Itinerary
          </button>

          <button
            className="action-btn secondary"
            onClick={() => navigate("/hotels")}
          >
            Back to Hotels
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelConfirmation;
