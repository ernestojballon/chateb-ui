import "./dashboardPage.css";
import { useCreateNewChat } from "../../helpers/useCreateNewChat";
import { useUser } from "@clerk/clerk-react";
const DashboardPage = () => {
  const { user } = useUser();
  const username = user?.username || user?.firstName || "User";

  const { createNewChat, isCreating } = useCreateNewChat();
  const handleNewChat = () => {
    createNewChat("New Chat");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="welcome-section">
          <h1>
            Welcome <span className="username">{username}</span>
          </h1>
          <p className="subtitle">Open a chat and start chatting?</p>
        </div>

        <div className="quick-actions">
          <button
            disabled={isCreating}
            className="new-chat-button"
            onClick={handleNewChat}
          >
            <img src="/chat.png" alt="New Chat" />
            <span>New Chat</span>
          </button>

          {/* <div className="suggestion-chips">
            <button
              onClick={() =>
                navigate(
                  "/dashboard/chats/new?prompt=Help me write a blog post",
                )
              }
            >
              Write a blog post
            </button>
            <button
              onClick={() =>
                navigate(
                  "/dashboard/chats/new?prompt=Explain quantum computing",
                )
              }
            >
              Explain a complex topic
            </button>
            <button
              onClick={() =>
                navigate("/dashboard/chats/new?prompt=Help me debug this code")
              }
            >
              Debug my code
            </button>
            <button
              onClick={() =>
                navigate("/dashboard/chats/new?prompt=Help me brainstorm ideas")
              }
            >
              Brainstorm ideas
            </button>
          </div> */}
        </div>

        {/* <div className="chat-section">
          <div className="section-header">
            <h2>Recent Conversations</h2>
            <button
              className="view-all"
              onClick={() => navigate("/dashboard/chats")}
            >
              View all
            </button>
          </div>

          {recentChats.length > 0 ? (
            <div className="recent-chats">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="chat-card"
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <div className="chat-info">
                    <h3>{chat.title}</h3>
                    <span className="date">{chat.date}</span>
                  </div>
                  <div className="chat-actions">
                    <img src="/arrow-right.png" alt="Open chat" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <img src="/empty-chat.png" alt="No chats yet" />
              <p>You havent started any conversations yet.</p>
              <button onClick={handleNewChat}>Start your first chat</button>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default DashboardPage;
