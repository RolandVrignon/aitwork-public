import React, { useEffect, useState } from "react";
import UserTable from "./userTable/userTable";
import ChartUsage from "../../../ChartUsage/chartUsage.jsx";
import NewUser from "./userHandler/newUser.jsx"
import NewTeam from "./teamHandler/newTeam.jsx"
import UserSelected from "./userHandler/userSelected.jsx"
import TeamSelected from "./teamHandler/teamSelected.jsx"


const User = ({ Request, userActif }) => {
  const [company, setCompany] = useState(null);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [offer, setOffer] = useState({});
  const [tokenRes, setTokenRes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newUser, setNewUser] = useState(false);
  const [newTeam, setNewTeam] = useState(false);

  const [teamSelected, setTeamSelected] = useState(null);
  const [userSelected, setUserSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let companyRes = await Request.Get("protected/company");
        setCompany(companyRes);

        let teamsRes = await Request.Get("protected/teams/all");
        setTeams(teamsRes);

        let usersRes = await Request.Get("protected/user/all");
        setUsers(usersRes);

        let offerRes = await Request.Get("protected/offer");
        setOffer({
          label : offerRes.label,
          maxTeams : offerRes.maxTeams,
          maxUsers : offerRes.maxUsers,
          trial: offerRes.trial,
        });

        let tokenRes = await Request.Get("protected/company/tokenUsage");
        setTokenRes(tokenRes);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleState = (stateName, value) => {
    switch (stateName) {
      case "newUser":
        setNewUser(value);
        setNewTeam(false);
        setTeamSelected(null);
        setUserSelected(null);
        break;
      case "newTeam":
        setNewTeam(value);
        setNewUser(false);
        setTeamSelected(null);
        setUserSelected(null);
        break;
      case "teamSelected":
        setTeamSelected(value);
        setNewUser(false);
        setNewTeam(false);
        setUserSelected(null);
        break;
      case "userSelected":
        setUserSelected(value);
        setNewUser(false);
        setNewTeam(false);
        setTeamSelected(null);
        break;
      case "back":
        setNewUser(false);
        setNewTeam(false);
        setTeamSelected(null);
        setUserSelected(null);
        break;
      default:
        console.error(`Invalid stateName: ${stateName}`);
        break;
    }
  };

  const getTeamName = (teamId) => {
    if (!Array.isArray(teams)) return "No team";
    const team = teams.find((team) => team._id === teamId);
    return team ? team.name : "No team";
  };


  return (
    <>
      <div className="head">
        <h1>
          Gestion de <span>l'entreprise.</span>
        </h1>
      </div>

      {  newUser ? (
        <NewUser Request={Request} handleState={handleState} company={company} setUsers={setUsers} teams={teams} offer={offer}/>
      ) : newTeam ? (
        <NewTeam Request={Request} handleState={handleState} company={company} setTeams={setTeams} teams={teams} offer={offer}/>
      ) : userSelected ? (
        <UserSelected Request={Request} handleState={handleState} user={userSelected} setUsers={setUsers} teams={teams} userActif={userActif}/>
      ) : teamSelected ? (
        <TeamSelected Request={Request} handleState={handleState} setTeams={setTeams} team={teamSelected} users={users} getTeamName={getTeamName}/>
      ) : (
        <div className="content">
        <div className="charts">
          <ChartUsage teams={teams} tokenRes={tokenRes} isLoading={isLoading}/>
        </div>

          {teams.length > 0 && (
            <>
              <div className="title">
                <div className="titre">
                  <h2>Mes équipes</h2>
                  <p>
                    {teams.length} / {offer.maxTeams}
                  </p>
                </div>
              </div>
              <div className="teams">
                {teams.map((team, index) => (
                  <div
                    key={index}
                    className="btn"
                    onClick={() => handleState("teamSelected", team)}
                  >
                    {team.name}
                  </div>
                ))}
                <button
                  className="btn"
                  onClick={() => handleState("newTeam", true)}
                  disabled={teams.length >= offer.maxTeams ? true : false}
                >
                  +
                </button>
              </div>
            </>
          )}

          {users.length > 0 && teams && (
            <>
              <div className="title">
                <div className="titre">
                  <h2>Utilisateurs</h2>
                  <p>
                    {users.length} / {offer.maxUsers}
                  </p>
                </div>
                <button
                  className="btn"
                  onClick={() => handleState("newUser", true)}
                  disabled={users.length >= offer.maxUsers}
                >
                  + Nouveau
                </button>
              </div>
              <div className="users">
                <UserTable
                  users={users}
                  getTeamName={getTeamName}
                  handleState={handleState}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default User;
