import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api"; // Only these two
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("user");
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isRegister) {
        // Pass role dynamically
        const role = activeForm === "admin" ? "ADMIN" : "USER";
        await registerUser({ username: name, email, password, role });

        setMessage("Registered successfully! Please login.");
        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        const res = await loginUser({ email, password });

        if (res.message === "Login successful") {
          const { role } = res;
          localStorage.setItem("user", JSON.stringify({ email, role }));
          setIsLoggedIn(true);
          navigate(role === "ADMIN" ? "/admin/dashboard" : "/");
        } else {
          setMessage(res.error || "Login failed");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Server error. Please try again.");
    }
  };

  const renderForm = (type) => {
    if (activeForm !== type) return null;
    return (
      <div className="login-card">
        <h2>Login Page</h2>
        <div className="login-toggle">
          <button type="button" className={!isRegister ? "active" : ""} onClick={() => setIsRegister(false)}>
            Login
          </button>
          <button type="button" className={isRegister ? "active" : ""} onClick={() => setIsRegister(true)}>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="  Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="  Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="  Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegister ? "Register" : "Login"}</button>
        </form>
        {message && <div className="login-message">{message}</div>}
      </div>
    );
  };

  return (
    <div className="login-page">
     
      <div className="login-container">
        {renderForm("user")}
        {renderForm("admin")}
      </div>
    </div>
  );
};

export default Login;
