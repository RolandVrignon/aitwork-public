import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AgentForm from "../agent/agent";

const Context = ({ Request, title, user, setUser }) => {
  const [displayProject, setDisplayProject] = useState(false);

  const [projectPrompt, setProjectPrompt] = useState(null);

  const [projectInitial, setProjectInitial] = useState(null);

  const [selectedProject, setSelectedProject] = useState(
    user?.projects?.length > 0 ? user.projects[0] : null
  );

  const [projectButtonStatus, setProjectButtonStatus] = useState("disabled");

  const [openAddProjectForm, setOpenAddProjectForm] = useState(false);

  const [projectName, setProjectName] = useState("");

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
      let res = await Request.Put(`/protected/project`, {
        id: selectedProject.id,
        content: value,
      });
      if (res && res.status === 400) {
        setStatus("error");
      } else setStatus("success");
      setTimeout(() => {
        setProjectInitial(value);
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
        let project = await Request.Get(
          `/protected/project/${selectedProject.id}`
        );
        setProjectPrompt(formatValue(project));
        setProjectInitial(formatValue(project));
        setDisplayProject(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [selectedProject]);

  async function handleAddProject(event) {
    event.preventDefault();
    let res = await Request.Post(`/protected/project`, { label: projectName });
    if (res.status >= 400) {
      console.log("error");
    } else {
      let newProject = res;
      setUser((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject],
      }));
      setSelectedProject(newProject);
    }
    setOpenAddProjectForm(false);
    setProjectName(""); // Reset projectName after creating the project
  }

  async function handleDeleteProject() {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce projet? Cette action n'est pas réversible."
      )
    ) {
      return;
    }
    let res = await Request.Delete(`/protected/project/${selectedProject.id}`);
    if (res.status >= 400) {
      console.log("error");
    } else {
      setUser((prev) => {
        const newProjects = prev.projects.filter(
          (project) => project.id !== selectedProject.id
        );
        return { ...prev, projects: newProjects };
      });
      if (user.projects.length > 0) {
        setSelectedProject(user.projects[0]);
      } else {
        setSelectedProject(null);
      }
    }
  }

  return (
    <>
      <div className="head">
        <h1>
          Gestion des <span>agents.</span>
        </h1>
      </div>

      {displayProject && (
        <div className="prompt">
          <h2>Contexte pro</h2>
          <div className="paragraphe">
            <p>Vous pouvez par exemple fournir ces élements :</p>
            <ol>
              <li>
                <strong>Informations sur une tâche :</strong> Présentez les
                détails de la tâche à accomplir, tels que les objectifs, les
                résultats attendus, les délais et les ressources nécessaires.
              </li>
              <li>
                <strong>Technique :</strong> Si la tâche nécessite une
                compétence technique spécifique, fournissez des détails sur les
                outils logiciels ou matériels nécessaires, ainsi que sur les
                compétences requises pour accomplir la tâche avec succès.
              </li>
              <li>
                <strong>Équipes et collaboration :</strong> Si la tâche
                nécessite plusieurs personnes ou équipes pour être accomplie,
                présentez les membres de l'équipe et expliquez les rôles et
                responsabilités de chacun. Décrivez également les processus de
                communication et de collaboration, tels que les réunions, les
                outils de partage de fichiers et les échéanciers de projet.
              </li>
              <li>
                <strong>Histoire et contexte :</strong> Si la tâche fait partie
                d'un projet plus large, expliquez comment elle s'inscrit dans le
                contexte global du projet.
              </li>
              <li>
                <strong>Ressources :</strong> Si des ressources sont nécessaires
                pour accomplir la tâche, telles que des partenaires externes,
                des données ou des rapports, expliquez comment y accéder et
                comment les intégrer dans le travail à effectuer.
              </li>
            </ol>
            <p>
              Fournissez des informations détaillées et pertinentes pour aider
              CogiPro à mieux comprendre la tâche à accomplir et à travailler
              efficacement pour atteindre vos objectifs.
            </p>
          </div>
          <div className="projects">
            <FormControl fullWidth className="form">
              <InputLabel id="demo-simple-select-label">Project</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Project"
                onChange={(event) => {
                  setOpenAddProjectForm(false);
                  setSelectedProject(event.target.value);
                }}
              >
                {user.projects.map((project) => (
                  <MenuItem key={project.id} value={project}>
                    {project.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="btn" onClick={() => setOpenAddProjectForm(true)}>
              + Nouveau Projet
            </div>
            <div
              className="btn"
              onClick={handleDeleteProject}
              disabled={!selectedProject}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="trash h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Supprimer Projet
            </div>
          </div>

          {openAddProjectForm ? (
            <form className="newProject" onSubmit={handleAddProject}>
              <input
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <button type="submit" disabled={projectName === ""}>
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="check h-4 w-4"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </form>
          ) : (
            <h2>{selectedProject.label}</h2>
          )}

          <div className="textarea-container">
            <textarea
              value={projectPrompt}
              onChange={(e) => setProjectPrompt(e.target.value)}
            ></textarea>
          </div>
          <button
            className={projectButtonStatus}
            disabled={projectPrompt === projectInitial}
            onClick={() =>
              handleSubmit(
                "projectPrompts",
                projectPrompt,
                setProjectButtonStatus
              )
            }
          >
            {projectButtonStatus === "success"
              ? "Mis à jour"
              : projectButtonStatus === "error"
              ? "Invalide"
              : "Mettre à jour"}
          </button>
        </div>
      )}

      <AgentForm Request={Request} />
    </>
  );
};

export default Context;
