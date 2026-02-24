import React, { useEffect, useState } from "react";
import * as api from "../services/api";
import "./MyMembership.css";

const MyMemberships = () => {
  const [myClubs, setMyClubs] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // page-ku 3 clubs

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  // Fetch user's memberships
  const fetchMyClubs = async () => {
    try {
      const data = await api.getUserMemberships(username);
      setMyClubs(Array.isArray(data) ? data : data.data);
      setError("");
    } catch (err) {
      setError(err.message || "❌ Failed to load memberships");
    }
  };

useEffect(() => {
fetchMyClubs();
}, []);

// Leave club (toggle via backend)
const handleLeave = async (id) => {
if (!window.confirm("Are you sure you want to leave this club?")) return;

try {
const result = await api.joinClub(id, username); // toggles join/leave
alert(typeof result === "string" ? result : "✅ Successfully left the club!");
await fetchMyClubs(); // refresh list
} catch (err) {
alert("❌ Error leaving club: " + err.message);
}
};

// Pagination calculations
const totalPages = Math.ceil(myClubs.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentClubs = myClubs.slice(startIndex, endIndex);

return (
<div className="membership-page">
<h1>🏛️My Clubs</h1>

{error && <div className="error">[Error - You need to specify the message]</div>}

{myClubs.length > 0 ? (
<>
<ul className="membership-list">
{currentClubs.map((club) => (
<li key={club.id} className="membership-card">
<h3>{club.clubName}</h3>
<p><strong>Category:</strong> {club.category}</p>
<p><strong>Members:</strong> {club.memberCount}</p>
<p>{club.description}</p>
<button
className="leave-btn"
onClick={() => handleLeave(club.id)}
>
Leave Club
</button>
</li>
))}
</ul>

{/* Pagination Controls */}
<div className="pagination">
<button
disabled={currentPage === 1}
onClick={() => setCurrentPage(currentPage - 1)}
>
◀ Previous
</button>

<span>
Page {currentPage} of {totalPages}
</span>

<button
disabled={currentPage === totalPages}
onClick={() => setCurrentPage(currentPage + 1)}
>
Next ▶
</button>
</div>
</>
) : (
<p style={{ textAlign: "center", marginTop: "20px", color: "#555" }}>
You have not joined any clubs yet.
</p>
)}
</div>
);
};

export default MyMemberships;