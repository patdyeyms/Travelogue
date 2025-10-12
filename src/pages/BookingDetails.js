import React, { useState } from "react";
import "../css/BookingDetails.css";
import { useNavigate } from "react-router-dom";

export default function BookingDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    adults: 1,
    children: 0,
    checkIn: "",
    checkOut: "",
    futureBooking: false,
  });

  const [childDetails, setChildDetails] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    if (name === "children") {
      const count = parseInt(value) || 0;
      setChildDetails(
        Array(count)
          .fill()
          .map((_, i) => ({
            name: childDetails[i]?.name || "",
            age: childDetails[i]?.age || "",
          }))
      );
    }
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...childDetails];
    updatedChildren[index][field] = value;
    setChildDetails(updatedChildren);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking submitted:", { formData, childDetails });
    alert("Booking details saved successfully!");
  };

  return (
    <div className="booking-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="booking-container">
        <h1>Booking Details</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group-inline">
            <div>
              <label>Adults</label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div>
              <label>Children</label>
              <input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          {childDetails.length > 0 && (
            <div className="child-section">
              <h3>Child Details</h3>
              {childDetails.map((child, index) => (
                <div key={index} className="child-inputs">
                  <input
                    type="text"
                    placeholder={`Child ${index + 1} Name`}
                    value={child.name}
                    onChange={(e) =>
                      handleChildChange(index, "name", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={child.age}
                    onChange={(e) =>
                      handleChildChange(index, "age", e.target.value)
                    }
                    required
                  />
                </div>
              ))}
            </div>
          )}

          <div className="form-group-inline">
            <div>
              <label>Check-in Date</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Check-out Date</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              name="futureBooking"
              checked={formData.futureBooking}
              onChange={handleChange}
            />
            <label>Book for a future date</label>
          </div>

          <button type="submit" className="submit-btn">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
