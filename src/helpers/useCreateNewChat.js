// src/hooks/useCreateNewChat.js
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useStore from "../store";
import { useCreateChat } from "../apiCalls/useCreateChat";

export const useCreateNewChat = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setChatId } = useStore();
  const mutation = useCreateChat();

  const createNewChat = async (initialText = "New Chat") => {
    try {
      // Create new chat
      const newChatId = await mutation.mutateAsync(initialText);

      // Update store with new chat ID
      setChatId(newChatId);

      // Refresh chat list
      queryClient.invalidateQueries({ queryKey: ["userChats"] });

      // Navigate to new chat
      navigate(`/dashboard/chats/${newChatId}`);

      return newChatId;
    } catch (error) {
      console.error("Failed to create new chat:", error);
      throw error;
    }
  };

  return {
    createNewChat,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
