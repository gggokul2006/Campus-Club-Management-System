// src/components/AdminClubList.jsx
import React, { useEffect, useState } from "react";
import * as api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ClubList.css";

const AdminClubList = ({ refreshFlag }) => {
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortField, setSortField] = useState("clubName");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchClubs = async () => {
    try {
      const data = await api.getAllClubs();
      setClubs(Array.isArray(data) ? data : data.data);
      setError("");
    } catch (err) {
      setError(err.message || "❌ Failed to load clubs");
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [refreshFlag]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    try {
      await api.deleteClub(id);
      fetchClubs();
    } catch (err) {
      alert("❌ Error deleting club: " + err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-club/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extract unique categories
  const categories = ["All", ...new Set(clubs.map((club) => club.category))];

  // Filter by category
  const filteredClubs =
    selectedCategory === "All"
      ? clubs
      : clubs.filter((club) => club.category === selectedCategory);

  // Sort logic
  const sortedClubs = [...filteredClubs].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
    if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentClubs = sortedClubs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedClubs.length / itemsPerPage);

const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

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
<h2>🏛️ Manage Clubs</h2>
{error && <div className="error">[Error - [Error - You need to specify the message]]</div>}

{/* Filter + Sorting Section */}
<div className="filter-container">
<label htmlFor="categoryFilter">Filter by Category:</label>
<select
id="categoryFilter"
value={selectedCategory}
onChange={handleCategoryChange}
>
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

{/* Table */}
<table className="club-table">
<thead>
<tr>
<th>Club Name</th>
<th>Category</th>
<th>President Email</th>
<th>Member Count</th>
<th>Established Date</th>
<th>Description</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{currentClubs.length > 0 ? (
currentClubs.map((club) => (
<tr key={club.id}>
<td>{club.clubName}</td>
<td>{club.category}</td>
<td>{club.presidentEmail}</td>
<td>{club.memberCount}</td>
<td>{club.establishedDate}</td>
<td>{club.description}</td>
<td>{club.status}</td>
<td>
<button className="edit-btn" onClick={() => handleEdit(club.id)}>
Edit
</button>
<button className="delete-btn" onClick={() => handleDelete(club.id)}>
Delete
</button>
</td>
</tr>
))
) : (
<tr>
<td colSpan={8} style={{ textAlign: "center" }}>
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
Previous
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
Next
</button>
</div>
)}
</div>
);
};

export default AdminClubList;