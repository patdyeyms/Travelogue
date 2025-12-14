import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/BookingDetails.css";

function BookingDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, flight: passedFlight, onHotelBooked } = location.state || {};

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    leadFirstName: "",
    leadLastName: "",
    leadEmail: "",
    residenceCountry: "Philippines",
    countryCode: "+63",
    mobileNumber: "",
    roomType: "",
    bedSetup: "",
    benefits: { breakfast: false, parking: false },
  });

  const [adultDetails, setAdultDetails] = useState([]);
  const [childDetails, setChildDetails] = useState([]);
  const [flightData, setFlightData] = useState(null);

  useEffect(() => {
    if (passedFlight) {
      setFlightData(passedFlight);
      setFormData(prev => ({ ...prev, checkIn: passedFlight.departureDate || "", checkOut: passedFlight.returnDate || "" }));
    } else {
      const savedFlight = localStorage.getItem("bookedFlight");
      if (savedFlight) {
        const parsedFlight = JSON.parse(savedFlight);
        setFlightData(parsedFlight);
        setFormData(prev => ({ ...prev, checkIn: parsedFlight.departureDate || "", checkOut: parsedFlight.returnDate || "" }));
      }
    }
  }, [passedFlight]);

  useEffect(() => {
    setAdultDetails(Array.from({ length: formData.adults }, () => ({ name: "", age: "" })));
    setChildDetails(Array.from({ length: formData.children }, () => ({ name: "", age: "" })));
  }, [formData.adults, formData.children]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdultDetailChange = (index, field, value) => {
    const updated = [...adultDetails];
    updated[index][field] = value;
    setAdultDetails(updated);
  };

  const handleChildDetailChange = (index, field, value) => {
    const updated = [...childDetails];
    updated[index][field] = value;
    setChildDetails(updated);
  };

  const handleSubmit = e => {
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

    const bookingData = { ...formData, adultDetails, childDetails, hotel };
    localStorage.setItem("bookedHotel", JSON.stringify(bookingData));

    // Update itinerary dynamically
    if (onHotelBooked) onHotelBooked(bookingData);

    navigate("/hotel-confirmation", { state: { bookingData } });
  };

  return (
    <div className="booking-details-container">
      <h1>Hotel Booking Details</h1>

      {hotel && (
        <div className="selected-hotel">
          <img src={hotel.image || "/assets/itinerary/default.jpg"} alt={hotel.name} />
          <div>
            <h2>{hotel.name}</h2>
            <p>{hotel.city}, {hotel.country}</p>
            <p>⭐ {hotel.stars}</p>
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
            <input type="date" name="checkIn" value={formData.checkIn} min={flightData?.departureDate || today} max={flightData?.returnDate} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Check-out Date *</label>
            <input type="date" name="checkOut" value={formData.checkOut} min={formData.checkIn || today} max={flightData?.returnDate} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Adults</label>
            <input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Children</label>
            <input type="number" name="children" min="0" value={formData.children} onChange={handleChange} />
          </div>
        </div>

        {/* Adult Details */}
        {adultDetails.length > 0 && (
          <div className="guest-details">
            <h3>Adult Details</h3>
            {adultDetails.map((adult, i) => (
              <div className="booking-grid" key={i}>
                <div className="input-group">
                  <label>Name *</label>
                  <input type="text" value={adult.name} onChange={e => handleAdultDetailChange(i, "name", e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Age *</label>
                  <input type="number" value={adult.age} onChange={e => handleAdultDetailChange(i, "age", e.target.value)} required />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Child Details */}
        {childDetails.length > 0 && (
          <div className="guest-details">
            <h3>Child Details</h3>
            {childDetails.map((child, i) => (
              <div className="booking-grid" key={i}>
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" value={child.name} onChange={e => handleChildDetailChange(i, "name", e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Age</label>
                  <input type="number" value={child.age} onChange={e => handleChildDetailChange(i, "age", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lead Guest */}
        <h3>Lead Guest</h3>
        <div className="booking-grid">
          <div className="input-group">
            <label>First Name *</label>
            <input name="leadFirstName" value={formData.leadFirstName} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Last Name *</label>
            <input name="leadLastName" value={formData.leadLastName} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email *</label>
            <input type="email" name="leadEmail" value={formData.leadEmail} onChange={handleChange} required />
          </div>
        </div>

        <div className="booking-grid">
          <div className="input-group">
            <label>Country / Region *</label>
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
              <input type="text" name="countryCode" value={formData.countryCode} onChange={handleChange} />
              <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <h3>Special Requests</h3>
        <div className="booking-grid">
          <div className="input-group">
            <label>Room Preference</label>
            <select name="roomType" value={formData.roomType} onChange={handleChange}>
              <option value="">No preference</option>
              <option>Non-smoking</option>
              <option>Smoking</option>
            </select>
          </div>

          <div className="input-group">
            <label>Bed Setup</label>
            <select name="bedSetup" value={formData.bedSetup} onChange={handleChange}>
              <option value="">No preference</option>
              <option>Large bed</option>
              <option>Twin beds</option>
            </select>
          </div>
        </div>

        <h4>Free Room Benefits</h4>
        <div className="checkbox-group column">
          <label>
            <input type="checkbox" checked={formData.benefits.breakfast} onChange={e => setFormData(prev => ({ ...prev, benefits: { ...prev.benefits, breakfast: e.target.checked } }))} />
            Breakfast <span className="free-badge">FREE</span>
          </label>
          <label>
            <input type="checkbox" checked={formData.benefits.parking} onChange={e => setFormData(prev => ({ ...prev, benefits: { ...prev.benefits, parking: e.target.checked } }))} />
            Parking
          </label>
        </div>

        <button type="submit" className="confirm-btn">Confirm Booking</button>
      </form>
    </div>
  );
}

export default BookingDetails;
