// src/components/Chat/ChatWindow.tsx
import { useEffect, useRef, useState } from "react";
import { chatAdminService } from "../../services/chatAdminService";
import type { ChatMessage } from "../../services/Interface";
import ChatMessageItem from "./ChatMessage";
import ChatInput from "./ChatInput";
import "./admin-chat.css";

const POLL_INTERVAL = 3000;

const ChatWindow = ({ roomId }: { roomId: number }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  /* ===== LOAD HISTORY ===== */
  const loadHistory = async () => {
    try {
      const data = await chatAdminService.getHistory(roomId);
      setMessages(data); // 👈 history trả MẢNG
    } catch (e) {
      console.error("Load history failed", e);
    }
  };

  /* ===== INIT + POLLING ===== */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      await loadHistory();
      if (mounted) setLoading(false);
    };

    init();

    timerRef.current = window.setInterval(loadHistory, POLL_INTERVAL);

    return () => {
      mounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roomId]);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  /* ===== SEND MESSAGE ===== */
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // optimistic
    const optimistic: ChatMessage = {
      senderType: "ADMIN",
      content: text
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const newMessages = await chatAdminService.adminReply(roomId, text);
      setMessages((prev) => [...prev.slice(0, -1), ...newMessages]);
    } catch (e) {
      console.error("Send failed", e);
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  return (
    <section className="admin-chat">
      <header>💬 Chat với khách – Room #{roomId}</header>

      {loading ? (
        <div className="loading">Đang tải chat…</div>
      ) : (
        <div className="chat-box" ref={boxRef}>
          {messages.map((m, i) => (
            <ChatMessageItem key={i} message={m} />
          ))}
        </div>
      )}

      <ChatInput onSend={handleSend} />
    </section>
  );
};

export default ChatWindow;
