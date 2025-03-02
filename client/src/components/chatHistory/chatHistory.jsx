import { useEffect, useRef } from "react";
import { useChatData } from "../../apiCalls/useChatData";
import useStore from "../../store";
import { IKImage } from "imagekitio-react";

import "./chatHistory.css";
import ModelMessage from "./modelMessage/modelMessage";

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
              <div
                className={message.role === "user" ? "message user" : "message"}
                key={i}
              >
                {message.img && (
                  <IKImage
                    className={"message user userImage"}
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="200"
                    width="200"
                    transformation={[{ height: 200, width: 200 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <ModelMessage msg={message.parts[0].text} />
              </div>
            ))}
      <div className="endChat" ref={endRef}></div>
    </div>
  );
};

export default ChatHistory;
