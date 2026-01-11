import { useState } from "react";
import ChatWindow from "./ChatWindow";
import "./floating-chat.css";

const FloatingChat = ({ roomId }: { roomId: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="chat-float-btn"
        onClick={() => setOpen(!open)}
        aria-label="Mở chat hỗ trợ"
      >
        {open ? "✖" : "💬"}
      </button>

      {open && (
        <div className="chat-float-panel">
          <ChatWindow roomId={roomId} />
        </div>
      )}
    </>
  );
};

export default FloatingChat;
