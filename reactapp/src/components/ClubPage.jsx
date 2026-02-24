import React, { useState } from "react";
import ClubForm from "./ClubForm";
import ClubList from "./ClubList";

const ClubsPage = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editId, setEditId] = useState(null); // manage edit mode

  return (
    <div style={{ padding: "20px" }}>
      <h1>Clubs Management</h1>

      <ClubForm
        setRefreshFlag={setRefreshFlag}
        editId={editId}
        setEditId={setEditId} // pass to form to reset edit mode
      />

      <ClubList
        refreshFlag={refreshFlag}
        setEditId={setEditId} // pass to list to trigger edit
      />
    </div>
  );
};

export default ClubsPage;
