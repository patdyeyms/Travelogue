import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  "Seoul, Korea": { 
    coords: [37.5665, 126.978], 
    image: seoulImage, 
    attractions: [
      { name: "Gyeongbokgung Palace", coords: [37.5796, 126.977] }, 
      { name: "Myeongdong", coords: [37.5636, 126.982] }, 
      { name: "N Seoul Tower", coords: [37.5512, 126.9882] }
    ] 
  },
  "Tokyo, Japan": { 
    coords: [35.6895, 139.6917], 
    image: tokyoImage, 
    attractions: [
      { name: "Tokyo Tower", coords: [35.6586, 139.7454] }, 
      { name: "Shibuya Crossing", coords: [35.6595, 139.7005] }, 
      { name: "Senso-ji Temple", coords: [35.7148, 139.7967] }
    ] 
  },
  Singapore: { 
    coords: [1.3521, 103.8198], 
    image: singaporeImage, 
    attractions: [
      { name: "Marina Bay Sands", coords: [1.2834, 103.8607] }, 
      { name: "Gardens by the Bay", coords: [1.2816, 103.8636] }, 
      { name: "Sentosa Island", coords: [1.2494, 103.8303] }
    ] 
  },
  "Manila, Philippines": { 
    coords: [14.5995, 120.9842], 
    image: manilaImage, 
    attractions: [
      { name: "Intramuros", coords: [14.5896, 120.9747] }, 
      { name: "Rizal Park", coords: [14.5826, 120.9797] }, 
      { name: "National Museum", coords: [14.5869, 120.9814] }
    ] 
  },
  "Dubai, UAE": { 
    coords: [25.276987, 55.296249], 
    image: dubaiImage, 
    attractions: [
      { name: "Burj Khalifa", coords: [25.1972, 55.2744] }, 
      { name: "The Dubai Mall", coords: [25.1985, 55.2797] }, 
      { name: "Palm Jumeirah", coords: [25.112, 55.1396] }
    ] 
  },
  "Zurich, Switzerland": { 
    coords: [47.3769, 8.5417], 
    image: zurichImage, 
    attractions: [
      { name: "Lake Zurich", coords: [47.3333, 8.55] }, 
      { name: "Old Town", coords: [47.3726, 8.5433] }, 
      { name: "Uetliberg Mountain", coords: [47.3493, 8.4914] }
    ] 
  },
};

const sidebarOptions = [
  { label: "Attractions", type: "attractions" },
  { label: "Restaurants", type: "restaurants" },
  { label: "Hotels", type: "hotels" },
];

function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { flightDetails: passedFlightDetails, hotel: passedHotel } = location.state || {};

  const [trip, setTrip] = useState(null);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [sidebarSelection, setSidebarSelection] = useState(sidebarOptions[0]);
  const [selectedSidebarPlace, setSelectedSidebarPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [bookedHotel, setBookedHotel] = useState(null);
  const [sidebarHotel, setSidebarHotel] = useState(null);
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check login status first
  useEffect(() => {
    const checkLogin = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (storedUser && loggedIn) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLogin();

    // Listen for login/logout events
    const handleStorageChange = () => {
      checkLogin();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Load flight and hotel data only if logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setFlightDetails(null);
      setBookedHotel(null);
      setTrip(null);
      setLoading(false);
      return;
    }

    const loadData = () => {
      try {
        // Load flight details
        const storedFlightDetails = localStorage.getItem("flightDetails");
        const parsedFlightDetails = storedFlightDetails 
          ? JSON.parse(storedFlightDetails) 
          : null;
        
        // Use passed flight details or stored ones
        const finalFlightDetails = passedFlightDetails || parsedFlightDetails;
        setFlightDetails(finalFlightDetails);

        // Load hotel details (optional)
        const storedHotel = localStorage.getItem("selectedHotel");
        const parsedHotel = storedHotel ? JSON.parse(storedHotel) : null;
        
        // Use passed hotel or stored one
        setBookedHotel(passedHotel || parsedHotel);

        setLoading(false);
      } catch (error) {
        console.error("Error loading itinerary data:", error);
        setFlightDetails(null);
        setBookedHotel(null);
        setLoading(false);
      }
    };

    loadData();
  }, [passedFlightDetails, passedHotel, isLoggedIn]);

  // Memoize trip based on flight destination
  const memoTrip = useMemo(() => {
    if (!flightDetails?.to) return null;
    return destinations[flightDetails.to] || null;
  }, [flightDetails?.to]);

  // Update trip when flightDetails changes
  useEffect(() => {
    if (!flightDetails?.to) {
      setTrip(null);
      return;
    }

    if (trip !== memoTrip) {
      setTrip(memoTrip);
    }

    // Save flight details to localStorage
    try {
      localStorage.setItem("flightDetails", JSON.stringify(flightDetails));
    } catch (error) {
      console.error("Error saving flight details:", error);
    }
  }, [flightDetails, memoTrip, trip]);

  // Fetch places whenever sidebarSelection or trip changes
  useEffect(() => {
    if (!trip) return;

    const fetchPlaces = async () => {
      const queryMap = {
        restaurants: "restaurant",
        hotels: "hotel",
        attractions: "tourist attraction",
      };

      const query = queryMap[sidebarSelection.type] || "tourist attraction";

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
    
    // Reset sidebar hotel when not viewing hotels
    if (sidebarSelection.type !== "hotels") {
      setSidebarHotel(null);
    }
  }, [sidebarSelection, trip]);

  // Handle place selection
  const handlePlaceSelect = useCallback((place) => {
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
  }, [sidebarSelection.type, flightDetails]);

  // Transform places for sidebar
  const sidebarPlaces = useMemo(() => {
    return places.map(p => ({
      name: p.name || p.title,
      coords: [p.gps_coordinates?.latitude, p.gps_coordinates?.longitude],
      rating: p.rating,
      address: p.address,
      order_online: p.order_online,
      image: p.thumbnail || p.image,
    })).filter(p => p.coords[0] && p.coords[1]); // Filter out places without coordinates
  }, [places]);

  // Loading state
  if (loading) {
    return (
      <div className="itinerary-page">
        <main className="main-content itinerary-empty">
          <div className="loading-spinner">Loading...</div>
        </main>
      </div>
    );
  }

  // Not logged in - show login prompt
  if (!isLoggedIn) {
    return (
      <div className="itinerary-page">
        <main className="main-content itinerary-empty">
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h2>Login Required</h2>
            <p>Please log in to view and manage your travel itinerary.</p>
            <button 
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Empty state - NO FLIGHT
  if (!flightDetails || !flightDetails.to || !trip) {
    return (
      <div className="itinerary-page">
        <main className="main-content itinerary-empty">
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h2>No Flight Booked Yet</h2>
            <p>Start planning your trip by booking a flight first.</p>
            <button 
              className="primary-btn"
              onClick={() => navigate("/flights")}
            >
              Search Flights
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Has flight - show itinerary (hotel is optional)
  return (
    <div className={`itinerary-page ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarHidden ? "hidden" : ""}`}>
        <div className="sidebar-section">
          <h4 className="sidebar-title">Explore</h4>
          <ul>
            {sidebarOptions.map(option => (
              <li
                key={option.type}
                className={option.type === sidebarSelection.type ? "active" : ""}
                onClick={() => setSidebarSelection(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-title">Places</h4>
          {sidebarPlaces.length > 0 ? (
            <ul>
              {sidebarPlaces.map((place, i) => (
                <li
                  key={i}
                  onClick={() => handlePlaceSelect(place)}
                  className="place-item"
                >
                  <div className="place-name">{place.name}</div>
                  {place.rating && (
                    <div className="place-rating">⭐ {place.rating}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-places">No places found</p>
          )}
        </div>
      </aside>

      {/* Sidebar Toggle Button */}
      <button 
        className="hide-sidebar-btn" 
        onClick={() => setIsSidebarHidden(!isSidebarHidden)}
        aria-label={isSidebarHidden ? "Show sidebar" : "Hide sidebar"}
      >
        {isSidebarHidden ? "⮞ Show" : "⮜ Hide"}
      </button>

      {/* Main Content */}
      <main className="main-content">
        {/* Trip Header */}
        <div className="trip-header-banner">
          <img 
            src={trip.image || defaultImage} 
            alt={flightDetails.to || "Destination"} 
            onError={(e) => e.target.src = defaultImage}
          />
          <div className="trip-header-card">
            <h1>Trip to {flightDetails.to?.split(",")[0]}</h1>
            <p>{flightDetails.departure} - {flightDetails.return || "One-way"}</p>
          </div>
        </div>

        {/* Flights Section */}
        <section className="flights-section">
          <h2>Flights</h2>
          <div className="info-card">
            <div className="info-icon">
              ✈️
            </div>
            <div className="info-details">
              <h3>{flightDetails.from} → {flightDetails.to}</h3>
              <p>📅 {flightDetails.departure} – {flightDetails.return || "One-way"}</p>
              
              {flightDetails.airline && (
                <p>
                  🛫 {flightDetails.airline}
                  {flightDetails.flightNumber && ` • ${flightDetails.flightNumber}`}
                </p>
              )}

              {(flightDetails.passengers || flightDetails.class) && (
                <p className="secondary-info">
                  {flightDetails.passengers && `${flightDetails.passengers} passenger(s)`}
                  {flightDetails.passengers && flightDetails.class && " • "}
                  {flightDetails.class}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Lodging Section (Optional) */}
        {(bookedHotel || sidebarHotel) ? (
          <section className="lodging-section">
            <h2>Lodging</h2>
            <div className="info-card">
              <img
                src={(bookedHotel || sidebarHotel).image || defaultImage}
                alt={(bookedHotel || sidebarHotel).name}
                className="hotel-image"
                onError={(e) => e.target.src = defaultImage}
              />
              <div className="info-details">
                <h3>{(bookedHotel || sidebarHotel).name}</h3>
                <p>
                  ⭐ {(bookedHotel || sidebarHotel).stars} stars • {(bookedHotel || sidebarHotel).city}, {(bookedHotel || sidebarHotel).country}
                </p>
                <p className="secondary-info">Selected for this trip</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="lodging-section">
            <h2>Lodging</h2>
            <div className="info-card empty-hotel">
              <div className="empty-hotel-content">
                <p>No hotel booked yet</p>
                <button 
                  className="secondary-btn"
                  onClick={() => {
                    localStorage.setItem("selectedDestination", flightDetails.to);
                    navigate("/hotels");
                  }}
                >
                  Browse Hotels
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Map Section */}
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

export default React.memo(Itinerary);