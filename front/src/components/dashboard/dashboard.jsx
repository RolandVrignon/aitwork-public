import React from "react";
import Card from "./components/Card/card.jsx";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined"; // Importez votre composant de chargement

import Div100vh from "react-div-100vh";

const Dashboard = ({ darkMode, toggleDarkMode }) => {
  return (
    <Div100vh className="dashboard">
      <>
        <div className="choose">
          <div className="logo">
            {darkMode ? (
              <img
                src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/aitwork_classic_darkmode_JZP8mnNC6?updatedAt=1696434420437"
                alt="logo"
              />
            ) : (
              <img
                src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/aitwork_classic_lightmode_7loTSqYOy?updatedAt=1696434475079"
                alt="logo"
              />
            )}
          </div>
          <div className="plugins">
            {/* <Card
              title="Fonctions"
              description="Creez, sauvegardez et utilisez des fonctions a base d'IA."
              link="/chat"
            /> */}
            <Card
              title="Chat"
              description="Chattez avec un agent conversationnel pour obtenir de l'aide."
              link="/chat"
            />
            <Card
              title="Onboarding"
              description="Discutez avec un agent conversationnel pour découvrir votre entreprise."
              link="/onboarding"
            />
          </div>
        </div>
        <div className="toggle-darkmode" onClick={toggleDarkMode}>
          {darkMode ? <Brightness4OutlinedIcon /> : <NightsStayOutlinedIcon />}
        </div>
      </>
    </Div100vh>
  );
};

export default Dashboard;
