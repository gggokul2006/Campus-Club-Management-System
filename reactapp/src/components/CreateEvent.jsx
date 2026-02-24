import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import "./CreateEvent.css";

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingEvent = location.state?.event || null;

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    date: "",
    status: "Upcoming",
    organizerId: 0,
  });

  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState("");

  // Fetch all clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await api.getAllClubs();
        setClubs(Array.isArray(data) ? data : data.data);
      } catch (err) {
        console.error("Failed to load clubs", err);
      }
    };
    fetchClubs();
  }, []);

  // Pre-fill form if editing
  useEffect(() => {
    if (editingEvent) {
      setForm({
        eventName: editingEvent.eventName || "",
        description: editingEvent.description || "",
        date: editingEvent.date || "",
        status: editingEvent.status || "Upcoming",
        organizerId: editingEvent.organizer?.id || 0,
      });
    }
  }, [editingEvent]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.organizerId) {
      setError("Please select a club as organizer");
      return;
    }

    try {
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, form);
        alert("✅ Event updated successfully!");
      } else {
        await api.addEvent(form);
        alert("✅ Event created successfully!");
      }

      navigate("/admin-events");
    } catch (err) {
      setError(err.message || "Failed to save event");
    }
  };

  
return (
<div className="create-event-page">
<div className="create-event-card">
<h1>{editingEvent ? "✏️ Edit Event" : "➕ Create Event"}</h1>

{error && <div className="error">⚠️ [Error - You need to specify the message]</div>}

<form onSubmit={handleSubmit} className="create-event-form">
<input
type="text"
name="eventName"
placeholder="Event Name"
value={form.eventName}
onChange={handleChange}
required
/>

<textarea
name="description"
placeholder="Description"
value={form.description}
onChange={handleChange}
required
/>

<input
type="date"
name="date"
value={form.date}
onChange={handleChange}
required
/>

<select name="status" value={form.status} onChange={handleChange}>
<option value="Upcoming">Upcoming</option>
<option value="Completed">Completed</option>
</select>

<select
name="organizerId"
value={form.organizerId}
onChange={handleChange}
required
>
<option value={0}>Select Organizer Club</option>
{clubs.map((club) => (
<option key={club.id} value={club.id}>
{club.clubName}
</option>
))}
</select>

<button type="submit" className="btn-create">
{editingEvent ? "Update Event" : "Create Event"}
</button>
</form>
</div>
</div>
);
};

export default CreateEvent;