import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useLocation } from "react-router-dom";
import useStore from "../../store";
import { useEffect } from "react";
import ChatHistory from "../../components/chatHistory/chatHistory";

const ChatPage = () => {
  const { setChatId } = useStore();
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  useEffect(() => {
    setChatId(chatId);
  }, []);

  return (
    <div className="chatPage">
      <div className="wrapper">
        <ChatHistory />
        <NewPrompt />
      </div>
    </div>
  );
};

export default ChatPage;
