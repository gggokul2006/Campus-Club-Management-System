// src/components/UserEvents.jsx
import React, { useEffect, useState } from "react";
import * as api from "../services/api";
import "./Events.css";

const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEvents = async () => {
    try {
      const data = await api.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await api.registerEvent(eventId, user.username);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, registeredUsers: [...(e.registeredUsers || []), user.username] }
            : e
        )
      );

setSuccessMsg("Registered successfully!");
setTimeout(() => setSuccessMsg(""), 3000);
} catch (err) {
setSuccessMsg("❌ Registration failed: " + err.message);
setTimeout(() => setSuccessMsg(""), 3000);
}
};

const handleFeedback = async (eventId) => {
const rating = feedbacks[eventId];
if (rating == null) return setSuccessMsg("Select a rating first!");

try {
await api.submitEventFeedback(eventId, user.username, rating);

setEvents((prev) =>
prev.map((e) =>
e.id === eventId
? {
...e,
feedbacks: { ...e.feedbacks, [user.username]: rating },
}
: e
)
);

setFeedbacks({ ...feedbacks, [eventId]: 0 });
setSuccessMsg("Feedback submitted!");
setTimeout(() => setSuccessMsg(""), 3000);
} catch (err) {
setSuccessMsg("❌ Feedback failed: " + err.message);
setTimeout(() => setSuccessMsg(""), 3000);
}
};

if (loading) return <p style={{ textAlign: "center" }}>Loading events...</p>;

// Pagination calculations
const indexOfLastEvent = currentPage * eventsPerPage;
const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
const totalPages = Math.ceil(events.length / eventsPerPage);

const handlePrevPage = () => {
if (currentPage > 1) setCurrentPage(currentPage - 1);
};

const handleNextPage = () => {
if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};

return (
  <div className="events-wrapper">
<div className="events-page">
<div className="events-header">
<h1>📅 Upcoming Events</h1>
</div>

{successMsg && <p className="success-msg">{successMsg}</p>}

{currentEvents.length === 0 ? (
<p>No events available.</p>
) : (
<ul className="event-list">
{currentEvents.map((e) => {
const registered = e.registeredUsers?.includes(user.username);
const userFeedback = e.feedbacks?.[user.username];

return (
<li key={e.id} className="event-card">
<h3>{e.eventName}</h3>
<p>
<strong>Date:</strong> {e.date}
</p>
<p>
<strong>Organizer:</strong> {e.organizer?.clubName || "Unknown"}
</p>
<p>
<strong>Status:</strong> {e.status || "Upcoming"}
</p>

{!registered && (
<button className="btn-register" onClick={() => handleRegister(e.id)}>
Register
</button>
)}

{registered && userFeedback ? (
<div className="feedback-container">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={`star ${userFeedback >= star ? "filled" : ""}`}>
★
</span>
))}
<span> ({userFeedback} / 5)</span>
</div>
) : registered ? (
<div className="feedback-container">
<span>Submit your feedback:</span>
{[1, 2, 3, 4, 5].map((star) => (
<span
key={star}
className={`star ${feedbacks[e.id] >= star ? "filled" : ""}`}
onClick={() => setFeedbacks({ ...feedbacks, [e.id]: star })}
>
★
</span>
))}
<button className="btn-feedback" onClick={() => handleFeedback(e.id)}>
Submit Feedback
</button>
</div>
) : null}
</li>
);
})}
</ul>
)}

{/* Pagination Controls */}
{totalPages > 1 && (
<div className="pagination">
<button onClick={handlePrevPage} disabled={currentPage === 1}>
Prev
</button>
<span>
Page {currentPage} of {totalPages}
</span>
<button onClick={handleNextPage} disabled={currentPage === totalPages}>
Next
</button>
</div>
)}
</div>
</div>
);
};

export default UserEvents;