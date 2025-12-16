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
  { label: "Overview", type: "overview" },
  { label: "Day Planner", type: "planner" },
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

  // Planner state
  const [tripName, setTripName] = useState("My Trip");
  const [days, setDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: "",
    time: "",
    location: "",
    notes: "",
    category: "attraction",
    duration: "",
    cost: "",
  });
  const [draggedItem, setDraggedItem] = useState(null);

  // State for add to planner modal
  const [showAddToPlanner, setShowAddToPlanner] = useState(false);
  const [selectedPlaceForPlanner, setSelectedPlaceForPlanner] = useState(null);
  const [selectedDayForPlace, setSelectedDayForPlace] = useState(0);

  // State for edit activity modal
  const [showEditActivity, setShowEditActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingDayIndex, setEditingDayIndex] = useState(null);

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
        const storedFlightDetails = localStorage.getItem("flightDetails");
        const parsedFlightDetails = storedFlightDetails 
          ? JSON.parse(storedFlightDetails) 
          : null;
        
        const finalFlightDetails = passedFlightDetails || parsedFlightDetails;
        setFlightDetails(finalFlightDetails);

        const storedHotel = localStorage.getItem("selectedHotel");
        const parsedHotel = storedHotel ? JSON.parse(storedHotel) : null;
        
        setBookedHotel(passedHotel || parsedHotel);

        // Load planner data
        const savedItinerary = localStorage.getItem("plannedItinerary");
        if (savedItinerary) {
          const data = JSON.parse(savedItinerary);
          setTripName(data.tripName || "My Trip");
          setDays(data.days || []);
        } else if (finalFlightDetails?.departure && finalFlightDetails?.return) {
          initializeDaysFromFlight(finalFlightDetails);
        }

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

  // Initialize days from flight dates
  const initializeDaysFromFlight = (flight) => {
    if (!flight.departure || !flight.return) return;

    const start = new Date(flight.departure);
    const end = new Date(flight.return);
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newDays = [];
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      newDays.push({
        id: i + 1,
        date: date.toISOString().split("T")[0],
        activities: [],
      });
    }
    setDays(newDays);
  };

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

    try {
      localStorage.setItem("flightDetails", JSON.stringify(flightDetails));
    } catch (error) {
      console.error("Error saving flight details:", error);
    }
  }, [flightDetails, memoTrip, trip]);

  // Fetch places whenever sidebarSelection or trip changes
  useEffect(() => {
    if (!trip || sidebarSelection.type === "overview" || sidebarSelection.type === "planner") return;

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

  // Add place to planner
  const handleAddToPlanner = (place) => {
    if (days.length === 0) {
      alert("Please add days to your trip first by visiting the Day Planner section.");
      return;
    }
    setSelectedPlaceForPlanner(place);
    setSelectedDayForPlace(0);
    setShowAddToPlanner(true);
  };

  const confirmAddToPlanner = () => {
    if (!selectedPlaceForPlanner) return;

    const categoryMap = {
      attractions: "attraction",
      restaurants: "restaurant",
      hotels: "hotel",
    };

    const activity = {
      id: Date.now(),
      title: selectedPlaceForPlanner.name,
      location: selectedPlaceForPlanner.address || "",
      category: categoryMap[sidebarSelection.type] || "other",
      notes: selectedPlaceForPlanner.rating ? `⭐ ${selectedPlaceForPlanner.rating} stars` : "",
      time: "",
      duration: "",
      cost: "",
    };

    const updatedDays = [...days];
    updatedDays[selectedDayForPlace].activities.push(activity);
    setDays(updatedDays);

    setShowAddToPlanner(false);
    setSelectedPlaceForPlanner(null);
    
    alert(`Added "${activity.title}" to Day ${selectedDayForPlace + 1}!`);
  };

  // Transform places for sidebar
  const sidebarPlaces = useMemo(() => {
    return places.map(p => ({
      name: p.name || p.title,
      coords: [p.gps_coordinates?.latitude, p.gps_coordinates?.longitude],
      rating: p.rating,
      address: p.address,
      order_online: p.order_online,
      image: p.thumbnail || p.image,
    })).filter(p => p.coords[0] && p.coords[1]);
  }, [places]);

  // Save planner data
  const saveItinerary = useCallback(() => {
    try {
      const data = {
        tripName,
        tripDates: {
          start: flightDetails?.departure || "",
          end: flightDetails?.return || ""
        },
        days,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("plannedItinerary", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving itinerary:", error);
    }
  }, [tripName, days, flightDetails]);

  // Auto-save planner
  useEffect(() => {
    if (isLoggedIn && days.length > 0 && sidebarSelection.type === "planner") {
      const timer = setTimeout(() => {
        saveItinerary();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [days, isLoggedIn, sidebarSelection.type, saveItinerary]);

  // Planner functions
  const addDay = () => {
    const lastDate = days[days.length - 1]?.date || new Date().toISOString().split("T")[0];
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 1);

    setDays([
      ...days,
      {
        id: days.length + 1,
        date: nextDate.toISOString().split("T")[0],
        activities: [],
      },
    ]);
  };

  const addActivity = () => {
    if (!newActivity.title) {
      alert("Please enter an activity title");
      return;
    }

    const activity = {
      id: Date.now(),
      ...newActivity,
    };

    const updatedDays = [...days];
    updatedDays[currentDay].activities.push(activity);
    setDays(updatedDays);

    setNewActivity({
      title: "",
      time: "",
      location: "",
      notes: "",
      category: "attraction",
      duration: "",
      cost: "",
    });
    setShowAddActivity(false);
  };

  const deleteActivity = (dayIndex, activityId) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (a) => a.id !== activityId
    );
    setDays(updatedDays);
  };

  const openEditActivity = (dayIndex, activity) => {
    setEditingDayIndex(dayIndex);
    setEditingActivity({ ...activity });
    setShowEditActivity(true);
  };

  const saveEditActivity = () => {
    if (!editingActivity.title) {
      alert("Please enter an activity title");
      return;
    }

    const updatedDays = [...days];
    const activityIndex = updatedDays[editingDayIndex].activities.findIndex(
      (a) => a.id === editingActivity.id
    );
    updatedDays[editingDayIndex].activities[activityIndex] = editingActivity;
    setDays(updatedDays);

    setShowEditActivity(false);
    setEditingActivity(null);
    setEditingDayIndex(null);
  };

  const handleDragStart = (e, dayIndex, activityId) => {
    setDraggedItem({ dayIndex, activityId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetDayIndex, targetPosition) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { dayIndex: sourceDayIndex, activityId } = draggedItem;
    const updatedDays = [...days];

    const sourceDay = updatedDays[sourceDayIndex];
    const activityIndex = sourceDay.activities.findIndex((a) => a.id === activityId);
    const [activity] = sourceDay.activities.splice(activityIndex, 1);

    const targetDay = updatedDays[targetDayIndex];
    targetDay.activities.splice(targetPosition, 0, activity);

    setDays(updatedDays);
    setDraggedItem(null);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      attraction: "🎭",
      restaurant: "🍽️",
      hotel: "🏨",
      transport: "🚗",
      shopping: "🛍️",
      activity: "⚽",
      other: "📍",
    };
    return icons[category] || "📍";
  };

  const getCategoryColor = (category) => {
    const colors = {
      attraction: "#f59e0b",
      restaurant: "#ef4444",
      hotel: "#8b5cf6",
      transport: "#3b82f6",
      shopping: "#ec4899",
      activity: "#10b981",
      other: "#6b7280",
    };
    return colors[category] || "#6b7280";
  };

  const calculateTotals = () => {
    let totalCost = 0;
    let totalActivities = 0;

    days.forEach((day) => {
      totalActivities += day.activities.length;
      day.activities.forEach((activity) => {
        const cost = parseFloat(activity.cost) || 0;
        totalCost += cost;
      });
    });

    return { totalCost, totalActivities };
  };

  const { totalCost, totalActivities } = calculateTotals();

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

  // Not logged in
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

  // Empty state
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

  // Render planner view
  if (sidebarSelection.type === "planner") {
    return (
      <div className={`itinerary-page ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
        <aside className={`sidebar ${isSidebarHidden ? "hidden" : ""}`}>
          <div className="sidebar-section">
            <h4 className="sidebar-title">Navigate</h4>
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
            <h4 className="sidebar-title">Days</h4>
            {days.length > 0 ? (
              <ul>
                {days.map((day, index) => (
                  <li
                    key={day.id}
                    className={currentDay === index ? "active" : ""}
                    onClick={() => setCurrentDay(index)}
                  >
                    <div className="place-name">Day {index + 1}</div>
                    <div className="place-rating">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-places">No days planned</p>
            )}
            <button className="add-day-btn-sidebar" onClick={addDay}>
              + Add Day
            </button>
          </div>
        </aside>

        <button 
          className="hide-sidebar-btn" 
          onClick={() => setIsSidebarHidden(!isSidebarHidden)}
          aria-label={isSidebarHidden ? "Show sidebar" : "Hide sidebar"}
        >
          {isSidebarHidden ? "⮞ Show" : "⮜ Hide"}
        </button>

        <main className="main-content planner-view">
          <div className="planner-header-integrated">
            <div className="planner-header-top">
              <input
                type="text"
                className="trip-name-input"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Trip Name"
              />
              <div className="header-stats-integrated">
                <div className="stat">
                  <span className="stat-icon">📅</span>
                  <div>
                    <div className="stat-value">{days.length}</div>
                    <div className="stat-label">Days</div>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon">📍</span>
                  <div>
                    <div className="stat-value">{totalActivities}</div>
                    <div className="stat-label">Activities</div>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon">💰</span>
                  <div>
                    <div className="stat-value">₱{totalCost.toLocaleString()}</div>
                    <div className="stat-label">Budget</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {days.length > 0 && days[currentDay] ? (
            <div className="planner-day-content">
              <div className="day-header">
                <h2>
                  Day {currentDay + 1} -{" "}
                  {new Date(days[currentDay].date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
                <button
                  className="add-activity-btn"
                  onClick={() => setShowAddActivity(true)}
                >
                  + Add Activity
                </button>
              </div>

              <div
                className="activities-timeline"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, currentDay, days[currentDay].activities.length)}
              >
                {days[currentDay].activities.length === 0 ? (
                  <div className="empty-timeline">
                    <p>No activities planned for this day</p>
                    <button
                      className="primary-btn"
                      onClick={() => setShowAddActivity(true)}
                    >
                      Add Your First Activity
                    </button>
                  </div>
                ) : (
                  days[currentDay].activities.map((activity, actIndex) => (
                    <div
                      key={activity.id}
                      className="activity-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, currentDay, activity.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, currentDay, actIndex)}
                      style={{ borderLeftColor: getCategoryColor(activity.category) }}
                    >
                      <div className="activity-drag-handle">⋮⋮</div>
                      <div className="activity-content">
                        <div className="activity-header">
                          <div className="activity-title-row">
                            <span
                              className="activity-icon"
                              style={{ background: getCategoryColor(activity.category) }}
                            >
                              {getCategoryIcon(activity.category)}
                            </span>
                            <h4>{activity.title}</h4>
                          </div>
                          <div className="activity-actions">
                            <button
                              className="icon-btn"
                              onClick={() => openEditActivity(currentDay, activity)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="icon-btn"
                              onClick={() => deleteActivity(currentDay, activity.id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className="activity-details">
                          {activity.time && (
                            <span className="detail-item">🕐 {activity.time}</span>
                          )}
                          {activity.duration && (
                            <span className="detail-item">⏱️ {activity.duration}</span>
                          )}
                          {activity.location && (
                            <span className="detail-item">📍 {activity.location}</span>
                          )}
                          {activity.cost && (
                            <span className="detail-item cost">
                              💰 ₱{parseFloat(activity.cost).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {activity.notes && (
                          <div className="activity-notes">{activity.notes}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="empty-planner-state">
              <p>No days available. Add a day to start planning!</p>
              <button className="primary-btn" onClick={addDay}>
                Add First Day
              </button>
            </div>
          )}
        </main>

        {showAddActivity && (
          <div className="modal-overlay" onClick={() => setShowAddActivity(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Activity</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowAddActivity(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Activity Title *</label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, title: e.target.value })
                    }
                    placeholder="e.g. Visit Tokyo Tower"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newActivity.category}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, category: e.target.value })
                      }
                    >
                      <option value="attraction">🎭 Attraction</option>
                      <option value="restaurant">🍽️ Restaurant</option>
                      <option value="hotel">🏨 Hotel</option>
                      <option value="transport">🚗 Transport</option>
                      <option value="shopping">🛍️ Shopping</option>
                      <option value="activity">⚽ Activity</option>
                      <option value="other">📍 Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={newActivity.time}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, time: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newActivity.location}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, location: e.target.value })
                    }
                    placeholder="e.g. 4 Chome-2-8 Shibakoen, Tokyo"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={newActivity.duration}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, duration: e.target.value })
                      }
                      placeholder="e.g. 2 hours"
                    />
                  </div>

                  <div className="form-group">
                    <label>Cost (₱)</label>
                    <input
                      type="number"
                      value={newActivity.cost}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, cost: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={newActivity.notes}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, notes: e.target.value })
                    }
                    placeholder="Add any notes or special instructions..."
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="secondary-btn"
                  onClick={() => setShowAddActivity(false)}
                >
                  Cancel
                </button>
                <button className="primary-btn" onClick={addActivity}>
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditActivity && editingActivity && (
          <div className="modal-overlay" onClick={() => setShowEditActivity(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Activity</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowEditActivity(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Activity Title *</label>
                  <input
                    type="text"
                    value={editingActivity.title}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, title: e.target.value })
                    }
                    placeholder="e.g. Visit Tokyo Tower"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={editingActivity.category}
                      onChange={(e) =>
                        setEditingActivity({ ...editingActivity, category: e.target.value })
                      }
                    >
                      <option value="attraction">🎭 Attraction</option>
                      <option value="restaurant">🍽️ Restaurant</option>
                      <option value="hotel">🏨 Hotel</option>
                      <option value="transport">🚗 Transport</option>
                      <option value="shopping">🛍️ Shopping</option>
                      <option value="activity">⚽ Activity</option>
                      <option value="other">📍 Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={editingActivity.time}
                      onChange={(e) =>
                        setEditingActivity({ ...editingActivity, time: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editingActivity.location}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, location: e.target.value })
                    }
                    placeholder="e.g. 4 Chome-2-8 Shibakoen, Tokyo"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={editingActivity.duration}
                      onChange={(e) =>
                        setEditingActivity({ ...editingActivity, duration: e.target.value })
                      }
                      placeholder="e.g. 2 hours"
                    />
                  </div>

                  <div className="form-group">
                    <label>Cost (₱)</label>
                    <input
                      type="number"
                      value={editingActivity.cost}
                      onChange={(e) =>
                        setEditingActivity({ ...editingActivity, cost: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={editingActivity.notes}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, notes: e.target.value })
                    }
                    placeholder="Add any notes or special instructions..."
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="secondary-btn"
                  onClick={() => setShowEditActivity(false)}
                >
                  Cancel
                </button>
                <button className="primary-btn" onClick={saveEditActivity}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render overview or explore views
  return (
    <div className={`itinerary-page ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
      <aside className={`sidebar ${isSidebarHidden ? "hidden" : ""}`}>
        <div className="sidebar-section">
          <h4 className="sidebar-title">Navigate</h4>
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

        {(sidebarSelection.type !== "overview" && sidebarSelection.type !== "planner") && (
          <div className="sidebar-section">
            <h4 className="sidebar-title">Places</h4>
            {sidebarPlaces.length > 0 ? (
              <ul>
                {sidebarPlaces.map((place, i) => (
                  <li
                    key={i}
                    className="place-item-with-actions"
                  >
                    <div 
                      className="place-item-info"
                      onClick={() => handlePlaceSelect(place)}
                    >
                      <div className="place-name">{place.name}</div>
                      {place.rating && (
                        <div className="place-rating">⭐ {place.rating}</div>
                      )}
                    </div>
                    <button
                      className="add-to-planner-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToPlanner(place);
                      }}
                      title="Add to Day Planner"
                    >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-places">No places found</p>
            )}
          </div>
        )}
      </aside>

      <button 
        className="hide-sidebar-btn" 
        onClick={() => setIsSidebarHidden(!isSidebarHidden)}
        aria-label={isSidebarHidden ? "Show sidebar" : "Hide sidebar"}
      >
        {isSidebarHidden ? "⮞ Show" : "⮜ Hide"}
      </button>

      <main className="main-content">
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

        <section className="flights-section">
          <h2>Flights</h2>
          <div className="info-card">
            <div className="info-icon">✈️</div>
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

        <section className="map-wrapper">
          <TripMap
            trip={trip}
            sidebarSelection={sidebarSelection}
            selectedSidebarPlace={selectedSidebarPlace}
          />
        </section>
      </main>

      {showAddToPlanner && selectedPlaceForPlanner && (
        <div className="modal-overlay" onClick={() => setShowAddToPlanner(false)}>
          <div className="modal-content add-to-planner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add to Day Planner</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddToPlanner(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="place-preview">
                <h4>{selectedPlaceForPlanner.name}</h4>
                {selectedPlaceForPlanner.rating && (
                  <p className="place-preview-rating">⭐ {selectedPlaceForPlanner.rating}</p>
                )}
                {selectedPlaceForPlanner.address && (
                  <p className="place-preview-address">📍 {selectedPlaceForPlanner.address}</p>
                )}
              </div>

              <div className="form-group">
                <label>Select Day</label>
                <select
                  value={selectedDayForPlace}
                  onChange={(e) => setSelectedDayForPlace(parseInt(e.target.value))}
                  className="day-select"
                >
                  {days.map((day, index) => (
                    <option key={day.id} value={index}>
                      Day {index + 1} - {new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} ({day.activities.length} activities)
                    </option>
                  ))}
                </select>
              </div>

              <p className="helper-text">
                You can edit the time, duration, and other details after adding it to your planner.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-btn"
                onClick={() => setShowAddToPlanner(false)}
              >
                Cancel
              </button>
              <button className="primary-btn" onClick={confirmAddToPlanner}>
                Add to Day {selectedDayForPlace + 1}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Itinerary);