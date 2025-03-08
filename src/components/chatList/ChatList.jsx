import { useNavigate } from "react-router-dom";
import "./chatList.css";
import { useGetUserChats } from "../../apiCalls/useGetUserChats";
import { useDeleteChatById } from "../../apiCalls/useDeleteChatById";

import { FaTrash } from "react-icons/fa";
import useStore from "../../store";

import { useCreateNewChat } from "../../helpers/useCreateNewChat";
import Spinner from "../spinner/Spinner";

const ChatList = () => {
  const navigate = useNavigate();
  const { isPending, error, data } = useGetUserChats();
  const { setIsSidebarOpen, setChatId, chatId, chatHistory } = useStore();

  const { createNewChat, isCreating } = useCreateNewChat();

  const deleteMutation = useDeleteChatById();

  const handleDelete = async(e, ToDeleteChatId) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (window.confirm("Are you sure you want to delete this chat?")) {
      await deleteMutation.mutateAsync(ToDeleteChatId);
      if (ToDeleteChatId === chatId) {
        setChatId(null);
        navigate("/dashboard");
        queryClient.invalidateQueries("userChats");
      }
    }
  };
  // New function to handle chat selection
  const handleChatSelect = (chatId) => {
    setIsSidebarOpen(false);
    setChatId(chatId);
    navigate(`/dashboard/chats/${chatId}`);
  };
  const newChatHandler = async () => {
    setIsSidebarOpen(false);
    createNewChat("New Chat");
  };
  return (
    <div className="chatList">
      <div to="/dashboard" className="logo">
        <img src="/logo.png" alt="" />
        <div>
          <span>Chateb</span>
          <blockquote>by Ernesto Ballon</blockquote>
        </div>
      </div>
      <span className="title">DASHBOARD</span>
      <button
        onClick={newChatHandler}
        className={`chat-item newChat ${chatId === null ? "active" : ""}`}
        disabled={isCreating}
      >
        Open a new Chat
      </button>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending ? (
          <Spinner size={"small"} />
        ) : error ? (
          "Something went wrong!"
        ) : (
          data?.map((chat) => (
            <button
              className={`chat-item ${chatId === chat._id ? "active" : ""}`}
              key={chat._id}
            >
              <div
                className="chat-link"
                onClick={() => handleChatSelect(chat._id)}
              >
                {chat.title}
              </div>
              <span
                className="delete-btn"
                onClick={(e) => handleDelete(e, chat._id)}
                aria-label="Delete chat"
              >
                <FaTrash />
              </span>
            </button>
          ))
        )}
      </div>
      <hr />
    </div>
  );
};

export default ChatList;
