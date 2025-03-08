import { useEffect, useRef } from "react";
import { useGetChatDataById } from "../../apiCalls/useGetChatDataById";
import useStore from "../../store";
import "./chatHistory.css";
import ModelMessage from "./modelMessage/modelMessage";
import EndChat from "./endChat.js/endChat";
import Spinner from "../spinner/Spinner";
import UserMessage from "./userMessage/userMessage";

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
        <>
          {chatHistory?.map((message, i) =>
            message.role === "model" ? (
              <article className="messagesContainer" key={i}>
                <ModelMessage msg={message.parts[0].text} />
              </article>
            ) : (
              <article className="messagesContainer" key={i}>
                <UserMessage
                  attachments={
                    message?.attachments?.length ? message.attachments : null
                  }
                  textMessage={message.parts[0].text}
                />
              </article>
            ),
          )}
        </>
      )}
      <EndChat />
    </div>
  );
};

export default ChatHistory;
