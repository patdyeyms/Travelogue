import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/BookingDetails.css";

// Country to phone code mapping
const COUNTRY_PHONE_CODES = {
  "Philippines": "+63",
  "United States": "+1",
  "United Kingdom": "+44",
  "Canada": "+1",
  "Australia": "+61",
  "Japan": "+81",
  "South Korea": "+82",
  "China": "+86",
  "Singapore": "+65",
  "Malaysia": "+60",
  "Thailand": "+66",
  "Vietnam": "+84",
  "Indonesia": "+62",
  "India": "+91",
  "UAE": "+971",
  "Saudi Arabia": "+966",
  "Qatar": "+974",
  "Switzerland": "+41",
  "Germany": "+49",
  "France": "+33",
  "Italy": "+39",
  "Spain": "+34",
  "Netherlands": "+31",
  "Belgium": "+32",
  "Sweden": "+46",
  "Norway": "+47",
  "Denmark": "+45",
  "Finland": "+358",
  "Poland": "+48",
  "Russia": "+7",
  "Turkey": "+90",
  "Egypt": "+20",
  "South Africa": "+27",
  "Brazil": "+55",
  "Argentina": "+54",
  "Mexico": "+52",
  "Chile": "+56",
  "Colombia": "+57",
  "Peru": "+51",
  "New Zealand": "+64",
  "Hong Kong": "+852",
  "Taiwan": "+886",
  "Pakistan": "+92",
  "Bangladesh": "+880",
  "Sri Lanka": "+94",
  "Nepal": "+977",
  "Myanmar": "+95",
  "Cambodia": "+855",
  "Laos": "+856",
};

// Popular countries list
const POPULAR_COUNTRIES = [
  "Philippines",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Japan",
  "South Korea",
  "Singapore",
  "China",
  "UAE",
  "Switzerland",
];

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

  // Load flight data
  useEffect(() => {
    if (passedFlight) {
      setFlightData(passedFlight);
      setFormData(prev => ({ 
        ...prev, 
        checkIn: passedFlight.departureDate || "", 
        checkOut: passedFlight.returnDate || "" 
      }));
    } else {
      const savedFlight = localStorage.getItem("bookedFlight");
      if (savedFlight) {
        try {
          const parsedFlight = JSON.parse(savedFlight);
          setFlightData(parsedFlight);
          setFormData(prev => ({ 
            ...prev, 
            checkIn: parsedFlight.departureDate || "", 
            checkOut: parsedFlight.returnDate || "" 
          }));
        } catch (error) {
          console.error("Error loading flight data:", error);
        }
      }
    }
  }, [passedFlight]);

  // Update guest detail arrays when counts change
  useEffect(() => {
    setAdultDetails(Array.from({ length: formData.adults }, () => ({ name: "", age: "" })));
    setChildDetails(Array.from({ length: formData.children }, () => ({ name: "", age: "" })));
  }, [formData.adults, formData.children]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // If country changes, automatically update country code
    if (name === "residenceCountry") {
      const phoneCode = COUNTRY_PHONE_CODES[value] || "";
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        countryCode: phoneCode 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleAdultDetailChange = useCallback((index, field, value) => {
    setAdultDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const handleChildDetailChange = useCallback((index, field, value) => {
    setChildDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const validateForm = () => {
    // Check required fields
    if (!formData.checkIn || !formData.checkOut) {
      alert("Please select check-in and check-out dates.");
      return false;
    }

    if (!formData.leadFirstName || !formData.leadLastName || !formData.leadEmail) {
      alert("Please fill in all lead guest details.");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.leadEmail)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Validate dates
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    
    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return false;
    }

    // Validate against flight dates if available
    if (flightData) {
      const dep = new Date(flightData.departureDate);
      const ret = new Date(flightData.returnDate);

      if (checkIn < dep || checkOut > ret) {
        alert("Your hotel dates must be within your flight travel dates.");
        return false;
      }
    }

    // Validate adult details
    for (let i = 0; i < adultDetails.length; i++) {
      if (!adultDetails[i].name || !adultDetails[i].age) {
        alert(`Please fill in all details for Adult ${i + 1}.`);
        return false;
      }
      
      const age = parseInt(adultDetails[i].age);
      if (age < 18 || age > 120) {
        alert(`Adult ${i + 1} must be 18 years or older.`);
        return false;
      }
    }

    // Validate child details (if any)
    for (let i = 0; i < childDetails.length; i++) {
      if (childDetails[i].name && childDetails[i].age) {
        const age = parseInt(childDetails[i].age);
        if (age < 0 || age >= 18) {
          alert(`Child ${i + 1} age must be between 0 and 17.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bookingData = { 
      ...formData, 
      adultDetails, 
      childDetails, 
      hotel 
    };

    try {
      localStorage.setItem("bookedHotel", JSON.stringify(bookingData));
      
      // Update itinerary dynamically
      if (onHotelBooked) {
        onHotelBooked(bookingData);
      }

      navigate("/hotel-confirmation", { state: { bookingData } });
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Error saving booking. Please try again.");
    }
  };

  // Get sorted list of all countries
  const allCountries = Object.keys(COUNTRY_PHONE_CODES).sort();

  return (
    <div className="booking-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>Hotel Booking Details</h1>

      {hotel && (
        <div className="selected-hotel">
          <img 
            src={hotel.image || "/assets/itinerary/default.jpg"} 
            alt={hotel.name}
            onError={(e) => e.target.src = "/assets/itinerary/default.jpg"}
          />
          <div>
            <h2>{hotel.name}</h2>
            <p>{hotel.city}, {hotel.country}</p>
            <p>⭐ {hotel.stars} stars</p>
          </div>
        </div>
      )}

      {flightData && (
        <div className="flight-info-box">
          <h3>✈️ Linked Flight</h3>
          <p><strong>{flightData.origin} → {flightData.destination}</strong></p>
          <p>📅 {flightData.departureDate} → {flightData.returnDate}</p>
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "8px" }}>
            Your hotel dates must be within these travel dates
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Dates */}
        <h3>Stay Dates</h3>
        <div className="booking-grid">
          <div className="input-group">
            <label htmlFor="checkIn">Check-in Date *</label>
            <input 
              type="date" 
              id="checkIn"
              name="checkIn" 
              value={formData.checkIn} 
              min={flightData?.departureDate || today} 
              max={flightData?.returnDate} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="checkOut">Check-out Date *</label>
            <input 
              type="date" 
              id="checkOut"
              name="checkOut" 
              value={formData.checkOut} 
              min={formData.checkIn || today} 
              max={flightData?.returnDate} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="adults">Adults (18+)</label>
            <input 
              type="number" 
              id="adults"
              name="adults" 
              min="1" 
              max="10"
              value={formData.adults} 
              onChange={handleChange} 
            />
          </div>
          <div className="input-group">
            <label htmlFor="children">Children (0-17)</label>
            <input 
              type="number" 
              id="children"
              name="children" 
              min="0" 
              max="10"
              value={formData.children} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Adult Details */}
        {adultDetails.length > 0 && (
          <div className="guest-details">
            <h3>Adult Details</h3>
            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
              All adults must be 18 years or older
            </p>
            {adultDetails.map((adult, i) => (
              <div className="guest-card" key={i}>
                <h4>Adult {i + 1}</h4>
                <div className="booking-grid">
                  <div className="input-group">
                    <label htmlFor={`adult-name-${i}`}>Full Name *</label>
                    <input 
                      type="text" 
                      id={`adult-name-${i}`}
                      value={adult.name} 
                      onChange={(e) => handleAdultDetailChange(i, "name", e.target.value)} 
                      placeholder="e.g. Juan Dela Cruz"
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor={`adult-age-${i}`}>Age *</label>
                    <input 
                      type="number" 
                      id={`adult-age-${i}`}
                      value={adult.age} 
                      onChange={(e) => handleAdultDetailChange(i, "age", e.target.value)} 
                      min="18"
                      max="120"
                      placeholder="18+"
                      required 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Child Details */}
        {childDetails.length > 0 && (
          <div className="guest-details">
            <h3>Child Details</h3>
            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
              Children must be under 18 years old
            </p>
            {childDetails.map((child, i) => (
              <div className="guest-card" key={i}>
                <h4>Child {i + 1}</h4>
                <div className="booking-grid">
                  <div className="input-group">
                    <label htmlFor={`child-name-${i}`}>Full Name</label>
                    <input 
                      type="text" 
                      id={`child-name-${i}`}
                      value={child.name} 
                      onChange={(e) => handleChildDetailChange(i, "name", e.target.value)} 
                      placeholder="e.g. Maria Dela Cruz"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor={`child-age-${i}`}>Age</label>
                    <input 
                      type="number" 
                      id={`child-age-${i}`}
                      value={child.age} 
                      onChange={(e) => handleChildDetailChange(i, "age", e.target.value)} 
                      min="0"
                      max="17"
                      placeholder="0-17"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lead Guest */}
        <h3>Lead Guest Contact Information</h3>
        <div className="booking-grid">
          <div className="input-group">
            <label htmlFor="leadFirstName">First Name *</label>
            <input 
              id="leadFirstName"
              name="leadFirstName" 
              value={formData.leadFirstName} 
              onChange={handleChange}
              placeholder="e.g. Juan"
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="leadLastName">Last Name *</label>
            <input 
              id="leadLastName"
              name="leadLastName" 
              value={formData.leadLastName} 
              onChange={handleChange}
              placeholder="e.g. Dela Cruz"
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="leadEmail">Email *</label>
            <input 
              type="email" 
              id="leadEmail"
              name="leadEmail" 
              value={formData.leadEmail} 
              onChange={handleChange}
              placeholder="example@email.com"
              required 
            />
          </div>
        </div>

        <div className="booking-grid">
          <div className="input-group">
            <label htmlFor="residenceCountry">Country / Region *</label>
            <select 
              id="residenceCountry"
              name="residenceCountry" 
              value={formData.residenceCountry} 
              onChange={handleChange}
              required
            >
              {/* Popular Countries */}
              <optgroup label="Popular Countries">
                {POPULAR_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </optgroup>
              
              {/* All Countries */}
              <optgroup label="All Countries">
                {allCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="countryCode">Country Code *</label>
            <input 
              type="text" 
              id="countryCode"
              name="countryCode" 
              value={formData.countryCode} 
              onChange={handleChange}
              placeholder="+63"
              readOnly={formData.residenceCountry !== ""}
              title={formData.residenceCountry ? `Auto-filled based on ${formData.residenceCountry}` : ""}
              style={formData.residenceCountry ? { background: '#f0f0f0', cursor: 'not-allowed' } : {}}
              required 
            />
            {formData.residenceCountry && formData.countryCode && (
              <small style={{ color: '#28a1a1', fontSize: '0.85rem', marginTop: '4px' }}>
                ✓ Auto-filled from {formData.residenceCountry}
              </small>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input 
              type="tel" 
              id="mobileNumber"
              name="mobileNumber" 
              value={formData.mobileNumber} 
              onChange={handleChange}
              placeholder="9123456789"
            />
          </div>
        </div>

        {/* Preferences */}
        <h3>Special Requests</h3>
        <div className="booking-grid">
          <div className="input-group">
            <label htmlFor="roomType">Room Preference</label>
            <select 
              id="roomType"
              name="roomType" 
              value={formData.roomType} 
              onChange={handleChange}
            >
              <option value="">No preference</option>
              <option value="Non-smoking">Non-smoking</option>
              <option value="Smoking">Smoking</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="bedSetup">Bed Setup</label>
            <select 
              id="bedSetup"
              name="bedSetup" 
              value={formData.bedSetup} 
              onChange={handleChange}
            >
              <option value="">No preference</option>
              <option value="Large bed">Large bed (King/Queen)</option>
              <option value="Twin beds">Twin beds (2 singles)</option>
            </select>
          </div>
        </div>

        <h4>Free Room Benefits</h4>
        <div className="checkbox-group column">
          <label>
            <input 
              type="checkbox" 
              checked={formData.benefits.breakfast} 
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                benefits: { ...prev.benefits, breakfast: e.target.checked } 
              }))} 
            />
            Breakfast <span className="free-badge">FREE</span>
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={formData.benefits.parking} 
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                benefits: { ...prev.benefits, parking: e.target.checked } 
              }))} 
            />
            Parking <span className="free-badge">FREE</span>
          </label>
        </div>

        <button type="submit" className="confirm-btn">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default React.memo(BookingDetails);