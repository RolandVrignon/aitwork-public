import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useRequest from "../../useRequest";

import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";
import ChatFormatted from "../dashboard/components/chat/chatFormatted";

import Div100vh from "react-div-100vh";

const SharedChat = ({ darkMode, toggleDarkMode }) => {
  const { id } = useParams();
  const [messages, setMessages] = useState(null);

  const Request = useRequest();

  useEffect(() => {
    const fetchData = async () => {
      let res = await Request.Get(`public/shared/${id}`);
      setMessages(res.messages);
    };
    fetchData();
    //eslint-disable-next-line
  }, []);

  return (
    <Div100vh className="dashboard-container">
      <div className="cogichat">
        <div className="big-container">
          <div className="content chat">
            <div className="chat-messages">
              {messages &&
                messages.length > 0 &&
                messages.map((message, index) => (
                  <div
                  key={index}
                  className={`message ${index % 2 === 0 ? "pair" : "unpair"}`}
                >
                  <ChatFormatted
                    key={index}
                    message={message}
                    darkMode={darkMode}
                    editable={false}
                  />
                </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="toggle-darkmode" onClick={toggleDarkMode}>
          {darkMode ? <Brightness4OutlinedIcon /> : <NightsStayOutlinedIcon />}
        </div>
    </Div100vh>
  );
};

export default SharedChat;
