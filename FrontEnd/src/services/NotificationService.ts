import axiosClient from './AxiosClient';

// Interface khớp đúng với response API của bạn
export interface Notification {
  id: number;
  title: string;
  notificationType: 'PERSONAL' | 'PROMOTION' | 'SYSTEM' | 'ORDER'; // thêm type nếu backend mở rộng
  content: string;           // message thực tế
  isRead: boolean;
  // createdAt có thể có hoặc không, tùy backend trả về
  // createdAt?: string;
}

export const notificationService = {
  // Lấy danh sách thông báo của user hiện tại
  getUserNotifications: async (userId: number): Promise<Notification[]> => {
    const response = await axiosClient.get<Notification[]>(
      `/api/notifications/user/${userId}`
    );
    return response.data;
  },

  // Đánh dấu đã đọc một thông báo
  markAsRead: async (notificationId: number): Promise<void> => {
    await axiosClient.put(`/api/notifications/${notificationId}/read`);
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async (userId: number): Promise<void> => {
    await axiosClient.put(`/api/notifications/read-all?userId=${userId}`);
    // hoặc nếu backend dùng: /api/notifications/read-all (dựa vào token)
  },

  // Xóa thông báo
  deleteNotification: async (notificationId: number): Promise<void> => {
    await axiosClient.delete(`/api/notifications/${notificationId}`);
  },
};