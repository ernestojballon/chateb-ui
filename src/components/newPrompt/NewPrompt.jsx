import { useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "./upload/Upload";
import { useQueryClient } from "@tanstack/react-query";
import useStore from "../../store";
import MultilineInput from "./multilineInput/multilineInput";
import useNewPromptStore from "../../store/newPromptStore.store";
import PromptAttachements from "./promptAttachements/PromptAttachements";
import { useAuth } from "@clerk/clerk-react"; // Or however you're importing Clerk
import useSentMessageToChat from "../../apiCalls/useSentMessageToChat";

const NewPrompt = () => {
  const { getToken } = useAuth();
  const {
    chatId,
    preAddUserMsgToChatHistory,
    preAddModelMsgToChatHistory,
    setScrollToEnd,
  } = useStore();
  // const { } =useSentMessageToChat();
  const { attachments, clearAttachments } = useNewPromptStore();

  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef(null);

  const queryClient = useQueryClient();
  const resetForm = () => {
    formRef.current.reset();
  };
  const sendMessageToBackend = async (text) => {
    // Format text properly
    const formattedText =
      typeof text === "object" ? JSON.stringify(text, null, 2) : String(text);

    // Add user message to chat history immediately for UI

    preAddUserMsgToChatHistory({
      text: formattedText,
      attachments,
    });

    try {
      // Show loading state in UI
      preAddModelMsgToChatHistory({
        text: "Thinking...",
      });

      console.log({ attachments });
      // Make the POST request to get the AI response
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gemini/stream/${chatId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: formattedText,
            attachments: attachments || undefined,
          }),
        },
      );
      clearAttachments();
      const reader = response.body.getReader();
      let accumulatedText = "";

      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Convert the Uint8Array to a string
          const chunk = new TextDecoder().decode(value);
          console.log("chunk:", chunk);
          const text = JSON.parse(
            chunk.replace("data:", "").replace(/—/g, "\\u2014"),
          ).response;
          accumulatedText += text;
          preAddModelMsgToChatHistory({
            text: accumulatedText,
          });
        }
      } catch (err) {
        console.error("Error reading stream:", err);
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
  };

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
    await sendMessageToBackend(text);
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
        <button type="submit">
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </div>
  );
};

export default NewPrompt;
