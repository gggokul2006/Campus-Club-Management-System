// src/components/AdminAnnouncements.jsx
import React, { useState, useEffect } from "react";
import "./AdminAnnouncements.css";

const AdminAnnouncements = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [success, setSuccess] = useState(false);

  // Fetch announcement history
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(
          "https://8080-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/announcements"
        );
        const data = await res.json();
        setAnnouncements(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://8080-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/announcements",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, message }),
        }
      );
      const newAnnouncement = await res.json();
      setTitle("");
      setMessage("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // Add new announcement to top of list
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    } catch (err) {
      console.error("Failed to post announcement:", err);
    }
  };


return (
<div className="admin-announcements-container">
<form onSubmit={handleSubmit} className="announcement-form">
<h2>➕ Add Announcement</h2>
{success && <div className="alert-success">Announcement posted!</div>}

<input
type="text"
placeholder="Title"
value={title}
onChange={(e) => setTitle(e.target.value)}
required
/>
<textarea
placeholder="Message"
value={message}
onChange={(e) => setMessage(e.target.value)}
rows={4}
required
/>
<button type="submit">Post Announcement</button>
</form>

{/* Announcement history */}
<div className="announcement-history">
<h2>📢 Announcement History</h2>
{announcements.length === 0 ? (
<p>No announcements yet.</p>
) : (
<ul>
{announcements.map((a) => (
<li key={a.id} className="announcement-item">
<h3>{a.title}</h3>
<p>{a.message}</p>
<small>{new Date(a.createdAt).toLocaleString()}</small>
</li>
))}
</ul>
)}
</div>
</div>
);
};

export default AdminAnnouncements;