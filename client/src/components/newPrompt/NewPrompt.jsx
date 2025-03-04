import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "./upload/Upload";
import { useQueryClient } from "@tanstack/react-query";
import useStore from "../../store";
import MultilineInput from "./multilineInput/multilineInput";
import { useCreateChat } from "../../apiCalls/useCreateChat";
import { useNavigate } from "react-router-dom";
import useNewPromptStore from "../../store/newPromptStore.store";
import PromptAttachements from "./promptAttachements/PromptAttachements";

const NewPrompt = () => {
  const {
    chatId,
    chatHistory,
    preAddUserMsgToChatHistory,
    preAddModelMsgToChatHistory,
    setScrollToEnd,
  } = useStore();

  const { attachments } = useNewPromptStore();

  useEffect(() => {
    if (chatHistory.length === 1) {
      const firstMessage = chatHistory[0].parts[0].text;
      if (firstMessage) {
        handleSubmit(firstMessage);
      }
    }
  }, [chatHistory]);

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
  });
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef(null);

  const queryClient = useQueryClient();
  const resetForm = () => {
    formRef.current.reset();
    setImg({
      isLoading: false,
      error: "",
      dbData: {},
      aiData: {},
    });
  };
  const navigate = useNavigate();
  const mutation = useCreateChat({
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });
  const sendMessageToBackend = async (text) => {
    // Format text properly
    const formattedText =
      typeof text === "object" ? JSON.stringify(text, null, 2) : String(text);

    // Add user message to chat history immediately for UI
    if (chatHistory.length !== 1) {
      preAddUserMsgToChatHistory({
        text: formattedText,
        img: img.dbData?.filePath,
      });
    }

    try {
      // Show loading state in UI
      preAddModelMsgToChatHistory({
        text: "Thinking...",
      });

      if (!chatId) {
        await mutation.mutate(text);
      }
      console.log({ attachments });
      // Make the POST request to get the AI response
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gemini/stream/${chatId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: formattedText,
            attachments: attachments || undefined,
          }),
        },
      );
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
  const handleSubmit = async (text) => {
    if (!text) return;
    setScrollToEnd(true);
    setIsLoading(true);
    await sendMessageToBackend(text);
    setIsLoading(false);
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);
  const uploadRef = useRef(null);
  useEffect(() => {
    if (!hasRun.current) {
      if (chatHistory.length === 1) {
        // add(chatHistory[0].parts[0].text);
        sendMessageToBackend(chatHistory[0].parts[0].text);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <div className="newPrompt">
      {/* ADD NEW CHAT */}
      <PromptAttachements />

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload />

        <MultilineInput onSubmit={handleSubmit} disabled={isLoading} />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </div>
  );
};

export default NewPrompt;
