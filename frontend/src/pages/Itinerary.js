import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "../css/Itinerary.css";
import axios from "axios";
import TripMap from "../component/TripMap";
import defaultImage from "../assets/itinerary/default.jpg";
import seoulImage from "../assets/itinerary/seoul.jpg";
import tokyoImage from "../assets/itinerary/tokyo.png";
import singaporeImage from "../assets/itinerary/singaporebg.png";
import manilaImage from "../assets/itinerary/manila.jpg";
import dubaiImage from "../assets/itinerary/dubai.jpg";
import zurichImage from "../assets/itinerary/zurich.jpeg";

const destinations = {
  "Seoul, Korea": { coords: [37.5665, 126.978], image: seoulImage, attractions: [{ name: "Gyeongbokgung Palace", coords: [37.5796, 126.977] }, { name: "Myeongdong", coords: [37.5636, 126.982] }, { name: "N Seoul Tower", coords: [37.5512, 126.9882] }] },
  "Tokyo, Japan": { coords: [35.6895, 139.6917], image: tokyoImage, attractions: [{ name: "Tokyo Tower", coords: [35.6586, 139.7454] }, { name: "Shibuya Crossing", coords: [35.6595, 139.7005] }, { name: "Senso-ji Temple", coords: [35.7148, 139.7967] }] },
  Singapore: { coords: [1.3521, 103.8198], image: singaporeImage, attractions: [{ name: "Marina Bay Sands", coords: [1.2834, 103.8607] }, { name: "Gardens by the Bay", coords: [1.2816, 103.8636] }, { name: "Sentosa Island", coords: [1.2494, 103.8303] }] },
  "Manila, Philippines": { coords: [14.5995, 120.9842], image: manilaImage, attractions: [{ name: "Intramuros", coords: [14.5896, 120.9747] }, { name: "Rizal Park", coords: [14.5826, 120.9797] }, { name: "National Museum", coords: [14.5869, 120.9814] }] },
  "Dubai, UAE": { coords: [25.276987, 55.296249], image: dubaiImage, attractions: [{ name: "Burj Khalifa", coords: [25.1972, 55.2744] }, { name: "The Dubai Mall", coords: [25.1985, 55.2797] }, { name: "Palm Jumeirah", coords: [25.112, 55.1396] }] },
  "Zurich, Switzerland": { coords: [47.3769, 8.5417], image: zurichImage, attractions: [{ name: "Lake Zurich", coords: [47.3333, 8.55] }, { name: "Old Town", coords: [47.3726, 8.5433] }, { name: "Uetliberg Mountain", coords: [47.3493, 8.4914] }] },
};

const sidebarOptions = [
  { label: "Attractions", type: "attractions" },
  { label: "Restaurants", type: "restaurants" },
  { label: "Hotels", type: "hotels" },
];

function Itinerary() {
  const location = useLocation();
  const { flightDetails: passedFlightDetails, hotel: passedHotel } = location.state || {};
  const storedFlightDetails = JSON.parse(localStorage.getItem("flightDetails") || "null");
  const storedHotel = JSON.parse(localStorage.getItem("selectedHotel") || "null");

  const flightDetails = passedFlightDetails || storedFlightDetails;

  const [trip, setTrip] = useState(null);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [sidebarSelection, setSidebarSelection] = useState(sidebarOptions[0]);
  const [selectedSidebarPlace, setSelectedSidebarPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [bookedHotel, setBookedHotel] = useState(passedHotel || storedHotel || null); // keep the booked hotel
  const [sidebarHotel, setSidebarHotel] = useState(null); // hotel from sidebar selection

  const memoTrip = useMemo(() => (flightDetails?.to ? destinations[flightDetails.to] : null), [flightDetails?.to]);

  useEffect(() => {
    if (!flightDetails?.to) return;
    localStorage.setItem("flightDetails", JSON.stringify(flightDetails));
    if (trip !== memoTrip) setTrip(memoTrip);
  }, [flightDetails, memoTrip, trip]);

  // Fetch places whenever sidebarSelection or trip changes
  useEffect(() => {
    if (!trip) return;

    const fetchPlaces = async () => {
      let query =
        sidebarSelection.type === "restaurants"
          ? "restaurant"
          : sidebarSelection.type === "hotels"
          ? "hotel"
          : "tourist attraction";

      try {
        const response = await axios.get("http://localhost:5000/api/search-places", {
          params: {
            lat: trip.coords[0],
            lng: trip.coords[1],
            query,
          },
        });
        setPlaces(response.data.local_results || []);
      } catch (err) {
        console.error("Error fetching places:", err);
        setPlaces([]);
      }
    };

    fetchPlaces();
    setSelectedSidebarPlace(null);
    if (sidebarSelection.type !== "hotels") setSidebarHotel(null);
  }, [sidebarSelection, trip]);

  if (!trip) return (
    <div className={`itinerary-page ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
      <aside className={`sidebar ${isSidebarHidden ? "hidden" : ""}`}></aside>
      <button className="hide-sidebar-btn" onClick={() => setIsSidebarHidden(!isSidebarHidden)}>
        {isSidebarHidden ? "⮞ Show" : "⮜ Hide"}
      </button>
      <main className="main-content itinerary-empty">
        <h2>No Itinerary Yet</h2>
        <p>Start by selecting a flight to generate your travel itinerary.</p>
      </main>
    </div>
  );

  const sidebarPlaces = places.map(p => ({
    name: p.name || p.title,
    coords: [p.gps_coordinates.latitude, p.gps_coordinates.longitude],
    rating: p.rating,
    address: p.address,
    order_online: p.order_online,
  }));

  return (
    <div className={`itinerary-page ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
      <aside className={`sidebar ${isSidebarHidden ? "hidden" : ""}`}>
        <div className="sidebar-section">
          <h4 className="sidebar-title">Explore</h4>
          <ul>
            {sidebarOptions.map(option => (
              <li
                key={option.type}
                style={{ fontWeight: option.type === sidebarSelection.type ? "700" : "400" }}
                onClick={() => setSidebarSelection(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-title">Places</h4>
          <ul>
            {sidebarPlaces.map((place, i) => (
              <li
                key={i}
                onClick={() => {
                  setSelectedSidebarPlace(place);
                  if (sidebarSelection.type === "hotels") {
                    setSidebarHotel({
                      name: place.name,
                      image: place.image,
                      stars: place.rating,
                      city: flightDetails?.to?.split(",")[0],
                      country: flightDetails?.to?.split(",")[1]?.trim(),
                    });
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {place.name}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <button className="hide-sidebar-btn" onClick={() => setIsSidebarHidden(!isSidebarHidden)}>
        {isSidebarHidden ? "⮞ Show" : "⮜ Hide"}
      </button>

      <main className="main-content">
        <div className="trip-header-banner">
          <img src={trip.image || defaultImage} alt={flightDetails?.to || "Destination"} />
          <div className="trip-header-card">
            <h1>Trip to {flightDetails?.to?.split(",")[0]}</h1>
            <p>{flightDetails?.departure} - {flightDetails?.return}</p>
          </div>
        </div>

        {/* Flights Section */}
          {flightDetails && (
            <section className="flights-section" style={{ paddingTop: "40px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
                Flights
              </h2>

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
                {/* Flight icon / placeholder */}
                <div
                  style={{
                    width: "160px",
                    height: "120px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #0b3a3a, #1f6f6f)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    fontWeight: "700",
                  }}
                >
                  ✈
                </div>

                <div>
                  <h3 style={{ marginBottom: "6px", fontSize: "18px" }}>
                    {flightDetails.from} → {flightDetails.to}
                  </h3>

                  <p style={{ marginBottom: "4px" }}>
                    📅 {flightDetails.departure} – {flightDetails.return}
                  </p>

                  {flightDetails.airline && (
                    <p style={{ marginBottom: "4px" }}>
                      🛫 {flightDetails.airline}
                      {flightDetails.flightNumber && ` • ${flightDetails.flightNumber}`}
                    </p>
                  )}

                  {(flightDetails.passengers || flightDetails.class) && (
                    <p style={{ fontSize: "14px", color: "#555" }}>
                      {flightDetails.passengers && `${flightDetails.passengers} passenger(s)`}
                      {flightDetails.passengers && flightDetails.class && " • "}
                      {flightDetails.class}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

        {/* Lodging Section */}
        {(bookedHotel || sidebarHotel) && (
          <section className="lodging-section">
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
                src={(bookedHotel || sidebarHotel).image || defaultImage}
                alt={(bookedHotel || sidebarHotel).name}
                style={{
                  width: "160px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <div>
                <h3 style={{ marginBottom: "6px", fontSize: "18px" }}>{(bookedHotel || sidebarHotel).name}</h3>
                <p style={{ marginBottom: "4px" }}>
                  ⭐ {(bookedHotel || sidebarHotel).stars} stars • {(bookedHotel || sidebarHotel).city}, {(bookedHotel || sidebarHotel).country}
                </p>
                <p style={{ color: "#555", fontSize: "14px" }}>Selected for this trip</p>
              </div>
            </div>
          </section>
        )}

        <section className="map-wrapper">
          <TripMap
            trip={trip}
            sidebarSelection={sidebarSelection}
            selectedSidebarPlace={selectedSidebarPlace}
          />
        </section>
      </main>
    </div>
  );
}

export default Itinerary;