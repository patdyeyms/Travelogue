import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import NavbarComponent from "./component/NavbarComponent";
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";
import BookingDetails from "./pages/BookingDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import Itinerary from "./pages/Itinerary";
import Landing from "./pages/Landing";
import FlightResults from "./pages/FlightsResults";
import FlightDetails from "./pages/FlightDetails";
import FlightConfirmation from "./pages/FlightConfirmation";
import "./css/Pages.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <NavbarComponent />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Flights" element={<Flights />} />
          <Route path="/Flights/Results" element={<FlightResults />} />
          <Route path="/flight-details" element={<FlightDetails />} />
          <Route path="/flight-confirmation" element={<FlightConfirmation />} />
          <Route path="/Hotels" element={<Hotels />} />
          <Route path="/booking-details" element={<BookingDetails />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/Itinerary" element={<Itinerary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
