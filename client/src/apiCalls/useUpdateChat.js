// hooks/useUpdateChat.js
import { useMutation } from "@tanstack/react-query";

export function useUpdateChat(chatId, { onSuccess }) {
  const updateChatMutation = useMutation({
    mutationFn: ({ question, answer, img }) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
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
