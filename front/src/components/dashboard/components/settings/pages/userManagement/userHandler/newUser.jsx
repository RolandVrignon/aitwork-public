import React, { useState } from 'react'

const NewUser = ({Request, handleState, offer, company, teams, setUsers}) => {
    const [error, setError] = useState(null);

    const [email, setEmail ] = useState(null);
    const [password, setPassword ] = useState(null);
    const [firstName, setFirstName ] = useState(null);
    const [lastName, setLastName ] = useState(null);
    const [role, setRole ] = useState(null);
    const [team, setTeam ] = useState(null);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        let obj = {
          email,
          password,
          firstName,
          lastName,
          role,
          team,
          company : company._id
        };
        let res = await Request.Post("/protected/user/new", obj);
        if (res.status >= 400) {
          setError(res.message || "Une erreur est intervenue");
        } else {
          setUsers((prevUsers) => [...prevUsers, res]);
          handleState("userSelected", res);
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
          <h2>Créer un nouvel utilisateur</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <input
              type="text"
              placeholder="Nom de famille"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="">Select a role</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="nothing">Nothing</option>
            </select>
            <select value={team} onChange={(event) => setTeam(event.target.value)}>
              <option value="">Select a team</option>
              {teams.map((team, index) => (
                <option key={index} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
            <button type="submit" disabled={!email || !password || !firstName || !lastName || !role || !team}>
              Créer
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      </div>
    );
}

export default NewUser