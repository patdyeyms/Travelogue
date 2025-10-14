import React, { useState, useEffect } from "react";
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
    airasia,
    allnipponairways: ana,
    cebupacific,
    emirates,
    philippineairlines: pal,
    singaporeairlines: singapore,
    swissinternationalairlines: swiss,
  };
  return logos[key] || "";
};

function FlightConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, flightDetails, formData } = location.state || {};
  const [showDetails, setShowDetails] = useState(false);

  if (!flight || !flightDetails || !formData) {
    return (
      <div className="results-section">
        <h1>No booking data</h1>
        <p>Please go back and book a flight first.</p>
        <button
          className="action-btn secondary"
          onClick={() => navigate("/flights")}
        >
          Return to Flights
        </button>
      </div>
    );
  }

  const displayPrice = flight?.price?.toLocaleString() || "N/A";

  const handleGoToItinerary = () => {
    const itineraryData = {
      type: "Flight",
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      from: flightDetails.from,
      to: flightDetails.to,
      departure: flightDetails.departure,
      returnDate: flightDetails.return || "N/A",
      price: flight.price,
      class: flight.class,
      passenger: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
    };

    // ✅ Save to localStorage only when "Go to Itinerary" is clicked
    const existingItinerary =
      JSON.parse(localStorage.getItem("itinerary")) || [];
    localStorage.setItem(
      "itinerary",
      JSON.stringify([...existingItinerary, itineraryData])
    );

    // Then navigate to Itinerary page
    navigate("/itinerary");
  };

  return (
    <div className="thankyou-section">
      <div className="thankyou-card floating-card">
        <div className="thankyou-header sticky-header">
          <h1>Booking Confirmed!</h1>
          <p className="small-muted">Thank you for booking with us.</p>
          <span className="booking-id">
            Booking ID: #{Math.floor(Math.random() * 900000 + 100000)}
          </span>
        </div>

        <div className="thankyou-content">
          <div className="flight-summary-card">
            <div
              className="flight-summary-top"
              onClick={() => setShowDetails(!showDetails)}
            >
              <div className="flight-summary-left">
                <img
                  src={getAirlineLogo(flight?.airline)}
                  alt={flight?.airline || "Airline"}
                  className="airline-img"
                />
                <div className="flight-summary-info">
                  <span className="airline-name">
                    {flight?.airline || "N/A"}
                  </span>
                  <span className="route">
                    {flightDetails?.from || "N/A"} →{" "}
                    {flightDetails?.to || "N/A"} <br />
                    Departure: {flightDetails?.departure || "N/A"}
                    <br />
                    {flightDetails?.return
                      ? `Return: ${flightDetails.return}`
                      : ""}
                  </span>
                </div>
              </div>
              <div className="flight-summary-right">
                <span className="peso-symbol">₱</span>
                {displayPrice}
                <span
                  className={`flight-summary-arrow ${
                    showDetails ? "open" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>

            <div
              className={`flight-summary-details ${
                showDetails ? "open" : ""
              }`}
            >
              <p>
                <strong>Flight Number:</strong>{" "}
                {flight?.flightNumber || "N/A"}
              </p>
              <p>
                <strong>Departure:</strong>{" "}
                {flight?.departureTime || flightDetails?.departure || "N/A"}
              </p>
              <p>
                <strong>Arrival:</strong> {flight?.arrivalTime || "N/A"}
              </p>
              <p>
                <strong>Class:</strong> {flight?.class || "N/A"}
              </p>
              <p>
                <strong>Passenger:</strong>{" "}
                {formData?.firstName || "N/A"} {formData?.lastName || ""}
              </p>
              <p>
                <strong>Email:</strong> {formData?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {formData?.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="confirm-actions">
            <button className="action-btn secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            <button
              className="action-btn primary"
              onClick={handleGoToItinerary}
            >
              Go to Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightConfirmation;
