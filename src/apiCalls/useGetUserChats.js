import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; // Or however you're importing Clerk

export const useGetUserChats = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    },
  });
};
