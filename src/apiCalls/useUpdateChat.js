// hooks/useUpdateChat.js
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; // Or however you're importing Clerk

export function useUpdateChat(chatId, { onSuccess }) {
  const { getToken } = useAuth();
  const updateChatMutation = useMutation({
    mutationFn: async ({ question, answer, img }) => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: question?.length ? question : undefined,
          answer,
          img: img || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return updateChatMutation;
}
