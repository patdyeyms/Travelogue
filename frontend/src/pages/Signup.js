import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/travelogue-api/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert("Signup successful! Please login.");
        navigate("/Login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };


  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Create an Account</h2>
        <p className="login-subtitle">
          Sign up to unlock exclusive travel deals and vouchers.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="login-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="login-submit-btn" type="submit">
            Sign Up
          </button>
        </form>

        <p className="login-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/Login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
