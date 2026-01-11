import axiosClient from "./AxiosClient";
import type {
  AdminReplyRequest,
  AdminReplyResponse,
  ChatMessage
} from  "../services/Interface";

export const chatAdminService = {
  async getHistory(roomId: number): Promise<ChatMessage[]> {
    const res = await axiosClient.get<ChatMessage[]>(
      "/api/chat/history",
      { params: { roomId } }
    );
    return res.data;
  },

  async adminReply(roomId: number, message: string): Promise<ChatMessage[]> {
    const res = await axiosClient.post(
      "/api/chat/admin/reply",
      { message },
      { params: { roomId } }
    );

    // BE trả { roomId, mode, messages }
    return res.data.messages;
  }
};
