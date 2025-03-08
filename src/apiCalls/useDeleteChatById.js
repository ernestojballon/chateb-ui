import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; // Or however you're importing Clerk

export function useDeleteChatById() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const deleteChatMutation = useMutation({
    mutationFn: async (chatId) => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to delete chat");
        return res.json();
      });
    },
  });

  return deleteChatMutation;
}
