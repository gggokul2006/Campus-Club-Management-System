import React, { useEffect, useState } from "react";
import { getAllAchievements } from "../services/api";
import "./UserAchievement.css";

export default function UserAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        setLoading(true);
        setError(null);

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) throw new Error("No logged-in user found");

        let data = await getAllAchievements();

        // STUDENT: show only public achievements or achievements from user's clubs
        if (user.role !== "ADMIN") {
          const userClubIds = user.clubs?.map((c) => c.id) || [];
          data = data.filter(
            (a) => a.isPublic === true || userClubIds.includes(a.clubId)
          );
        }

        setAchievements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  if (loading) return <p className="loading">Loading achievements...</p>;
  if (error) return <p className="error">Error: [Error - You need to specify the message]</p>;
  if (achievements.length === 0) return <p className="no-data">No achievements found.</p>;

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="user-achievements-wrapper">
    <div className="user-achievements-container">
      <h2>{user.role === "ADMIN" ? "All Achievements" : " 🏆 Achievements"}</h2>
      <div className="achievements-grid">
        {achievements.map((a) => (
          <div key={a.id} className="achievement-card">
            <div className="card-header">
              <h3>{a.title}</h3>
              <span className={`type-badge ${a.achievementType.toLowerCase()}`}>
                {a.achievementType}
              </span>
            </div>
            <div className="card-body">
              <p><strong>Points:</strong> {a.pointsAwarded}</p>
              <p><strong>Date:</strong> {a.awardDate}</p>
              <p><strong>Club:</strong> {a.clubName || a.clubId}</p>
              {a.description && <p className="description">{a.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
