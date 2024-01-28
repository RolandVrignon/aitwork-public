import React, { useEffect, useState } from "react";
import Avatar from "./avatar.jsx";

const Parametres = ({ Request, user, setUser }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(user.username);
  const [generalStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [changeAvatar, setChangeAvatar] = useState(false);

  const [tones, setTones] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
       let res = await Request.Get("protected/tone");
       setTones(res);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  // eslint-disable-next-line
  }, [])

  const handleToneChange = async (newTone) => {
    setUser({...user, tone: newTone});

    await Request.Put("/protected/user/update/tone", {
      newTone,
    });
  }

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const postData = async () => {
      if (newPassword === confirmPassword) {
        let res = await Request.Post("protected/user/password", {
          oldPassword,
          newPassword,
        });
        if (res.status === 401) {
          setPasswordStatus("error");
        } else {
          setPasswordStatus("success")
        }
        setTimeout(() => {
          setPasswordStatus("")
        }, 4000);
      }
    };
    postData();
  };

  const handleGeneralInfoChange = (e) => {
    e.preventDefault();
  };

  const handleAvatarChange = () => {
    setChangeAvatar(!changeAvatar);
  }

  return (
    <>
      <div className="head">
        <h1>
          Paramètres <span>généraux.</span>
        </h1>
      </div>
      <div className="user">
        { changeAvatar && <Avatar Request={Request} user={user} setUser={setUser} handleAvatarChange={handleAvatarChange}/>}
        <div className="avatar">
          <div className="img">
            <img
              src={`${user.profilePic}&tr=w-300,h-auto`}
              alt="avatar"
            />
          </div>
          <div className="btn" onClick={() => handleAvatarChange()}>Modifier</div>
        </div>
        <div className="infos">
          <div className="informations">
            <h2>Informations générales</h2>
          </div>
          <div className="password">
            <h2>Mot de passe</h2>
            <form onSubmit={handlePasswordChange}>
              <label>
                <input
                  placeholder="Ancien mot de passe"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </label>
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
                disabled={(!oldPassword || !newPassword || !confirmPassword) || (newPassword !== confirmPassword)}
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
          {tones && (
            <div className="tone">
              <h2>Quel ton employer ?</h2>

              <h3>Professionnel</h3>
              <div className="button">
                {tones.filter(tone => tone.type === 'pro').map((tone, index) => (
                  <div key={index} className={`btn ${user.tone === tone._id ? 'active disabled' : ''}`} disabled={user.tone === tone._id} onClick={() => handleToneChange(tone._id)}>
                    {tone.label}
                  </div>
                ))}
              </div>

              <h3>Comique</h3>
              <div className="button">
                {tones.filter(tone => tone.type === 'rigolo').map((tone, index) => (
                  <div key={index} className={`btn ${user.tone === tone._id ? 'active disabled' : ''}`} disabled={user.tone === tone._id} onClick={() => handleToneChange(tone._id)}>
                    {tone.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Parametres;
