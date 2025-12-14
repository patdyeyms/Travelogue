import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logging in with email: ${email}`);
    // Your API call can go here
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
          <button className="login-submit-btn" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
