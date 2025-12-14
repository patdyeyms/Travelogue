import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/BookingDetails.css";

function BookingDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel } = location.state || {};

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,

    // Lead guest
    leadFirstName: "",
    leadLastName: "",
    leadEmail: "",
    residenceCountry: "Philippines",
    countryCode: "+63",
    mobileNumber: "",

    // Preferences
    roomType: "",
    bedSetup: "",
    benefits: {
      breakfast: false,
      parking: false,
    },
  });

  const [adultDetails, setAdultDetails] = useState([]);
  const [childDetails, setChildDetails] = useState([]);
  const [flightData, setFlightData] = useState(null);

  useEffect(() => {
    const savedFlight = localStorage.getItem("bookedFlight");
    if (savedFlight) {
      const flight = JSON.parse(savedFlight);
      setFlightData(flight);
      setFormData((prev) => ({
        ...prev,
        checkIn: flight.departureDate || "",
        checkOut: flight.returnDate || "",
      }));
    }
  }, []);

  useEffect(() => {
    setAdultDetails(
      Array.from({ length: formData.adults }, () => ({ name: "", age: "" }))
    );
    setChildDetails(
      Array.from({ length: formData.children }, () => ({ name: "", age: "" }))
    );
  }, [formData.adults, formData.children]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (flightData) {
      const dep = new Date(flightData.departureDate);
      const ret = new Date(flightData.returnDate);
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);

      if (checkIn < dep || checkOut > ret) {
        alert("Your hotel dates must be within your flight travel dates.");
        return;
      }
    }

    const bookingData = {
      ...formData,
      adultDetails,
      childDetails,
      hotel,
    };

    localStorage.setItem("bookedHotel", JSON.stringify(bookingData));
    navigate("/hotel-confirmation", { state: { bookingData } });
  };

  return (
    <div className="booking-details-container">
      <h1>Hotel Booking Details</h1>

      {hotel && (
        <div className="selected-hotel">
          <img src={hotel.image} alt={hotel.name} />
          <div>
            <h2>{hotel.name}</h2>
            <p>{hotel.city}, {hotel.country}</p>
            <p>⭐ {hotel.stars} stars</p>
          </div>
        </div>
      )}

      {flightData && (
        <div className="flight-info-box">
          <h3>Linked Flight</h3>
          <p>✈️ {flightData.origin} → {flightData.destination}</p>
          <p>{flightData.departureDate} → {flightData.returnDate}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Dates */}
        <div className="booking-grid">
          <div className="input-group">
            <label>Check-in Date *</label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              min={flightData?.departureDate || today}
              max={flightData?.returnDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Check-out Date *</label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              min={formData.checkIn || today}
              max={flightData?.returnDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Lead Guest */}
        <h3>Who’s the lead guest?</h3>
        <p className="helper-text"><strong>*Required field</strong></p>

        <div className="booking-grid">
          <div className="input-group">
            <label>First name *</label>
            <input name="leadFirstName" value={formData.leadFirstName} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Last name *</label>
            <input name="leadLastName" value={formData.leadLastName} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Email *</label>
            <input type="email" name="leadEmail" value={formData.leadEmail} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Country / region *</label>
            <select name="residenceCountry" value={formData.residenceCountry} onChange={handleChange}>
              <option>Philippines</option>
              <option>Japan</option>
              <option>South Korea</option>
              <option>United States</option>
            </select>
          </div>

          <div className="input-group">
            <label>Mobile Number</label>

            <div className="phone-row">
              <input
                type="text"
                name="countryCode"
                placeholder="+63"
                value={formData.countryCode}
                onChange={handleChange}
              />

              <input
                type="text"
                name="mobileNumber"
                placeholder="9XXXXXXXXX"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </div>
          </div>

        </div>

        <p className="helper-text">
          We’ll use this to send your booking confirmation and reminders.
        </p>

        {/* Preferences */}
        <h3>Special requests</h3>

        <div className="booking-grid">
          <div className="input-group">
            <label>Room preference</label>
            <select name="roomType" value={formData.roomType} onChange={handleChange}>
              <option value="">No preference</option>
              <option>Non-smoking</option>
              <option>Smoking</option>
            </select>
          </div>

          <div className="input-group">
            <label>Bed setup</label>
            <select name="bedSetup" value={formData.bedSetup} onChange={handleChange}>
              <option value="">No preference</option>
              <option>Large bed</option>
              <option>Twin beds</option>
            </select>
          </div>
        </div>

        <h4>Free room benefits</h4>

        <div className="checkbox-group column">
          <label>
            <input
              type="checkbox"
              checked={formData.benefits.breakfast}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  benefits: { ...formData.benefits, breakfast: e.target.checked },
                })
              }
            />
            Breakfast <span className="free-badge">FREE</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.benefits.parking}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  benefits: { ...formData.benefits, parking: e.target.checked },
                })
              }
            />
            Parking
          </label>
        </div>

        <button type="submit" className="confirm-btn">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingDetails;
