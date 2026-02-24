// src/components/UserClubList.jsx
import React, { useEffect, useState, useCallback } from "react";
import * as api from "../services/api";
import "./ClubList.css";

const UserClubList = ({ refreshFlag }) => {
  const [clubs, setClubs] = useState([]);
  const [userMemberships, setUserMemberships] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortField, setSortField] = useState("clubName");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all clubs
  const fetchClubs = useCallback(async () => {
    try {
      const data = await api.getAllClubs();
      setClubs(Array.isArray(data) ? data : data.data);
      setError("");
    } catch (err) {
      setError(err.message || "❌ Failed to load clubs");
    }
  }, []);

  // Fetch user memberships
  const fetchUserMemberships = useCallback(async () => {
    try {
      const memberships = await api.getUserMemberships(user.username);
      setUserMemberships(Array.isArray(memberships) ? memberships : memberships.data);
    } catch (err) {
      console.error("Failed to fetch memberships:", err);
    }
  }, [user.username]);

  // Initial fetch + refreshFlag
  useEffect(() => {
    fetchClubs();
    fetchUserMemberships();
  }, [refreshFlag, fetchClubs, fetchUserMemberships]);

  // Join club + add announcement
  const handleJoinToggle = async (clubId) => {
    try {
      await api.joinClub(clubId, user.username);
      await api.addAnnouncement({
        message: `🎉 ${user.username} joined the club with ID: ${clubId}`,
        createdAt: new Date().toISOString(),
      });

    const memberships = await api.getUserMemberships(user.username);
setUserMemberships(Array.isArray(memberships) ? memberships : memberships.data);

alert("✅ Joined club and announcement added");
} catch (err) {
console.error(err);
alert("❌ Error joining club: " + err.message);
}
};

// Extract unique categories for filter dropdown
const categories = ["All", ...new Set(clubs.map((club) => club.category))];

// Filter clubs by category
const filteredClubs =
selectedCategory === "All"
? clubs
: clubs.filter((club) => club.category === selectedCategory);

// Sort clubs
const sortedClubs = [...filteredClubs].sort((a, b) => {
let fieldA = a[sortField];
let fieldB = b[sortField];

if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();

if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
return 0;
});

// Pagination calculations
const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentClubs = sortedClubs.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(sortedClubs.length / itemsPerPage);

const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

const handleCategoryChange = (e) => {
setSelectedCategory(e.target.value);
setCurrentPage(1);
};

const handleSortFieldChange = (e) => {
setSortField(e.target.value);
setCurrentPage(1);
};

const handleSortOrderChange = (e) => {
setSortOrder(e.target.value);
setCurrentPage(1);
};

return (
<div className="club-list-container">
<h2>🏛️ Available Clubs</h2>
{error && <div className="error">[Error - [Error - You need to specify the message]]</div>}

{/* Filters and Sorting */}
<div className="filter-container">
<label htmlFor="categoryFilter">Filter by Category:</label>
<select id="categoryFilter" value={selectedCategory} onChange={handleCategoryChange}>
{categories.map((cat) => (
<option key={cat} value={cat}>
{cat}
</option>
))}
</select>

<label htmlFor="sortField" style={{ marginLeft: "15px" }}>
Sort by:
</label>
<select id="sortField" value={sortField} onChange={handleSortFieldChange}>
<option value="clubName">Club Name</option>
<option value="memberCount">Member Count</option>
</select>

<select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
<option value="asc">⬆ Ascending</option>
<option value="desc">⬇ Descending</option>
</select>
</div>

{/* Club Table */}
<table className="club-table">
<thead>
<tr>
<th>Club Name</th>
<th>Category</th>
<th>Member Count</th>
<th>Description</th>
<th>Action</th>
</tr>
</thead>
<tbody>
{currentClubs.length > 0 ? (
currentClubs.map((club) => {
const joined = userMemberships.some((c) => c.id === club.id);
return (
<tr key={club.id}>
<td>{club.clubName}</td>
<td>{club.category}</td>
<td>{club.memberCount}</td>
<td>{club.description}</td>
<td>
<button
className={joined ? "joined-btn" : "join-btn"}
onClick={() => handleJoinToggle(club.id)}
disabled={joined}
>
{joined ? "Joined" : "Join"}
</button>
</td>
</tr>
);
})
) : (
<tr>
<td colSpan={5} style={{ textAlign: "center" }}>
No clubs available
</td>
</tr>
)}
</tbody>
</table>

{/* Pagination */}
{totalPages > 1 && (
<div className="pagination">
<button onClick={handlePrev} disabled={currentPage === 1}>
&laquo; Prev
</button>
{Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
<button
key={number}
onClick={() => setCurrentPage(number)}
className={currentPage === number ? "active-page" : ""}
>
{number}
</button>
))}
<button onClick={handleNext} disabled={currentPage === totalPages}>
Next &raquo;
</button>
</div>
)}
</div>
);
};

export default UserClubList;