import { useMutation } from "@tanstack/react-query";

export function useCreateChat({ onSuccess }) {
  const createChatMutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      if (onSuccess) onSuccess(id);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  return createChatMutation;
}
