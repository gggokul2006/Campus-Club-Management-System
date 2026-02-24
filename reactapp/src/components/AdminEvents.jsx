import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";
import "./Events.css";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      alert("❌ Error deleting event: " + err.message);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return "⭐ No feedback";
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading events...</p>;

  // Pagination calculations
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  return (
    <div className="events-wrapper">
    <div className="events-page">
      <div className="events-header">
        <h1>📅 Manage Events</h1>
        <button
          className="btn-create-event"
          onClick={() => navigate("/create-event")}
        >
          + Create Event
        </button>
      </div>

      {currentEvents.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul className="event-list">
          {currentEvents.map((e) => (
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

          <div className="event-actions">
<button
className="btn-edit"
onClick={() =>
navigate("/create-event", { state: { event: e } })
}
>
Edit
</button>
<button
className="btn-delete"
onClick={() => handleDelete(e.id)}
>
Delete
</button>
</div>

{e.registeredUsers && e.registeredUsers.length > 0 && (
<div className="event-registered">
<strong>Registered Users & Feedback:</strong>
<ul>
{e.registeredUsers.map((u) => (
<li key={u}>
{u} - {renderStars(e.feedbacks?.[u])}
</li>
))}
</ul>
</div>
)}
</li>
))}
</ul>
)}

{totalPages > 1 && (
<div className="pagination">
<button
onClick={() => setCurrentPage(currentPage - 1)}
disabled={currentPage === 1}
>
Prev
</button>
<span>
Page {currentPage} of {totalPages}
</span>
<button
onClick={() => setCurrentPage(currentPage + 1)}
disabled={currentPage === totalPages}
>
Next
</button>
</div>
)}
</div>
</div>
);
};

export default AdminEvents;