import { useState } from "react";

const ChatInput = ({ onSend }: { onSend: (t: string) => void }) => {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="chat-input">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập phản hồi..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button onClick={submit}>Gửi</button>
    </div>
  );
};

export default ChatInput;
