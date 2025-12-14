import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost/travelogue-api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        navigate(-1); // Go back to previous page
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

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
        alert("Login successful!");
        navigate(-1); // Go back to previous page
      } else {
        if (data.message === "Email not registered") {
          const confirmRegister = window.confirm(
            "Email not registered. Do you want to create an account?"
          );
          if (confirmRegister) {
            handleRegister();
          }
        } else {
          alert(data.message);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Sign in or create an account</h2>
        <p className="login-subtitle">
          Sign up for free or log in to access amazing deals and benefits!
        </p>

        {/* Social Login */}
        <div className="social-login">
          <button className="social-btn google">
            <FaGoogle className="social-icon" /> Sign in with Google
          </button>
          <button className="social-btn facebook">
            <FaFacebookF className="social-icon" /> Sign in with Facebook
          </button>
          <button className="social-btn apple">
            <FaApple className="social-icon" /> Sign in with Apple
          </button>
        </div>

        <div className="divider">or</div>

        {/* Email Login */}
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="id@email.com"
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
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
