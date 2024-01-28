import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Switch } from "@mui/material";
import useRequest from "../../../useRequest.js";

import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";

import Div100vh from "react-div-100vh";
import ChatbotSidebar from "./components/Sidebar/chatbotSidebar.jsx";
import NewChatbot from "./components/NewChatbot/newChatbot.jsx";
import SelectedChatbot from "./components/SelectedChatbot/selectedChatbot.jsx";

const ChatbotAgent = ({ darkMode, toggleDarkMode }) => {
  const [close, setClose] = useState(window.innerWidth <= 767);
  const [user, setUser] = useState(null);
  const [storedToken, setStoredToken] = useState("");
  const [decryptedToken, setDecryptedToken] = useState("");
  const [selectedAgent, setSelectedAgent] = useState({ _id: null });

  const [agents, setAgents] = useState([]);

  const Request = useRequest();

  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (!storedToken) setStoredToken(localStorage.getItem("websiteToken"));
  }, [storedToken]);

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

  const handleLogout = () => {
    localStorage.removeItem("websiteToken");
    window.location.href = "/";
  };

  return (
    <Div100vh className="dashboard-container">
      <Div100vh className="cogichat chatbot">
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
            <div className="logo">
              <div
                className="back"
                onClick={() => {
                  navigateToDashboard();
                }}
              >
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
              <h1>
                Chatbot <span>Agents. 🤖🔍</span>
              </h1>
            </div>

            <div className="content">
              <ChatbotSidebar
                Request={Request}
                agents={agents}
                setAgents={setAgents}
                selectedAgent={selectedAgent}
                setSelectedAgent={setSelectedAgent}
              />
            </div>

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
          <div className="container">
            {!selectedAgent._id ? (
              <NewChatbot
                setAgents={setAgents}
                setSelectedAgent={setSelectedAgent}
              />
            ) : (
              <SelectedChatbot setSelectedAgent={setSelectedAgent} />
            )}
          </div>
        </Div100vh>
      </Div100vh>
    </Div100vh>
  );
};

export default ChatbotAgent;
