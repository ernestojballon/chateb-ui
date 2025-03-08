import { useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "./upload/Upload";
import { useQueryClient } from "@tanstack/react-query";
import useStore from "../../store";
import MultilineInput from "./multilineInput/multilineInput";
import useNewPromptStore from "../../store/newPromptStore.store";
import PromptAttachements from "./promptAttachements/PromptAttachements";
import useSentMessageToChat from "../../apiCalls/useSentMessageToChat";
import { useEffect } from "react";
import { useRenameChat } from "../../apiCalls/useRenameChat"; // Path to your hook
import Spinner from "../spinner/Spinner";

const NewPrompt = () => {
  const renameChatMutation = useRenameChat();
  const {
    chatId,
    preAddUserMsgToChatHistory,
    preAddModelMsgToChatHistory,
    setScrollToEnd,
    chatHistory,
  } = useStore();
  const [isStreaming, streamedText, setStreamedText, sendMessageToBackend] =
    useSentMessageToChat();
  const { attachments, clearAttachments } = useNewPromptStore();

  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef(null);

  const queryClient = useQueryClient();
  const resetForm = () => {
    formRef.current.reset();
  };

  useEffect(() => {
    if (isStreaming) {
      return preAddModelMsgToChatHistory({
        text: streamedText,
      });
    }
    setStreamedText("");
  }, [isStreaming, streamedText, preAddModelMsgToChatHistory, setStreamedText]);

  const multilineInputRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = multilineInputRef.current?.getValue() || ""; // Get text from your MultilineInput component
    if (!text) return;
    startStream(text);
  };

  const startStream = async (text) => {
    setScrollToEnd(true);
    setIsLoading(true);
    const formattedText =
      typeof text === "object" ? JSON.stringify(text, null, 2) : String(text);
    preAddUserMsgToChatHistory({
      text: formattedText,
      attachments,
    });
    preAddModelMsgToChatHistory({
      text: "Thinking...",
    });
    try {
      await sendMessageToBackend(chatId, { text: formattedText, attachments });

      if (chatHistory.length < 3) {
        await renameChatMutation.mutateAsync({ chatId });
      }
      await queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      resetForm();
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to send message:", err);
      preAddModelMsgToChatHistory({
        text: "Sorry, there was an error processing your request.",
      });
      setIsLoading(false);
    }

    clearAttachments();
    setIsLoading(false);
    setTimeout(() => multilineInputRef.current?.focus(), 100);
  };
  return (
    <div className="newPrompt">
      <PromptAttachements />
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload />
        <MultilineInput
          ref={multilineInputRef}
          startStream={startStream}
          disabled={isLoading}
        />
        {isLoading ? (
          <Spinner size={"tiny"} />
        ) : (
          <button type="submit">
            <img src="/arrow.png" alt="" />
          </button>
        )}
      </form>
    </div>
  );
};

export default NewPrompt;
