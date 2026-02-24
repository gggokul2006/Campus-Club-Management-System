import React, { useEffect, useState } from "react";
import { getAllUsers } from "../services/api";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of users per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>👥 Manage Users</h1>
        <input
          type="text"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          style={{ marginTop: "10px", padding: "5px", width: "250px" }}
        />
      </div>


{loading ? (
<p>Loading users...</p>
) : error ? (
<p className="error-text">[Error - You need to specify the message]</p>
) : filteredUsers.length === 0 ? (
<p>No users found.</p>
) : (
<>
<div className="table-responsive">
<table className="users-table">
<thead>
<tr>
<th>#</th>
<th>Username</th>
<th>Email</th>
<th>Role</th>
</tr>
</thead>
<tbody>
{currentUsers.map((user, index) => (
<tr key={user.id}>
<td>{startIndex + index + 1}</td>
<td>{user.username}</td>
<td>{user.email}</td>
<td>
<span className={`role-badge ${user.role.toLowerCase()}`}>
{user.role}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>

{/* Pagination Controls */}
<div className="pagination">
<button onClick={handlePrevPage} disabled={currentPage === 1}>
◀ Prev
</button>
<span>
Page {currentPage} of {totalPages}
</span>
<button onClick={handleNextPage} disabled={currentPage === totalPages}>
Next ▶
</button>
</div>
</>
)}
</div>
);
};

export default ManageUsers;