import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import useStore from "../../store";
import { useEffect } from "react";
import ChatHistory from "../../components/chatHistory/chatHistory";

const ChatPage = () => {
  const { setChatId } = useStore();
  const path = window.location.pathname;
  const chatId = path.split("/").pop();

  useEffect(() => {
    setChatId(chatId);
  }, [chatId, setChatId]);

  return (
    <div className="chatPage">
      <ChatHistory />
      <NewPrompt />
    </div>
  );
};

export default ChatPage;
