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
      // Get user info for user-specific storage
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const userId = user?.email || user?.id || 'default';

      // Get flight details (check user-specific key first)
      let flightDetails = JSON.parse(localStorage.getItem(`flightDetails_${userId}`) || "{}");
      if (!flightDetails || Object.keys(flightDetails).length === 0) {
        flightDetails = JSON.parse(localStorage.getItem("flightDetails") || "{}");
      }

      const hotelToSave = { 
        ...bookingData.hotel, 
        bookedForTrip: flightDetails.to 
      };

      // Save with user-specific key
      localStorage.setItem(`selectedHotel_${userId}`, JSON.stringify(hotelToSave));
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

  const handleGoToItinerary = () => {
    // Get user info
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.email || user?.id || 'default';

    // Get flight details from user-specific storage
    let flightDetails = JSON.parse(localStorage.getItem(`flightDetails_${userId}`) || "null");
    if (!flightDetails) {
      flightDetails = JSON.parse(localStorage.getItem("flightDetails") || "null");
    }

    navigate("/itinerary", { 
      state: { 
        flightDetails, 
        hotel: bookingData.hotel 
      } 
    });
  };

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
            onClick={handleGoToItinerary}
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