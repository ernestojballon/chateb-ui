import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; // Or however you're importing Clerk

export function useCreateChat() {
  const { getToken } = useAuth();
  const createChatMutation = useMutation({
    mutationFn: async (text) => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: text,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });
  return createChatMutation;
}
