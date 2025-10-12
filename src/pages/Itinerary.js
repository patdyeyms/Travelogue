import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import seoulImage from "../assets/itinerary/seoul.jpg";
import "../css/Itinerary.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightDetails } = location.state || {};
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);

  const destinations = {
    "Seoul, Korea": {
      coords: [37.5665, 126.978],
      attractions: [
        { name: "Gyeongbokgung Palace", desc: "Historic royal palace.", coords: [37.5796, 126.977] },
        { name: "Myeongdong Shopping Street", desc: "Popular shopping area.", coords: [37.5636, 126.982] },
        { name: "N Seoul Tower", desc: "Observation tower with city view.", coords: [37.5512, 126.9882] },
      ],
    },
    "Tokyo, Japan": {
      coords: [35.6895, 139.6917],
      attractions: [
        { name: "Tokyo Tower", desc: "Iconic red observation tower.", coords: [35.6586, 139.7454] },
        { name: "Shibuya Crossing", desc: "Famous busy intersection.", coords: [35.6595, 139.7005] },
        { name: "Senso-ji Temple", desc: "Ancient Buddhist temple.", coords: [35.7148, 139.7967] },
      ],
    },
    "Singapore": {
      coords: [1.3521, 103.8198],
      attractions: [
        { name: "Marina Bay Sands", desc: "Iconic hotel and observation deck.", coords: [1.2834, 103.8607] },
        { name: "Gardens by the Bay", desc: "Futuristic gardens.", coords: [1.2816, 103.8636] },
        { name: "Sentosa Island", desc: "Beaches and resorts.", coords: [1.2494, 103.8303] },
      ],
    },
  };

  useEffect(() => {
    if (!flightDetails || !flightDetails.to) {
      navigate("/flights");
      return;
    }

    const dest = destinations[flightDetails.to];
    if (dest) setTrip(dest);

    if (flightDetails.departure && flightDetails.return) {
      const start = new Date(flightDetails.departure);
      const end = new Date(flightDetails.return);
      const tempDays = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateCopy = new Date(d);
        tempDays.push({
          date: dateCopy,
          title: dateCopy.toLocaleDateString("en-US", {
            weekday: "short",
            month: "numeric",
            day: "numeric",
          }),
        });
      }

      setDays(tempDays);
    }
  }, [flightDetails, navigate]);

  if (!trip) {
    return (
      <div className="itinerary-empty">
        <h2>No itinerary available</h2>
        <p>Book a flight first to view your itinerary.</p>
      </div>
    );
  }

  return (
    <div className="itinerary-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-section">
          <h4 className="sidebar-title">Explore</h4>
          <ul>
            <li>Notes</li>
            <li>Places to visit</li>
            <li>Untitled</li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-title">Itinerary</h4>
          <ul>
            {days.map((day, i) => (
              <li key={i}>
                {day.date.toLocaleDateString("en-US", { weekday: "short" })} {day.date.getMonth() + 1}/{day.date.getDate()}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-title">Budget</h4>
          <ul>
            <li>View</li>
          </ul>
        </div>

        <button className="hide-sidebar-btn">⮜ Hide sidebar</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="trip-header-banner">
          <img src={seoulImage} alt="Seoul" />

          <div className="trip-header-card">
            <h1>Trip to {flightDetails.to.split(",")[0]}</h1>
            <p>
              {flightDetails.departure} - {flightDetails.return}
            </p>
          </div>
        </div>

        <section className="map-wrapper">
          <MapContainer center={trip.coords} zoom={12} className="map-view">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
            {trip.attractions.map((place, i) => (
              <Marker key={i} position={place.coords}>
                <Popup>
                  <strong>{place.name}</strong><br />
                  {place.desc}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>

        <section className="explore-section">
          <h2>Explore</h2>
          <div className="explore-grid">
            <div className="explore-card">
              <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24" alt="Attractions" />
              <p>Best attractions in {flightDetails.to.split(",")[0]}</p>
            </div>
            <div className="explore-card">
              <img src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b" alt="Restaurants" />
              <p>Best restaurants in {flightDetails.to.split(",")[0]}</p>
            </div>
            <div className="explore-card">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" alt="Hotels" />
              <p>Search hotels with transparent pricing</p>
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}

export default Itinerary;
