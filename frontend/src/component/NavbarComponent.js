import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/NavbarComponent.css";

function NavbarComponent() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check login status
  const checkLoginStatus = useCallback(() => {
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
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  // Initial check and listen for changes
  useEffect(() => {
    // Check on mount
    checkLoginStatus();

    // Listen for storage events (from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "isLoggedIn" || e.key === null) {
        checkLoginStatus();
      }
    };

    // Listen for custom storage events (from same tab)
    const handleCustomStorageChange = () => {
      checkLoginStatus();
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage", handleCustomStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage", handleCustomStorageChange);
    };
  }, [checkLoginStatus]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      setUser(null);
      setIsLoggedIn(false);
      setIsUserDropdownOpen(false);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event("storage"));
      
      // Navigate to home
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Toggle user dropdown
  const toggleUserDropdown = useCallback(() => {
    setIsUserDropdownOpen((prev) => !prev);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown-container")) {
        setIsUserDropdownOpen(false);
      }
      if (!e.target.closest(".mobile-menu") && !e.target.closest(".hamburger")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.name || user.email?.split("@")[0] || "User";
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo-link">
          <img 
            src={
              isScrolled
                ? process.env.PUBLIC_URL + "/dark-blue.png"
                : process.env.PUBLIC_URL + "/white.png"
            }
            alt="Travelogue Logo" 
            className="navbar-logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/flights">Flights</Link>
          </li>
          <li>
            <Link to="/hotels">Hotels</Link>
          </li>
          <li>
            <Link to="/itinerary">Itinerary</Link>
          </li>
          <li>
            <Link to="/offers">Offers</Link>
          </li>
        </ul>

        {/* User Section - Desktop Only */}
        <div className="navbar-actions desktop-only">
          {isLoggedIn ? (
            <div className="user-dropdown-container">
              <button
                className="user-button"
                onClick={toggleUserDropdown}
                aria-expanded={isUserDropdownOpen}
                aria-label="User menu"
              >
                <span className="user-icon">👤</span>
                <span className="user-name">{getUserDisplayName()}</span>
                <span className={`dropdown-arrow ${isUserDropdownOpen ? "open" : ""}`}>
                  ▼
                </span>
              </button>

              {isUserDropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <span className="user-email">{user?.email}</span>
                  </div>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/profile");
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/itinerary");
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    My Trips
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/offers");
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    My Offers
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-backdrop" onClick={toggleMobileMenu}></div>
          <div className="mobile-menu">
            <ul>
              <li>
                <Link to="/" onClick={toggleMobileMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/flights" onClick={toggleMobileMenu}>
                  Flights
                </Link>
              </li>
              <li>
                <Link to="/hotels" onClick={toggleMobileMenu}>
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/itinerary" onClick={toggleMobileMenu}>
                  Itinerary
                </Link>
              </li>
              <li>
                <Link to="/offers" onClick={toggleMobileMenu}>
                  Offers
                </Link>
              </li>
            </ul>

            <div className="mobile-menu-divider"></div>

            {isLoggedIn ? (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <span className="user-icon">👤</span>
                  <div>
                    <div className="mobile-user-name">{getUserDisplayName()}</div>
                    <div className="mobile-user-email">{user?.email}</div>
                  </div>
                </div>
                <button
                  className="mobile-menu-btn"
                  onClick={() => {
                    navigate("/profile");
                    toggleMobileMenu();
                  }}
                >
                  Profile
                </button>
                <button
                  className="mobile-menu-btn"
                  onClick={() => {
                    navigate("/itinerary");
                    toggleMobileMenu();
                  }}
                >
                  My Trips
                </button>
                <button
                  className="mobile-menu-btn"
                  onClick={() => {
                    navigate("/offers");
                    toggleMobileMenu();
                  }}
                >
                  My Offers
                </button>
                <button className="mobile-menu-btn logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="mobile-login-btn"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default React.memo(NavbarComponent);