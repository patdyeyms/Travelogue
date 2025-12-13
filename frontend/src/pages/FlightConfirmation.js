import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Flights.css";
import { getAirlineLogo } from "../utils/airlines";

function FlightConfirmation() {
  const navigate = useNavigate();
  const { flight, flightDetails, formData } = useLocation().state || {};
  const [showDetails, setShowDetails] = useState(false);

  // Generate booking ID only once
  const bookingId = useMemo(() => Math.floor(Math.random() * 900000 + 100000), []);

  if (!flight || !flightDetails || !formData) {
    return (
      <div className="results-section">
        <h1>No booking data</h1>
        <p>Please go back and book a flight first.</p>
        <button className="back-btn" onClick={() => navigate("/flights")}>
          Return to Flights
        </button>
      </div>
    );
  }

  const displayPrice = Number(flight.price || 0).toLocaleString();

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const handleGoToItinerary = () => {
    const itineraryData = { ...flight, ...flightDetails, ...formData, type: "Flight", bookingId };
    const existingItinerary = JSON.parse(localStorage.getItem("itinerary")) || [];
    localStorage.setItem("itinerary", JSON.stringify([...existingItinerary, itineraryData]));
    navigate("/itinerary");
  };

  const handleGoToHotels = () => {
    // Pre-fill the Hotels page search using the flight destination
    const destination = flightDetails.to; // e.g., "Tokyo, Japan"

    // Save both destination and flight info
    localStorage.setItem("selectedDestination", destination);
    localStorage.setItem("bookedFlight", JSON.stringify({
      origin: flightDetails.from,
      destination: flightDetails.to,
      departureDate: flightDetails.departure,
      returnDate: flightDetails.return,
      airline: flight.airline,
      price: flight.price,
      passenger: formData.firstName + " " + formData.lastName
    }));

    navigate("/hotels");
  };

  return (
    <div className="thankyou-section">
      <div className="thankyou-card">
        <div className="thankyou-header">
          <h1>Booking Confirmed!</h1>
          <span className="booking-id">Booking ID: #{bookingId}</span>
        </div>

        <div className="thankyou-content">
          <div className="flight-summary-card">
            <div className="flight-summary-top" onClick={() => setShowDetails(!showDetails)}>
              <div className="flight-summary-left">
                <img
                  src={getAirlineLogo(flight.airline)}
                  alt={flight.airline || "Airline"}
                  className="airline-img"
                />
                <div className="flight-summary-info">
                  <span className="airline-name">{flight.airline || "N/A"}</span>
                  <span className="route">
                    {flightDetails.from || "N/A"} → {flightDetails.to || "N/A"}<br/>
                    Departure: {flight.departureTime || flightDetails.departure || "N/A"}<br/>
                    Arrival: {flight.arrivalTime || flightDetails.return || "N/A"}<br/>
                    Stops: {flight.stops || 0} • Duration: {formatDuration(flight.duration)}
                  </span>
                </div>
              </div>
              <div className="flight-summary-right">
                <span className="peso-symbol">₱</span>{displayPrice}
                <span className={`flight-summary-arrow ${showDetails ? "open" : ""}`}>▼</span>
              </div>
            </div>

            <div className={`flight-summary-details ${showDetails ? "open" : ""}`}>
              <p><strong>Cabin:</strong> {flight.cabin || "N/A"}</p>
              <p><strong>Passenger:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>

              {flight.flights?.map((leg, idx) => (
                <div key={idx} className="flight-leg-card">
                  <div className="flight-leg-header">
                    {leg.airline} • {leg.flight_number} ({leg.travel_class})
                  </div>
                  <div className={`flight-leg-details open`}>
                    <p>
                      {leg.departure_airport?.name} ({leg.departure_airport?.id}) at {leg.departure_airport?.time} → {leg.arrival_airport?.name} ({leg.arrival_airport?.id}) at {leg.arrival_airport?.time}
                    </p>
                    <p>Duration: {formatDuration(leg.duration)}</p>
                    <p>Airplane: {leg.airplane || "N/A"}</p>
                    {leg.legroom && <p>Legroom: {leg.legroom}</p>}
                    {leg.extensions?.length > 0 && (
                      <div>
                        <strong>Extensions:</strong>
                        <ul>
                          {leg.extensions.map((ext, i) => (
                            <li key={i}>{ext}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {flight.layovers?.length > 0 && (
                <p>
                  <strong>Layovers:</strong>{" "}
                  {flight.layovers.map((layover, idx) => (
                    <span key={idx}>
                      {layover.name} ({formatDuration(layover.duration)})
                      {layover.overnight ? " • Overnight" : ""}
                      {idx < flight.layovers.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}

              {flight.carbon_emissions && (
                <p>
                  <strong>Carbon Emissions:</strong>{" "}
                  {(flight.carbon_emissions.this_flight / 1000).toFixed(2)} kg (
                  {flight.carbon_emissions.difference_percent > 0 ? "+" : ""}
                  {flight.carbon_emissions.difference_percent}% vs typical)
                </p>
              )}
            </div>
          </div>

          <div className="confirm-actions">
            <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
            <button className="confirm-btn" onClick={handleGoToItinerary}>Itinerary</button>
            <button className="confirm-btn" onClick={handleGoToHotels}>Hotels</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightConfirmation;
