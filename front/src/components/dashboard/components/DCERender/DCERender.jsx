import React, { useEffect, useRef, useState } from "react";
import EditableTextField from "./EditableTextField";
import Excel from "exceljs";
import ProgressBar from "./ProgressBar";

const ConclusionDropdown = ({ data, index, dataKey, updateMessageContent }) => {
  const handleChange = (event) => {
    const newConclusion = event.target.value;
    data["afterhuman"][dataKey].conclusion = newConclusion;
    updateMessageContent(index, data);
  };

  return (
    <select
      onChange={handleChange}
      defaultValue={data["afterhuman"][dataKey].conclusion || "-"}
    >
      <option value="0">✅</option>
      <option value="-1">❌</option>
      <option value="1">🟡</option>
    </select>
  );
};

const DCERender = ({
  editable,
  data,
  index,
  updateMessageContent,
  selectedChat,
  updateChatDb,
}) => {
  const [openRows, setOpenRows] = useState({});
  const [openFiles, setOpenFiles] = useState({});
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [variation, setVariation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedNormes, setSelectedNormes] = useState([]);
  const [selectedExtraits, setSelectedExtraits] = useState([]);

  const [status, setStatus] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exigencesLenght, setExigencesLenght] = useState(1);

  const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;

  const dataRef = useRef();
  const filteredKeysRef = useRef();

  useEffect(() => {
    setStatus(data["utils"].status ? data["utils"].status : 0);
    setExigencesLenght(
      data["utils"].exigencesLength ? data["utils"].exigencesLength : 1
    );

    console.log("data:", data);

    // Correct way to assign to dataRef
    if (data["final"] && !data["afterhuman"]) {
      setLoading(true);
      data["afterhuman"] = data["final"];
      dataRef.current = data["afterhuman"];
    } else if (data["final"] && data["afterhuman"]) {
      setLoading(true);
      dataRef.current = data["afterhuman"];

      let test = Object.keys(data["afterhuman"]).filter(
        (key) =>
          !["type", "name", "children", "metadata", "utils"].includes(key)
      );

      setFilteredKeys(test);
    }

    if (data["variation"]) {
      setVariation(data["variation"]);
    }
    setLoading(false);
  }, [data]);

  useEffect(() => {
    console.log("status:", status);
    if (status < 100) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    console.log("dataRef : ", dataRef.current);

    if (dataRef.current) {
      // Convertir l'objet en tableau pour le trier
      const entries = Object.entries(dataRef.current);

      // Trier par checked et ensuite par ordre alphabétique
      const sortedEntries = [...entries]
        .sort(([keyA, valueA], [keyB, valueB]) => {
          // Premièrement, trier par checked (non checked en premier)
          if ((valueA.checked === false || valueA.checked === undefined) && valueB.checked === true) {
            return -1;
          }
          if (valueA.checked === true && (valueB.checked === false || valueB.checked === undefined)) {
            return 1;
          }
          // Si checked est identique, trier par ordre alphabétique des clés
          return keyA.localeCompare(keyB);
        });

      // Vérifiez si les entrées triées sont différentes des entrées originales
      const hasChanged = sortedEntries.some(([key, value], index) => {
        return entries[index][0] !== key || entries[index][1] !== value;
      });

      if (hasChanged) {
        // Si un changement a été détecté, mettez à jour dataRef.current
        const newDataRef = sortedEntries.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
        dataRef.current = newDataRef;
        data["afterhuman"] = newDataRef;
        updateMessageContent(index, data);
      }

      // Mise à jour de filteredKeys après le tri
      setFilteredKeys(
        sortedEntries.map(([key]) => key).filter(
          (key) =>
            !["type", "name", "children", "metadata", "utils"].includes(key)
        )
      );
      setLoading(false);
    } else {
      setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRef.current]);


  useEffect(() => {
    console.log("variation : ", variation);
  }, [variation]);

  useEffect(() => {
    console.log("filteredKeys : ", filteredKeys);
    filteredKeysRef.current = filteredKeys;
    console.log("filteredKeysRef.current:", filteredKeysRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredKeysRef, filteredKeys, filteredKeysRef.current]);

  const toggleRow = (key) => {
    setOpenRows((prevState) => {
      const newState = { ...prevState };
      if (newState.hasOwnProperty(key)) {
        delete newState[key];
      } else {
        newState[key] = true;
      }
      return newState;
    });
  };


  const toggleFile = (key, fileName) => {
    setOpenFiles({
      ...openFiles,
      [`${key}-${fileName}`]: !openFiles[`${key}-${fileName}`],
    });
  };

  const transformFinalData = (finalData) => {
    return Object.keys(finalData).map((key) => {
      let item = finalData[key];
      return {
        Exigence: key,
        Description: item.label,
        Avis:
          item.conclusion === "0"
            ? "Conforme"
            : item.conclusion === "-1"
            ? "Non Conforme"
            : "A vérifier",
        Commentaire: item.explication || "",
        Fiabilité: item.variance + "%",
      };
    });
  };

  const transformFileData = (exigenceData, apiUrl) => {
    let fileDetails = [];
    exigenceData.files.forEach((file) => {
      file.result.forEach((result) => {
        const fileName = file.name.split("/").pop();
        const filePath = `${file.link}`;
        fileDetails.push({
          NomFichier: {
            text: fileName,
            hyperlink: filePath,
            font: { color: { argb: "FF0000FF" }, underline: true },
          },
          Extrait: result.information.extrait,
          Explication: result.information.explication,
          Conforme:
            parseInt(result.conforme) === 0
              ? "Conforme"
              : parseInt(result.conforme) === -1
              ? "Non conforme"
              : "A vérifier",
          Page: {
            text: `${result.page}`, // Le texte qui sera affiché
            hyperlink: `${file.link}#page=${result.page}`, // L'URL du lien avec l'ancre de page
            font: { color: { argb: "FF0000FF" }, underline: true },
          },
          Fiabilité: result.taux + "%",
          Poids: result.poids,
        });
      });
    });
    return fileDetails;
  };

  const downloadExcel = async () => {
    // Créer un nouveau classeur
    const workbook = new Excel.Workbook();

    // Données finales
    const finalData = data["afterhuman"]; // Assurez-vous que json est défini et contient vos données
    const transformedFinalData = transformFinalData(finalData);

    // Créer une feuille de calcul pour les résultats finaux
    const wsFinal = workbook.addWorksheet("Résultats Finaux");

    // Ajouter les en-têtes pour les résultats finaux
    wsFinal.columns = [
      { header: "Exigence", key: "Exigence", width: 20 },
      { header: "Description", key: "Description", width: 30 },
      { header: "Avis", key: "Avis", width: 10 },
      { header: "Commentaire", key: "Commentaire", width: 30 },
      { header: "Fiabilité", key: "Fiabilité", width: 15 },
    ];

    // Ajouter les données pour les résultats finaux
    transformedFinalData.forEach((item, index) => {
      const row = wsFinal.addRow(item);
      const cell = row.getCell("Exigence");
      cell.value = {
        text: item.Exigence,
        hyperlink: `'#${item.Exigence}!A1'`,
      };
      cell.font = { color: { argb: "FF0000FF" }, underline: true };
    });

    // Créer un onglet par exigence
    Object.keys(finalData).forEach((key) => {
      const exigenceData = finalData[key];
      const transformedFileData = transformFileData(exigenceData, apiUrl);
      const ws = workbook.addWorksheet(key);

      // Ajouter les en-têtes pour chaque exigence
      ws.columns = [
        { header: "NomFichier", key: "NomFichier", width: 30 },
        { header: "Extrait", key: "Extrait", width: 50 },
        { header: "Explication", key: "Explication", width: 50 },
        { header: "Conforme", key: "Conforme", width: 10 },
        { header: "Page", key: "Page", width: 10 },
        { header: "Fiabilité", key: "Fiabilité", width: 10 },
        { header: "Poids", key: "Poids", width: 10 },
      ];

      // Ajouter les données pour chaque exigence
      transformedFileData.forEach((data) => {
        const row = ws.addRow({
          NomFichier: data.NomFichier.text,
          Extrait: data.Extrait,
          Explication: data.Explication,
          Conforme: data.Conforme,
          Page: data.Page.text,
          Fiabilité: data.Fiabilité,
          Poids: data.Poids,
        });

        // Définir le lien hypertexte pour le NomFichier
        const fileNameCell = row.getCell("NomFichier");
        fileNameCell.value = {
          text: data.NomFichier.text,
          hyperlink: data.NomFichier.hyperlink,
        };
        fileNameCell.font = data.NomFichier.font;

        const pageCell = row.getCell("Page");
        pageCell.value = {
          text: data.Page.text,
          hyperlink: data.Page.hyperlink,
        };
        pageCell.font = data.Page.font;
      });
    });

    // Générer le buffer Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Créer un Blob à partir du buffer
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Créer un lien pour le téléchargement
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    let dlname = `${data.utils.name}-v${data.utils.version}-${data.utils.date}`;
    link.download = `${dlname}.xlsx`;

    // Simuler un clic sur le lien pour déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(JSON.stringify(data))
      .then(() => {
        alert("Contenu copié avec succès !");
      })
      .catch((err) => {
        alert(`Impossible de copier le texte : ${err}`);
      });
  };

  const handleCloseAllSections = () => {

    console.log("openFiles:", openFiles);

    // Close all opened files
    for (const key in openFiles) {
      const fileName = key.split("-")[1];
      if (openFiles[key]) {
        toggleFile(key, fileName);
      }
    }

    // Close all opened rows
    for (const key in openRows) {
      if (openRows[key]) {
        toggleRow(key);
      }
    }
  };

  const handleNormeChange = (event, idx) => {
    event.stopPropagation();
    setSelectedNormes((prev) => {
      const newSelectedNormes = [...prev];
      const isNormeSelected = newSelectedNormes.includes(idx);

      if (isNormeSelected) {
        newSelectedNormes.splice(newSelectedNormes.indexOf(idx), 1);
      } else {
        newSelectedNormes.push(idx);
      }

      // Mise à jour des extraits en fonction de la sélection de la norme
      const normeKey = filteredKeys[idx];
      const newSelectedExtraits = [...selectedExtraits];
      dataRef.current[normeKey].files.forEach((file, fileIndex) => {
        file.result.forEach((_, resultIndex) => {
          const extraitKey = `${normeKey}-${fileIndex}-${resultIndex}`;
          if (isNormeSelected) {
            // Supprimer l'extrait s'il est présent
            const extraitIndex = newSelectedExtraits.indexOf(extraitKey);
            if (extraitIndex > -1) {
              newSelectedExtraits.splice(extraitIndex, 1);
            }
          } else if (!newSelectedExtraits.includes(extraitKey)) {
            // Ajouter l'extrait s'il n'est pas déjà présent
            newSelectedExtraits.push(extraitKey);
          }
        });
      });

      setSelectedExtraits(newSelectedExtraits);
      return newSelectedNormes;
    });
  };

  const handleExtraitChange = (event, normeIdx, fileIndex, resultIndex) => {
    event.stopPropagation();
    const extraitKey = `${filteredKeys[normeIdx]}-${fileIndex}-${resultIndex}`;
    setSelectedExtraits((prev) => {
      const newSelectedExtraits = [...prev];
      if (newSelectedExtraits.includes(extraitKey)) {
        newSelectedExtraits.splice(newSelectedExtraits.indexOf(extraitKey), 1);
      } else {
        newSelectedExtraits.push(extraitKey);
      }
      return newSelectedExtraits;
    });
  };

  const handleDeleteSelected = () => {
    console.log("selectedNormes : ", selectedNormes);
    console.log("dataRef.current:", dataRef.current);

    setLoading(true);

    const newRefData = { ...dataRef.current };

    console.log("newRefData:", newRefData);

    selectedNormes.forEach((idx) => {
      console.log("idx:", idx);
      const normeKey = filteredKeys[idx];
      console.log("filteredKeys[idx]:", filteredKeys[idx]);
      console.log("dataRef.current[idx]:", dataRef.current[idx]);
      console.log("newRefData[normeKey]:", newRefData[normeKey]);
      delete newRefData[normeKey];
    });

    console.log("newRefData:", newRefData);

    console.log("selectedExtraits:", selectedExtraits);

    // Supprimer les extraits associés aux normes supprimées
    const newSelectedExtraits = selectedExtraits.filter((extraitKey) => {
      return !selectedNormes.some((idx) => {
        const normeKey = filteredKeys[idx];
        return extraitKey.startsWith(normeKey);
      });
    });

    newSelectedExtraits.forEach((extraitKey) => {
      const [normeKey, fileIndex, resultIndex] = extraitKey.split("-");
      if (
        dataRef.current[normeKey] &&
        dataRef.current[normeKey].files[fileIndex]
      ) {
        dataRef.current[normeKey].files[fileIndex].result.splice(
          resultIndex,
          1
        );
      }
    });

    // Mise à jour des états et du dataRef
    dataRef.current = newRefData;

    console.log("WAZOUUUU");
    console.log("dataRef.current:", dataRef.current);
    console.log("WAZOUUUU");

    setSelectedNormes([]);
    setSelectedExtraits([]);

    data["afterhuman"] = dataRef.current;

    setFilteredKeys(
      Object.keys(data["afterhuman"]).filter(
        (key) =>
          !["type", "name", "children", "metadata", "utils"].includes(key)
      )
    );

    updateMessageContent(index, data);

    console.log("dataRef.current :", dataRef.current);
  };

  const updateMetadatas = (key, value) => {
    data.utils[key] = value;
    updateMessageContent(index, data);
    updateChatDb({
      id: selectedChat.id,
      name: `DCE : ${data.utils.name}-v${data.utils.version}-${data.utils.date}`,
    });
  };

  useEffect(() => {
    let timeBetweenSteps = Math.ceil(exigencesLenght) * 30000;

    const simulateProgress = () => {
      if (progress >= 100) {
        return;
      }

      if (progress < status) {
        setProgress(progress + 1);
      }
    };

    setTimeout(simulateProgress, timeBetweenSteps);

    simulateProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, status]);

  const handleButtonClick = (key, e) => {
    e.stopPropagation();
    const newDataRef = { ...dataRef.current };
    // Vérifie si la propriété checked existe et bascule sa valeur
    newDataRef[key] = {
      ...newDataRef[key],
      checked: !newDataRef[key].checked, // Bascule entre true et false
    };
    dataRef.current = newDataRef;

    updateMessageContent(index, data);

    // Si nécessaire, déclenchez une mise à jour d'état ici pour re-rendre le composant
  };

  return (
    <>
      {!loading ? (
        <>
          <div className="head">
            <div className="inline">
              <h3>Nom</h3>
              <input
                type="text"
                value={data.utils.name}
                onChange={(e) => updateMetadatas("name", e.target.value)}
              />
            </div>
            <div className="inline">
              <h3>Version</h3>
              <input
                type="text"
                value={data.utils.version}
                onChange={(e) => updateMetadatas("version", e.target.value)}
              />
            </div>
            <div className="inline">
              <h3>Date</h3>
              <input
                type="text"
                value={data.utils.date}
                onChange={(e) => updateMetadatas("date", e.target.value)}
              />
            </div>
          </div>

          <div className="header">
            <button onClick={handleCloseAllSections} disabled={Object.keys(openRows).length === 0}>Fermer Sections</button>
            <button
              onClick={handleDeleteSelected}
              disabled={
                selectedExtraits.length === 0 && selectedNormes.length === 0
              }
            >
              Supprimer Sélectionnés
            </button>
            <button>Partager</button>
          </div>

          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Nom d'exigence</th>
                  <th>Description d'exigence</th>
                  <th>Niveau de Performance</th>
                  <th>Avis</th>
                  <th>Commentaire</th>
                  <th>Fiabilité</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeysRef.current.map((key, idx) => (
                  <React.Fragment key={key}>
                    <tr onClick={() => toggleRow(key)} className={dataRef.current[key].checked  ? "checked" : ""}>
                      <td>
                        <input
                          className="CheckBox"
                          type="checkbox"
                          checked={selectedNormes.includes(idx)}
                          onChange={(e) => handleNormeChange(e, idx)}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </td>
                      <td>{key}</td>
                      <td>{`${dataRef.current[key].label}` || ""}</td>
                      <td>
                        {dataRef.current[key].compliance !== ""
                          ? dataRef.current[key].compliance
                          : "-"}
                      </td>

                      <td>
                        {editable ? (
                          <ConclusionDropdown
                            data={data}
                            index={index}
                            dataKey={key}
                            updateMessageContent={updateMessageContent}
                          />
                        ) : parseInt(dataRef.current[key].conclusion) === 0 ? (
                          "✅"
                        ) : parseInt(dataRef.current[key].conclusion) === -1 ? (
                          "❌"
                        ) : (
                          "🟡"
                        )}
                      </td>
                      <td className="editable">
                        {editable ? (
                          <EditableTextField
                            data={data}
                            dataKey={key}
                            value={dataRef.current[key].explication || "roro"}
                            field={"explication"}
                            index={index}
                            updateMessageContent={updateMessageContent}
                          />
                        ) : (
                          dataRef.current[key].explication
                        )}
                      </td>
                      <td>
                        {dataRef.current[key].variance}%
                        <div className="roro">
                          <button onClick={(e) => handleButtonClick(key, e)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="icon check-circle"
                              height="1em"
                              width="1em"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M9 12l2 2 4-4"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {openRows[key] && (
                      <tr key={`${key}-details`}>
                        <td colSpan="7">
                          <div className="files">
                            {dataRef.current[key].files.map(
                              (file, fileIndex) => {
                                if (file.result && file.result.length > 0) {
                                  return (
                                    <div
                                      className="dropdown-container"
                                      key={file.name}
                                    >
                                      <div
                                        className="dropdown"
                                        onClick={() =>
                                          toggleFile(key, file.name)
                                        }
                                      >
                                        {file.name.split("/").slice(-1)[0]}
                                        <svg
                                          stroke="currentColor"
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
                                          <path d="M12 16l-6-8h12z"></path>
                                        </svg>
                                      </div>
                                      {openFiles[`${key}-${file.name}`] && (
                                        <table className="nested-table">
                                          <thead>
                                            {" "}
                                            <tr>
                                              <th></th>
                                              <th>Extrait</th>
                                              <th>Explication</th>
                                              <th>Avis</th>
                                              <th>Fiabilité</th>
                                              <th>Poids</th>
                                              <th>Page</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {file.result.map(
                                              (result, resultIndex) => (
                                                <tr
                                                  key={`${key}-${file.name}-${resultIndex}`}
                                                >
                                                  <td>
                                                    <input
                                                      className="CheckBox"
                                                      type="checkbox"
                                                      checked={selectedExtraits.includes(
                                                        `${key}-${fileIndex}-${resultIndex}`
                                                      )}
                                                      onChange={(e) =>
                                                        handleExtraitChange(
                                                          e,
                                                          idx,
                                                          fileIndex,
                                                          resultIndex
                                                        )
                                                      }
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                      }}
                                                    />
                                                  </td>
                                                  <td>
                                                    {result.information.extrait}
                                                  </td>
                                                  <td>
                                                    {
                                                      result.information
                                                        .explication
                                                    }
                                                  </td>
                                                  <td>
                                                    {result.conforme === 0
                                                      ? "✅"
                                                      : result.conforme === -1
                                                      ? "❌"
                                                      : "🟡"}
                                                  </td>
                                                  <td>{result.taux}%</td>
                                                  <td>{result.poids}</td>
                                                  <td>
                                                    <a
                                                      href={`${file.link}#page=${result.page}`}
                                                      target="_blank"
                                                      rel="noreferrer"
                                                    >
                                                      {result.page}
                                                    </a>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                      )}
                                    </div>
                                  );
                                }
                                return null;
                              }
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="footer-btn">
            <button onClick={handleCopy}>Copier le contenu</button>
            <button onClick={downloadExcel}>Télécharger en XLSX</button>
          </div>
        </>
      ) : (
        <ProgressBar
          rounds={Math.ceil(exigencesLenght / 10)}
          initialProgress={status}
          status={status}
        />
      )}
    </>
  );
};

export default DCERender;
