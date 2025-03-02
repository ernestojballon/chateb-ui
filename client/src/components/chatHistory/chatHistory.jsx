import { useEffect, useRef } from "react";
import { useChatData } from "../../apiCalls/useChatData";
import useStore from "../../store";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import "./chatHistory.css";

const ChatHistory = () => {
  const { chatId, setChatInfo, chatHistory } = useStore();
  const { isPending, error, data } = useChatData(chatId);
  useEffect(() => {
    if (data) {
      console.log("Data is available:", data);
      setChatInfo(data);
    }
  }, [data, setChatInfo]);

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="chat">
      {isPending
        ? "Loading..."
        : error
          ? "Something went wrong!"
          : chatHistory?.map((message, i) => (
              <>
                {message.img && (
                  <IKImage
                    className={"message user userImage"}
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 500 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div
                  className={
                    message.role === "user" ? "message user" : "message"
                  }
                  key={i}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </>
            ))}
      <div className="endChat" ref={endRef}></div>
    </div>
  );
};

export default ChatHistory;
