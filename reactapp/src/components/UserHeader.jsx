// src/components/UserHeader.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as api from "../services/api";
import "./Header.css";

const UserHeader = ({ isLoggedIn, setIsLoggedIn }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [username, setUsername] = useState("User");
  const [newCount, setNewCount] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.getAnnouncements();
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAnnouncements(sorted);

      // ✅ Count new announcements since last visit
      const lastVisit = localStorage.getItem("lastAnnouncementCheck");
      if (lastVisit) {
        const count = sorted.filter(
          (a) => new Date(a.createdAt) > new Date(lastVisit)
        ).length;
        setNewCount(count);
      } else {
        setNewCount(sorted.length);
      }
    } catch (err) {
      console.error("❌ Error fetching announcements:", err);
    }
  };

  // ✅ Run when logged in or user info changes
  useEffect(() => {
    if (user && user.username) {
      setUsername(user.username);
      fetchAnnouncements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]); // Ignore 'user' dependency intentionally

  // ✅ Optional: Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnnouncements();
    }, 15000);
    return () => clearInterval(interval);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowMenu(false);
    navigate("/login");
  };

  // ✅ Student navigation links
  const studentLinks = [
    { path: "/", label: "Home" },
    { path: "/clubs", label: "Club List" },
    { path: "/profile", label: "My Clubs" },
    { path: "/events", label: "Events" },
    { path: "/achievements", label: "Achievements" },
  ];

  const handleBellClick = () => {
    setShowAnnouncements(!showAnnouncements);
    setNewCount(0);
    localStorage.setItem("lastAnnouncementCheck", new Date().toISOString());
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand">
          <div className="logo">CC</div>
          <div className="brand-text">
            <div className="bold">Campus Club Management System</div>
            <div className="tag">discover | join | connect | grow</div>
          </div>
        </div>

        {/* Navigation */}
        {isLoggedIn && (
          <nav className="navbar">
            {studentLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}


        <div className="auth-buttons">
          {isLoggedIn && (
            <>
              {/* Announcements Bell */}
              <div className="notif-wrapper">
                <div className="notif-bell" onClick={handleBellClick}>
                  📢
                  {newCount > 0 && <span className="notif-dot"></span>}
                </div>
                {showAnnouncements && (
                  <div className="notif-dropdown">
                    {announcements.length === 0 ? (
                      <div className="notif-empty">No announcements</div>
                    ) : (
                      announcements.slice(0, 5).map((a) => (
                        <div key={a.id} className="notif-item">
                          <div className="font-semibold">{a.title}</div>
                          <div>{a.message}</div>
                          <div className="notif-time">
                            {new Date(a.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="user-menu">
                <div
                  className="user-circle"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  {username.charAt(0).toUpperCase()}
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
