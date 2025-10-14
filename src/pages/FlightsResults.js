import React from "react";
import "../css/Flights.css";
import pal from "../assets/flights/pal.png";
import cebu from "../assets/flights/cebupacific.png";
import singapore from "../assets/flights/singapore.png";
import swiss from "../assets/flights/swiss.png";
import emirates from "../assets/flights/emirates.png";
import airasia from "../assets/flights/airasia.png";
import ana from "../assets/flights/ana.png";
import { useLocation, useNavigate } from "react-router-dom";

const getAirlineLogo = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("philippine")) return pal;
  if (n.includes("cebu")) return cebu;
  if (n.includes("singapore")) return singapore;
  if (n.includes("swiss")) return swiss;
  if (n.includes("emirates")) return emirates;
  if (n.includes("airasia")) return airasia;
  if (n.includes("ana") || n.includes("nippon")) return ana;
  return "";
};

function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightDetails } = location.state || {};

  if (!flightDetails) {
    return (
      <div className="results-section">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back to Search</button>
        <h1>No flight details found</h1>
        <p>Please go back to the Flights page and search again.</p>
      </div>
    );
  }

  const flightsData = {
    "Tokyo, Japan": [
      { airline: "All Nippon Airways", departureTime: "7:00 am", arrivalTime: "11:30 am", stops: "Nonstop", duration: "4h 30m", price: 15200, cabin: "Economy", flightNumber: "ANA101" },
      { airline: "Philippine Airlines", departureTime: "9:45 am", arrivalTime: "2:20 pm", stops: "Nonstop", duration: "4h 35m", price: 14500, cabin: "Economy", flightNumber: "PR202" },
      { airline: "Cebu Pacific", departureTime: "1:50 pm", arrivalTime: "6:10 pm", stops: "1 stop", duration: "6h 20m", price: 12800, cabin: "Economy", flightNumber: "CEB303" },
    ],
    "Dubai, UAE": [
      { airline: "Emirates", departureTime: "2:00 am", arrivalTime: "6:30 am", stops: "Nonstop", duration: "9h 30m", price: 25300, cabin: "Economy", flightNumber: "EK401" },
      { airline: "Philippine Airlines", departureTime: "5:45 am", arrivalTime: "3:20 pm", stops: "1 stop", duration: "11h 35m", price: 21100, cabin: "Economy", flightNumber: "PR502" },
      { airline: "Cebu Pacific", departureTime: "11:20 am", arrivalTime: "8:10 pm", stops: "Nonstop", duration: "8h 50m", price: 29400, cabin: "Economy", flightNumber: "CEB603" },
    ],
    "Zurich, Switzerland": [
      { airline: "Swiss International Air Lines", departureTime: "12:30 am", arrivalTime: "9:50 am", stops: "1 stop", duration: "15h 20m", price: 42000, cabin: "Economy", flightNumber: "SWI701" },
      { airline: "Philippine Airlines", departureTime: "3:15 am", arrivalTime: "2:40 pm", stops: "2 stops", duration: "17h 25m", price: 38500, cabin: "Economy", flightNumber: "PR802" },
      { airline: "Singapore Airlines", departureTime: "6:00 am", arrivalTime: "3:50 pm", stops: "1 stop", duration: "13h 50m", price: 45200, cabin: "Economy", flightNumber: "SQ903" },
    ],
    "Seoul, Korea": [
      { airline: "Philippine Airlines", departureTime: "6:00 am", arrivalTime: "10:30 am", stops: "Nonstop", duration: "4h 30m", price: 15200, cabin: "Economy", flightNumber: "PR1001" },
      { airline: "Cebu Pacific", departureTime: "12:15 pm", arrivalTime: "4:45 pm", stops: "Nonstop", duration: "4h 30m", price: 13500, cabin: "Economy", flightNumber: "CEB1102" },
      { airline: "AirAsia", departureTime: "9:00 am", arrivalTime: "1:30 pm", stops: "Nonstop", duration: "4h 30m", price: 14800, cabin: "Economy", flightNumber: "AK1203" },
    ],
    "Singapore": [
      { airline: "Singapore Airlines", departureTime: "7:30 am", arrivalTime: "11:15 am", stops: "Nonstop", duration: "4h 45m", price: 16000, cabin: "Economy", flightNumber: "SQ1301" },
      { airline: "Philippine Airlines", departureTime: "1:00 pm", arrivalTime: "4:40 pm", stops: "Nonstop", duration: "3h 40m", price: 14200, cabin: "Economy", flightNumber: "PR1402" },
      { airline: "Cebu Pacific", departureTime: "9:00 am", arrivalTime: "12:50 pm", stops: "Nonstop", duration: "3h 50m", price: 12900, cabin: "Economy", flightNumber: "CEB1503" },
    ],
  };

  const flights = flightsData[flightDetails.to] || [];

  return (
    <div className="results-section">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Search</button>
      <h1>Flights from {flightDetails.from} to {flightDetails.to}</h1>
      <p>Departure: {flightDetails.departure} {flightDetails.return && ` | Return: ${flightDetails.return}`}</p>

      <div className="results-list">
        {flights.map((flight, index) => (
          <div key={index} className="flight-card">
            <div className="flight-logo">
              <img src={getAirlineLogo(flight.airline)} alt={flight.airline} />
            </div>
            <div className="flight-details">
              <h3>{flight.airline}</h3>
              <p>{flight.departureTime} – {flight.arrivalTime}</p>
              <p>{flightDetails.from} → {flightDetails.to}</p>
              <p>{flight.stops} • {flight.duration}</p>
              <p>Cabin: {flight.cabin}</p>
            </div>
            <div className="flight-price-btn">
              <div className="flight-price">₱ {flight.price.toLocaleString()}</div>
              <button className="flight-book-btn" onClick={() => navigate("/flight-details", { state: { flight, flightDetails } })}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightResults;
