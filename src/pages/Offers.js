import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Offers.css";

function Offers() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLoginRedirect = () => {
    navigate("/Login");
  };

  return (
    <div className="offers-page">
      {isLoggedIn ? (
        <div className="offers-container">
          <h2 className="offers-title">Exclusive Offers & Vouchers</h2>
          <p className="offers-subtitle">
            Grab these limited-time travel deals curated just for you!
          </p>

          <div className="offers-grid">
            <div className="offer-card">
              <h3>✈️ Flight Discount</h3>
              <p>Get up to 30% off on international flights.</p>
              <button>Claim Offer</button>
            </div>
            <div className="offer-card">
              <h3>🏨 Hotel Stay</h3>
              <p>Book 2 nights, get the 3rd free — limited time only!</p>
              <button>View Deal</button>
            </div>
            <div className="offer-card">
              <h3>🎟️ Travel Package</h3>
              <p>Save ₱2000 on your next tropical getaway!</p>
              <button>Redeem Now</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="offers-locked">
          <h2>Unlock Exclusive Offers ✨</h2>
          <p>
            Log in or sign up to access amazing discounts, travel vouchers, and
            members-only deals.
          </p>
          <button className="offers-login-btn" onClick={handleLoginRedirect}>
            Login to Continue
          </button>
        </div>
      )}
    </div>
  );
}

export default Offers;
