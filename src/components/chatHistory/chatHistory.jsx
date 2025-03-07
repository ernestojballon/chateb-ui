import { useEffect, useRef } from "react";
import { useGetChatDataById } from "../../apiCalls/useGetChatDataById";
import useStore from "../../store";
import { IKImage } from "imagekitio-react";
import "./chatHistory.css";
import ModelMessage from "./modelMessage/modelMessage";
import EndChat from "./endChat.js/endChat";
import Spinner from "../spinner/Spinner";

const ChatHistory = () => {
  const { chatId, setChatInfo, chatHistory, scrolltoEnd, setScrollToEnd } =
    useStore();

  const { isPending, error, data } = useGetChatDataById(chatId);
  useEffect(() => {
    if (data) {
      setChatInfo(data);
    }
  }, [data, setChatInfo, chatId]);

  useEffect(() => {
    scrollValueRef.current = 0;
  }, [chatId]);

  const scrollValueRef = useRef(null);

  const handleScroll = (e) => {
    if (scrolltoEnd && scrollValueRef.current <= e.target.scrollTop) {
      console.log("scrolling down");
      scrollValueRef.current = e.target.scrollTop;
    } else {
      setScrollToEnd(false);
    }
  };
  return (
    <div className="chatHistory" onScroll={handleScroll}>
      {isPending ? (
        <div className="chatHistory__spinner">
          <Spinner />
        </div>
      ) : error ? (
        "Something went wrong!"
      ) : (
        chatHistory?.map((message, i) => (
          <div
            className={message.role === "user" ? "message user" : "message"}
            key={i}
          >
            {message?.attachments?.length
              ? message.attachments.map((attachment, i) => (
                  <div key={i} className="message user userImage">
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={attachment.filePath}
                      height="100"
                      width="100"
                      transformation={[{ height: 200, width: 200 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  </div>
                ))
              : null}
            <ModelMessage msg={message.parts[0].text} />
          </div>
        ))
      )}
      <EndChat />
    </div>
  );
};

export default ChatHistory;
