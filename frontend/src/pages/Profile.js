import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [tripHistory, setTripHistory] = useState([]);
  const [hotelHistory, setHotelHistory] = useState([]);
  const [claimedOffers, setClaimedOffers] = useState([]);

  // Check login status
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (storedUser && loggedIn) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        loadUserData(parsedUser);
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

  // Load user's trip and hotel history with user-specific keys
  const loadUserData = (userData) => {
    try {
      const userId = userData.email || userData.id || 'default';

      // Load flight history (user-specific)
      const flightDetailsKey = `flightDetails_${userId}`;
      const flightDetails = localStorage.getItem(flightDetailsKey);
      
      if (flightDetails) {
        const flight = JSON.parse(flightDetails);
        setTripHistory([flight]); // Can expand to array of trips
      } else {
        setTripHistory([]);
      }

      // Load hotel history (user-specific)
      const hotelDetailsKey = `bookedHotel_${userId}`;
      const hotelDetails = localStorage.getItem(hotelDetailsKey);
      
      if (hotelDetails) {
        const hotel = JSON.parse(hotelDetails);
        setHotelHistory([hotel]); // Can expand to array of hotels
      } else {
        setHotelHistory([]);
      }

      // Load claimed offers (already user-specific)
      const offersKey = `claimedOffers_${userId}`;
      const offers = localStorage.getItem(offersKey);
      
      if (offers) {
        const parsedOffers = JSON.parse(offers);
        setClaimedOffers(parsedOffers);
      } else {
        setClaimedOffers([]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setTripHistory([]);
      setHotelHistory([]);
      setClaimedOffers([]);
    }
  };

  // Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn || !user) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h2>Login Required</h2>
          <p>Please log in to view your profile.</p>
          <button 
            className="primary-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Get user display name
  const displayName = user.name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "No email provided";
  const joinDate = user.joinDate || new Date().toLocaleDateString();

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-info">
            <h1>{displayName}</h1>
            <p className="profile-email">{userEmail}</p>
            <p className="profile-meta">Member since {joinDate}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">✈️</div>
            <div className="stat-content">
              <h3>{tripHistory.length}</h3>
              <p>Flights Booked</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏨</div>
            <div className="stat-content">
              <h3>{hotelHistory.length}</h3>
              <p>Hotels Booked</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎁</div>
            <div className="stat-content">
              <h3>{claimedOffers.length}</h3>
              <p>Offers Claimed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🗺️</div>
            <div className="stat-content">
              <h3>{tripHistory.length}</h3>
              <p>Destinations</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === "trips" ? "active" : ""}`}
            onClick={() => setActiveTab("trips")}
          >
            My Trips
          </button>
          <button
            className={`tab-btn ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            Claimed Offers
          </button>
          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="overview-tab">
              <h2>Welcome back, {displayName}! 👋</h2>
              <p className="overview-subtitle">
                Here's a quick overview of your travel activity
              </p>

              {/* Recent Activity */}
              <div className="section">
                <h3>Recent Activity</h3>
                {tripHistory.length > 0 || hotelHistory.length > 0 ? (
                  <div className="activity-list">
                    {tripHistory.map((trip, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">✈️</div>
                        <div className="activity-details">
                          <h4>Flight to {trip.to}</h4>
                          <p>{trip.departure} - {trip.return || "One-way"}</p>
                        </div>
                        <button 
                          className="view-btn"
                          onClick={() => navigate("/itinerary")}
                        >
                          View
                        </button>
                      </div>
                    ))}
                    {hotelHistory.map((hotel, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">🏨</div>
                        <div className="activity-details">
                          <h4>{hotel.hotel?.name || "Hotel Booking"}</h4>
                          <p>{hotel.checkIn} - {hotel.checkOut}</p>
                        </div>
                        <button 
                          className="view-btn"
                          onClick={() => navigate("/itinerary")}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-message">
                    <p>No bookings yet. Start planning your next trip!</p>
                    <button 
                      className="primary-btn"
                      onClick={() => navigate("/flights")}
                    >
                      Search Flights
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="section">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button 
                    className="action-card"
                    onClick={() => navigate("/flights")}
                  >
                    <span className="action-icon">✈️</span>
                    <span className="action-text">Book Flight</span>
                  </button>
                  <button 
                    className="action-card"
                    onClick={() => navigate("/hotels")}
                  >
                    <span className="action-icon">🏨</span>
                    <span className="action-text">Find Hotel</span>
                  </button>
                  <button 
                    className="action-card"
                    onClick={() => navigate("/itinerary")}
                  >
                    <span className="action-icon">🗺️</span>
                    <span className="action-text">View Itinerary</span>
                  </button>
                  <button 
                    className="action-card"
                    onClick={() => navigate("/offers")}
                  >
                    <span className="action-icon">🎁</span>
                    <span className="action-text">Browse Offers</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Trips Tab */}
          {activeTab === "trips" && (
            <div className="trips-tab">
              <h2>My Trips</h2>
              {tripHistory.length > 0 ? (
                <div className="trips-list">
                  {tripHistory.map((trip, index) => (
                    <div key={index} className="trip-card">
                      <div className="trip-header">
                        <h3>{trip.from} → {trip.to}</h3>
                        <span className="trip-badge">Active</span>
                      </div>
                      <div className="trip-details">
                        <div className="trip-info">
                          <span className="trip-label">Departure</span>
                          <span className="trip-value">{trip.departure}</span>
                        </div>
                        <div className="trip-info">
                          <span className="trip-label">Return</span>
                          <span className="trip-value">{trip.return || "One-way"}</span>
                        </div>
                        {trip.passengers && (
                          <div className="trip-info">
                            <span className="trip-label">Passengers</span>
                            <span className="trip-value">{trip.passengers}</span>
                          </div>
                        )}
                        {trip.class && (
                          <div className="trip-info">
                            <span className="trip-label">Class</span>
                            <span className="trip-value">{trip.class}</span>
                          </div>
                        )}
                      </div>
                      <button 
                        className="view-details-btn"
                        onClick={() => navigate("/itinerary")}
                      >
                        View Full Itinerary
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">
                  <div className="empty-icon">✈️</div>
                  <h3>No trips yet</h3>
                  <p>Start planning your next adventure!</p>
                  <button 
                    className="primary-btn"
                    onClick={() => navigate("/flights")}
                  >
                    Search Flights
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === "offers" && (
            <div className="offers-tab">
              <h2>Claimed Offers</h2>
              {claimedOffers.length > 0 ? (
                <div className="offers-list">
                  {claimedOffers.map((offerId, index) => (
                    <div key={index} className="offer-card">
                      <div className="offer-icon">🎁</div>
                      <div className="offer-content">
                        <h4>Offer #{offerId}</h4>
                        <p>Successfully claimed</p>
                      </div>
                      <span className="offer-status">Claimed</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">
                  <div className="empty-icon">🎁</div>
                  <h3>No offers claimed yet</h3>
                  <p>Check out our exclusive deals!</p>
                  <button 
                    className="primary-btn"
                    onClick={() => navigate("/offers")}
                  >
                    Browse Offers
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="settings-tab">
              <h2>Account Settings</h2>
              
              <div className="settings-section">
                <h3>Personal Information</h3>
                <div className="settings-group">
                  <div className="setting-item">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={userEmail} 
                      disabled 
                      className="disabled-input"
                    />
                  </div>
                  <div className="setting-item">
                    <label>Display Name</label>
                    <input 
                      type="text" 
                      value={displayName} 
                      disabled 
                      className="disabled-input"
                    />
                    <small>Contact support to change your name</small>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Preferences</h3>
                <div className="settings-group">
                  <div className="setting-item-checkbox">
                    <input type="checkbox" id="emailNotif" defaultChecked />
                    <label htmlFor="emailNotif">
                      <strong>Email Notifications</strong>
                      <span>Receive updates about your bookings</span>
                    </label>
                  </div>
                  <div className="setting-item-checkbox">
                    <input type="checkbox" id="offerNotif" defaultChecked />
                    <label htmlFor="offerNotif">
                      <strong>Offer Alerts</strong>
                      <span>Get notified about exclusive deals</span>
                    </label>
                  </div>
                  <div className="setting-item-checkbox">
                    <input type="checkbox" id="newsletter" />
                    <label htmlFor="newsletter">
                      <strong>Newsletter</strong>
                      <span>Travel tips and destination guides</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-section danger-zone">
                <h3>Danger Zone</h3>
                <div className="settings-group">
                  <button className="danger-btn" onClick={handleLogout}>
                    Logout from this device
                  </button>
                  <button 
                    className="danger-btn"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                        // Handle account deletion
                        alert("Account deletion feature coming soon!");
                      }
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Profile);