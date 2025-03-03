import { useLocation } from "react-router-dom";
const useGetChatId = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  return [chatId];
};

export const getChatId = () => {
  const path = window.location.pathname;
  const chatId = path.split("/").pop();

  return chatId;
};

export default useGetChatId;
