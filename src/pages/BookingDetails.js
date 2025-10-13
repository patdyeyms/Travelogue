import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/BookingDetails.css";

function BookingDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel } = location.state || {}; // ✅ get the real selected hotel

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    futureBooking: false,
  });

  const [adultDetails, setAdultDetails] = useState([]);
  const [childDetails, setChildDetails] = useState([]);
  const [flightData, setFlightData] = useState(null);

  // 🕒 Auto-fill from recent flight booking (if available)
  useEffect(() => {
    const savedFlight = localStorage.getItem("bookedFlight");
    if (savedFlight) {
      const flight = JSON.parse(savedFlight);
      setFlightData(flight);

      // Pre-fill check-in/check-out based on flight
      setFormData((prev) => ({
        ...prev,
        checkIn: flight.departureDate || "",
        checkOut: flight.returnDate || "",
      }));
    }
  }, []);

  // Update adults/children form inputs dynamically
  useEffect(() => {
    setAdultDetails(Array.from({ length: formData.adults }, () => ({ name: "", age: "" })));
    setChildDetails(Array.from({ length: formData.children }, () => ({ name: "", age: "" })));
  }, [formData.adults, formData.children]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAdultChange = (index, field, value) => {
    const updated = [...adultDetails];
    updated[index][field] = value;
    setAdultDetails(updated);
  };

  const handleChildChange = (index, field, value) => {
    const updated = [...childDetails];
    updated[index][field] = value;
    setChildDetails(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Restrict booking dates within flight range unless “Future Booking” checked
    if (flightData && !formData.futureBooking) {
      const dep = new Date(flightData.departureDate);
      const ret = new Date(flightData.returnDate);
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);

      if (checkIn < dep || checkOut > ret) {
        alert(
          "Your hotel dates must be within your flight travel dates, or check 'Future Booking' to bypass."
        );
        return;
      }
    }

    // ✅ Build final booking object (uses your real selected hotel)
    const bookingData = {
      ...formData,
      adultDetails,
      childDetails,
      hotel,
    };

    // Save hotel booking to localStorage for itinerary
    localStorage.setItem("bookedHotel", JSON.stringify(bookingData));

    // Navigate to confirmation page
    navigate("/hotel-confirmation", { state: { bookingData } });
  };

  return (
    <div className="booking-details-container">
      <h1>Hotel Booking Details</h1>

      {hotel ? (
        <div className="selected-hotel">
          <img src={hotel.image} alt={hotel.name} />
          <div>
            <h2>{hotel.name}</h2>
            <p>{hotel.city}, {hotel.country}</p>
            <p>⭐ {hotel.stars} stars</p>
          </div>
        </div>
      ) : (
        <p className="no-hotel">No hotel selected.</p>
      )}

      {flightData && (
        <div className="flight-info-box">
          <h3>Linked Flight</h3>
          <p>
            ✈️ {flightData.origin} → {flightData.destination}
          </p>
          <p>
            {flightData.departureDate} → {flightData.returnDate}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Check-in Date:</label>
          <input
            type="date"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            min={!formData.futureBooking && flightData?.departureDate}
            max={!formData.futureBooking && flightData?.returnDate}
            required
          />
        </div>

        <div className="form-group">
          <label>Check-out Date:</label>
          <input
            type="date"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            min={!formData.futureBooking && flightData?.departureDate}
            max={!formData.futureBooking && flightData?.returnDate}
            required
          />
        </div>

        <div className="form-group">
          <label>Adults:</label>
          <input
            type="number"
            name="adults"
            value={formData.adults}
            min="1"
            max="10"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Children:</label>
          <input
            type="number"
            name="children"
            value={formData.children}
            min="0"
            max="10"
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="futureBooking"
            checked={formData.futureBooking}
            onChange={handleChange}
          />
          <label>Book for future trip (ignore flight restriction)</label>
        </div>

        <h3>Traveler Details</h3>
        <div className="traveler-section">
          {adultDetails.map((_, i) => (
            <div key={i} className="traveler-input">
              <label>Adult {i + 1}</label>
              <input
                type="text"
                placeholder="Name"
                value={adultDetails[i].name}
                onChange={(e) => handleAdultChange(i, "name", e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={adultDetails[i].age}
                onChange={(e) => handleAdultChange(i, "age", e.target.value)}
                required
              />
            </div>
          ))}
          {childDetails.map((_, i) => (
            <div key={i} className="traveler-input">
              <label>Child {i + 1}</label>
              <input
                type="text"
                placeholder="Name"
                value={childDetails[i].name}
                onChange={(e) => handleChildChange(i, "name", e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={childDetails[i].age}
                onChange={(e) => handleChildChange(i, "age", e.target.value)}
                required
              />
            </div>
          ))}
        </div>

        <button type="submit" className="confirm-btn">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingDetails;
