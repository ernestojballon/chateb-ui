import React from "react";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // Or however you're importing Clerk

const sendMessageToBackend = async ({ chatId, text, token, attachments }) => {
  const body = { text, attachments: attachments || undefined };
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/gemini/stream/${chatId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );

  return response;
};

const useSentMessageToChat = async () => {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const { getToken } = useAuth();

  const sendMessageToBackend = async (chatId, message) => {
    const { text, attachments } = message;
    setStreamedText("");
    setIsStreaming(true);
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
          text: text,
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
        setStreamedText(accumulatedText);
      }
    } catch (err) {
      console.error("Error reading stream:", err);
    }
    setIsStreaming(false);
  };

  return {
    isStreaming,
    streamedText,
    setStreamedText,
    sendMessageToBackend,
  };
};

export default useSentMessageToChat;
