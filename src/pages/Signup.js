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

  const handleSubmit = (e) => {
    e.preventDefault();
    // temporary success
    navigate("/Login");
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
