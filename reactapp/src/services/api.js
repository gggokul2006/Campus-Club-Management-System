import axios from "axios";
// =====================================
// Club API
// =====================================
const API_BASE = "https://8080-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/api/clubs";

export async function getAllClubs() {
  const res = await fetch(`${API_BASE}/allClubs`);
  if (!res.ok) throw new Error("Failed to fetch clubs");
  return res.json();
}

export async function joinClub(clubId, userEmail) {
  const res = await fetch(`${API_BASE}/join/${clubId}?userEmail=${userEmail}`, { method: "PUT" });

  if (!res.ok) {
    // Try parse body for error message
    let errorMsg;
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        errorMsg = data?.message || "Failed to join/leave club";
      } else {
        errorMsg = await res.text();
      }
    } catch {
      errorMsg = "Failed to join/leave club";
    }
    throw new Error(errorMsg);
  }

  // Success, return empty object if no data
  try {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
  } catch {}
  return {}; // fallback empty
}

export async function getClubById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch club by id");
  return res.json();
}

export async function addClub(club) {
  const res = await fetch(`${API_BASE}/addClub`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(club),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add club");
  }
  return res.json();
}

export async function updateClub(id, club) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(club),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update club");
  }
  return res.json();
}

export async function deleteClub(id) {
const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
if (!res.ok) throw new Error("Failed to delete club");
return true;
}

// Get user memberships
export async function getUserMemberships(userEmail) {
  const res = await fetch(`${API_BASE}/memberships?userEmail=${userEmail}`);
  if (!res.ok) throw new Error("Failed to fetch memberships");
  return res.json(); // will be array of joined clubs
}


// =====================================
// Event API
// =====================================
const EVENTS_BASE = "https://8080-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/api/events";

// Get all events
export async function getAllEvents() {
const res = await fetch(`${EVENTS_BASE}`);
if (!res.ok) throw new Error("Failed to fetch events");
return res.json();
}

// Get event by ID
export async function getEventById(id) {
const res = await fetch(`${EVENTS_BASE}/${id}`);
if (!res.ok) throw new Error("Failed to fetch event");
return res.json();
}

// Add new event
export async function addEvent(event) {
const res = await fetch(`${EVENTS_BASE}`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(event),
});
if (!res.ok) {
const errorData = await res.json();
throw new Error(errorData.message || "Failed to add event");
}
return res.json();
}

// Update event
export async function updateEvent(id, event) {
const res = await fetch(`${EVENTS_BASE}/${id}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(event),
});
if (!res.ok) {
const errorData = await res.json();
throw new Error(errorData.message || "Failed to update event");
}
return res.json();
}

// Delete event
export async function deleteEvent(id) {
const res = await fetch(`${EVENTS_BASE}/${id}`, { method: "DELETE" });
if (!res.ok) throw new Error("Failed to delete event");
return true;
}

// Get upcoming events
export async function getUpcomingEvents() {
return getAllEvents(); // same as getAllEvents
}

export async function registerEvent(eventId, userEmail) {
  const res = await fetch(`${EVENTS_BASE}/${eventId}/register?userEmail=${userEmail}`, {
    method: "POST",
  });

  // Read the body **once**
  const text = await res.text();

  // Try parsing JSON, fallback to text
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  // Throw if response not OK
  if (!res.ok) {
    throw new Error(typeof data === "string" ? data : "Failed to register for event");
  }

  return data;
}


export async function submitEventFeedback(eventId, userEmail, rating) {
  const res = await fetch(`${EVENTS_BASE}/${eventId}/feedback?userEmail=${userEmail}&rating=${rating}`, {
    method: "POST",
  });

  const text = await res.text(); // read body **once**
  let data;

  try {
    data = JSON.parse(text); // try parse JSON
  } catch {
    data = text; // fallback to raw text
  }

  if (!res.ok) {
    throw new Error(typeof data === "string" ? data : "Failed to submit feedback");
  }

  return data;
}

// Get events by club
export async function getEventsByClub(clubId) {
const res = await fetch(`${EVENTS_BASE}/byClub/${clubId}`);
if (!res.ok) throw new Error("Failed to fetch events by club");
return res.json();
}


// =====================================
// Announcements API
// =====================================
const ANNOUNCE_BASE = "https://8080-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/api/announcements";

export const getAnnouncements = async () => {
  const res = await fetch(
    "https://8080-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/announcements"
  );
  const data = await res.json();
  return { data };
};


// Get announcements by club
export async function getClubAnnouncements(clubId) {
  const res = await axios.get(`${ANNOUNCE_BASE}/club/${clubId}`);
  return res.data;
}

// Add new announcement (admin/club leader only)
export async function addAnnouncement(announcement) {
  const res = await axios.post(`${ANNOUNCE_BASE}`, announcement);
  return res.data;
}


// src/services/api.js

// Base API URL (adjust if backend is hosted elsewhere)
const AI_BASE = "https://8080-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/api";

// =======================
// Achievements API
// =======================

const BASE_URL = AI_BASE + "/achievements";

// -----------------------
// Add a new achievement (Admin)
export async function addAchievement(payload) {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

// -----------------------
// Get all achievements (Admin view)
export async function getAllAchievements() {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) throw new Error("Failed to fetch achievements");
  return res.json();
}

// -----------------------
// Get achievements by student ID (User view)
export async function getAchievementsByStudent(studentId) {
  const res = await fetch(`${BASE_URL}/student/${studentId}`);
  if (!res.ok) throw new Error("Failed to fetch achievements for student");
  return res.json();
}

// -----------------------
// Get achievements by club ID
export async function getAchievementsByClub(clubId) {
  const res = await fetch(`${BASE_URL}/club/${clubId}`);
  if (!res.ok) throw new Error("Failed to fetch achievements for club");
  return res.json();
}


// -----------------------
// Get achievements by student ID & club ID
export async function getAchievementsByStudentAndClub(studentId, clubId) {
const res = await fetch(`${BASE_URL}/student/${studentId}/club/${clubId}`);
if (!res.ok) throw new Error(
`Failed to fetch achievements for student ${studentId} in club ${clubId}`
);
return res.json();
}

// -----------------------
// Create achievement for student & club
export async function addAchievementForStudentAndClub(studentId, clubId, payload) {
const res = await fetch(`${BASE_URL}/student/${studentId}/club/${clubId}`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});
if (!res.ok) {
const text = await res.text();
throw new Error(`${res.status} ${res.statusText} - ${text}`);
}
return res.json();
}

// -----------------------
// Get achievement by ID
export async function getAchievementById(id) {
const res = await fetch(`${BASE_URL}/${id}`);
if (!res.ok) throw new Error(`Failed to fetch achievement with ID ${id}`);
return res.json();
}

// -----------------------
// Update an achievement by ID (Admin)
export async function updateAchievement(id, payload) {
const res = await fetch(`${BASE_URL}/${id}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});
if (!res.ok) {
const text = await res.text();
throw new Error(`${res.status} ${res.statusText} - ${text}`);
}
return res.json();
}

// -----------------------
// Delete an achievement by ID (Admin)
export async function deleteAchievement(id) {
const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
if (!res.ok) {
const text = await res.text();
throw new Error(`${res.status} ${res.statusText} - ${text}`);
}
return true; // Deleted successfully
}

const AUTH_BASE = "https://8080-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/auth";
// =====================================
// Auth API
// =====================================
export async function registerUser(userData) {
  const res = await fetch(`${AUTH_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (res.headers.get("content-type")?.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to register user");
    return data;
  } else {
    const text = await res.text();
    throw new Error(text || "Failed to register user");
  }
}

export async function loginUser(loginData) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (res.headers.get("content-type")?.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  } else {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }
}
// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${AUTH_BASE}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

