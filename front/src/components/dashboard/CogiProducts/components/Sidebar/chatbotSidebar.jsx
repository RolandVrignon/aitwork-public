import React, { useEffect } from "react";

const ChatbotSidebar = ({ Request, agents, setAgents, selectedAgent, setSelectedAgent }) => {
  useEffect(() => {
    const fetchAllChats = async () => {
      const response = await Request.Get(`/protected/agents`);
      setAgents(response.agents);
    };

    fetchAllChats();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="new">
        <div className="btn new-agent" onClick={() => {setSelectedAgent({_id: null})}}>
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
          Nouvel Agent
        </div>
      </div>
      <div className="sb agents">
        <ul>
          {agents &&
            agents.map((agent, index) => (
              <li
                key={index}
                className={agent === selectedAgent ? "active" : ""}
                onClick={() => {setSelectedAgent(agent)}}
              >
                <div className="one">
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
                  <p>{agent.name}</p>
                </div>
                <div className="two">
                  {agent.isActive ? (
                    <div className="circle active"></div>
                  ) : (
                    <div className="circle"></div>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default ChatbotSidebar;
