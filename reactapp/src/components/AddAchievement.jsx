import React, { useState } from "react";
import { addAchievement } from "../services/api";
import "./AddAchievement.css";

const defaultForm = {
  studentId: "",
  clubId: "",
  achievementType: "LEADERSHIP",
  title: "",
  description: "",
  pointsAwarded: 0,
  awardDate: "",
  awardedBy: "",
  academicYear: "",
  certificateUrl: "",
  isVerified: false,
  isPublic: true,
};

export default function AddAchievement({ onAdd }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function validate() {
    const err = {};
    if (!form.studentId) err.studentId = "Student ID is required";
    if (!form.clubId) err.clubId = "Club ID is required";
    if (!form.title || form.title.trim().length < 3)
      err.title = "Enter a title (min 3 chars)";
    if (!form.awardDate) err.awardDate = "Award date is required";
    if (form.pointsAwarded < 0) err.pointsAwarded = "Points cannot be negative";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const v =
      type === "checkbox"
        ? checked
        : type === "number"
        ? value === ""
          ? ""
          : Number(value)
        : value;
    setForm((prev) => ({ ...prev, [name]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;

    const payload = {
      studentId: Number(form.studentId),
      clubId: Number(form.clubId),
      achievementType: form.achievementType,
      title: form.title,
      description: form.description || null,
      pointsAwarded: form.pointsAwarded || 0,
      awardDate: form.awardDate,
      awardedBy: form.awardedBy ? Number(form.awardedBy) : null,
      academicYear: form.academicYear || null,
      certificateUrl: form.certificateUrl || null,
      isVerified: form.isVerified,
      isPublic: form.isPublic,
    };

    try {
      setLoading(true);
      const data = await addAchievement(payload);
      setMessage({ type: "success", text: "Achievement added successfully." });
      setForm(defaultForm);
      setErrors({});
      if (onAdd) onAdd(data); // <-- Add to parent state immediately
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add achievement: " + err.message });
    } finally {
      setLoading(false);
    }
  }

 return (
  <div className="add-achievement-wrapper">
<div className="add-achievement-container">
<h2>Add Achievement</h2>
{message && <div className={`message ${message.type}`}>{message.text}</div>}

<form onSubmit={handleSubmit} className="achievement-form">
{/* Row 1 */}
<div className="form-row">
<div className="form-group">
<label>Student ID*</label>
<input name="studentId" value={form.studentId} onChange={handleChange} required />
{errors.studentId && <div className="error">{errors.studentId}</div>}
</div>

<div className="form-group">
<label>Club ID*</label>
<input name="clubId" value={form.clubId} onChange={handleChange} required />
{errors.clubId && <div className="error">{errors.clubId}</div>}
</div>
</div>

{/* Row 2 */}
<div className="form-row">
<div className="form-group">
<label>Type</label>
<select name="achievementType" value={form.achievementType} onChange={handleChange}>
<option>LEADERSHIP</option>
<option>PARTICIPATION</option>
<option>SERVICE</option>
<option>ACADEMIC</option>
<option>SPECIAL_RECOGNITION</option>
</select>
</div>

<div className="form-group">
<label>Title*</label>
<input name="title" value={form.title} onChange={handleChange} required />
{errors.title && <div className="error">{errors.title}</div>}
</div>
</div>

{/* Description */}
<div className="form-group">
<label>Description</label>
<textarea name="description" value={form.description} onChange={handleChange} />
</div>

{/* Row 3 */}
<div className="form-row">
<div className="form-group">
<label>Points Awarded</label>
<input type="number" name="pointsAwarded" min="0" value={form.pointsAwarded} onChange={handleChange} />
{errors.pointsAwarded && <div className="error">{errors.pointsAwarded}</div>}
</div>

<div className="form-group">
<label>Award Date*</label>
<input type="date" name="awardDate" value={form.awardDate} onChange={handleChange} required />
{errors.awardDate && <div className="error">{errors.awardDate}</div>}
</div>
</div>

{/* Row 4 */}
<div className="form-row">
<div className="form-group">
<label>Awarded By (user id)</label>
<input name="awardedBy" value={form.awardedBy} onChange={handleChange} />
</div>

<div className="form-group">
<label>Academic Year</label>
<input name="academicYear" value={form.academicYear} onChange={handleChange} />
</div>
</div>

<div className="form-group">
<label>Certificate URL</label>
<input name="certificateUrl" value={form.certificateUrl} onChange={handleChange} />
</div>

<div className="form-row checkbox-row">
<label>
<input type="checkbox" name="isVerified" checked={form.isVerified} onChange={handleChange} /> Verified
</label>
<label>
<input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} /> Public
</label>
</div>

<button type="submit" disabled={loading}>
{loading ? "Saving..." : "Add Achievement"}
</button>
</form>
</div>
</div>
);
}