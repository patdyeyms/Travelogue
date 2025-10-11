import React from "react";
import HotelCard from "./HotelCard";
import "../css/Hotels.css";
import hotels from "../pages/Hotels";
const hotels = [
  // Philippines
  {
    id: 1,
    country: "Philippines",
    name: "Okada Manila",
    stars: 5,
    reviews: ["Luxurious experience!", "Amazing amenities!"],
    image: "okada-manila.jpg",
  },
  {
    id: 2,
    country: "Philippines",
    name: "Kingsford Hotel Manila Bay",
    stars: 4,
    reviews: ["Great location!", "Friendly staff!"],
    image: "kingsford-manila.jpg",
  },

  // Switzerland
  {
    id: 3,
    country: "Switzerland",
    name: "Hyatt Place Zurich Airport The Circle",
    stars: 4,
    reviews: ["Comfortable rooms", "Close to airport!"],
    image: "hyatt-zurich.jpg",
  },
  {
    id: 4,
    country: "Switzerland",
    name: "Capsule Hotel - Alpine Garden Zurich Airport",
    stars: 4.5,
    reviews: ["Unique experience!", "Clean and modern!"],
    image: "capsule-zurich.jpg",
  },

  // Japan
  {
    id: 5,
    country: "Japan",
    name: "Hotel Villa Fontaine Grand Haneda Airport",
    stars: 4,
    reviews: ["Convenient location", "Comfortable beds!"],
    image: "villa-fontaine-tokyo.jpg",
  },
  {
    id: 6,
    country: "Japan",
    name: "LANDABOUT Tokyo",
    stars: 3,
    reviews: ["Cozy rooms", "Affordable stay!"],
    image: "landabout-tokyo.jpg",
  },

  // Korea
  {
    id: 7,
    country: "Korea",
    name: "Roynet Hotel Seoul Mapo",
    stars: 4,
    reviews: ["Clean and modern", "Nice staff!"],
    image: "roynet-seoul.jpg",
  },
  {
    id: 8,
    country: "Korea",
    name: "GLAD MAPO",
    stars: 4,
    reviews: ["Great facilities", "Central location!"],
    image: "glad-mapo.jpg",
  },

  // UAE
  {
    id: 9,
    country: "UAE",
    name: "Rove Downtown",
    stars: 3,
    reviews: ["Budget-friendly", "Nice pool!"],
    image: "rove-downtown.jpg",
  },
  {
    id: 10,
    country: "UAE",
    name: "Sonder by Marriott Bonvoy Business Bay Apartments",
    stars: 4,
    reviews: ["Spacious rooms", "Good service!"],
    image: "sonder-uae.jpg",
  },

  // Singapore
  {
    id: 11,
    country: "Singapore",
    name: "Marina Bay Sands",
    stars: 5,
    reviews: ["Iconic hotel!", "Amazing infinity pool!"],
    image: "marina-bay-sands.jpg",
  },
  {
    id: 12,
    country: "Singapore",
    name: "Orchard Rendezvous Hotel by Far East Hospitality",
    stars: 4,
    reviews: ["Comfortable stay", "Great location!"],
    image: "orchard-rendezvous.jpg",
  },
];

const HotelsSection = ({ country }) => {
  const filteredHotels = hotels.filter(hotel => hotel.country === country);

  return (
    <div className="hotels-section">
      {filteredHotels.map(hotel => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelsSection;
