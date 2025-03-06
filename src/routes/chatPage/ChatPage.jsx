import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import useStore from "../../store";
import { useEffect } from "react";
import ChatHistory from "../../components/chatHistory/chatHistory";
import Welcome from "./welcomeSection/Welcome";

const ChatPage = () => {
  const { chatId: storeChatId, setChatId, chatHistory } = useStore();
  const path = window.location.pathname;
  const chatId = path.split("/").pop();
  console.log({
    chatHistory,
  });
  useEffect(() => {
    setChatId(chatId);
  }, [chatId, setChatId]);

  return (
    <div className="chatPage">
      {!chatHistory.length && <Welcome />}
      {storeChatId && chatHistory && <ChatHistory />}
      <NewPrompt />
    </div>
  );
};

export default ChatPage;
