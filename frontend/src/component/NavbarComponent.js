import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/NavbarComponent.css";

function NavbarComponent() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null); // store logged-in user
  const collapseRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        collapseRef.current &&
        !collapseRef.current.contains(event.target) &&
        !event.target.classList.contains("navbar-toggler")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`custom-navbar ${scrolled ? "scrolled" : ""}`}
      expanded={open}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={
              scrolled
                ? process.env.PUBLIC_URL + "/dark-blue.png"
                : process.env.PUBLIC_URL + "/white.png"
            }
            alt="Travelogue Logo"
            className="navbar-logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setOpen(!open)}
        />

        <Navbar.Collapse id="basic-navbar-nav" ref={collapseRef}>
          <Nav className="me-auto align-items-lg-center">
            <Nav.Link as={Link} to="/Flights" onClick={() => setOpen(false)}>
              Flights
            </Nav.Link>
            <Nav.Link as={Link} to="/Hotels" onClick={() => setOpen(false)}>
              Hotels
            </Nav.Link>
            <Nav.Link as={Link} to="/Itinerary" onClick={() => setOpen(false)}>
              Itinerary
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center">
            <Nav.Link
              as={Link}
              to="/Offers"
              className="offer-btn"
              onClick={() => setOpen(false)}
            >
              Offers
            </Nav.Link>

            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {user.email} {/* or user.name if you have it */}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      localStorage.removeItem("user");
                      setUser(null);
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link to="/Login" onClick={() => setOpen(false)}>
                <Button className="login-btn">Login</Button>
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
