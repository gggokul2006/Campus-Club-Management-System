import React, { useState, useEffect } from "react";
import AddAchievement from "./AddAchievement";
import UserAchievements from "./UserAchievements";
import { getAllAchievements } from "../services/api";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAchievements() {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("No logged-in user found");

      let data = await getAllAchievements();

      // Filter by user's clubs if not admin
      if (user.role !== "ADMIN") {
        const userClubIds = user.clubs?.map((c) => c.id) || [];
        data = data.filter((a) => userClubIds.includes(a.clubId));
      }

      setAchievements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Callback after adding a new achievement
  function handleNewAchievement(newAchievement) {
    setAchievements((prev) => [newAchievement, ...prev]);
  }

  return (
    <div>
      <AddAchievement onAdd={handleNewAchievement} />
      {loading && <p className="loading">Loading achievements...</p>}
      {error && <p className="error">Error: [Error - You need to specify the message]</p>}
      <UserAchievements achievements={achievements} />
    </div>
  );
}
