import { useMutation } from "@tanstack/react-query";

export function useDeleteChatById({ onSuccess }) {
  const deleteChatMutation = useMutation({
    mutationFn: (chatId) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to delete chat");
        return res.json();
      });
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return deleteChatMutation;
}
