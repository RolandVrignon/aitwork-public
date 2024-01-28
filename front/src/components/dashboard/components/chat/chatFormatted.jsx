import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import copy from "copy-to-clipboard";
import remarkGfm from "remark-gfm";
import Parameter from "./parameter/parameter";
import FolderStructure from "../FolderStructure/folderStructure";
import DCERender from "../DCERender/DCERender";

const ChatFormatted = ({
  index,
  handleSendMessage,
  project,
  setSendReady,
  parameters,
  message,
  darkMode,
  hideProgressBar,
  user,
  editable,
  progress,
  setParameters,
  updateMessage,
  Request,
  updateMessageContent,
  selectedChat,
  updateChatDb,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copySuccessJSON, setCopySuccessJSON] = useState(false);
  const [copySuccessGPT, setCopySuccessGPT] = useState(false);
  const [showPdfContent, setShowPdfContent] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [paramStatuses, setParamStatuses] = useState(
    message.template?.parameters
      ? message.template.parameters.map(() => false)
      : []
  );
  const [fonctionReady, setFonctionReady] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;

  useEffect(() => {
    setFonctionReady(paramStatuses.every((status) => status));
  }, [paramStatuses]);

  const handleCopyClick = (code, type = null) => {
    copy(code);
    if (type === "json") {
      setCopySuccessJSON(true);
      setTimeout(() => setCopySuccessJSON(false), 2000);
    } else if (type === "gpt") {
      setCopySuccessGPT(true);
      setTimeout(() => setCopySuccessGPT(false), 2000);
    } else {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const CustomTable = ({ children, ...props }) => {
    const extractText = (element) => {
      if (typeof element === "string") {
        return element;
      } else if (React.isValidElement(element)) {
        return element.props.children;
      } else {
        return null;
      }
    };

    let header = [];
    if (
      children &&
      children[0]?.props?.children &&
      children[0].props.children[0]
    ) {
      header =
        children[0].props.children[0].props.children?.map((headerCell) => {
          return extractText(headerCell?.props?.children?.[0]);
        }) || [];
    }

    let rows = [];
    if (children && children[1]?.props?.children) {
      rows =
        children[1].props.children?.map((row) => {
          return (
            row?.props?.children?.map((cell) => {
              return extractText(cell?.props?.children?.[0]);
            }) || []
          );
        }) || [];
    }

    const tableData = [header, ...rows];

    const handleTableCopyClick = () => {
      let csvContent = tableData.map((e) => e.join(",")).join("\n");
      copy(csvContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
      <>
        <div className="tableContainer">
          <table {...props}>{children}</table>
        </div>
        <button className="copyButton" onClick={handleTableCopyClick}>
          {copySuccess ? "Copié!" : "Copier en csv"}
        </button>
      </>
    );
  };

  const CustomCode = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div className="codeContainer">
        <SyntaxHighlighter
          style={darkMode ? oneDark : materialLight}
          language={match[1] || "javascript"}
          PreTag="div"
          className="codeFormatted"
          children={String(children).replace(/\n$/, "")}
          {...props}
        />
        <button
          className="copyButton"
          onClick={() => handleCopyClick(String(children).replace(/\n$/, ""))}
        >
          {copySuccess ? "Copié!" : "Copier"}
        </button>
      </div>
    ) : (
      <span className="span-code">{String(children)}</span>
    );
  };

  const components = {
    code: CustomCode,
    table: CustomTable,
  };

  const handleViewMoreClick = () => {
    setShowPdfContent(!showPdfContent);
  };

  const formatFilePath = (filePath) => {
    const fileNameWithExtension = filePath.split("/").pop(); // Extrait "Adam Suleman - CV 2023-KD3rioB-i.pdf"
    const parts = fileNameWithExtension.split("."); // Divise le nom du fichier en utilisant le point comme séparateur
    parts.pop(); // Retire la dernière partie (l'extension)
    const fileNameWithoutExtension = parts.join("."); // Réassemble les parties
    const truncatedFileName = fileNameWithoutExtension.slice(0, -10);
    return truncatedFileName;
  };

  const handleViewMoreClickPdf = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const handleToggleAllChecks = () => {
    if (checkedItems.length === message.pages.length) {
      setCheckedItems([]);
      let updatedMessage = { ...message, content: "" };
      updateMessage(updatedMessage);
    } else {
      setCheckedItems(message.pages.map((_, index) => index));
      let updatedMessage = {
        ...message,
        content: message.pages.map((page) => page.text).join(""),
      };
      updateMessage(updatedMessage);
    }
  };

  const handleCheckboxChange = (event, index) => {
    if (event.target.checked) {
      let newContent = message.pages[index].text + message.content;
      let updatedMessage = { ...message, content: newContent };
      updateMessage(updatedMessage); // Use the updateMessage function here
      setCheckedItems([...checkedItems, index]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== index));
      let updatedContent = message.content.replace(
        message.pages[index].text,
        ""
      );
      let updatedMessage = { ...message, content: updatedContent };
      updateMessage(updatedMessage); // And here
    }
  };

  return (
    <div className="chat-formatted">
      {/* ROLE */}

      {!message.template && (
        <div
          className={`role ${message.role}`}
          style={
            message.role === "user"
              ? {
                  backgroundImage: user
                    ? `url(${user.profilePic}&tr=w-40,h-auto)`
                    : `url(https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/19_Zt2nhX2Tn.png?updatedAt=1682989404249&tr=w-40,h-auto)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          {message.role === "assistant" ? (
            <p>🥸</p>
          ) : message.role === "system" ? (
            <p>⚙️</p>
          ) : message.role === "function" ? (
            <img
              src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/couches_Pce30hbLp.png?updatedAt=1689113997083"
              alt="function"
            />
          ) : (
            ""
          )}
        </div>
      )}

      {/* CONTENT */}

      {!message.image &&
      (message.content !== null || message.role === "assistant") &&
      !message.function ? (
        message.content?.length === 0 &&
        (!message.type || message.type !== "error-stop") &&
        !message.pages && message.role === 'assistant' ? (
          <div className="loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : message.type && message.type === "pdf" ? (
          <div className="pdf-container">
            <div className="pdf">
              <div className="logo">
                <img
                  src="https://ik.imagekit.io/z0tzxea0wgx/Cogitum/PDF_file_icon.svg_hFHGoPbIC.png?updatedAt=1686166532222&tr=h-100,w-auto"
                  alt="pdf-logo"
                />
              </div>
              <div className="content">
                <div className="pdf-title">{message.name}</div>
                <div
                  className={`status ${
                    message.pages.length > 0 ? "ok" : "nok"
                  }`}
                >
                  {message.pages.length > 0 ? (
                    <p>Enregistré.</p>
                  ) : (
                    <p>Erreur.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="infos" onClick={handleViewMoreClick}>
              {showPdfContent ? "Voir moins" : "Voir plus"}
            </div>
            <div className="pdf-content">
              {showPdfContent && (
                <>
                  <button onClick={handleToggleAllChecks}>
                    {checkedItems.length === message.pages.length
                      ? "Tout décocher"
                      : "Tout cocher"}
                  </button>
                  {message.pages.map((page, index) => (
                    <div key={index} className="pdf-page">
                      <div className="headline">
                        <input
                          type="checkbox"
                          checked={checkedItems.includes(index)}
                          onChange={(event) =>
                            handleCheckboxChange(event, index)
                          }
                        />
                        <div
                          className={`pdf-page-header ${
                            expandedItems.includes(index) ? "expanded" : ""
                          }`}
                          onClick={() => handleViewMoreClickPdf(index)}
                        >
                          {expandedItems.includes(index) ? "▼" : "▸"} Page{" "}
                          {page.page}
                        </div>
                      </div>
                      {expandedItems.includes(index) && <p>{page.text}</p>}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : message.type && message.type === "json" ? (
          <div className="content">
            <h3>
              {message.title} :{" "}
              <a
                href={`${apiUrl}/files/${message.filePath}`}
                target="_blank"
                rel="noreferrer"
              >
                {formatFilePath(message.filePath)}
              </a>
            </h3>
            <p>{message.description}</p>
            <pre className="json-container">
              <div className="codeContainer">
                <SyntaxHighlighter
                  style={darkMode ? oneDark : materialLight}
                  language="json"
                  PreTag="div"
                  className="codeFormatted"
                  children={JSON.stringify(message.contentToShow, null, 2)}
                />
              </div>
              <div className="buttons">
                <button
                  className="copyButton"
                  onClick={() =>
                    handleCopyClick(
                      JSON.stringify(JSON.parse(message.content), null, 2),
                      "json"
                    )
                  }
                >
                  {copySuccessJSON ? "Copié!" : "Copier en JSON"}
                </button>
                <button
                  className="copyButton"
                  onClick={() => handleCopyClick(message.content, "json")}
                >
                  {copySuccessGPT ? "Copié!" : "Copier pour GPT"}
                </button>
              </div>
            </pre>
          </div>
        ) : (
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            className="content"
          >
            {message.content}
          </ReactMarkdown>
        )
      ) : null}

      {/* IMAGE */}
      {message.image && (
        <>
          <div className="image">
            <div className="img-container">
              <a href={message.contentToShow} target="_blank" rel="noreferrer">
                <img src={message.contentToShow} alt={message.alt} />
              </a>
            </div>

            <div className="buttons">
              {message.edit && <button>Modifier</button>}

              {message.variations && <button>Variation</button>}
            </div>
          </div>
        </>
      )}

      {message.function ? (
        message.functionName === "DCE" ? (
          <div className="function-DCE">
            {typeof message.structure === "object" &&
              message.structure !== null && (
                <FolderStructure folderStruct={message.structure} />
              )}

            <div className="dce">
              {typeof message.content === "object" &&
              message.content !== null ? (
                <DCERender
                  editable={editable}
                  data={message.content}
                  index={index}
                  updateMessageContent={updateMessageContent}
                  selectedChat={selectedChat}
                  updateChatDb={updateChatDb}
                />
              ) : (
                <div className="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          </div>
        ) : null
      ) : null}

      {/* TEMPLATE */}
      {message.template && message.template.function ? (
        <div className="function-container">
          <h2>Fonction {message.template.label}</h2>

          {/* {message.template.description && ( */}
          <div className="description">
            <p>{message.template.description}</p>
          </div>
          {/* // )} */}

          <div className="parameters">
            {message.template.parameters?.map((param, index) => (
              <Parameter
                key={index}
                index={index}
                param={param}
                setParameters={setParameters}
                setParamStatuses={setParamStatuses}
                parameters={parameters}
                Request={Request}
              />
            ))}
          </div>
          {!hideProgressBar && (
            <button
              disabled={!fonctionReady}
              onClick={(e) => {
                handleSendMessage(e, null, true);
                setSendReady(false);
                setFonctionReady(!fonctionReady);
              }}
            >
              <div
                className="progressBar"
                style={{ width: `${progress}%` }}
              ></div>
              <div className="button-content">
                {progress > 0 ? `${progress}%` : "Lancer la fonction"}
              </div>
            </button>
          )}
        </div>
      ) : message.template && message.template.label ? (
        <h2>Plugin {message.template.label}</h2>
      ) : null}
    </div>
  );
};

export default ChatFormatted;
