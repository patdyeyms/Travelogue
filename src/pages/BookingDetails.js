import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/BookingDetails.css";

function BookingDetails() {
  const { state } = useLocation();
  const hotel = state?.hotel;
  const navigate = useNavigate();

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [guestDetails, setGuestDetails] = useState([{ name: "", age: "" }]);
  const [childDetails, setChildDetails] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [futureBooking, setFutureBooking] = useState(false);

  if (!hotel) return <p>No hotel selected. Go back to Hotels page.</p>;

  const handleAdultsChange = (e) => {
    const count = parseInt(e.target.value);
    setAdults(count);

    const details = [];
    for (let i = 0; i < count; i++) {
      details.push(guestDetails[i] || { name: "", age: "" });
    }
    setGuestDetails(details);
  };

  const handleChildrenChange = (e) => {
    const count = parseInt(e.target.value);
    setChildren(count);

    const details = [];
    for (let i = 0; i < count; i++) {
      details.push(childDetails[i] || { name: "", age: "" });
    }
    setChildDetails(details);
  };

  const handleGuestChange = (index, field, value, isChild = false) => {
    if (isChild) {
      const newDetails = [...childDetails];
      newDetails[index][field] = value;
      setChildDetails(newDetails);
    } else {
      const newDetails = [...guestDetails];
      newDetails[index][field] = value;
      setGuestDetails(newDetails);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      hotel,
      checkIn,
      checkOut,
      adults,
      children,
      guestDetails,
      childDetails,
      futureBooking,
      userSignedUp: false, // for later signup
    };

    navigate("/booking-confirmation", { state: { booking: bookingData } });
  };

  return (
    <div className="booking-page">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>

      <h1>Booking: {hotel.name}</h1>
      <p>{hotel.city}, {hotel.country}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Check-in Date:</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Check-out Date:</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Number of Adults:</label>
          <input type="number" min="1" value={adults} onChange={handleAdultsChange} />
        </div>

        {guestDetails.map((guest, idx) => (
          <div key={idx} className="guest-details">
            <h4>Adult {idx + 1}</h4>
            <input
              type="text"
              placeholder="Name"
              value={guest.name}
              onChange={(e) => handleGuestChange(idx, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              value={guest.age}
              onChange={(e) => handleGuestChange(idx, "age", e.target.value)}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Number of Children:</label>
          <input type="number" min="0" value={children} onChange={handleChildrenChange} />
        </div>

        {childDetails.map((child, idx) => (
          <div key={idx} className="guest-details">
            <h4>Child {idx + 1}</h4>
            <input
              type="text"
              placeholder="Name"
              value={child.name}
              onChange={(e) => handleGuestChange(idx, "name", e.target.value, true)}
            />
            <input
              type="number"
              placeholder="Age"
              value={child.age}
              onChange={(e) => handleGuestChange(idx, "age", e.target.value, true)}
            />
          </div>
        ))}

        <div className="future-booking">
          <input
            type="checkbox"
            checked={futureBooking}
            onChange={() => setFutureBooking(!futureBooking)}
          />
          <span>Continue booking for future purposes</span>
        </div>

        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
}

export default BookingDetails;
