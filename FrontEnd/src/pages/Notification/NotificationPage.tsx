import React, { useState, useEffect } from 'react';
import axiosClient from '../../services/AxiosClient';
import LoadingSkeleton from '../../components/NotificationComponet/LoadingSkeleton';
import './NotificationPage.css';

// IMPORT THIẾU – QUAN TRỌNG NHẤT!!!
import { 
  Package, 
  Percent, 
  Bell, 
  User, 
  Info, 
  Trash2 
} from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'ORDER' | 'PROMOTION' | 'SYSTEM' | 'ACCOUNT';
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // SỬA LỖI CÚ PHÁP: XÓA DẤU NGOẶC THỪA { Ở DÒNG NÀY
  useEffect(() => {
    // const fetchNotifications = async () => {
    //   try {
    //     const response = await axiosClient.get<{ data: Notification[] }>('/api/notifications');
    //     setNotifications(response.data.data || []);
    //   } catch (err: any) {
    //     setError('Không thể tải thông báo');
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchNotifications();
    const fakeNotifications: Notification[] = [
  {
    id: 999,
    title: "Đơn hàng #DH123456 đã giao thành công",
    message: "Đơn hàng của bạn gồm iPhone 15 Pro Max 256GB Đen đã được giao đến 123 Nguyễn Trãi, Hà Nội lúc 14:30 hôm nay. Cảm ơn bạn đã mua sắm tại CellPhoneS!",
    type: "ORDER",
    isRead: false,
    createdAt: "2025-12-13T14:30:00.000Z"
  },
  {
    id: 998,
    title: "Khuyến mãi cực sốc 24h",
    message: "Giảm ngay 3.000.000đ cho tất cả MacBook Air M2 & M3. Chỉ áp dụng hôm nay 13/12!",
    type: "PROMOTION",
    isRead: false,
    createdAt: "2025-12-13T09:00:00.000Z"
  },
  {
    id: 997,
    title: "Cập nhật thông tin tài khoản",
    message: "Bạn vừa đổi mật khẩu thành công lúc 01:45 AM. Nếu không phải bạn thao tác, vui lòng liên hệ ngay hỗ trợ.",
    type: "ACCOUNT",
    isRead: true,
    createdAt: "2025-12-13T01:45:00.000Z"
  },
  {
    id: 996,
    title: "Hệ thống bảo trì lúc 3h sáng mai",
    message: "Hệ thống sẽ bảo trì từ 3:00 - 4:30 sáng ngày 14/12. Rất mong quý khách thông cảm!",
    type: "SYSTEM",
    isRead: false,
    createdAt: "2025-12-12T20:00:00.000Z"
  }
];
    setTimeout(() => {
        setNotifications(fakeNotifications);
        setLoading(false);
    }, 1500);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await axiosClient.put(`/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
      );
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosClient.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Lỗi đánh dấu tất cả');
    }
  };

  const deleteNotification = async (id: number) => {
    if (!confirm('Xóa thông báo này?')) return;
    try {
      await axiosClient.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Package size={20} />;
      case 'PROMOTION': return <Percent size={20} />;
      case 'SYSTEM': return <Bell size={20} />;
      case 'ACCOUNT': return <User size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ORDER': return '#10b981';
      case 'PROMOTION': return '#f59e0b';
      case 'SYSTEM': return '#3b82f6';
      case 'ACCOUNT': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (error) return <div className="error-message">{error}</div>;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Thông báo của bạn</h1>
          {unreadCount > 0 && (
            <button className="mark-all-read" onClick={markAllAsRead}>
              Đánh dấu tất cả đã đọc ({unreadCount})
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell className="empty-icon" size={80} />
            <p>Chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                onClick={() => !notif.isRead && markAsRead(notif.id)}
              >
                <div className="notification-icon" style={{ backgroundColor: getTypeColor(notif.type) }}>
                  {getTypeIcon(notif.type)}
                </div>

                <div className="notification-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <span className="notification-time">
                    {new Date(notif.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notif.isRead && <span className="unread-dot"></span>}
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;