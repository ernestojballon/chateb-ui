import { useEffect, useRef } from "react";
import "./multilineInput.css";

const MultilineInput = ({ onSubmit, disabled = false }) => {
  const textareaRef = useRef(null);

  // Auto-resize the textarea
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Handle Enter and Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Allow Shift+Enter to create a new line (default behavior)
      } else {
        // Submit on Enter
        e.preventDefault();

        const text = e.target.value.trim();
        if (text && !disabled) {
          onSubmit(text);
          e.target.value = "";
          e.target.style.height = "auto";
        }
      }
    }
  };

  // Set up resize observer to handle dynamic content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resizeObserver = new ResizeObserver(() => {
      autoResize();
    });

    resizeObserver.observe(textarea);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <textarea
      ref={textareaRef}
      name="text"
      placeholder="Ask anything..."
      rows="1"
      className="multiline-input"
      onKeyDown={handleKeyDown}
      onChange={autoResize}
      disabled={disabled}
    />
  );
};

export default MultilineInput;
