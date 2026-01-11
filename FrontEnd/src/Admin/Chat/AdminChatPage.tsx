import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../../components/Chat/ChatWindow";

const AdminChatPage = () => {
  const { roomId } = useParams();

  useEffect(() => {
    document.title = `Admin Chat | Room #${roomId}`;
  }, [roomId]);

  return <ChatWindow roomId={Number(roomId)} />;
};

export default AdminChatPage;
