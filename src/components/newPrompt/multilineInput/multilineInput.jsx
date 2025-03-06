import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./multilineInput.css";

const MultilineInput = forwardRef(({ startStream, disabled = false }, ref) => {
  const textareaRef = useRef(null);

  // Expose the textarea ref and methods to parent components
  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    setValue: (value) => {
      if (textareaRef.current) {
        textareaRef.current.value = value;
        autoResize();
      }
    },
    getValue: () => textareaRef.current?.value || "",
    clear: () => {
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }
    },
    // Expose the underlying DOM element
    element: textareaRef.current,
  }));

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
        return;
        // Allow Shift+Enter to create a new line (default behavior)
      }
      // Submit on Enter
      e.preventDefault();

      const text = e.target.value.trim();
      if (text && !disabled) {
        startStream(text);
        e.target.value = "";
        e.target.style.height = "auto";
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
});

// Add display name for debugging
MultilineInput.displayName = "MultilineInput";

export default MultilineInput;
