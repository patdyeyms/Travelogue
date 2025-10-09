import React, { useEffect, useRef, useState } from "react";
import "../css/Pages.css";
import planeImg from "../assets/plane.png";
import itineraryImg from "../assets/travel itinerary.png";

function Landing() {
  const featureRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (featureRef.current) observer.observe(featureRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <section className="intro-section">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
        >
          <source src="/cinematic.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="intro-overlay"></div>

        <div className="intro-content">
          <h1>Discover the World with Travelogue</h1>
          <p>Plan smarter, travel farther — your next adventure starts here.</p>
          <button
            className="scroll-button"
            onClick={() =>
              document
                .querySelector(".feature-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore ↓
          </button>
        </div>
      </section>

      <section className="hero-section">
        <img src={planeImg} alt="plane" className="plane-image" />
        <h2>Organize your trips the easy way with Travelogue!</h2>
      </section>

      <section
        ref={featureRef}
        className={`feature-section center-layout ${isVisible ? "fade-in" : ""}`}
      >
        <h1 className="feature-title">Travel itinerary planner</h1>
        <img
          src={itineraryImg}
          alt="Travel Itinerary"
          className="itinerary-image"
        />

        <div className="feature-text left-text">
          <h3>
            No more struggling with Word docs, spreadsheets, and Google Maps to
            plan a trip.
          </h3>
          <p>
            With the Travelogue planning tool, you have one simple way to
            organize your travel. Create a new trip or start with a ready-made
            itinerary. Add activities and accommodation, then drag and drop your
            daily schedule with ease.
          </p>
          <p>
            Print, publish, and share your itinerary — and take it with you on
            the road using the Travelogue viewer app. You’ll never be lost.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Landing;
