import React, { useState } from "react";

const Button = ({ title, value, sendMessage, setSendReady }) => {
  const handleClick = (event) => {
    setSendReady(false);
    sendMessage(event, value);
  };

  return (
    <div className="btn" onClick={handleClick}>
      {title}
    </div>
  );
};

const NewChat = ({
  plugin,
  setMessages,
  template,
  setTemplate,
  setSettings,
  user,
  handleSendMessage,
  setSendReady,
}) => {
  const [selectedProject, setSelectedProject] = useState(null);

  const buttons1 = [
    {
      title: "Carte d'identité de l'entreprise",
      value: "Peux tu me parler de l'entreprise ?",
    },
    { title: "Contacts RH", value: "Quels sont les contacts RH ?" },
    { title: "Que est ton poste ?", value: "Quel est mon poste ?" },
    {
      title: "Principaux outils",
      value: "Quels sont les differents outils de l'entreprise ?",
    },
  ];

  const buttons2 = [
    {
      title: "Temps forts RH",
      value: "Quels sont les temps forts RH et quand sont-ils ?",
    },
    {
      title: "Les bonnes adresses du quartier",
      value: "Quelles sont les bonnes adresses du quartier",
    },
    {
      title: "Avantages CE",
      value: "Quels sont les avantages du Comité d'entreprise ?",
    },
    {
      title: "Mot de passe",
      value:
        "Quelles sont les procédures pour récupérer les différents mots de passes ?",
    },
  ];

  const buttons3 = [
    {
      title: "Les valeurs de l'entreprise",
      value: "Quelles sont les valeurs de l'entreprise ?",
    },
    { title: "Contacts IT", value: "Quelles sont les contacts IT ?" },
    {
      title: "Horaires Accueil",
      value: "Quelles sont les horaires de l'accueil ?",
    },
    {
      title: "Mon équipe",
      value:
        "Qui sont les membres de mon équipe et quelles sont leurs contacts s'il en ont ?",
    },
  ];

  return (
    <>
      {plugin === "cogichat" ? (
        <div className="new-chat">
          <div className="project-body">
            <div className="projects-parent">
              <div className="header">
                <h3>Fonctions</h3>
                <svg
                  stroke="currentColor"
                  onClick={() => setSettings("functionCenter")}
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <div className="projects-container">
                <div
                  className={`btn ${!selectedProject ? "active" : ""}`}
                  onClick={() => setTemplate(null)}
                >
                  Aucun
                </div>
                {user && user.projects &&
                  user.projects.length > 0 &&
                  user.projects.map((project, index) => (
                    <div
                      key={index}
                      className={`btn ${
                        selectedProject && selectedProject.id === project.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSelectedProject(project)} // on click, only the selectedProject is updated
                    >
                      {project.label}
                    </div>
                  ))}
              </div>
            </div>
            <button
              onClick={() => {
                setTemplate(selectedProject); // on button click, the template is updated to the selectedProject
                setMessages([
                  {
                    role: "function",
                    content: null,
                    template: selectedProject,
                  },
                ]);
              }}
            >
              Utiliser
            </button>{" "}
          </div>
        </div>
      ) : plugin === "onboarding" ? (
        <div className="new-chat">
          <p>Bienvenue sur l'outil d'onboarding. Posez vos questions concernant l'entreprise et obtenez vos réponses en un claquement de doigt.</p>
          <p>
            Powered by <span>Iadopt - 2023.</span>
          </p>
          <div className="templates">
            <div className="wrapper right">
              {buttons1.map((button, index) => (
                <Button
                  key={index}
                  title={button.title}
                  value={button.value}
                  sendMessage={handleSendMessage}
                  setSendReady={setSendReady}
                />
              ))}
              {buttons1.map((button, index) => (
                <Button
                  key={index + buttons1.length}
                  title={button.title}
                  value={button.value}
                  sendMessage={handleSendMessage}
                  setSendReady={setSendReady}
                />
              ))}
            </div>
            <div className="wrapper left">
              {buttons2.map((button, index) => (
                <Button
                  key={index}
                  title={button.title}
                  value={button.value}
                  sendMessage={handleSendMessage}
                  setSendReady={setSendReady}
                />
              ))}
              {buttons2.map((button, index) => (
                <Button
                  key={index + buttons2.length}
                  title={button.title}
                  value={button.value}
                  sendMessage={handleSendMessage}
                  setSendReady={setSendReady}
                />
              ))}
            </div>
            <div className="wrapper right">
              {buttons3.map((button, index) => (
                <Button
                  key={index}
                  title={button.title}
                  value={button.value}
                  sendMessage={handleSendMessage}
                  setSendReady={setSendReady}
                />
              ))}
              {buttons3.map((button, index) => (
                <Button
                  key={index + buttons3.length}
                  title={button.title}
                  value={button.value}
                  sendMessage={handleSendMessage}
                  setSendReady={setSendReady}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="new-chat">
          <p>Bienvenue sur CogiChat, le wikipedia de votre entreprise.</p>
          <p>Pour commencer, entrez n'importe quelle demande ci-dessous.</p>
          <p>
            Powered by <span>Cogitum - 2023.</span>
          </p>
        </div>
      )}
    </>
  );
};

export default NewChat;
