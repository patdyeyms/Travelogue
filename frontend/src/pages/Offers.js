import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Offers.css";

function Offers() {
  const navigate = useNavigate();

  // States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [claimedOffers, setClaimedOffers] = useState([]);
  const [modal, setModal] = useState({ show: false, message: "" });

  // Offers data
  const offers = [
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

  // Load user and claimed offers
  useEffect(() => {
    const checkLogin = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);

        const storageKey = `claimedOffers_${parsedUser.email}`;
        const storedClaims = JSON.parse(localStorage.getItem(storageKey)) || [];
        setClaimedOffers(storedClaims);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setClaimedOffers([]);
      }
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // Handle claiming an offer
  const handleClaimOffer = (offerId) => {
    if (!isLoggedIn) {
      setModal({ show: true, message: "Log in to claim this offer!" });
      return;
    }

    const storageKey = `claimedOffers_${user.email}`;
    const storedClaims = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (storedClaims.includes(offerId)) {
      setModal({ show: true, message: "You already claimed this offer!" });
      return;
    }

    const updatedClaims = [...storedClaims, offerId];
    localStorage.setItem(storageKey, JSON.stringify(updatedClaims));
    setClaimedOffers(updatedClaims);
    setModal({ show: true, message: "Offer claimed successfully!" });
  };

  // Close modal
  const closeModal = () => {
    setModal({ show: false, message: "" });
    if (modal.message === "Log in to claim this offer!") {
      navigate("/Login");
    }
  };

  return (
    <div className="offers-page">
      {!isLoggedIn ? (
        <div className="offers-locked">
          <h2>Unlock Exclusive Offers</h2>
          <p>Log in to access amazing deals and claim your offers!</p>
          <button
            className="offers-login-btn"
            onClick={() => navigate("/Login")}
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
            {offers.map((offer) => {
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
                    />
                  </div>
                  <h3>{offer.title}</h3>
                  <p>{offer.desc}</p>
                  <button
                    onClick={() => handleClaimOffer(offer.id)}
                    disabled={isClaimed}
                  >
                    {isClaimed ? "CLAIMED" : "Claim Offer"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modal.show && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <p>{modal.message}</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Offers;
