import React, { useEffect } from "react";

const ChatSidebar = ({ Request, handleSelectChat, updateChatDb, ...props }) => {
  const {
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    setMessages,
    plugin,
    agents,
    setSelectedAgent,
  } = props;

  const deleteChat = async (chat) => {
    await Request.Delete(`/protected/chats/delete/${chat.id}`);
  };

  useEffect(() => {
    const fetchAllChats = async () => {
      const response = await Request.Get(`/protected/chats/${plugin}`);
      setChats(response.chats);
    };

    fetchAllChats();
    // eslint-disable-next-line
  }, []);

  const handleNewChat = () => {
    setSelectedChat({ name: null, id: null, favorite: false });
    setMessages([]);
  };

  const handleDeleteChats = async () => {
    const updatedChats = chats.filter((c) => c["favorite"] === false);

    for (const chat of updatedChats) {
      await deleteChat(chat);
    }

    setChats(chats.filter((c) => c["favorite"] === true));
  };

  const handleStarClick = (chat) => {
    const updatedChats = chats.map((c) => {
      if (c["id"] === chat.id) {
        return {
          ...c,
          favorite: !c["favorite"],
        };
      }
      return c;
    });

    setChats(updatedChats);

    const chatToUpdate = updatedChats.find((c) => c.id === chat.id);
    chatToUpdate.favorite = !chat.favorite;
    updateChatDb(chatToUpdate);
  };

  const handleTrashClick = (chat) => {
    const updatedChats = chats.filter((c) => c["id"] !== chat.id);

    setChats(updatedChats);

    deleteChat(chat);
  };

  return (
    <>
      {/* <div className="specialized-chatbot">
        <select name="" id="" onChange={(e) => setSelectedAgent(e.target.value)}>
          <option value="">-- Select Agent --</option>
          {agents &&
            agents.map((agent, index) => (
              <option key={index} value={agent._id}>
                {agent.name}
              </option>
            ))}
        </select>
      </div> */}

      <div className="new">
        <div className="btn new-chat" onClick={() => handleNewChat()}>
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouveau chat
        </div>
        {/* <div className="btn folders">
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
            <path
              d="M12 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M18 14V17M18 20V17M18 17H15M18 17H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div> */}
      </div>
      <div className="sb history">
        <ul>
          {chats &&
            chats
              .filter((chat) => !chat.favorite)
              .reverse()
              .map((chat, index) => (
                <li
                  key={index}
                  className={chat.id === selectedChat.id ? "active" : ""}
                >
                  <div className="one" onClick={() => handleSelectChat(chat)}>
                    <svg
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="conv h-4 w-4"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>{chat.id === selectedChat.id && selectedChat.name ? selectedChat.name : chat.name}</p>
                  </div>
                  <div className="two">
                    <svg
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarClick(chat);
                      }}
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="star h-4 w-4"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2 L15.09 8.12 L22 9.27 L17 14.22 L18.18 21 L12 17.77 L5.82 21 L7 14.22 L2 9.27 L8.91 8.12 Z"></path>
                    </svg>
                    <svg
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrashClick(chat);
                      }}
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
                </li>
              ))}
        </ul>
      </div>
      <div className="delete">
        <div className="btn delete-chats" onClick={() => handleDeleteChats()}>
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
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Supprimer chats
        </div>
      </div>
      <div className="sb favorite">
        <h2>Favoris</h2>
        <ul>
          {chats &&
            chats
              .filter((chat) => chat.favorite)
              .reverse()
              .map((chat, index) => (
                <li
                  key={index}
                  className={chat.id === selectedChat.id ? "active" : ""}
                >
                  <div className="one" onClick={() => handleSelectChat(chat)}>
                    <svg
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="conv h-4 w-4"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>{chat.id === selectedChat.id && selectedChat.name ? selectedChat.name : chat.name}</p>
                  </div>
                  <div className="two">
                    <svg
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarClick(chat);
                      }}
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="star h-4 w-4"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2 L15.09 8.12 L22 9.27 L17 14.22 L18.18 21 L12 17.77 L5.82 21 L7 14.22 L2 9.27 L8.91 8.12 Z"></path>
                    </svg>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </>
  );
};

export default ChatSidebar;
