import React, { useState, useCallback, useRef, useEffect } from "react";
import autosize from "autosize";
import ChatFormatted from "./chatFormatted.jsx";
import io from "socket.io-client";
import NewChat from "../NewChat/newChat.jsx";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExtensionIcon from "@mui/icons-material/Extension";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SettingsIcon from "@mui/icons-material/Settings";
import * as pdfjs from "pdfjs-dist";
import { pdfjsWorker } from "pdfjs-dist/webpack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { extractTextFromPDF } from "./pdf/pdfExtract.jsx";
import pako from "pako";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Chat = ({
  Request,
  selectedChatRef,
  updateChatDb,
  darkMode,
  ...props
}) => {
  const {
    selectedChat,
    decryptedToken,
    setChats,
    setSelectedChat,
    messages,
    setMessages,
    user,
    setSettings,
    plugin,
    close,
    setClose,
    handleSettings,
    navigateToDashboard,
    progress,
    setProgress,
    socket,
    setGenerationTaskId,
    handleStopGeneration,
    selectedAgentRef,
  } = props;

  // const [generationTaskId, setGenerationTaskId] = useState(null);
  const [sendReady, setSendReady] = useState(false);

  const [messageText, setMessageText] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const [temperature] = useState(1);
  const [hideProgressBar, setHideProgressBar] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [error, setError] = useState("");
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);
  const [maxTokens] = useState(2048);
  const [template, setTemplate] = useState("");
  const [parameters, setParameters] = useState([]);
  const [showInput, setShowInput] = useState(false);

  const [closeButtons, setCloseButtons] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;

  // const socket = useRef(null);
  const textareaRef = useRef(null);
  const messagesRef = useRef(messages);
  const parametersRef = useRef(parameters);
  const messagesEndRef = useRef(null);

  // const handleStopGeneration = useCallback(() => {
  //   if (generationTaskId && socket.current) {
  //     socket.current.emit("stopGeneration", {
  //       taskId: generationTaskId,
  //       chatId: selectedChatRef.current.id,
  //       chatName: selectedChatRef.current.name,
  //     });
  //   }
  //   // eslint-disable-next-line
  // }, [generationTaskId]);

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const fetchData = async () => {
      let res = await Request.Get("protected/openai/models");
      setModels(res);

      if (res.includes("gpt-3.5-turbo-16k-0613")) {
        setSelectedModel("gpt-3.5-turbo-16k-0613");
      } else {
        setSelectedModel("gpt-3.5-turbo");
      }
    };

    fetchData();
    setSendReady(true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    if (messagesRef.current.length > 1) setHideProgressBar(true);
  // eslint-disable-next-line
  }, [messages]);

  useEffect(() => {
    if (
      messages.length === 1 &&
      messages[0].role === "function" &&
      messages[0].template.function
    ) {
      setShowInput(false);
    } else if (messages[0] && messages[0].functionName && messages[0].functionName === "DCE") {
      setShowInput(false);
    } else {
      scrollToBottom();
      setShowInput(true);
    }
  }, [messages]);

  useEffect(() => {
    if (selectedChat.id && messages.length > 0 && !closeButtons)
    updateChatDb({ id: selectedChat.id, messages });
  // eslint-disable-next-line
  }, [messages]);

  useEffect(() => {
    parametersRef.current = parameters;
  }, [parameters]);

  useEffect(() => {
    setHideProgressBar(false);
    handleStopGeneration();
    //eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    if (!decryptedToken) {
      return;
    }

    socket.current = io(`${apiUrl}`, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    socket.current.on("connect", () => {});

    let receivedMessage = "";

    let newChat = true;

    socket.current.on("chatResponse", async (response) => {
      if (response && !response.end && response.content) {
        receivedMessage += response.content;
        if (!selectedChatRef.current.id && response.chatId && newChat) {
          setChats((prevChats) => [
            ...prevChats,
            { id: response.chatId, name: response.chatName, favorite: false },
          ]);
          newChat = false;
        }
        if (!response.end) {
          if (response.progress) setProgress(response.progress);
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const updatedMessage = {
              ...lastMessage,
              title: response.title ? response.title : null,
              description: response.description ? response.description : null,
              filePath: response.filePath ? response.filePath : null,
              structure: response.structure ? response.structure : null,
              function: response.function ? response.function : null,
              functionName: response.functionName
                ? response.functionName
                : null,
              contentToShow: response.contentToShow ? response.contentToShow : null,
              content:
                response.type === "json" || response.functionName === "DCE"
                  ? response.content
                  : receivedMessage,
              type: response.type ? response.type : null,
              image: response.image ? response.image : null,
              alt: response.alt ? response.alt : null,
              edit: response.edit ? response.edit : null,
              variations: response.variations ? response.variations : null,
            };
            return prevMessages
              .slice(0, prevMessages.length - 1)
              .concat([updatedMessage]);
          });
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const updatedMessage = {
              ...lastMessage,
              type: response.type ? response.type : null,
            };
            return prevMessages
              .slice(0, prevMessages.length - 1)
              .concat([updatedMessage]);
          });
        }
        return;
      } else if (response && response.end) {
        if (response.status && response.status === 400) {
          setError(response.message);
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const updatedMessage = {
              ...lastMessage,
              content: response.message,
              type: "error-stop",
            };
            return prevMessages
              .slice(0, prevMessages.length - 1)
              .concat([updatedMessage]);
          });
          setProgress(100);
          setSendReady(true);
          setTemplate("");
          setParameters([]);
          setTimeout(() => {
            setError("");
          }, 5000);
        } else {
          await sleep(500);
          try {
            await updateChatDb({
              id: response.chatId,
              messages:
                messagesRef.current[0]?.role === "function"
                  ? messagesRef.current.slice(1)
                  : messagesRef.current,
            });
          } catch (error) {
            console.log(error);
          }
          await setSelectedChat({
            id: response.chatId,
            name: response.chatName,
            favorite: false,
          });
          receivedMessage = "";
          setTemplate("");
          setParameters([]);
          setSendReady(true);
        }
      }
    });

    socket.current.on("taskId", (taskId) => {
      setGenerationTaskId(taskId);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const addMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // eslint-disable-next-line
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = useCallback(
    (event, text = messageText, isFromFunction = false) => {
      event.preventDefault();

      let updatedMessagesForSending = null;
      if (!isFromFunction) {
        const newMessageObj = {
          role: selectedRole,
          content: text,
        };

        const updatedMessages = [...messages, newMessageObj];
        updatedMessagesForSending = updatedMessages.map(
          ({ role, content }) => ({ role, content })
        );

        setMessages(updatedMessages);
      }

      if (selectedRole !== "user") {
        setSendReady(true);
        setMessageText("");
        return;
      } else {
        let updatedParameters;
        setParameters((prevParameters) => {
          updatedParameters = [...prevParameters];
          return updatedParameters;
        });
      }

      addMessage({ role: "assistant", content: "" });

      if (template.label === "DCE") setHideProgressBar(true);

      const obj = {
        scope: "intern",
        chatId: selectedChat.id,
        chatName: selectedChat.name,
        model: selectedModel,
        temperature,
        maxTokens,
        messages: updatedMessagesForSending
          ? updatedMessagesForSending
          : messages,
        decryptedToken,
        role: selectedRole,
        plugin: plugin === "cogichat" ? "cogipro" : "onboarding",
        template: plugin === "cogichat" ? template : null,
        function:
          plugin === "cogichat" && template.function
            ? template.function
            : false,
        parameters: parametersRef.current,
        selectedAgentRef: selectedAgentRef.current ? selectedAgentRef.current : null,
      };

      const jsonString = JSON.stringify(obj);
      const compressedData = pako.gzip(jsonString);

      socket.current.emit("chat", compressedData, (error) => {
        if (error) {
          console.error(error);
          return;
        }
      });

      setMessageText("");
    },
    // eslint-disable-next-line
    [
      selectedRole,
      messageText,
      selectedModel,
      temperature,
      decryptedToken,
      messages,
      addMessage,
      maxTokens,
    ]
  );

  const handleInputChange = useCallback((event) => {
    setMessageText(event.target.value);
  }, []);

  const handleRoleChange = useCallback((event) => {
    setSelectedRole(event.target.value);
  }, []);

  const handleModelChange = useCallback((event) => {
    setSelectedModel(event.target.value);
  }, []);

  const handleKeyDown = (event) => {
    if (sendReady && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setSendReady(false);
      handleSendMessage(event);
    } else {
      return;
    }
  };

  const instantUpdateChatDb = async () => {
    updateChatDb({ id: selectedChat.id, messages });
  };

  const handleSendIconClick = (event) => {
    if (sendReady) {
      setSendReady(false);
      handleSendMessage(event);
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredMessageIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredMessageIndex(null);
  };

  const handleDeleteMessage = (indexToDelete) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter(
        (_, index) => index !== indexToDelete
      );
      updateChatDb({ id: selectedChat.id, messages: updatedMessages });
      return updatedMessages;
    });
  };

  const handleNewChat = () => {
    setSelectedChat({ name: null, id: null, favorite: false });
    setMessages([]);
  };

  const handleSettingsClick = () => {
    setShowButtons(!showButtons);
    setCloseButtons(!closeButtons);
  };

  const onFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "system",
              name: file.name,
              content: "Processing...",
              type: "progress",
              progress: 0,
            },
          ]);
          const progressCallback = (progress) => {
            setMessages((prevMessages) => {
              const messagesCopy = [...prevMessages];
              const lastMessage = messagesCopy[messagesCopy.length - 1];
              if (lastMessage.type === "progress") {
                lastMessage.content = `Processing... (${Math.round(
                  progress * 100
                )}%)`;
                lastMessage.progress = progress;
              }
              return messagesCopy;
            });
          };
          const pdf = await extractTextFromPDF(
            new Uint8Array(e.target.result),
            file,
            progressCallback
          );
          setMessages((prevMessages) => {
            const messagesCopy = [...prevMessages];
            const lastMessage = messagesCopy[messagesCopy.length - 1];
            if (lastMessage.type === "progress") {
              lastMessage.pages = pdf.text;
              lastMessage.content = "pdf";
              lastMessage.type = "pdf";
              delete lastMessage.progress;
            }
            return messagesCopy;
          });
        } catch (error) {
          console.error("Error extracting text from PDF:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    // eslint-disable-next-line
  }, []);

  const updateMessage = (index, updatedMessage) => {
    setMessages(
      messages.map((message, idx) => (idx === index ? updatedMessage : message))
    );
  };

  const updateMessageContent = (index, newContent) => {
    setMessages((currentMessages) =>
      currentMessages.map((msg, idx) =>
        idx === index ? { ...msg, content: newContent } : msg
      )
    );
  };

  const sharedChat = async () => {
    let res = await Request.Post(
      "/protected/shared",
      selectedChatRef.current.id
    );
    if (res && res.id) {
      const newTabUrl = `${window.location.origin}/shared/${res.id}`;
      window.open(newTabUrl, "_blank");
    }
  };

  return (
    <div className="content chat">
      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((messageObj, index) => (
            <div
              key={index}
              className={`message ${index % 2 === 0 ? "pair" : "unpair"}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <ChatFormatted
                index={index}
                handleSendMessage={handleSendMessage}
                project={template}
                message={messageObj}
                setSendReady={setSendReady}
                darkMode={darkMode}
                editable={true}
                user={user}
                progress={progress}
                parameters={parameters}
                setParameters={setParameters}
                updateMessage={(newMessage) => updateMessage(index, newMessage)}
                hideProgressBar={hideProgressBar}
                Request={Request}
                updateMessageContent={updateMessageContent}
                selectedChat={selectedChat}
                updateChatDb={updateChatDb}
              />
              {hoveredMessageIndex === index && (
                <div className="message-actions">
                  <div className="btn">
                    <svg
                      onClick={() => handleDeleteMessage(index)}
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
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <NewChat
            plugin={plugin}
            setMessages={setMessages}
            template={template}
            setTemplate={setTemplate}
            setSettings={setSettings}
            user={user}
            setSendReady={setSendReady}
            handleSendMessage={handleSendMessage}
          />
        )}
        <div className="down" ref={messagesEndRef} />
      </div>

      {showInput && (
        <div className="chat-input">
          <div className="input-container">
            <div className={`chat-error ${error !== "" ? "active" : ""}`}>
              {error}
              <div className="cross" onClick={() => setError("")}>
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
            </div>
            <div className="new">
              <div className="vertical">
                {showButtons ? (
                  <div className="test">
                    <div
                      className="mobile-btn settings"
                      onClick={() => navigateToDashboard()}
                    >
                      <ExtensionIcon />
                    </div>
                    <div
                      className="mobile-btn settings"
                      onClick={() => handleSettings()}
                    >
                      <SettingsIcon />
                    </div>
                    <label
                      htmlFor="file-upload"
                      className="mobile-btn new-conv"
                    >
                      <PictureAsPdfIcon />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={onFileChange}
                      accept=".pdf"
                      style={{ display: "none" }}
                    />
                    {close ? (
                      <div
                        className="mobile-btn sidebar-btn"
                        onClick={() => setClose(!close)}
                      >
                        <KeyboardArrowRightIcon />
                      </div>
                    ) : (
                      <div
                        className="mobile-btn sidebar-btn"
                        onClick={() => setClose(!close)}
                      >
                        <KeyboardArrowLeftIcon />
                      </div>
                    )}
                    <div
                      className="mobile-btn settings"
                      onClick={() => handleSettingsClick()}
                    >
                      <CloseIcon />
                    </div>
                  </div>
                ) : (
                  <div className="test">
                    <div
                      className="mobile-btn settings"
                      onClick={() => {
                        handleSettingsClick();
                      }}
                    >
                      <SettingsSuggestIcon />
                    </div>
                  </div>
                )}
                <div
                  className="mobile-btn new-conv"
                  onClick={() => handleNewChat()}
                >
                  <AddIcon />
                </div>
              </div>
            </div>
            <div className="options">
              {models.length > 0 && sendReady && (
                <>
                  <select
                    className="role"
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    <option value="system">Système</option>
                    <option value="user">Utilisateur</option>
                    <option value="assistant">Assistant</option>
                  </select>
                  <select
                    className="model"
                    value={selectedModel}
                    onChange={handleModelChange}
                  >
                    {models.length > 0 &&
                      models.map((model) => (
                        <option value={model} key={model}>
                          {model}
                        </option>
                      ))}
                  </select>
                  <button
                    disabled={messages.length === 0}
                    onClick={() => {
                      sharedChat();
                    }}
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon-sm"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Partager
                  </button>
                </>
              )}
              {!sendReady && (
                <button type="button" onClick={handleStopGeneration}>
                  Stop
                </button>
              )}
            </div>
            <form
              className="input"
              onSubmit={(event) => {
                event.preventDefault();
                handleSendMessage(event);
              }}
            >
              <div className="textarea-container">
                <textarea
                  ref={textareaRef}
                  type="text"
                  placeholder="Entrez votre message ici..."
                  value={messageText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                {sendReady ? (
                  <svg
                    onClick={handleSendIconClick}
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <circle cx="6" cy="12" r="2" fill="currentColor" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <circle cx="18" cy="12" r="2" fill="currentColor" />
                  </svg>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
