// src/components/AdminHeader.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

const AdminHeader = ({ isLoggedIn, setIsLoggedIn }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState("Admin");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      // Fallback to username, then email, then "Admin"
      setUsername(currentUser.username || currentUser.email || "Admin");
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand">
          <div className="logo">CC</div>
          <div className="brand-text">
            <div className="bold">Campus Club Management System</div>
            <div className="tag">manage | monitor | lead student organizations</div>
          </div>
        </div>

        {/* Navigation */}
        {isLoggedIn && (
          <nav className="navbar">
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
            <NavLink to="/add-club" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Add Club</NavLink>
            <NavLink to="/create-event" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Add Event</NavLink>
            <NavLink to="/clubs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Club List</NavLink>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Reports</NavLink>
            <NavLink to="/events" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Events</NavLink>
          </nav>
        )}


        {/* User Menu */}
        <div className="auth-buttons">
          {isLoggedIn && (
            <div className="user-menu">
              <div
                className="user-circle"
                onClick={() => setShowMenu(!showMenu)}
              >
                {username?.charAt(0).toUpperCase() || "A"}
              </div>
              {showMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-item">{username}</div>
                  <button className="btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
