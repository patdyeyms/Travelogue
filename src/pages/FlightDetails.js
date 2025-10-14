import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Flights.css";
import airasia from "../assets/flights/airasia.png";
import ana from "../assets/flights/ana.png";
import cebupacific from "../assets/flights/cebupacific.png";
import emirates from "../assets/flights/emirates.png";
import pal from "../assets/flights/pal.png";
import singapore from "../assets/flights/singapore.png";
import swiss from "../assets/flights/swiss.png";

const getAirlineLogo = (name) => {
  if (!name) return "";
  const key = name.toLowerCase().replace(/\s/g, "");
  const logos = {
    airasia: airasia,
    allnipponairways: ana,
    cebupacific: cebupacific,
    emirates: emirates,
    philippineairlines: pal,
    singaporeairlines: singapore,
    swissinternationalairlines: swiss,
  };
  return logos[key] || "";
};

function FlightDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, flightDetails } = location.state || {};
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passport: ""
  });
  const [saving, setSaving] = useState(false);

  if (!flight || !flightDetails) {
    return (
      <div className="results-section">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>No flight selected</h1>
        <p>Please go back and choose a flight to view details.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }
    setSaving(true);

    // Pass all flight details in normalized format
    const fullFlightData = {
      ...flight,
      departureTime: flight.departureTime || flightDetails.departure || "N/A",
      arrivalTime: flight.arrivalTime || flightDetails.arrival || "N/A",
      flightNumber: flight.flightNumber || "N/A",
      class: flight.cabin || "N/A"
    };

    setTimeout(() => {
      navigate("/flight-confirmation", { 
        state: { flight: fullFlightData, flightDetails, formData } 
      });
    }, 900);
  };

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Results</button>

      <div className="flight-details-card">
        <div className="flight-details-header">
          <img
            src={getAirlineLogo(flight.airline)}
            alt={flight.airline}
            style={{ width: "70px", height: "auto" }}
          />
          <h2>{flight.airline}</h2>
        </div>

        <div className="flight-details-info">
          <p><strong>{flight.departureTime}</strong> – <strong>{flight.arrivalTime || "N/A"}</strong></p>
          <p>{flightDetails.from} → {flightDetails.to}</p>
          <p>{flight.stops} • {flight.duration}</p>
          <p><strong>Cabin:</strong> {flight.cabin}</p>
          <p><strong>Price:</strong> ₱ {flight.price.toLocaleString()}</p>
        </div>
      </div>

      <form className="booking-form" onSubmit={handleConfirm}>
        <h3>Passenger Information</h3>
        <div className="booking-grid">
          <div className="input-group">
            <label>First Name</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Passport (optional)</label>
            <input name="passport" value={formData.passport} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="confirm-btn" disabled={saving}>
          {saving ? "Saving..." : "Confirm Flight"}
        </button>
      </form>
    </div>
  );
}

export default FlightDetails;
