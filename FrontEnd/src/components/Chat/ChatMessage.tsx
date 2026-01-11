import type { ChatMessage } from "../../services/Interface";

const ChatMessageItem = ({ message }: { message: ChatMessage }) => {
  const cls =
    message.senderType === "ADMIN"
      ? "admin"
      : message.senderType === "USER"
      ? "user"
      : "ai";

  return (
    <div className={`msg ${cls}`}>
      <p>{message.content}</p>
    </div>
  );
};

export default ChatMessageItem;
