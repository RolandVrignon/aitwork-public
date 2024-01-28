import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import useRequest from "../../../useRequest.js";

import { Switch } from "@mui/material";

import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";

import ChatSidebar from "../components/sidebar/chat/chat.jsx";
import SettingsSidebar from "../components/sidebar/settings/settings.jsx";

import ChatContainer from "../components/chat/chat.jsx";
import SettingsContainer from "../components/settings/settings.jsx";

import Div100vh from "react-div-100vh";

const Onboarding = ({ darkMode, toggleDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState({
    name: null,
    id: null,
    favorite: false,
  });
  const [storedToken, setStoredToken] = useState("");
  const [decryptedToken, setDecryptedToken] = useState("");
  const [settings, setSettings] = useState("");
  const [progress, setProgress] = useState(0);
  const [close, setClose] = useState(window.innerWidth <= 767);
  const [user, setUser] = useState(null);

  const [generationTaskId, setGenerationTaskId] = useState(null);
  const socket = useRef(null);

  const handleStopGeneration = useCallback(() => {
    if (generationTaskId && socket.current) {
      socket.current.emit("stopGeneration", {
        taskId: generationTaskId,
        chatId: selectedChatRef.current.id,
        chatName: selectedChatRef.current.name,
      });
    }
    // eslint-disable-next-line
  }, [generationTaskId]);

  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  window.addEventListener("beforeunload", handleStopGeneration);

  const Request = useRequest();

  const selectedChatRef = useRef(selectedChat);
  const progressRef = useRef(progress);

  // METHODS

  const updateChatDb = async (chat) => {
    await Request.Put("/protected/chats/update", chat);
  };

  // USE_EFFECTS

  // useEffect(() => {
  //   setTimeout(() => {
  //     setSelectedChat({ name: null, id: null, favorite: false });
  //   }, 400);
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    if (!storedToken) setStoredToken(localStorage.getItem("websiteToken"));
  }, [storedToken]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    setProgress(0);
    //eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    if (storedToken) {
      setDecryptedToken(storedToken);
    }
  }, [storedToken]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await Request.Get("/protected/user");
      setUser(res);
    };
    fetchData();
    // eslint-disable-next-line
  }, [decryptedToken]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (settings === "") {
      setTimeout(() => {
        setSelectedChat({
          name: selectedChatRef.current.name,
          id: selectedChatRef.current.id,
          favorite: selectedChatRef.current.favorite,
        });
      }, 400);
    }
    // eslint-disable-next-line
  }, [settings]);

  // Handler

  const handleLogout = () => {
    localStorage.removeItem("websiteToken");
    window.location.href = "/";
  };

  const handleSelectChat = useCallback((event) => {
    if (!event.favorite) setSelectedChat(event);
    else setSelectedChat({ name: null, id: null, favorite: false });

    const fetchChatData = async (chat) => {
      const response = await Request.Get(`/protected/chats/one/${chat.id}`);
      const chatData = response.chat;
      setMessages(chatData[0].chat.messages);
    };

    fetchChatData(event);
    // eslint-disable-next-line
  }, []);

  const handleSettings = () => {
    if (!decryptedToken) return;
    if (settings !== "") setSettings("");
    else setSettings("settings");
  };

  return (
    <Div100vh className="dashboard-container">
      <Div100vh className="cogichat">
        <Div100vh className={`sidebar ${close ? "close" : ""}`}>
          <div className="arrow" onClick={() => setClose(!close)}>
            {close ? (
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="double-right-arrow h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="13 4 20 12 13 20"></polyline>
                <polyline points="5 4 12 12 5 20"></polyline>
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="double-left-arrow h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="11 4 4 12 11 20"></polyline>
                <polyline points="19 4 12 12 19 20"></polyline>
              </svg>
            )}
          </div>
          <div className="sidebar-content">
            <div
              className="logo"
              onClick={() => {
                settings !== "" ? setSettings("") : navigateToDashboard();
              }}
            >
              <div className="back">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </div>
              <div className="box">
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
              <div className="back"></div>
            </div>

            {settings === "" ? (
              <ChatSidebar
                Request={Request}
                chats={chats}
                setChats={setChats}
                setMessages={setMessages}
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
                handleSelectChat={handleSelectChat}
                updateChatDb={updateChatDb}
                plugin="onboarding"
              />
            ) : (
              <SettingsSidebar
                settings={settings}
                setSettings={setSettings}
                user={user}
                cogiproducts={"cogiwelcome"}
              />
            )}

            <div className="email">
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {user && <p>{user.email}</p>}
            </div>
            <div className="logout">
              <div className="btn" onClick={() => handleLogout()}>
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Déconnexion
              </div>
              <div
                className={`btn ${settings ? "active" : ""}`}
                onClick={() => handleSettings()}
              >
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
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <div className="toggle-container">
                <Switch
                  className="toggle"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  inputProps={{ "aria-label": "Toggle dark mode" }}
                />
                {darkMode ? (
                  <NightsStayOutlinedIcon className="iconColor dark-mode" />
                ) : (
                  <Brightness4OutlinedIcon className="iconColor light-mode" />
                )}
              </div>
            </div>
          </div>
        </Div100vh>
        <Div100vh className="big-container">
          {settings === "" ? (
            <ChatContainer
              Request={Request}
              selectedChat={selectedChat}
              selectedChatRef={selectedChatRef}
              updateChatDb={updateChatDb}
              decryptedToken={decryptedToken}
              setChats={setChats}
              setSelectedChat={setSelectedChat}
              darkMode={darkMode}
              messages={messages}
              setMessages={setMessages}
              user={user}
              setSettings={setSettings}
              plugin="onboarding"
              close={close}
              setClose={setClose}
              handleSettings={handleSettings}
              navigateToDashboard={navigateToDashboard}
              socket={socket}
              setGenerationTaskId={setGenerationTaskId}
              handleStopGeneration={handleStopGeneration}
              progress={progressRef.current}
              setProgress={setProgress}
            />
          ) : (
            <SettingsContainer
              settings={settings}
              handleSettings={handleSettings}
              user={user}
              setUser={setUser}
              plugin="onboarding"
            />
          )}
        </Div100vh>
      </Div100vh>
    </Div100vh>
  );
};

export default Onboarding;
