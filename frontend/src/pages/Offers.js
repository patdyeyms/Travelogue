import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Offers.css";

// Constants
const OFFERS_DATA = [
  {
    id: 1,
    title: "Flight Discount",
    desc: "Get up to 30% off on international flights.",
    icon: "/offers-icon/flightdis.png",
    color: "linear-gradient(135deg, #00b09b, #96c93d)",
  },
  {
    id: 2,
    title: "Hotel Stay",
    desc: "Book 2 nights and get the 3rd free — limited time offer.",
    icon: "/offers-icon/hotelstay.png",
    color: "linear-gradient(135deg, #6a11cb, #2575fc)",
  },
  {
    id: 3,
    title: "Travel Package",
    desc: "Save ₱2000 on your next tropical getaway.",
    icon: "/offers-icon/travelpack.png",
    color: "linear-gradient(135deg, #f7971e, #ffd200)",
  },
];

const MODAL_MESSAGES = {
  NOT_LOGGED_IN: "Log in to claim this offer!",
  ALREADY_CLAIMED: "You already claimed this offer!",
  CLAIM_SUCCESS: "Offer claimed successfully!",
};

function Offers() {
  const navigate = useNavigate();

  // States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [claimedOffers, setClaimedOffers] = useState([]);
  const [modal, setModal] = useState({ show: false, message: "" });

  // Get storage key for user's claimed offers
  const getStorageKey = useCallback((email) => `claimedOffers_${email}`, []);

  // Load claimed offers from localStorage
  const loadClaimedOffers = useCallback((userEmail) => {
    try {
      const storageKey = getStorageKey(userEmail);
      const storedClaims = localStorage.getItem(storageKey);
      return storedClaims ? JSON.parse(storedClaims) : [];
    } catch (error) {
      console.error("Error loading claimed offers:", error);
      return [];
    }
  }, [getStorageKey]);

  // Save claimed offers to localStorage
  const saveClaimedOffers = useCallback((userEmail, offers) => {
    try {
      const storageKey = getStorageKey(userEmail);
      localStorage.setItem(storageKey, JSON.stringify(offers));
      return true;
    } catch (error) {
      console.error("Error saving claimed offers:", error);
      return false;
    }
  }, [getStorageKey]);

  // Check login status
  const checkLoginStatus = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        
        const claims = loadClaimedOffers(parsedUser.email);
        setClaimedOffers(claims);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setClaimedOffers([]);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUser(null);
      setClaimedOffers([]);
    }
  }, [loadClaimedOffers]);

  // Initialize and listen for storage changes
  useEffect(() => {
    checkLoginStatus();
    
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, [checkLoginStatus]);

  // Handle claiming an offer
  const handleClaimOffer = useCallback((offerId) => {
    // Check if user is logged in
    if (!isLoggedIn || !user) {
      setModal({ show: true, message: MODAL_MESSAGES.NOT_LOGGED_IN });
      return;
    }

    // Check if offer is already claimed
    if (claimedOffers.includes(offerId)) {
      setModal({ show: true, message: MODAL_MESSAGES.ALREADY_CLAIMED });
      return;
    }

    // Claim the offer
    const updatedClaims = [...claimedOffers, offerId];
    const saved = saveClaimedOffers(user.email, updatedClaims);

    if (saved) {
      setClaimedOffers(updatedClaims);
      setModal({ show: true, message: MODAL_MESSAGES.CLAIM_SUCCESS });
    } else {
      setModal({ show: true, message: "Failed to claim offer. Please try again." });
    }
  }, [isLoggedIn, user, claimedOffers, saveClaimedOffers]);

  // Close modal
  const closeModal = useCallback(() => {
    const shouldNavigateToLogin = modal.message === MODAL_MESSAGES.NOT_LOGGED_IN;
    
    setModal({ show: false, message: "" });
    
    if (shouldNavigateToLogin) {
      navigate("/Login");
    }
  }, [modal.message, navigate]);

  // Memoized offer cards
  const offerCards = useMemo(() => {
    return OFFERS_DATA.map((offer) => {
      const isClaimed = claimedOffers.includes(offer.id);
      
      return (
        <div
          key={offer.id}
          className={`offer-card ${isClaimed ? "claimed-card" : ""}`}
        >
          <div
            className="offer-icon-wrapper"
            style={{ background: offer.color }}
          >
            <img
              src={process.env.PUBLIC_URL + offer.icon}
              alt={offer.title}
              className="offer-icon"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                console.error(`Failed to load offer icon: ${offer.icon}`);
              }}
            />
          </div>
          <h3>{offer.title}</h3>
          <p>{offer.desc}</p>
          <button
            onClick={() => handleClaimOffer(offer.id)}
            disabled={isClaimed}
            aria-label={isClaimed ? "Offer already claimed" : `Claim ${offer.title}`}
          >
            {isClaimed ? "CLAIMED" : "Claim Offer"}
          </button>
        </div>
      );
    });
  }, [claimedOffers, handleClaimOffer]);

  return (
    <div className="offers-page">
      {!isLoggedIn ? (
        <div className="offers-locked">
          <h2>Unlock Exclusive Offers</h2>
          <p>Log in to access amazing deals and claim your offers!</p>
          <button
            className="offers-login-btn"
            onClick={() => navigate("/Login")}
            aria-label="Login to access offers"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="offers-container">
          <h2 className="offers-title">Exclusive Offers & Vouchers</h2>
          <p className="offers-subtitle">
            Take advantage of our curated travel deals available for a limited time.
          </p>

          <div className="offers-grid">
            {offerCards}
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.show && (
        <div 
          className="modal-overlay" 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-message"
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <p id="modal-message">{modal.message}</p>
            <button 
              onClick={closeModal}
              aria-label="Close modal"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Offers);