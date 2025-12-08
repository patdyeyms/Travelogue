import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import seoulImage from "../assets/itinerary/seoul.jpg";
import tokyoImage from "../assets/itinerary/tokyo.png";
import singaporeImage from "../assets/itinerary/singaporebg.png";
import manilaImage from "../assets/itinerary/manila.jpg";
import dubaiImage from "../assets/itinerary/dubai.jpg";
import zurichImage from "../assets/itinerary/zurich.jpeg";
import defaultImage from "../assets/itinerary/default.jpg";
import "../css/Itinerary.css";

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Destinations moved outside component for stable reference
const destinations = {
  "Seoul, Korea": {
    coords: [37.5665, 126.978],
    image: seoulImage,
    attractions: [
      { name: "Gyeongbokgung Palace", desc: "Historic royal palace.", coords: [37.5796, 126.977] },
      { name: "Myeongdong Shopping Street", desc: "Popular shopping area.", coords: [37.5636, 126.982] },
      { name: "N Seoul Tower", desc: "Observation tower with city view.", coords: [37.5512, 126.9882] },
    ],
  },
  "Tokyo, Japan": {
    coords: [35.6895, 139.6917],
    image: tokyoImage,
    attractions: [
      { name: "Tokyo Tower", desc: "Iconic red observation tower.", coords: [35.6586, 139.7454] },
      { name: "Shibuya Crossing", desc: "Famous busy intersection.", coords: [35.6595, 139.7005] },
      { name: "Senso-ji Temple", desc: "Ancient Buddhist temple.", coords: [35.7148, 139.7967] },
    ],
  },
  Singapore: {
    coords: [1.3521, 103.8198],
    image: singaporeImage,
    attractions: [
      { name: "Marina Bay Sands", desc: "Iconic hotel and observation deck.", coords: [1.2834, 103.8607] },
      { name: "Gardens by the Bay", desc: "Futuristic gardens with supertrees.", coords: [1.2816, 103.8636] },
      { name: "Sentosa Island", desc: "Beaches and entertainment.", coords: [1.2494, 103.8303] },
    ],
  },
  "Manila, Philippines": {
    coords: [14.5995, 120.9842],
    image: manilaImage,
    attractions: [
      { name: "Intramuros", desc: "Historic walled city of Manila.", coords: [14.5896, 120.9747] },
      { name: "Rizal Park", desc: "National park and monument.", coords: [14.5826, 120.9797] },
      { name: "National Museum of Fine Arts", desc: "Art and cultural museum.", coords: [14.5869, 120.9814] },
    ],
  },
  "Dubai, UAE": {
    coords: [25.276987, 55.296249],
    image: dubaiImage,
    attractions: [
      { name: "Burj Khalifa", desc: "Tallest building in the world.", coords: [25.1972, 55.2744] },
      { name: "The Dubai Mall", desc: "One of the world's largest malls.", coords: [25.1985, 55.2797] },
      { name: "Palm Jumeirah", desc: "Man-made island shaped like a palm.", coords: [25.112, 55.1396] },
    ],
  },
  "Zurich, Switzerland": {
    coords: [47.3769, 8.5417],
    image: zurichImage,
    attractions: [
      { name: "Lake Zurich", desc: "Scenic lake surrounded by mountains.", coords: [47.3333, 8.55] },
      { name: "Old Town (Altstadt)", desc: "Historic center with medieval charm.", coords: [47.3726, 8.5433] },
      { name: "Uetliberg Mountain", desc: "Viewpoint overlooking Zurich.", coords: [47.3493, 8.4914] },
    ],
  },
};

function Itinerary() {
  const location = useLocation();

  const { flightDetails: passedFlightDetails, resetItinerary } = location.state || {};
  const storedFlightDetails = JSON.parse(localStorage.getItem("flightDetails") || "null");
  const flightDetails = passedFlightDetails || storedFlightDetails;

  const [trip, setTrip] = useState(null);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    // Reset trip
    if (resetItinerary) {
      localStorage.removeItem("flightDetails");
      localStorage.removeItem("selectedHotel");
      setTrip(null);
      setSelectedHotel(null);
      return;
    }

    if (!flightDetails || !flightDetails.to) {
      setTrip(null);
      setSelectedHotel(null);
      return;
    }

    // Save flight details
    localStorage.setItem("flightDetails", JSON.stringify(flightDetails));

    // Set trip
    const dest = destinations[flightDetails.to];
    if (dest) setTrip(dest);

    // Load hotel if explicitly selected
    const savedHotel = JSON.parse(localStorage.getItem("selectedHotel") || "null");
    if (savedHotel && savedHotel.bookedForTrip === flightDetails.to) {
      setSelectedHotel(savedHotel);
    } else {
      setSelectedHotel(null);
    }
  }, [flightDetails, resetItinerary]);

  if (!trip) {
    return (
      <div className={`itinerary-page ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
        <aside className={`sidebar ${isSidebarHidden ? "hidden" : ""}`}>
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
          </div>
        </aside>

        <button
          className="hide-sidebar-btn"
          onClick={() => setIsSidebarHidden(!isSidebarHidden)}
        >
          {isSidebarHidden ? "⮞ Show" : "⮜ Hide"}
        </button>

        <main className="main-content itinerary-empty">
          <h2>No Itinerary Yet</h2>
          <p>Start by selecting a flight to generate your travel itinerary.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={`itinerary-page ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarHidden ? "hidden" : ""}`}>
        <div className="sidebar-section">
          <h4 className="sidebar-title">Explore</h4>
          <ul>
            <li>Best attractions in {flightDetails?.to?.split(",")[0]}</li>
            <li>Best restaurants in {flightDetails?.to?.split(",")[0]}</li>
            <li>Search hotels with transparent pricing</li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-title">Reservations and attachments</h4>
          <ul>
            <li>Flight</li>
            <li>Lodging</li>
            <li>Rental car</li>
            <li>Restaurant</li>
            <li>Attachment</li>
            <li>Other</li>
          </ul>
          <p style={{ fontWeight: "bold", marginTop: "10px" }}>₱0.00</p>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-title">Places to visit</h4>
          <ul>
            {trip.attractions.map((place, i) => (
              <li key={i}>{place.name}</li>
            ))}
          </ul>
        </div>
      </aside>

      <button
        className="hide-sidebar-btn"
        onClick={() => setIsSidebarHidden(!isSidebarHidden)}
      >
        {isSidebarHidden ? "⮞ Show" : "⮜ Hide"}
      </button>

      {/* Main content */}
      <main className="main-content">
        <div className="trip-header-banner">
          <img src={trip.image || defaultImage} alt={flightDetails?.to || "Destination"} />
          <div className="trip-header-card">
            <h1>Trip to {flightDetails?.to?.split(",")[0] || "Unknown"}</h1>
            <p>
              {flightDetails?.departure || "?"} - {flightDetails?.return || "?"}
            </p>
          </div>
        </div>

        {/* Lodging Section */}
        {selectedHotel && (
          <section className="lodging-section" style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Lodging</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                padding: "20px",
                gap: "20px",
              }}
            >
              <img
                src={selectedHotel.image || defaultImage}
                alt={selectedHotel.name}
                style={{
                  width: "160px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <div>
                <h3 style={{ marginBottom: "6px", fontSize: "18px" }}>{selectedHotel.name}</h3>
                <p style={{ marginBottom: "4px" }}>
                  ⭐ {selectedHotel.stars} stars • {selectedHotel.city}, {selectedHotel.country}
                </p>
                <p style={{ color: "#555", fontSize: "14px" }}>Selected for this trip</p>
              </div>
            </div>
          </section>
        )}

        {/* Map Section */}
        <section className="map-wrapper">
          <MapContainer center={trip.coords} zoom={12} className="map-view">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
            {trip.attractions.map((place, i) => (
              <Marker key={i} position={place.coords}>
                <Popup>
                  <strong>{place.name}</strong>
                  <br />
                  {place.desc}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>

        {/* Explore Section */}
        <section className="explore-section">
          <h2>Explore</h2>
          <div className="explore-grid">
            <div className="explore-card">
              <img src={trip.image || defaultImage} alt="Attractions" />
              <p>Best attractions in {flightDetails?.to?.split(",")[0]}</p>
            </div>
            <div className="explore-card">
              <img src={trip.image || defaultImage} alt="Restaurants" />
              <p>Best restaurants in {flightDetails?.to?.split(",")[0]}</p>
            </div>
            <div className="explore-card">
              <img src={trip.image || defaultImage} alt="Hotels" />
              <p>Search hotels with transparent pricing</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Itinerary;
