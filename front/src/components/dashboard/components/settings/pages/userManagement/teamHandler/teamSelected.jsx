import React from "react";
import UserTable from "../userTable/userTable";

const TeamSelected = ({
  Request,
  handleState,
  setTeams,
  team,
  users,
  getTeamName,
}) => {
  const handleDeleteTeam = async () => {
    try {
      await Request.Delete(`/protected/teams/deleteTeam/${team._id}`);
      setTeams((prevTeams) =>
        prevTeams.filter((item) => item._id !== team._id)
      );
      handleState("back", null);
    } catch (error) {
      console.error(error);
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
      <div className="submodule-content">
        <h2>
          Équipe <span>{team.name}.</span>
        </h2>

        <div className="delete">
          <button
            disabled={users.filter((user) => user.team === team._id).length > 0}
            onClick={() => handleDeleteTeam()}
          >
            Supprimer équipe
          </button>
          {users.filter((user) => user.team === team._id).length > 0 && (
            <ul>
              Pour supprimer l'équipe, il faut :{" "}
              <li>Modifier l'équipe des utilisateurs ci-dessous.</li>{" "}
              <li>Supprimer les utilisateurs ci-dessous.</li>{" "}
            </ul>
          )}
        </div>

        <>
          <div className="title">
            <div className="titre">
              <h2>Utilisateurs</h2>
              <p>{users.filter((user) => user.team === team._id).length}</p>
            </div>
            <div className="btn" onClick={() => handleState("newUser", true)}>
              + Nouveau
            </div>
          </div>
          <div className="users">
            <UserTable
              users={users.filter((user) => user.team === team._id)}
              getTeamName={getTeamName}
              handleState={handleState}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default TeamSelected;
