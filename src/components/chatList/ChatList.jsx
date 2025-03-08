import { Link, useNavigate } from "react-router-dom";
import "./chatList.css";
import { useGetUserChats } from "../../apiCalls/useGetUserChats";
import { useDeleteChatById } from "../../apiCalls/useDeleteChatById";

import { FaTrash } from "react-icons/fa";
import useStore from "../../store";

import { useCreateNewChat } from "../../helpers/useCreateNewChat";
import Spinner from "../spinner/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { ColoredScrollbars } from "../coloredScrollBar/coloredScrollBar";

const ChatList = () => {
  const navigate = useNavigate();
  const { isPending, error, data } = useGetUserChats();
  const queryClient = useQueryClient();
  const { setIsSidebarOpen, setChatId, chatId } = useStore();

  const { createNewChat, isCreating } = useCreateNewChat();

  const deleteMutation = useDeleteChatById();

  const handleDelete = async (e, ToDeleteChatId) => {
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
      <ColoredScrollbars className="list">
        {isPending ? (
          <Spinner size={"small"} />
        ) : error ? (
          "Something went wrong!"
        ) : (
          data?.map((chat) => (
            <div
              key={chat._id}
              className={`${chatId === chat._id ? "chat-item active" : "chat-item"}`}
            >
              <Link
                to={`/dashboard/chats/${chat._id}`}
                className={`${chatId === chat._id ? "active" : ""}`}
                onClick={() => {
                  setIsSidebarOpen(false);
                  setChatId(chat._id);
                }}
              >
                {chat.title}
              </Link>
              <span
                className="delete-btn"
                onClick={(e) => handleDelete(e, chat._id)}
                aria-label="Delete chat"
              >
                <FaTrash />
              </span>
            </div>
          ))
        )}
      </ColoredScrollbars>
      <hr />
    </div>
  );
};

export default ChatList;
