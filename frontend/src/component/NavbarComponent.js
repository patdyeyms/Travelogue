import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/NavbarComponent.css";

function NavbarComponent() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const collapseRef = useRef(null);

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
            <Nav.Link as={Link} to="/Flights">
              Flights
            </Nav.Link>
            <Nav.Link as={Link} to="/Hotels">
              Hotels
            </Nav.Link>
            <Nav.Link as={Link} to="/Itinerary">
              Itinerary
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center">
            {/* Offers link with underline hover */}
            <Nav.Link as={Link} to="/Offers" className="offer-btn">
              Offers
            </Nav.Link>

            {/* ✅ Login button now links to /Login */}
            <Link to="/Login">
              <Button className="login-btn">Login</Button>
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
