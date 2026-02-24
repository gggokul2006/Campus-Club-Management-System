// src/components/AdminHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllClubs, getAllEvents } from "../services/api";
import "./Home.css";

// Chart imports
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminHome = () => {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc"); // ✅ new state for sorting

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubsData = await getAllClubs();
        setClubs(clubsData);

        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );

  const totalClubs = clubs.length;
  const activeClubs = clubs.filter((c) => c.status === "Active").length;
  const upcomingEventsCount = events.length;

  // ✅ Unique category list for filter
  const categories = ["All", ...new Set(clubs.map((club) => club.category))];

  // ✅ Filter + Search + Sort
  const filteredClubs = clubs
    .filter(
      (club) =>
        (selectedCategory === "All" || club.category === selectedCategory) &&
        (club.clubName.toLowerCase().includes(searchText.toLowerCase()) ||
          club.category.toLowerCase().includes(searchText.toLowerCase()))
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.clubName.localeCompare(b.clubName)
        : b.clubName.localeCompare(a.clubName)
    );

// Chart data
const pieData = {
labels: ["Active", "Pending"],
datasets: [
{
label: "Club Status",
data: [activeClubs, totalClubs - activeClubs],
backgroundColor: ["#10b981", "#f97316"],
},
],
};

const barData = {
labels: ["Jan", "Feb", "Mar", "Apr"],
datasets: [
{
label: "Events per Month",
data: [2, 4, 1, 3],
backgroundColor: "#3b82f6",
},
],
};

const lineData = {
labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
datasets: [
{
label: "New Members",
data: [1, 3, 2, 4],
borderColor: "#f43f5e",
backgroundColor: "#f43f5e33",
},
],
};

return (
<div className="home-container">
{/* Hero */}
<div className="hero-stats-wrapper">
  <div className="home-container-inner"></div>
<section className="hero">
<h1>Welcome Admin 👨‍💼</h1>
<p>Manage clubs, members, and oversee campus activities.</p>
<div className="hero-buttons">
<Link to="/add-club" className="btn-primary">
➕ Add Club
</Link>
<Link to="/analytics" className="btn-secondary">
📊 View Reports
</Link>
<Link to="/admin-announcements" className="btn-secondary">
📢 Add Announcement
</Link>
</div>
</section>

{/* Stats */}
<section className="stats">
<div className="card">
<h2>{totalClubs}</h2>
<p>Total Clubs</p>
</div>
<div className="card">
<h2>{activeClubs}</h2>
<p>Active Clubs</p>
</div>
<div className="card">
<h2>{upcomingEventsCount}</h2>
<p>Upcoming Events</p>
</div>
</section>
</div>

{/* Quick Actions */}
<section className="quick-actions">
  <h2>🚀 Admin Quick Actions</h2>
  <div className="actions-grid">
    <Link to="/add-club" className="action-card">
      ➕ Add Club
    </Link>
    <Link to="/clubs" className="action-card">
      📋 Manage Clubs
    </Link>
    <Link to="/analytics" className="action-card">
      📊 Analytics
    </Link>
    <Link to="/events" className="action-card">
      📅 Manage Events
    </Link>
    <Link to="/users" className="action-card">
      👥 Manage Users
    </Link>
    {/* ✅ Add Achievement button */}
    <Link to="/add-achievement" className="action-card">
      🏆 Add Achievement
    </Link>
  </div>
</section>

{/* Charts */}
<section className="charts-section">
<h2>📊 Analytics Overview</h2>
<div className="chart-row">
<div className="chart-container">
<Pie data={pieData} />
</div>
<div className="chart-container">
<Bar data={barData} />
</div>
<div className="chart-container">
<Line data={lineData} />
</div>
</div>
</section>

{/* Club Search + Filter + Sort */}
<section className="club-search">
<h2>📋 Clubs</h2>

<div className="filter-search-row">
{/* ✅ Filter Dropdown */}
<select
value={selectedCategory}
onChange={(e) => setSelectedCategory(e.target.value)}
className="filter-dropdown"
>
{categories.map((cat) => (
<option key={cat} value={cat}>
{cat}
</option>
))}
</select>

{/* ✅ Sorting Dropdown */}
<select
value={sortOrder}
onChange={(e) => setSortOrder(e.target.value)}
className="filter-dropdown"
>
<option value="asc">🔼 Sort A–Z</option>
<option value="desc">🔽 Sort Z–A</option>
</select>

{/* Existing Search Bar */}
<input
type="text"
placeholder="🔍 Search by name or category..."
value={searchText}
onChange={(e) => setSearchText(e.target.value)}
className="search-input"
/>
</div>
</section>

{/* Filtered Clubs */}
<section className="recent-clubs">
{filteredClubs.length === 0 ? (
<p>No clubs found.</p>
) : (
<ul>
{filteredClubs.slice(0, 4).map((club) => (
<li key={club.id}>
<span className="club-name">{club.clubName}</span>
<span className="category">{club.category}</span>
</li>
))}
</ul>
)}
</section>

{/* Upcoming Events */}
<section className="events">
<h2>📅 Upcoming Events</h2>
{events.length === 0 ? (
<p>No upcoming events</p>
) : (
<ul>
{events.slice(0, 4).map((e) => (
<li key={e.id}>
<strong>{e.eventName}</strong> – {e.date} (
{e.organizer?.clubName || "Unknown Club"})
</li>
))}
</ul>
)}
</section>
</div>
);
};

export default AdminHome;