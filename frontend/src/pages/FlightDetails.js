import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/FlightDetails.css";
import { getAirlineLogo } from "../utils/airlines";

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

// Popular countries list for quick selection
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

function FlightDetails() {
  const navigate = useNavigate();
  const { flight, flightDetails } = useLocation().state || {};

  const [formData, setFormData] = useState({
    passportNumber: "",
    passportExpiryYear: "",
    passportExpiryMonth: "",
    passportExpiryDay: "",
    nationality: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    firstName: "",
    lastName: "",
    countryCode: "",
    phone: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);
  const [openLegIndex, setOpenLegIndex] = useState(null);

  if (!flight || !flightDetails) {
    return (
      <div className="results-section">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>No flight selected</h1>
        <p>Please go back and choose a flight to view details.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If nationality changes, automatically update country code
    if (name === "nationality") {
      const phoneCode = COUNTRY_PHONE_CODES[value] || "";
      setFormData({ 
        ...formData, 
        [name]: value,
        countryCode: phoneCode 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const toggleLegDetails = (index) =>
    setOpenLegIndex(openLegIndex === index ? null : index);

  const handleConfirm = (e) => {
    e.preventDefault();

    const requiredFields = [
      "passportNumber",
      "firstName",
      "lastName",
      "email",
      "phone",
      "nationality",
      "birthYear",
      "birthMonth",
      "birthDay",
      "gender",
    ];

    // Validate required fields
    const missingFields = [];
    for (const field of requiredFields) {
      if (!formData[field]) {
        const fieldName = field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        missingFields.push(fieldName);
      }
    }

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields:\n${missingFields.join('\n')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Validate date of birth
    const year = parseInt(formData.birthYear);
    const month = parseInt(formData.birthMonth);
    const day = parseInt(formData.birthDay);
    
    if (year < 1900 || year > new Date().getFullYear()) {
      alert("Please enter a valid birth year.");
      return;
    }
    
    if (month < 1 || month > 12) {
      alert("Please enter a valid birth month (1-12).");
      return;
    }
    
    if (day < 1 || day > 31) {
      alert("Please enter a valid birth day (1-31).");
      return;
    }

    setSaving(true);

    const firstLeg = flight.flights?.[0] || {};
    const lastLeg = flight.flights?.[flight.flights.length - 1] || {};
    const totalDuration = flight.flights?.reduce(
      (sum, leg) => sum + (leg.duration || 0),
      0
    );

    const fullFlightData = {
      ...flight,
      airline: flight.airline || firstLeg.airline,
      departureTime: firstLeg.departure_airport?.time,
      arrivalTime: lastLeg.arrival_airport?.time,
      stops: flight.flights?.length - 1 || 0,
      duration: totalDuration,
      cabin: firstLeg.travel_class || "Economy",
      airlineCode: firstLeg.airline_code,
    };

    setTimeout(() => {
      navigate("/flight-confirmation", {
        state: { flight: fullFlightData, flightDetails, formData },
      });
    }, 900);
  };

  const firstLeg = flight.flights?.[0] || {};
  const lastLeg = flight.flights?.[flight.flights.length - 1] || {};
  const totalDuration = flight.flights?.reduce(
    (sum, leg) => sum + (leg.duration || 0),
    0
  );

  // Get sorted list of all countries
  const allCountries = Object.keys(COUNTRY_PHONE_CODES).sort();

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Results
      </button>

      {/* ================= FLIGHT SUMMARY ================= */}
      <div className="flight-details-card">
        <div className="flight-details-header">
          <img
            src={getAirlineLogo(firstLeg.airline || firstLeg.airline_code)}
            alt={flight.airline}
            className="airline-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h2>{flight.airline}</h2>
        </div>

        <div className="flight-details-info">
          <p>
            <strong>{firstLeg.departure_airport?.time}</strong> –{" "}
            <strong>{lastLeg.arrival_airport?.time}</strong>
          </p>
          <p>
            {flightDetails.from} → {flightDetails.to}
          </p>
          <p>
            <strong>Stops:</strong> {flight.flights?.length - 1 || 0} •{" "}
            {formatDuration(totalDuration)}
          </p>
          <p>
            <strong>Cabin:</strong> {firstLeg.travel_class || "Economy"}
          </p>
          <p>
            <strong>Price:</strong> ₱ {Number(flight.price || 0).toLocaleString()}
          </p>

          {/* ================= LEGS DETAILS COLLAPSIBLE ================= */}
          {flight.flights.map((leg, idx) => (
            <div key={idx} className="flight-summary-card">
              <div
                className="flight-summary-top"
                onClick={() => toggleLegDetails(idx)}
              >
                <div className="flight-summary-left">
                  <img
                    src={getAirlineLogo(leg.airline || leg.airline_code)}
                    alt={leg.airline}
                    className="airline-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="flight-summary-info">
                    <span>{leg.airline} • {leg.flight_number}</span>
                    <span>
                      {leg.departure_airport?.id} {leg.departure_airport?.time} →{" "}
                      {leg.arrival_airport?.id} {leg.arrival_airport?.time}
                    </span>
                  </div>
                </div>
                <div className="flight-summary-right">
                  {formatDuration(leg.duration)}
                  <span className={`flight-summary-arrow ${openLegIndex === idx ? "open" : ""}`}>
                    ▼
                  </span>
                </div>
              </div>

              <div
                className={`flight-summary-details ${
                  openLegIndex === idx ? "open scrollable" : ""
                }`}
              >
                <p><strong>Airplane:</strong> {leg.airplane}</p>
                <p><strong>Travel Class:</strong> {leg.travel_class}</p>
                <p><strong>Legroom:</strong> {leg.legroom}</p>
                {leg.extensions?.length > 0 && (
                  <ul>
                    {leg.extensions.map((ext, i) => (
                      <li key={i}>{ext}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PASSENGER DETAILS ================= */}
      <form className="booking-form extended" onSubmit={handleConfirm}>
        <h3>Passenger Details</h3>
        <p>
          Passenger information must match exactly as shown on the passport.
        </p>

        <div className="booking-grid">
          <div className="input-group">
            <label htmlFor="passportNumber">Passport Number *</label>
            <input
              id="passportNumber"
              name="passportNumber"
              placeholder="e.g. P12345678"
              value={formData.passportNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="nationality">Nationality / Country *</label>
            <select
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
            >
              <option value="">Select nationality</option>
              
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
            <label>Passport Expiry (YYYY / MM / DD)</label>
            <div className="date-inputs">
              <input
                name="passportExpiryYear"
                placeholder="Year"
                value={formData.passportExpiryYear}
                onChange={handleChange}
                maxLength="4"
                type="number"
              />
              <input
                name="passportExpiryMonth"
                placeholder="Month"
                value={formData.passportExpiryMonth}
                onChange={handleChange}
                maxLength="2"
                type="number"
                min="1"
                max="12"
              />
              <input
                name="passportExpiryDay"
                placeholder="Day"
                value={formData.passportExpiryDay}
                onChange={handleChange}
                maxLength="2"
                type="number"
                min="1"
                max="31"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Date of Birth (YYYY / MM / DD) *</label>
            <div className="date-inputs">
              <input
                name="birthYear"
                placeholder="Year"
                value={formData.birthYear}
                onChange={handleChange}
                required
                maxLength="4"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
              />
              <input
                name="birthMonth"
                placeholder="Month"
                value={formData.birthMonth}
                onChange={handleChange}
                required
                maxLength="2"
                type="number"
                min="1"
                max="12"
              />
              <input
                name="birthDay"
                placeholder="Day"
                value={formData.birthDay}
                onChange={handleChange}
                required
                maxLength="2"
                type="number"
                min="1"
                max="31"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="gender">Gender *</label>
            <select 
              id="gender"
              name="gender" 
              value={formData.gender} 
              onChange={handleChange}
              required
            >
              <option value="">Please select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <h3 style={{ marginTop: "2rem" }}>Contact Details</h3>
        <div className="booking-grid">
          <div className="input-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              name="firstName"
              placeholder="e.g. Juan"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              name="lastName"
              placeholder="e.g. Dela Cruz"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="countryCode">Country / Region Code *</label>
            <input
              id="countryCode"
              name="countryCode"
              placeholder="+63"
              value={formData.countryCode}
              onChange={handleChange}
              required
              readOnly={formData.nationality !== ""}
              title={formData.nationality ? `Auto-filled based on ${formData.nationality}` : ""}
              style={formData.nationality ? { background: '#f0f0f0', cursor: 'not-allowed' } : {}}
            />
            {formData.nationality && formData.countryCode && (
              <small style={{ color: '#28a1a1', fontSize: '0.85rem', marginTop: '4px' }}>
                ✓ Auto-filled from {formData.nationality}
              </small>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              name="phone"
              placeholder="9123456789"
              value={formData.phone}
              onChange={handleChange}
              required
              type="tel"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="confirm-btn" disabled={saving}>
          {saving ? "Saving..." : "Confirm Flight"}
        </button>
      </form>
    </div>
  );
}

export default React.memo(FlightDetails);