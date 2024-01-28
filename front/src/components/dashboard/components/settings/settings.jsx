import React from "react";
import useRequest from "../../../../useRequest.js";
import FunctionCenter from "./pages/functionCenter/context.jsx";
import OnboardingContext from "./pages/Onboarding/context.jsx";
import UserManagement from "./pages/userManagement/user.jsx";
import Parametres from "./pages/parametres/parametres.jsx";

const Settings = ({ settings, handleSettings, user, setUser, plugin }) => {
  const Request = useRequest();
  return (
    <div className="content settings">

      <div className="settings-container">
        <div className="cross" onClick={() => handleSettings()}>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-900 dark:text-gray-200"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        {settings === "settings" ? (
          <Parametres
            Request={Request}
            user={user}
            setUser={setUser}
          />
        ) : settings === "functionCenter" && user.role !== "nothing" && plugin === "cogichat" ? (
          <FunctionCenter
            Request={Request}
            user={user}
            setUser={setUser}
          />
        ) : settings === "context" && user.role !== "nothing" && plugin === "onboarding" ? (
          <OnboardingContext
            Request={Request}
            user={user}
            setUser={setUser}
          />
        ) : settings === "user" && user.role === "superadmin" ? (
          <UserManagement userActif={user} Request={Request} />
        ) : null}
      </div>
    </div>
  );
};

export default Settings;
