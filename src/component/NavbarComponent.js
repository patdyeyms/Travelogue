import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/NavbarComponent.css";

function NavbarComponent() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          TRAVELOGUE
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/Flights">Flights</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/Hotels">Hotels</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/Itinerary">Itinerary</Link></li>
          </ul>

          <div className="d-flex align-items-center">
            <button className="offer-btn">Offers</button>
              <button className="login-btn ms-2">Login</button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
