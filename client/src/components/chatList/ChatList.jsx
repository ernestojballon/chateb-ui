import { Link, useNavigate } from "react-router-dom";
import "./chatList.css";
import { useGetUserChats } from "../../apiCalls/useGetUserChats";
import { useDeleteChatById } from "../../apiCalls/useDeleteChatById";
import { useQueryClient } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import useStore from "../../store";

const ChatList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isPending, error, data } = useGetUserChats();
  const { setIsSidebarOpen, setChatId, chatId } = useStore();

  const deleteMutation = useDeleteChatById({
    onSuccess: () => {
      queryClient.invalidateQueries("userChats");
    },
  });
  const handleDelete = (e, chatId) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteMutation.mutate(chatId);
    }
  };
  // New function to handle chat selection
  const handleChatSelect = (chatId) => {
    setIsSidebarOpen(false);
    setChatId(chatId);
    navigate(`/dashboard/chats/${chatId}`);
  };
  const newChatHandler = () => {
    setIsSidebarOpen(false);
    setChatId(null);
    navigate("/dashboard");
  };
  return (
    <div className="chatList">
      <div to="/dashboard" className="logo">
        <img src="/logo.png" alt="" />
        <span>BALLONAI</span>
      </div>
      <span className="title">DASHBOARD</span>
      <div
        onClick={newChatHandler}
        className={`chat-item newChat ${chatId === null ? "active" : ""}`}
      >
        Open a new Chat
      </div>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "Loading..."
          : error
            ? "Something went wrong!"
            : data?.map((chat) => (
                <div
                  className={`chat-item ${chatId === chat._id ? "active" : ""}`}
                  key={chat._id}
                >
                  <div
                    className="chat-link"
                    onClick={() => handleChatSelect(chat._id)}
                  >
                    {chat.title}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, chat._id)}
                    aria-label="Delete chat"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
      </div>
      <hr />
    </div>
  );
};

export default ChatList;
