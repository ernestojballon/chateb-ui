import "./modelMessage.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./codeBlock/codeBlock";

const ModelMessage = ({ msg }) => {
  return (
    <div className="model-message">
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
          // Other components remain the same
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
  );
};

export default ModelMessage;
