import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ItineraryPlanner.css";

function ItineraryPlanner() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Trip data
  const [tripName, setTripName] = useState("My Trip");
  const [tripDates, setTripDates] = useState({ start: "", end: "" });
  const [days, setDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(0);
  
  // Activity state
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
  
  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState(null);

  // Check login status
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (storedUser && loggedIn) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        loadItinerary();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load saved itinerary
  const loadItinerary = () => {
    try {
      const savedItinerary = localStorage.getItem("plannedItinerary");
      if (savedItinerary) {
        const data = JSON.parse(savedItinerary);
        setTripName(data.tripName || "My Trip");
        setTripDates(data.tripDates || { start: "", end: "" });
        setDays(data.days || []);
      } else {
        // Initialize with one day
        setDays([
          {
            id: 1,
            date: new Date().toISOString().split("T")[0],
            activities: [],
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading itinerary:", error);
      setDays([
        {
          id: 1,
          date: new Date().toISOString().split("T")[0],
          activities: [],
        },
      ]);
    }
  };

  // Save itinerary
  const saveItinerary = useCallback(() => {
    try {
      const data = {
        tripName,
        tripDates,
        days,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("plannedItinerary", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving itinerary:", error);
    }
  }, [tripName, tripDates, days]);

  // Auto-save
  useEffect(() => {
    if (isLoggedIn && days.length > 0) {
      const timer = setTimeout(() => {
        saveItinerary();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tripName, tripDates, days, isLoggedIn, saveItinerary]);

  // Generate days based on date range
  const generateDays = () => {
    if (!tripDates.start || !tripDates.end) return;

    const start = new Date(tripDates.start);
    const end = new Date(tripDates.end);
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newDays = [];
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      newDays.push({
        id: i + 1,
        date: date.toISOString().split("T")[0],
        activities: days[i]?.activities || [],
      });
    }
    setDays(newDays);
  };

  // Add day
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

  // Add activity
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

    // Reset form
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

  // Delete activity
  const deleteActivity = (dayIndex, activityId) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (a) => a.id !== activityId
    );
    setDays(updatedDays);
  };

  // Edit activity
  const editActivity = (dayIndex, activityId, updatedActivity) => {
    const updatedDays = [...days];
    const activityIndex = updatedDays[dayIndex].activities.findIndex(
      (a) => a.id === activityId
    );
    updatedDays[dayIndex].activities[activityIndex] = {
      ...updatedDays[dayIndex].activities[activityIndex],
      ...updatedActivity,
    };
    setDays(updatedDays);
  };

  // Drag and drop handlers
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

    // Find and remove from source
    const sourceDay = updatedDays[sourceDayIndex];
    const activityIndex = sourceDay.activities.findIndex((a) => a.id === activityId);
    const [activity] = sourceDay.activities.splice(activityIndex, 1);

    // Add to target
    const targetDay = updatedDays[targetDayIndex];
    targetDay.activities.splice(targetPosition, 0, activity);

    setDays(updatedDays);
    setDraggedItem(null);
  };

  // Get category icon
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

  // Get category color
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

  // Calculate totals
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
      <div className="planner-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading planner...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="planner-page">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h2>Login Required</h2>
          <p>Please log in to create and manage your itinerary.</p>
          <button className="primary-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-page">
      <div className="planner-container">
        {/* Header */}
        <div className="planner-header">
          <div className="header-content">
            <input
              type="text"
              className="trip-name-input"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="Trip Name"
            />
            <div className="trip-dates">
              <input
                type="date"
                value={tripDates.start}
                onChange={(e) => {
                  setTripDates({ ...tripDates, start: e.target.value });
                  setTimeout(generateDays, 100);
                }}
              />
              <span>to</span>
              <input
                type="date"
                value={tripDates.end}
                onChange={(e) => {
                  setTripDates({ ...tripDates, end: e.target.value });
                  setTimeout(generateDays, 100);
                }}
                min={tripDates.start}
              />
            </div>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-icon">📅</span>
              <span className="stat-value">{days.length}</span>
              <span className="stat-label">Days</span>
            </div>
            <div className="stat">
              <span className="stat-icon">📍</span>
              <span className="stat-value">{totalActivities}</span>
              <span className="stat-label">Activities</span>
            </div>
            <div className="stat">
              <span className="stat-icon">💰</span>
              <span className="stat-value">₱{totalCost.toLocaleString()}</span>
              <span className="stat-label">Budget</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="planner-content">
          {/* Sidebar - Days List */}
          <div className="planner-sidebar">
            <div className="sidebar-header">
              <h3>Days</h3>
              <button className="add-day-btn" onClick={addDay} title="Add Day">
                + Add Day
              </button>
            </div>
            <div className="days-list">
              {days.map((day, index) => (
                <div
                  key={day.id}
                  className={`day-item ${currentDay === index ? "active" : ""}`}
                  onClick={() => setCurrentDay(index)}
                >
                  <div className="day-number">Day {index + 1}</div>
                  <div className="day-date">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="day-count">{day.activities.length} activities</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Panel - Timeline */}
          <div className="planner-main">
            {days[currentDay] && (
              <>
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

                {/* Activities Timeline */}
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
                                onClick={() => deleteActivity(currentDay, activity.id)}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <div className="activity-details">
                            {activity.time && (
                              <span className="detail-item">
                                🕐 {activity.time}
                              </span>
                            )}
                            {activity.duration && (
                              <span className="detail-item">
                                ⏱️ {activity.duration}
                              </span>
                            )}
                            {activity.location && (
                              <span className="detail-item">
                                📍 {activity.location}
                              </span>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
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
    </div>
  );
}

export default React.memo(ItineraryPlanner);