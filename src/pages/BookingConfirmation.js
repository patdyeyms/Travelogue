import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/BookingDetails.css";

function BookingConfirmation() {
  const { state } = useLocation();
  const booking = state?.booking;
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [containerHeight, setContainerHeight] = useState("auto");

  useEffect(() => {
    // Adjust container height dynamically based on guest count
    if (booking) {
      const totalGuests =
        booking.adults +
        (booking.children || 0);
      const baseHeight = 150; // base height for 1-2 guests
      const perGuestHeight = 50; // additional per guest
      setContainerHeight(baseHeight + perGuestHeight * totalGuests);
    }
  }, [booking]);

  if (!booking) return <p>No booking data found.</p>;

  return (
    <div className="booking-page">
      <h1 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "1rem" }}>
        Thank You!
      </h1>

      <div
        className="guest-details"
        style={{ minHeight: containerHeight, position: "relative" }}
      >
        <h3>{booking.hotel.name} Booking Summary</h3>
        <p>{booking.hotel.city}, {booking.hotel.country}</p>
        <p>Check-in: {booking.checkIn}</p>
        <p>Check-out: {booking.checkOut}</p>

        {/* See Details link */}
        <span
          style={{
            position: "absolute",
            bottom: "10px",
            left: "15px",
            textDecoration: "underline",
            color: "#ff8f2c",
            cursor: "pointer",
            fontWeight: "600"
          }}
          onClick={() => setShowDetails(!showDetails)}
        >
          See Details
        </span>

        {showDetails && (
          <div style={{ marginTop: "1.5rem" }}>
            <p>Adults: {booking.adults}</p>
            <p>Children: {booking.children}</p>
            {booking.guestDetails.map((guest, idx) => (
              <p key={idx}>Adult {idx + 1}: {guest.name}, Age: {guest.age}</p>
            ))}
            {booking.childDetails?.map((child, idx) => (
              <p key={idx}>Child {idx + 1}: {child.name}, Age: {child.age}</p>
            ))}
            {booking.futureBooking && <p>Future Booking: Yes</p>}
          </div>
        )}
      </div>

      {/* Buttons below container */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button
          className="back-btn"
          style={{ flex: 1 }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
        <button
          className="back-btn"
          style={{ flex: 1 }}
          onClick={() => navigate("/itinerary", { state: { booking } })}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmation;
