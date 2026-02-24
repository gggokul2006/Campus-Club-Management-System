// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";

// Components
import Footer from "./components/Footer";
import Login from "./components/Login";
import ClubForm from "./components/ClubForm";
import Analytics from "./components/Analytics";
import MyMemberships from "./components/MyMemberships";
import CreateEvent from "./components/CreateEvent";

// Role-based home pages
import UserHome from "./components/UserHome";
import AdminHome from "./components/AdminHome";

// Role-based lists/events
import AdminClubList from "./components/AdminClubList";
import UserClubList from "./components/UserClubList";
import AdminEvents from "./components/AdminEvents";
import UserEvents from "./components/UserEvents";

// Role-based headers
import AdminHeader from "./components/AdminHeader";
import UserHeader from "./components/UserHeader";

// Admin Announcements
import AdminAnnouncements from "./components/AdminAnnouncements"; 
// make sure file exists with this exact name

import ManageUsers from "./components/ManageUsers";
import UserAchievements from "./components/UserAchievement"; 
import AddAchievement from "./components/AddAchievement"; // import at top

// Inside <Routes>

// import component

// Inside <Routes>




function ClubFormWrapper({ setRefreshFlag }) {
  const { id } = useParams();
  const editId = id ? Number(id) : null;
  return <ClubForm setRefreshFlag={setRefreshFlag} editId={editId} />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "USER";
  const navigate = useNavigate();

  return (
    <div className="app-root">
      {/* 🔹 Role-based Header */}
      {role === "ADMIN" ? (
        <AdminHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <UserHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}

<main className="container my-4">
<Routes>
{/* 🔹 Login */}
<Route
path="/login"
element={
isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />
}
/>

{/* 🔹 Home (role-based) */}
<Route
path="/"
element={
  isLoggedIn ? (
    role === "ADMIN" ? <AdminHome /> : <UserHome />
) : (
  <Navigate to="/login" />
  )
}
/>

{/* 🔹 Add club (Admin only) */}
<Route
path="/add-club"
element={
isLoggedIn && role === "ADMIN" ? (
  <ClubForm setRefreshFlag={setRefreshFlag} editId={null} />
  ) : (
<Navigate to="/" />
)
}
/>

{/* 🔹 Edit club (Admin only) */}
<Route
path="/edit-club/:id"
element={
isLoggedIn && role === "ADMIN" ? (
  <ClubFormWrapper setRefreshFlag={setRefreshFlag} />
  ) : (
    <Navigate to="/" />
)
}
/>

<Route
  path="/achievements"
  element={isLoggedIn && role === "USER" ? (
    <UserAchievements studentId={user.id} />
  ) : (
    <Navigate to="/login" />
  )}
/>
<Route
  path="/add-achievement"
  element={isLoggedIn && role === "ADMIN" ? (
    <AddAchievement />
  ) : (
    <Navigate to="/" />
  )}
/>
{/* 🔹 Club list (role-based) */}
<Route
path="/clubs"
element={
isLoggedIn ? (
  role === "ADMIN" ? (
    <AdminClubList refreshFlag={refreshFlag} />
    ) : (
      <UserClubList refreshFlag={refreshFlag} />
      )
) : (
  <Navigate to="/login" />
  )
}
/>

{/* 🔹 Analytics (Admin only) */}
<Route
path="/analytics"
element={
isLoggedIn && role === "ADMIN" ? <Analytics /> : <Navigate to="/" />
}
/>

{/* 🔹 Events (role-based) */}
<Route
path="/events"
element={
isLoggedIn ? (
role === "ADMIN" ? <AdminEvents /> : <UserEvents />
) : (
<Navigate to="/login" />
)
}
/>

{/* 🔹 Create event (Admin only) */}
<Route
path="/create-event"
element={
  isLoggedIn && role === "ADMIN" ? <CreateEvent /> : <Navigate to="/" />
}
/>

{/* 🔹 My Memberships (Users) */}
<Route
path="/profile"
element={isLoggedIn ? <MyMemberships /> : <Navigate to="/login" />}
/>

{/* 🔹 Admin Announcements */}
<Route
path="/admin-announcements"
element={isLoggedIn && role === "ADMIN" ? <AdminAnnouncements /> : <Navigate to="/" />}
/>

{/* 🔹 Fallback */}
<Route path="*" element={<Navigate to="/login" />} />


{/* 🔹 Manage Users (Admin only) */}
<Route
  path="/users"
  element={
    isLoggedIn && role === "ADMIN" ? <ManageUsers /> : <Navigate to="/" />
  }
/>

</Routes>
</main>

<Footer />
</div>
);
}

export default App;