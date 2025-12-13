import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/travelogue-api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/Itinerary");
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
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">
          Log in to access your personalized offers and itineraries.
        </p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-submit-btn" type="submit">
            Login
          </button>
        </form>

        <p className="login-switch">
          New to Travelogue?{" "}
          <span onClick={() => navigate("/Signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
