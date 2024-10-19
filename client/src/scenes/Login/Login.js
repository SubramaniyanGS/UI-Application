import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";  // Import the external CSS

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before login attempt

    try {
      const response = await fetch("http://localhost:5001/api/general/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Check for CORS or Network issues first
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage("User doesn't exist.");
        } else if (response.status === 400) {
          setErrorMessage("Invalid credentials.");
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
        return;
      }

      const data = await response.json();

      // Handle success
      console.log("Login successful:", data);
      localStorage.setItem('token', data.token);
      navigate("/dashboard"); // Navigate to dashboard on successful login
    } catch (error) {
      // Handle any network or unexpected errors
      setErrorMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-heading">Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>

      {/* Link to the Signup page */}
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
    </div>
  );
}

export default Login;
