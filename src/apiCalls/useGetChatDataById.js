import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; // Or however you're importing Clerk

export const useGetChatDataById = (chatId) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        return res.json();
      });
    },
  });
};
