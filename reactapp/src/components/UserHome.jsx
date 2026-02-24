// src/components/UserHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllClubs, getAllEvents, getUserMemberships } from "../services/api";
import "./Home.css";

// Chart imports
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserHome = () => {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.username || user?.email;

  const [allClubs, allEvents, membershipsResponse] = await Promise.all([
    getAllClubs(),
    getAllEvents(),
    getUserMemberships(userEmail),
  ]);

  setClubs(allClubs || []);
  setEvents(allEvents || []);

  console.log("🟢 Memberships API Response:", membershipsResponse);

  // Flexible parsing (handles all cases)
  const membershipsArray =
    membershipsResponse?.data?.memberships ||
    membershipsResponse?.data ||
    membershipsResponse ||
    [];

  setMyClubs(Array.isArray(membershipsArray) ? membershipsArray : []);
} catch (err) {
  console.error("Failed to fetch data:", err);
  setClubs([]);
  setEvents([]);
  setMyClubs([]);
} finally {
  setLoading(false);
}

    };

fetchData();
}, []);

if (loading)
return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

const totalJoined = myClubs.length;
const upcomingEventsCount = events.length;
const activeClubsCount = clubs.filter((c) => c.status === "Active").length;

const categories = ["All", ...new Set(clubs.map((c) => c.category))];

// ✅ Filter + Search + Sort
const filteredClubs = clubs
.filter(
(club) =>
(selectedCategory === "All" || club.category === selectedCategory) &&
(club.clubName.toLowerCase().includes(searchText.toLowerCase()) ||
club.category.toLowerCase().includes(searchText.toLowerCase()))
)
.sort((a, b) => {
const nameA = a.clubName.toLowerCase();
const nameB = b.clubName.toLowerCase();
return sortOrder === "asc"
? nameA.localeCompare(nameB)
: nameB.localeCompare(nameA);
});

// ✅ Charts
const pieData = {
labels: ["Joined", "Available"],
datasets: [
{
data: [totalJoined, clubs.length - totalJoined],
backgroundColor: ["#3b82f6", "#10b981"],
},
],
};

const lineData = {
labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
datasets: [
{
label: "Events Attended",
data: [1, 2, 1, 3],
borderColor: "#f43f5e",
backgroundColor: "#f43f5e33",
},
],
};

const categoryCounts = clubs.reduce((acc, club) => {
acc[club.category] = (acc[club.category] || 0) + 1;
return acc;
}, {});

const barData = {
labels: Object.keys(categoryCounts),
datasets: [
{
label: "Clubs per Category",
data: Object.values(categoryCounts),
backgroundColor: "#f59e0b",
},
],
};

return (
<div className="home-container">
{/* ================= Hero + Stats ================= */}
<div className="hero-stats-wrapper">
<section className="hero">
<h1>Welcome Student 👩‍🎓</h1>
<p>Discover clubs, join activities, and track your engagement.</p>
<div className="hero-buttons">
<Link to="/clubs" className="btn-primary">
🔍 Explore Clubs
</Link>
<Link to="/events" className="btn-secondary">
📅 View Events
</Link>
</div>
</section>

<section className="stats">
<div className="card">
<h2>{totalJoined}</h2>
<p>My Clubs</p>
</div>
<div className="card">
<h2>{activeClubsCount}</h2>
<p>Active Clubs</p>
</div>
<div className="card">
<h2>{upcomingEventsCount}</h2>
<p>Upcoming Events</p>
</div>
</section>
</div>

{/* ================= Quick Access ================= */}
<section className="quick-actions">
<h2>🚀 Quick Access</h2>
<div className="actions-grid">
<Link to="/clubs" className="action-card">
📋 View All Clubs
</Link>
<Link to="/events" className="action-card">
📅 Upcoming Events
</Link>
<Link to="/profile" className="action-card">
👤 My Memberships
</Link>
</div>
</section>

{/* ================= Charts ================= */}
<section className="charts-section">
<h2>📊 Overview</h2>
<div className="chart-row">
<div className="chart-container">
<Pie data={pieData} />
</div>
<div className="chart-container">
<Line data={lineData} />
</div>
<div className="chart-container">
<Bar data={barData} />
</div>
</div>
</section>

{/* ================= Club Search + Filter ================= */}
<section className="club-search">
<h2>📋 Clubs</h2>
<div className="filter-search-row">
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

<select
value={sortOrder}
onChange={(e) => setSortOrder(e.target.value)}
className="filter-dropdown"
>
<option value="asc">⬆️ A → Z</option>
<option value="desc">⬇️ Z → A</option>
</select>

<input
type="text"
placeholder="🔍 Search by name or category..."
value={searchText}
onChange={(e) => setSearchText(e.target.value)}
className="search-input"
/>
</div>
</section>

{/* ================= Filtered Clubs ================= */}
<section className="recent-clubs">
{filteredClubs.length === 0 ? (
<p>No clubs found.</p>
) : (
<ul>
{filteredClubs.slice(0, 4).map((club) => (
<li key={club.id}>
<strong>{club.clubName}</strong> ({club.category})
</li>
))}
</ul>
)}
</section>

{/* ================= Upcoming Events ================= */}
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

export default UserHome;