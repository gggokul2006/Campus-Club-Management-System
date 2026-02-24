import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./ClubForm.css";

const ClubForm = ({ setRefreshFlag }) => {
  const { id } = useParams(); // get id from route
  const navigate = useNavigate();

  const [clubName, setClubName] = useState("");
  const [category, setCategory] = useState("Academic");
  const [presidentEmail, setPresidentEmail] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [establishedDate, setEstablishedDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [message, setMessage] = useState("");

 
  useEffect(() => {
    if (id) {
      api.getClubById(id).then((club) => {
        setClubName(club.clubName);
        setCategory(club.category);
        setPresidentEmail(club.presidentEmail);
        setMemberCount(club.memberCount);
        setEstablishedDate(club.establishedDate);
        setDescription(club.description);
        setStatus(club.status);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clubData = {
      clubName,
      category,
      presidentEmail,
      memberCount: Number(memberCount),
      establishedDate,
      description,
      status,
    };

try {
if (id) {
// PUT to update
await api.updateClub(id, clubData);
setMessage("Club updated successfully");
} else {
// POST to add
await api.addClub(clubData);
setMessage("Club added successfully");
}

setRefreshFlag((prev) => !prev); // refresh list
navigate("/clubs");
} catch (err) {
console.error(err);
setMessage("Error adding/updating club");
}
};

return (
<div className="club-form-wrapper">
<div className="club-form-card">
<h2>{id ? "🏛️Update Club" : "🏛️Add Club"}</h2>
<form onSubmit={handleSubmit}>
<input type="text" placeholder="Club name" value={clubName} onChange={(e) => setClubName(e.target.value)} required />
<input type="email" placeholder="President email" value={presidentEmail} onChange={(e) => setPresidentEmail(e.target.value)} required />
<select value={category} onChange={(e) => setCategory(e.target.value)}>
<option value="Academic">Academic</option>
<option value="Technical">Technical</option>
<option value="Sports">Sports</option>
<option value="Cultural">Cultural</option>
</select>
<input type="number" placeholder="Member count" value={memberCount} onChange={(e) => setMemberCount(e.target.value)} required />
<input type="date" value={establishedDate} onChange={(e) => setEstablishedDate(e.target.value)} required />
<textarea placeholder="Club description..." value={description} onChange={(e) => setDescription(e.target.value)} />
<select value={status} onChange={(e) => setStatus(e.target.value)}>
<option value="Active">Active</option>
<option value="Inactive">Inactive</option>
<option value="Under Review">Under Review</option>
</select>
<button type="submit">{id ? "Update Club" : "Add Club"}</button>
</form>
{message && <div className="success-message">{message}</div>}
</div>
</div>
);
};

export default ClubForm;