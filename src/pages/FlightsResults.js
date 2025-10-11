import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightDetails } = location.state || {};

  // Show message if no flightDetails
  if (!flightDetails) {
    return (
      <div className="results-section">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Search
        </button>
        <h1>No flight details found</h1>
        <p>Please go back to the Flights page and search for your flight.</p>
      </div>
    );
  }

  const flights = [
    {
      airline: "Philippine Airlines",
      departureTime: "7:45 am",
      arrivalTime: "11:20 am",
      from: flightDetails.from,
      to: flightDetails.to,
      stops: "Nonstop",
      duration: "3h 35m",
      price: "₱14,131",
      cabin: "Economy",
    },
    {
      airline: "Cebu Pacific",
      departureTime: "1:50 pm",
      arrivalTime: "5:10 pm",
      from: flightDetails.from,
      to: flightDetails.to,
      stops: "1 stop",
      duration: "6h 05m",
      price: "₱17,295",
      cabin: "Economy",
    },
    {
      airline: "Singapore Airlines",
      departureTime: "9:00 am",
      arrivalTime: "1:15 pm",
      from: flightDetails.from,
      to: flightDetails.to,
      stops: "Nonstop",
      duration: "4h 15m",
      price: "₱18,427",
      cabin: "Economy",
    },
  ];

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Search
      </button>

      <h1>
        Flights from {flightDetails.from} to {flightDetails.to}
      </h1>
      <p>
        {flightDetails.departure} {flightDetails.return && ` - ${flightDetails.return}`}
      </p>

      <div className="results-list">
        {flights.map((flight, index) => (
          <div key={index} className="flight-card">
            {/* Airline Logo placeholder */}
            <div className="flight-logo">
              <img
                src={`https://via.placeholder.com/50?text=${flight.airline.split(" ")[0]}`}
                alt={flight.airline}
              />
            </div>

            {/* Flight details */}
            <div className="flight-details">
              <h3>{flight.airline}</h3>
              <p>
                {flight.departureTime} – {flight.arrivalTime}
              </p>
              <p>
                {flight.from} → {flight.to}
              </p>
              <p>{flight.stops} • {flight.duration}</p>
              <p>Cabin: {flight.cabin}</p>
            </div>

            {/* Price & Book */}
            <div className="flight-price-btn">
              <div className="flight-price">{flight.price}</div>
              <button className="book-btn">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightResults;
