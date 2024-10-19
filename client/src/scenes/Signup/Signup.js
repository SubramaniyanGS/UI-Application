import React, { useState } from "react"  // For password hashing
import { Link, useNavigate } from "react-router-dom";  // Import Link and useNavigate
import "./Signup.css";  // Import the external CSS

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("admin"); // Default role is 'admin'
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();  // Hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
  
    try {
  
      // Prepare the user data to be sent to the backend
      const userData = {
        name,
        email,
        password, // Send the hashed password
        phoneNumber,
        role,
      };
  
      // Send the user data to the backend API using fetch
      const response = await fetch("http://localhost:5001/api/general/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      // Parse the response
      const data = await response.json();
  
      if (response.ok) {
        // If the response is OK, redirect to the login page
        console.log("Signup successful:", data);
        navigate("/login");  // Programmatically navigate to the login page
      } else {
        // If there's an error, set the error message to display
        setErrorMessage(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      // Handle network errors or other unforeseen errors
      setErrorMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-card">
      <h2 className="signup-heading">Signup</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="signup-input"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="signup-input">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="signup-button">Signup</button>
      </form>

      {/* Link to the Login page */}
      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
