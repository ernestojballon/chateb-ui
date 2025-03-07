import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

export const useRenameChat = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const renameChatMutation = useMutation({
    mutationFn: async ({ chatId }) => {
      const token = await getToken();
      return fetch(
        `${import.meta.env.VITE_API_URL}/api/llm/rename-chat/${chatId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      ).then((res) => res.json());
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return renameChatMutation;
};
