import React, { useState, useRef, useCallback, useEffect } from "react";

const Parameters = ({
  param,
  index,
  setParameters,
  setParamStatuses,
  parameters,
  Request,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [namePdf, setNamePdf] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [sizePdf, setSizePdf] = useState("");
  const [zipName, setZipName] = useState("");
  const [zipSize, setZipSize] = useState("");
  const [checklistActiveButton, setChecklistActiveButton] = useState(null);
  const inputFileRef = useRef(null);
  const parametersRef = useRef([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {

    console.log('param.type:', param.type)
    console.log('param:', param)
    console.log('parameters[index]:', parameters[index])
    console.log('parameters[index]?.content:', parameters[index]?.content)
    console.log('parameters[index]?.content?.length:', parameters[index]?.content?.length)

    if (param.type.includes("checklist")) {
      if (parameters[index]?.content) {
        setParamStatuses((prevStatuses) => {
          const newStatuses = [...prevStatuses];
          newStatuses[index] = true;
          return newStatuses;
        });
      } else {
        setParamStatuses((prevStatuses) => {
          const newStatuses = [...prevStatuses];
          newStatuses[index] = false;
          return newStatuses;
        });
      }
    }
    //eslint-disable-next-line
  }, [parameters]);

  useEffect(() => {
    setParameters((prevParameters) => {
      const newParameters = [...prevParameters];
      newParameters[index] = { type: param.type, content: selectedItems };
      return newParameters;
    });
    //eslint-disable-next-line
  }, [selectedItems]);

  async function uploadZipFile(file) {
    const formData = new FormData();
    formData.append("fileField", file);

    setIsUploading(true);
    const response = await Request.PostFile(
      "/protected/uploads",
      formData,
      file.name,
      param.fileMaxSize,
      param.minioTags,
      (progress) => setUploadProgress(progress) // Ajoutez cette ligne
    );
    setIsUploading(false);
    setUploadProgress(0);

    return response;
  }

  async function uploadPdf(file) {
    const formData = new FormData();
    formData.append("fileField", file);
    let response;

    setIsUploading(true);



    response = await Request.PostFile(
      "/protected/uploads",
      formData,
      file.name,
      param.fileMaxSize,
      param.minioTags,
      (progress) => setUploadProgress(progress)
    );

    setIsUploading(false);
    setUploadProgress(0);

    return response;
  }

  const onFileChange = useCallback(async (event) => {
    if (param.type === "pdf") {
      const pdf = event.target.files[0];
      if (pdf) {
        try {
          // Appel à la fonction pour uploader le fichier zip et obtenir le fileId en retour
          const data = await uploadPdf(pdf);

          setNamePdf(data.fileName);
          setSizePdf(data.size);

          setParameters((prevParameters) => {
            const newParameters = [...prevParameters];
            newParameters[index] = {
              type: param.type,
              fileName: data.fileName,
            };
            parametersRef.current = newParameters;
            return newParameters;
          });
          setParamStatuses((prevStatuses) => {
            const newStatuses = [...prevStatuses];
            newStatuses[index] = true;
            return newStatuses;
          });
          setIsValid(true);
        } catch (error) {
          console.error("Error uploading zip file:", error);
        }
      }
    } else if (param.type === "zip") {
      const zipFile = event.target.files[0];
      if (zipFile) {
        try {
          // Appel à la fonction pour uploader le fichier zip et obtenir le fileId en retour
          const data = await uploadZipFile(zipFile);

          setZipName(data.fileName);
          setZipSize(data.size);

          // Utiliser fileId pour mettre à jour les paramètres ou autres états
          setParameters((prevParameters) => {
            const newParameters = [...prevParameters];
            newParameters[index] = {
              type: param.type,
              fileName: data.fileName,
            };
            parametersRef.current = newParameters;
            return newParameters;
          });
          setParamStatuses((prevStatuses) => {
            const newStatuses = [...prevStatuses];
            newStatuses[index] = true;
            return newStatuses;
          });
          setIsValid(true);
        } catch (error) {
          console.error("Error uploading zip file:", error);
        }
      }
    }
    // eslint-disable-next-line
  }, []);

  const checklistButtonClick = useCallback((item, index, idx) => {
    setChecklistActiveButton(idx);
    setIsValid(true);
    setParameters((prevParameters) => {
      const newParameters = [...prevParameters];
      newParameters[index] = { type: param.type, content: item }; // setting the parameter to the clicked button's text
      return newParameters;
    });
    console.log("YEAAAAH");
    setParamStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      newStatuses[index] = true;
      return newStatuses;
    });
    console.log(parametersRef.current);
    //eslint-disable-next-line
  }, []);

  const toggleItem = (item, index, idx) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const toggleAllItems = (fields) => {
    const allSelected = fields.every((field) => selectedItems.includes(field));

    if (allSelected) {
      setSelectedItems(selectedItems.filter((item) => !fields.includes(item)));
    } else {
      setSelectedItems([...new Set([...selectedItems, ...fields])]);
    }
  };

  const handleClick = () => {
    if (isValid) {
      return;
    }

    if (param.type === "pdf" || param.type === "zip") {
      inputFileRef.current.click();
    }
  };

  const handleTextChange = (index, event) => {
    const newText = event.target.value;

    // Mettre à jour 'parameters'
    setParameters((prevParameters) => {
      const newParameters = [...prevParameters];
      newParameters[index] = { type: "string", content: newText };
      return newParameters;
    });

    // Mettre à jour 'paramStatuses' si le texte n'est pas vide
    setParamStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      newStatuses[index] = newText !== "";
      return newStatuses;
    });
  };

  return (
    <div
      className={`param-container ${
        param.type.includes("checklist") ? "double no-click" : "single click"
      }`}
    >
      <h3>{param.label}</h3>
      {param.type === "plurial-checklist" ? (
        param.value.map((item, idx) => (
          <div key={idx}>
            <div className="header">
              <h4>• {item.name}</h4>
              <h4
                className="toggle-all-button"
                onClick={() => toggleAllItems(item.fields, item)}
              >
                {item.fields.every((field) => selectedItems.includes(field))
                  ? "Tout décocher"
                  : "Tout cocher"}
              </h4>
            </div>
            <div
              className={`param-button ${isValid ? "valid" : ""}`}
              onClick={handleClick}
            >
              <div className="checklist-container">
                <div className="buttons">
                  {item.fields.map((field, fieldIdx) => (
                    <div
                      key={fieldIdx} // Ajout d'une clé unique ici
                      className={`btn ${
                        selectedItems.includes(field) ? "active" : ""
                      }`}
                      onClick={() => toggleItem(field, item)}
                    >
                      {field.exigence}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : param.type === "zip" ||
        param.type === "pdf" ||
        param.type === "checklist" ? (
        <div
          className={`param-button ${
            isValid ? "valid" : isUploading ? "upload" : "active"
          }`}
          onClick={handleClick}
        >
          {param.type === "pdf" && !isUploading ? (
            isValid ? (
              <div className="pdf-function">
                <div className="logo">
                  <img
                    src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/PDF_file_icon.svg_hFHGoPbIC.png?updatedAt=1686166532222&tr=h-100,w-auto"
                    alt="pdf-logo"
                  />
                </div>
                <div className="content">
                  <div className="title">{namePdf}</div>
                  <div className="pages">{sizePdf}</div>
                </div>
              </div>
            ) : (
              <img
                src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/addpdf_Wa31ZcO5L.png?updatedAt=1689086030740"
                alt="addpdf"
              />
            )
          ) : param.type === "checklist" ? (
            <div className="checklist-container">
              <div className="buttons">
                {param.value.map((item, idx) => (
                  <div
                    className={`btn ${
                      idx === checklistActiveButton ? "active" : ""
                    }`}
                    key={idx}
                    onClick={() => checklistButtonClick(item, index, idx)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : param.type === "zip" && !isUploading ? (
            isValid ? (
              <div className="pdf-function">
                <div className="logo">
                  <img
                    src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/zip_aHvCGeB1f.webp?updatedAt=1692205927836&tr=h-100,w-auto"
                    alt="pdf-logo"
                  />
                </div>
                <div className="content">
                  <div className="title">{zipName}</div>
                  <div className="pages">{zipSize}</div>
                </div>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                width="512.000000pt"
                height="512.000000pt"
                viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                  fill="#000000"
                  stroke="none"
                >
                  <path d="M1745 4940 c-726 -97 -1398 -187 -1492 -200 l-173 -23 0 -2146 0 -2146 1493 -204 c820 -112 1500 -206 1510 -209 16 -4 17 11 17 217 l0 221 793 0 c857 0 860 0 945 54 50 31 100 89 126 145 l21 46 0 1880 0 1880 -36 65 c-42 76 -109 133 -183 155 -42 13 -172 15 -858 15 l-808 0 0 215 c0 199 -1 215 -17 214 -10 -1 -612 -81 -1338 -179z m2988 -453 c16 -10 37 -32 47 -50 20 -31 20 -66 20 -1866 0 -1821 0 -1834 -20 -1866 -42 -68 -2 -65 -884 -65 l-796 0 0 1928 c0 1061 3 1932 7 1936 4 3 365 5 803 4 748 -3 798 -4 823 -21z m-2440 -1378 c177 -36 282 -176 263 -353 -21 -200 -183 -315 -443 -316 l-83 0 0 -186 0 -187 -77 7 c-42 3 -93 6 -115 6 l-38 0 0 505 0 505 23 5 c92 24 380 32 470 14z m-693 -520 l0 -512 -37 7 c-21 3 -71 6 -110 6 l-73 0 0 505 0 505 110 0 110 0 0 -511z m-370 433 l0 -68 -216 -329 -216 -330 64 -6 c35 -4 134 -7 221 -8 l157 -1 0 -96 0 -95 -92 5 c-51 3 -213 9 -360 12 l-268 6 0 57 c0 56 1 57 175 324 96 148 196 300 221 339 l45 70 -198 -3 -198 -4 -3 88 c-1 48 -1 88 0 89 4 2 398 14 546 16 l122 2 0 -68z" />
                  <path d="M3667 4424 c-4 -4 -7 -40 -7 -81 l0 -73 185 0 186 0 -3 78 -3 77 -176 3 c-96 1 -178 -1 -182 -4z" />
                  <path d="M3290 4125 l0 -75 185 0 185 0 0 75 0 75 -185 0 -185 0 0 -75z" />
                  <path d="M3660 3875 l0 -75 185 0 185 0 0 75 0 75 -185 0 -185 0 0 -75z" />
                  <path d="M3292 3638 l3 -73 183 -3 182 -2 0 75 0 75 -185 0 -186 0 3 -72z" />
                  <path d="M3660 3395 l0 -75 185 0 185 0 0 75 0 75 -185 0 -185 0 0 -75z" />
                  <path d="M3557 3156 c-94 -35 -158 -116 -181 -230 -7 -39 -30 -224 -50 -411 -39 -370 -38 -395 11 -490 49 -94 165 -172 283 -189 178 -26 371 123 396 307 9 62 -63 732 -87 818 -22 77 -78 148 -143 181 -52 27 -174 35 -229 14z m223 -911 l0 -255 -120 0 -120 0 0 255 0 255 120 0 120 0 0 -255z" />
                  <path d="M2034 2927 c-2 -7 -3 -78 -2 -157 l3 -145 58 -3 c115 -6 194 41 217 129 20 73 -10 143 -74 173 -43 20 -194 23 -202 3z" />
                </g>
              </svg>
            )
          ) : (param.type === "zip" || param.type === "pdf") && isUploading ? (
            <>
              <div className="overlay"></div>
              <div className="spinner">
                <div className="spinner-circle"></div>
                <div className="spinner-text">{`${parseInt(
                  uploadProgress
                )}%`}</div>
              </div>
            </>
          ) : (
            "+"
          )}

          {param.type === "pdf" ? (
            <input
              ref={inputFileRef}
              id="file-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={onFileChange}
              style={{ display: "none" }}
              disabled={isUploading}
            />
          ) : param.type === "zip" ? (
            <input
              ref={inputFileRef}
              id="file-upload"
              type="file"
              accept=".zip"
              onChange={onFileChange}
              style={{ display: "none" }}
              disabled={isUploading}
            />
          ) : (
            <></>
          )}
          {isValid && (
            <>
              <div className="overlay"></div>
              <div className="checked">
                <img
                  src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/verifier_1BFgD2y3Y.png?updatedAt=1689114193374"
                  alt="check"
                />
              </div>
            </>
          )}
        </div>
      ) : param.type === "string" ? (
        <div className="textbox">
          <input
            type="text"
            value={param.content}
            disabled={false}
            placeholder={param.value}
            onChange={(event) => handleTextChange(index, event)}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Parameters;
