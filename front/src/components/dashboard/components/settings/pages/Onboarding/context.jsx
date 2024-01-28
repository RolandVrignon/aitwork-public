import React, { useEffect, useState } from "react";

const Context = ({ Request, title, user }) => {

  const [displayCompany, setDisplayCompany] = useState(false);
  const [displayTeam, setDisplayTeam] = useState(false);
  const [displayUser, setDisplayUser] = useState(false);
  
  const [companyPrompt, setCompanyPrompt] = useState(null);
  const [teamPrompt, setTeamPrompt] = useState(null);
  const [userPrompt, setUserPrompt] = useState(null);

  const [companyInitial, setCompanyInitial] = useState(null);
  const [teamInitial, setTeamInitial] = useState(null);
  const [userInitial, setUserInitial] = useState(null);

  const [companyButtonStatus, setCompanyButtonStatus] = useState("disabled");
  const [teamButtonStatus, setTeamButtonStatus] = useState("disabled");
  const [userButtonStatus, setUserButtonStatus] = useState("disabled");

  function formatValue(obj) {
    const combinedCompany = obj.prompts
      .map((prompt) => {
        return prompt.replace(/\${5}.*?\${5}/, " ");
      })
      .join("");

    return combinedCompany;
  }

  async function handleSubmit(promptType, value, setStatus) {
    try {
      let res = await Request.Put(`/protected/user/${promptType}`, { value });
      if (res && res.status === 400) {
        setStatus("error");
      } else
        setStatus("success");
      setTimeout(() => {
        if (promptType === "companyPrompts") setCompanyInitial(value);
        else if (promptType === "teamPrompts") setTeamInitial(value);
        else if (promptType === "userPrompts") setUserInitial(value);

        setStatus("disabled");
      }, 5000);
    } catch (error) {
      console.error("Error updating prompt:", error);
      setStatus("error");
    }
  }

  useEffect(() => {
    const fetchData = async () => {

      try {
        let company;
        let team;
        let usr;
        
        if (user.role === "superadmin") {
          company = await Request.Get("/protected/user/companyPrompts");
          setCompanyPrompt(formatValue(company));
          setCompanyInitial(formatValue(company));
          setDisplayCompany(true);
        }
        if (user.role === "superadmin" || user.role === "admin") {
          team = await Request.Get("/protected/user/teamPrompts");
          setTeamPrompt(formatValue(team));
          setTeamInitial(formatValue(team));
          setDisplayTeam(true);
        }
        if (user.role !== "nothing") {
          usr = await Request.Get("/protected/user/userPrompts");
          setUserPrompt(formatValue(usr));
          setUserInitial(formatValue(usr));
          setDisplayUser(true);
        }
      } catch (error) {
          console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
        <div className="head">
          <h1>
            Gestion des <span>contextes.</span>
          </h1>
        </div>

        {displayCompany && (
          <div className="prompt">
            <h2>Contexte de l'entreprise</h2>
            <div className="paragraphe">
              <p>Vous pouvez par exemple fournir ces élements :</p>
              <ol>
                <li>
                  <strong>Organigramme :</strong> Présentez la structure
                  organisationnelle, les départements et les rôles des membres
                  clés.
                </li>
                <li>
                  <strong>Outils et ressources :</strong> Énumérez les outils,
                  logiciels et technologies utilisés, en expliquant leurs
                  relations et utilités.
                </li>
                <li>
                  <strong>Équipes et départements :</strong> Décrivez les
                  différentes équipes, leurs responsabilités et objectifs.
                </li>
                <li>
                  <strong>Histoire et évolution :</strong> Racontez l'histoire
                  de l'entreprise, les jalons importants et les défis
                  rencontrés.
                </li>
                <li>
                  <strong>Culture et valeurs :</strong> Présentez les valeurs
                  fondamentales et la culture organisationnelle.
                </li>
                <li>
                  <strong>Vision et stratégie :</strong> Expliquez la vision
                  globale, les objectifs à long terme et comment l'entreprise
                  envisage de les atteindre.
                </li>
              </ol>
              <p>
                Fournissez des informations détaillées et pertinentes pour aider
                les utilisateurs à mieux connaître votre organisation.
              </p>
            </div>
            <div className="textarea-container">
              <textarea
                value={companyPrompt}
                onChange={(e) => setCompanyPrompt(e.target.value)}
              ></textarea>
            </div>
            <button
              className={companyButtonStatus}
              disabled={companyPrompt === companyInitial}
              onClick={() =>
                handleSubmit(
                  "companyPrompts",
                  companyPrompt,
                  setCompanyButtonStatus
                )
              }
            >
              {companyButtonStatus === "success" ? "Mis à jour" : companyButtonStatus === "error" ? "Invalide" : "Mettre à jour"}
            </button>
          </div>
        )}

        {displayTeam && (
          <div className="prompt">
            <h2>Contexte de l'équipe</h2>
            <div className="paragraphe">
              <p>Vous pouvez par exemple fournir ces élements :</p>
              <ol>
                <li>
                  <strong>Membres de l'équipe :</strong> Présentez les membres
                  de l'équipe, leurs rôles et responsabilités.
                </li>
                <li>
                  <strong>Processus internes :</strong> Décrivez les procédures
                  et méthodes de travail au sein de l'équipe.
                </li>
                <li>
                  <strong>Contacts clés :</strong> Indiquez les personnes
                  ressources importantes en interne et externe à l'équipe.
                </li>
                <li>
                  <strong>Pôles de collaboration :</strong> Mentionnez les
                  autres équipes ou départements avec lesquels votre équipe
                  travaille étroitement.
                </li>
              </ol>
              <p>
                Fournissez des informations précises pour permettre aux autres
                de mieux comprendre le fonctionnement de votre équipe.
              </p>
            </div>
            <div className="textarea-container">
              <textarea
                value={teamPrompt}
                onChange={(e) => setTeamPrompt(e.target.value)}
              ></textarea>
            </div>
            <button
              className={teamButtonStatus}
              disabled={teamPrompt === teamInitial}
              onClick={() =>
                handleSubmit("teamPrompts", teamPrompt, setTeamButtonStatus)
              }
            >
              {teamButtonStatus === "success" ? "Mis à jour" : teamButtonStatus === "error" ? "Invalide" : "Mettre à jour"}
            </button>
          </div>
        )}

        {displayUser && (
          <div className="prompt">
            <h2>Contexte de l'utilisateur</h2>
            <div className="paragraphe">
              <p>
                Votre prompt est unique, personnalisez-le selon vos besoins :
              </p>
              <ol>
                <li>
                  <strong>Processus personnels :</strong> Notez les procédures
                  et méthodes de travail que vous avez du mal à retenir ou que
                  vous utilisez fréquemment.
                </li>
                <li>
                  <strong>Ressources importantes :</strong> Référencez les
                  ressources, documents ou liens clés qui sont essentiels pour
                  votre travail.
                </li>
                <li>
                  <strong>Modèles et gabarits :</strong> Ajoutez des modèles ou
                  gabarits que vous utilisez régulièrement pour gagner du temps
                  et améliorer votre productivité.
                </li>
                <li>
                  <strong>Cœur de métier :</strong> Précisez votre domaine
                  d'expertise et les compétences ainsi que vos faiblesses afin
                  que CogiChat puisse vous être le plus pertinent.
                </li>
              </ol>
              <p>
                N'oubliez pas que votre prompt est unique et peut être
                personnalisé selon vos préférences et besoins professionnels.
              </p>
            </div>
            <div className="textarea-container">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              ></textarea>
            </div>
            <button
              className={userButtonStatus}
              disabled={userPrompt === userInitial}
              onClick={() =>
                handleSubmit("userPrompts", userPrompt, setUserButtonStatus)
              }
            >
              {userButtonStatus === "success" ? "Mis à jour" : userButtonStatus === "error" ? "Invalide" : "Mettre à jour"}
            </button>
          </div>
        )}
    </>
  );
};

export default Context;