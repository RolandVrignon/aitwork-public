import React, { useState } from "react";

function AgentForm({Request}) {
  const [agentId, setAgentId] = useState(null);
  const [agentPath, setAgentPath] = useState(null);
  const [agentName, setAgentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState([]);

  const handleNameChange = (e) => {
    setAgentName(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  async function createAgent() {
    try {
      let res = await Request.Post("/protected/agents/new", {
        name: agentName,
      });

      console.log('res:', res);

      setAgentId(res._id);
      setAgentPath(res.path);

      let uploadRes = await uploadFiles(res.path);
      console.log(uploadRes);

      let indexFiles = await Request.Post("/protected/agents/index", {
        folderPath : res.path,
      });

      console.log('indexFiles:', indexFiles)
    } catch (error) {
      console.log(error.message || "Une erreur est intervenue");
    }
  }

  async function uploadFiles(path) {
    setIsUploading(true);
    let res = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("fileField", file);
      let response;
      response = await Request.PostFile(
        "/protected/uploads",
        formData,
        file.name,
        30,
        (progress) => setUploadProgress(progress),
      );
      res.push(response);
    }
    setIsUploading(false);
    return res;
  }

  const handleFileDelete = (indexToDelete) => {
    setFiles(files.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="agent">
      <h2>Créer un nouvel Agent</h2>
      <input
        type="text"
        placeholder="Nom d'agent"
        value={agentName}
        onChange={handleNameChange}
      />
      <button onClick={() => document.getElementById("fileInput").click()}>
        Ajouter des fichiers
      </button>
      <input
        id="fileInput"
        type="file"
        multiple
        style={{ display: "none" }}
        accept=".pdf,.docx,.zip"
        onChange={handleFileChange}
      />
      <button
        disabled={files.length === 0 || !agentName}
        onClick={() => {
          createAgent();
        }}
      >
        Créer
      </button>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <div className="file">
              <div className="icon">
                {file.name.split(".").pop() === "pdf" ? (
                  <img
                    src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/PDF_file_icon.svg_pwXmhKgZ0.png?updatedAt=1699062113427"
                    alt="pdf"
                  />
                ) : file.name.split(".").pop() === "docx" ? (
                  <img
                    src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/docx-9_OrPH9UDFT.png?updatedAt=1699062112933"
                    alt="docx"
                  />
                ) : file.name.split(".").pop() === "pptx" ? (
                  <img
                    src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Microsoft_Office_PowerPoint_(2019_present)_AnE-7A58F.png?updatedAt=1699062113537"
                    alt="docx"
                  />
                ) : null}
              </div>
              <p>{file.name}</p>
            </div>
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AgentForm;
