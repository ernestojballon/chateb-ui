import { useQuery } from "@tanstack/react-query";

export const useChatData = (chatId) => {
  console.log({ chatId });
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then(async (res) => {
        return res.json();
      }),
  });
};
