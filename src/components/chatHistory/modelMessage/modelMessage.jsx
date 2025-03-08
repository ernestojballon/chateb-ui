import "./modelMessage.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./codeBlock/codeBlock";
import { useRef, useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

const ModelMessage = ({ msg }) => {
  const markdownRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    if (markdownRef.current) {
      try {
        await navigator.clipboard.writeText(markdownRef.current.textContent);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Hide success message after 2 seconds
      } catch (err) {
        console.error("Failed to copy: ", err);
        // Consider adding a user-facing error message here.
      }
    }
  };

  return (
    <div className="model-message-container">
      <div className="model-message" ref={markdownRef}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <CodeBlock
                  language={match[1]}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            ul(props) {
              return <ul className="markdown-ul" {...props} />;
            },
            ol(props) {
              return <ol className="markdown-ol" {...props} />;
            },
            li(props) {
              return <li className="markdown-li" {...props} />;
            },
          }}
        >
          {msg}
        </Markdown>
      </div>
      <button className="copy-message" onClick={copyToClipboard}>
        {copySuccess ? (
          <>
            <FaCheck />
            Copied!
          </>
        ) : (
          <>
            Copy
            <FaCopy />
          </>
        )}
      </button>
    </div>
  );
};

export default ModelMessage;
