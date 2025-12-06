import React from "react";
import "../css/Hotels.css";

const HotelCard = ({ hotel }) => {
  return (
    <div className="hotel-card">
      <img src={hotel.image} alt={hotel.name} />
      <h3>{hotel.name}</h3>
      <p>{hotel.stars} ⭐</p>
      <ul>
        {hotel.reviews.map((review, idx) => (
          <li key={idx}>{review}</li>
        ))}
      </ul>
    </div>
  );
};

export default HotelCard;
