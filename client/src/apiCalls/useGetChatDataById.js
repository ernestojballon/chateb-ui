import { useQuery } from "@tanstack/react-query";

export const useGetChatDataById = (chatId) => {
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
