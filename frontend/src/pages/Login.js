import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost/travelogue-api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess("Account created successfully! Logging you in...");
        setTimeout(() => {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("isLoggedIn", "true");
          window.dispatchEvent(new Event("storage"));
          navigate(-1);
        }, 1500);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost/travelogue-api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        window.dispatchEvent(new Event("storage"));
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate(-1), 1000);
      } else {
        if (data.message === "Email not registered") {
          const confirmRegister = window.confirm(
            "Email not registered. Do you want to create an account?"
          );
          if (confirmRegister) {
            handleRegister();
          } else {
            setLoading(false);
          }
        } else {
          setError(data.message || "Login failed. Please check your credentials.");
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server. Please try again later.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("Google Sign-In coming soon!");
  };

  const handleFacebookLogin = () => {
    setError("Facebook Login coming soon!");
  };

  const handleAppleLogin = () => {
    setError("Apple Sign-In coming soon!");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Sign in or create an account</h2>
        <p className="login-subtitle">
          Sign up for free or log in to access amazing deals and benefits!
        </p>

        {/* Error Message */}
        {error && <div className="error-message" role="alert">{error}</div>}

        {/* Success Message */}
        {success && <div className="success-message" role="alert">{success}</div>}

        {/* Social Login */}
        <div className="social-login">
          <button 
            className="social-btn google" 
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
            aria-label="Sign in with Google"
          >
            <FaGoogle className="social-icon" />
            <span>Sign in with Google</span>
          </button>
          <button 
            className="social-btn facebook" 
            onClick={handleFacebookLogin}
            disabled={loading}
            type="button"
            aria-label="Sign in with Facebook"
          >
            <FaFacebookF className="social-icon" />
            <span>Sign in with Facebook</span>
          </button>
          <button 
            className="social-btn apple" 
            onClick={handleAppleLogin}
            disabled={loading}
            type="button"
            aria-label="Sign in with Apple"
          >
            <FaApple className="social-icon" />
            <span>Sign in with Apple</span>
          </button>
        </div>

        <div className="divider">or</div>

        {/* Email Login */}
        <form className="login-form" onSubmit={handleLogin} noValidate>
          <input
            type="email"
            placeholder="id@email.com"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
            name="email"
            id="login-email"
            aria-label="Email address"
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
            name="password"
            id="login-password"
            aria-label="Password"
          />
          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>
          <button 
            className={`login-submit-btn ${loading ? "loading" : ""}`}
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default React.memo(Login);