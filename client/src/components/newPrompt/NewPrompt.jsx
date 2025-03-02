import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateChat } from "../../apiCalls/useUpdateChat";
import useStore from "../../store";
import { MdCancel } from "react-icons/md";
import MultilineInput from "./multilineInput/multilineInput";

const NewPrompt = () => {
  const {
    chatId,
    chatHistory,
    preAddUserMsgToChatHistory,
    preAddModelMsgToChatHistory,
  } = useStore();
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const chat = model.startChat({
    history: chatHistory?.map(({ role, parts }) => ({
      role: role,
      parts: [{ text: parts[0].text }],
    })),

    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

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

  const newMutation = useUpdateChat(chatId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] }).then(() => {
        resetForm();
      });
    },
  });

  const add = async (text) => {
    preAddUserMsgToChatHistory({
      text: text,
      img: img.dbData?.filePath,
    });
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text],
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        preAddModelMsgToChatHistory({
          text: accumulatedText,
        });
      }

      newMutation.mutate({
        question: text,
        answer: accumulatedText,
        img: img.dbData?.filePath,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (text) => {
    if (!text) return;
    setIsLoading(true);
    await add(text);
    setIsLoading(false);
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);
  const uploadRef = useRef(null);
  useEffect(() => {
    if (!hasRun.current) {
      if (chatHistory.length === 1) {
        add(chatHistory[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImg({
      isLoading: false,
      error: "",
      dbData: {},
      aiData: {},
    });
    // Reset the upload component if needed
    if (uploadRef.current) {
      // This will clear the file input
      uploadRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    // Allow Shift+Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }

    // Auto resize the textarea
    const textarea = e.target;
    setTimeout(() => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, 0);
  };
  return (
    <div className="newPrompt">
      {/* ADD NEW CHAT */}
      <div className="tempImg">
        {img.isLoading && <div className="">Loading...</div>}

        {img.dbData?.filePath && (
          <div className="thumbnailImg">
            <span onClick={handleRemoveImage} className="cancelButton">
              <MdCancel color="#2c2937" size={24} />
            </span>
            <IKImage
              urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
              path={img.dbData?.filePath}
              width="100"
              transformation={[{ width: 100, height: 100 }]}
            />
          </div>
        )}
      </div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} uploadRef={uploadRef} />
        <input id="file" type="file" multiple={false} hidden />
        <MultilineInput onSubmit={handleSubmit} disabled={isLoading} />
        {/* <input type="text" name="text" placeholder="Ask anything..." /> */}
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </div>
  );
};

export default NewPrompt;
