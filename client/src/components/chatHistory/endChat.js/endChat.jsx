import { useEffect, useRef } from "react";
import useStore from "../../../store";

const EndChat = () => {
  const { chatHistory, scrolltoEnd, setScrollToEnd } = useStore();
  const endRef = useRef(null);
  useEffect(() => {
    if (scrolltoEnd) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
      // setScrollToEnd(false);
    }
  }, [chatHistory, scrolltoEnd, setScrollToEnd]);
  return <div className="endChat" ref={endRef}></div>;
};

export default EndChat;
