import React, { useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const UserSelected = ({ Request, handleState, user, setUsers, teams, userActif }) => {
  const [initialEmail, setInitialEmail] = useState(user.email);
  const [initialFirstName, setInitialFirstName] = useState(user.firstName);
  const [initialLastName, setInitialLastName] = useState(user.lastName);
  const [initialRole, setInitialRole] = useState(user.role);
  const [initialTeam, setInitialTeam] = useState(user.team);

  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [role, setRole] = useState(user.role);
  const [team, setTeam] = useState(user.team);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const [updateStatus, setUpdateStatus] = useState("");

  const handleUserUpdate = (e) => {
    e.preventDefault();
    const updateData = async () => {
      try {
        let obj = {
          id: user.id,
          email,
          firstName,
          lastName,
          role,
          team,
        };
        const res = await Request.Put("/protected/user/update", obj);
        if(res.status === 500) {
          setUpdateStatus("error");
          setTimeout(() => {
            setUpdateStatus("");
          }, 4000);
        } else {
          setUpdateStatus("success");
          setInitialEmail(email);
          setInitialFirstName(firstName);
          setInitialLastName(lastName);
          setInitialRole(role);
          setInitialTeam(team);
          setTimeout(() => {
            setUpdateStatus("");
          }, 4000);

          // Begin: updating users array
          setUsers((prevUsers) => {
            const updatedUsers = [...prevUsers]; // clone previous state to not mutate it directly
            const userIndex = updatedUsers.findIndex((u) => u.id === user.id); // find the user's index
            if (userIndex !== -1) {
              updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...obj }; // update user data
            }
            return updatedUsers;
          });
          // End: updating users array
        }
      } catch (error) {
        setUpdateStatus("error");
        console.log(error);
      }
    };
    updateData();
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const postData = async () => {
      if (newPassword === confirmPassword) {
        let res = await Request.Post("protected/user/adminpassword", {
          id: user.id,
          newPassword,
        });
        if (res.status === 401) {
          setPasswordStatus("error");
        } else {
          setPasswordStatus("success");
        }

        setPasswordStatus("");
        setNewPassword("");

        setTimeout(() => {
          setConfirmPassword("");
        }, 4000);
      }
    };
    postData();
  };

  const handleDelete = () => {
    const deleteData = async () => {
      try {
        let res = await Request.Delete(`protected/user/delete/${user.id}`);
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        handleState("back", null);
      } catch (error) {
        console.log(error);
      }
    };
    deleteData();
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
        <h1>
          {user.firstName} {user.lastName}
        </h1>

        <div className="informations">
          <h2>
            <AccountCircleOutlinedIcon /> Informations de compte
          </h2>
          <form onSubmit={handleUserUpdate}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="">Choisir un rôle</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="nothing">Nothing</option>
            </select>
            <select
              value={team}
              onChange={(event) => setTeam(event.target.value)}
            >
              <option value="">Choisir une équipe</option>
              {teams.map((team, index) => (
                <option key={index} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className={updateStatus}
              disabled={
                initialEmail === email &&
                initialFirstName === firstName &&
                initialLastName === lastName &&
                initialRole === role &&
                initialTeam === team
              }
            >
            {updateStatus === "success" ? "Mis à jour" : "Enregistrer"}
            </button>
          </form>
        </div>

        <div className="password">
          <h2>
            <KeyOutlinedIcon /> Mot de passe
          </h2>
          <form onSubmit={handlePasswordChange}>
            <label>
              <input
                placeholder="Nouveau mot de passe"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label>
              <input
                placeholder="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <button
              className={passwordStatus}
              disabled={
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
              type="submit"
            >
              {passwordStatus === "success"
                ? "Mis à jour"
                : passwordStatus === "error"
                ? "Invalide"
                : "Mettre à jour"}
            </button>
          </form>
        </div>

        <div className="delete">
          <h2>
            <DeleteOutlinedIcon /> Supprimer compte
          </h2>
          <button onClick={() => handleDelete()} disabled={userActif.email === user.email || user.email === "admin@iadopt.fr"}>
            Supprimer
          </button>
          {userActif.email === user.email && <p>Vous ne pouvez pas supprimer votre propre compte.</p>}
        </div>
      </div>
    </div>
  );
};

export default UserSelected;
