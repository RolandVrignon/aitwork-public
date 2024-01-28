import React, { useState } from "react";

const NewTeam = ({ Request, handleState, company, setTeams, teams, offer }) => {
  const [label, setLabel] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!label) return;
    try {
      let obj = {
        label: label
      };
      let res = await Request.Post("/protected/teams/new", obj);
      if (res.status >= 400) {
        setError(res.message);
      } else {
        setTeams((prevTeams) => [...prevTeams, res]);
        handleState("teamSelected", res);
      }
    } catch (error) {
      setError(error.message || "Une erreur est intervenue");
    }
  };

  return (
    <div className="submodule">
      <div className="back" onClick={() => handleState("back", null)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </div>
      <div className="content">
        <h2>Créer une nouvelle équipe</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom de votre nouvelle équipe"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
          <button type="submit" disabled={!label}>
            Créer
          </button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default NewTeam;
