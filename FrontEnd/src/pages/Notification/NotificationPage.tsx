import React, { useEffect, useState } from "react";
import "./NotificationPage.css";
import { useAuth } from "../../context/AuthContext";
import LoadingSkeleton from "../../components/NotificationComponet/LoadingSkeleton";
import {
  Package,
  Percent,
  Bell,
  User,
  Info,
  Trash2
} from "lucide-react";

import NotificationBell from "../../components/Badge/NotificationBell";
import { notificationService } from "../../services/NotificationService";
import type { Notification } from "../../services/Interface";

/* ================= CLIENT READ STATE ================= */

// lưu theo user
const getStorageKey = (userId: number) =>
  `read_notification_keys_user_${userId}`;

// key cơ bản từ nội dung
const buildBaseKey = (n: Notification) =>
  `${n.notificationType}|${n.title}|${n.content}`;

const getReadKeys = (userId: number): string[] => {
  try {
    return JSON.parse(
      localStorage.getItem(getStorageKey(userId)) || "[]"
    );
  } catch {
    return [];
  }
};

const saveReadKey = (userId: number, key: string) => {
  const cur = getReadKeys(userId);
  if (!cur.includes(key)) {
    localStorage.setItem(
      getStorageKey(userId),
      JSON.stringify([...cur, key])
    );
  }
};

const saveAllReadKeys = (userId: number, keys: string[]) => {
  localStorage.setItem(
    getStorageKey(userId),
    JSON.stringify(keys)
  );
};

/* ================= TYPES ================= */

type NotificationClient = Notification & {
  __clientKey: string;
};

/* ================= COMPONENT ================= */

const NotificationsPage: React.FC = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [notifications, setNotifications] =
    useState<NotificationClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = authUser?.userId;

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem thông báo");
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);

        const data =
          await notificationService.getUserNotifications(
            userId
          );

        const readKeys = getReadKeys(userId);

        const merged: NotificationClient[] = data.map(
          (n, index) => {
            const baseKey = buildBaseKey(n);
            const clientKey = `${baseKey}__${index}`;

            return {
              ...n,
              __clientKey: clientKey,
              isRead: readKeys.includes(baseKey)
            };
          }
        );

        setNotifications(merged);
      } catch (err) {
        console.error("Lỗi tải thông báo:", err);
        setError(
          "Không thể tải thông báo. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  /* ================= HANDLERS ================= */

  const handleClickNotification = (notif: NotificationClient) => {
    if (!userId || notif.isRead) return;

    setNotifications(prev =>
      prev.map(n =>
        n.__clientKey === notif.__clientKey
          ? { ...n, isRead: true }
          : n
      )
    );

    const baseKey = `${notif.notificationType}|${notif.title}|${notif.content}`;

    saveReadKey(userId, baseKey);
    window.dispatchEvent(new Event("notification-read"));
  };

  const markAllAsRead = () => {
    if (!userId) return;

    const allBaseKeys = notifications.map(
      n => `${n.notificationType}|${n.title}|${n.content}`
    );
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );

    saveAllReadKeys(userId, allBaseKeys);
    window.dispatchEvent(new Event("notification-read"));

  };

  const deleteNotification = (clientKey: string) => {
    if (!userId) return;
    if (!confirm("Xóa thông báo này?")) return;

    setNotifications(prev =>
      prev.filter(n => n.__clientKey !== clientKey)
    );

    const remain = getReadKeys(userId).filter(
      k => k !== clientKey
    );
    saveAllReadKeys(userId, remain);
  };

  /* ================= HELPERS ================= */

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <Package size={20} />;
      case "PROMOTION":
        return <Percent size={20} />;
      case "SYSTEM":
        return <Bell size={20} />;
      case "ACCOUNT":
      case "PERSONAL":
        return <User size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ORDER":
        return "#10b981";
      case "PROMOTION":
        return "#f59e0b";
      case "SYSTEM":
        return "#3b82f6";
      case "ACCOUNT":
      case "PERSONAL":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  /* ================= DERIVED ================= */

  const unreadCount = notifications.filter(
    n => !n.isRead
  ).length;

  /* ================= RENDER ================= */

  if (authLoading || loading) return <LoadingSkeleton />;
  if (error) return <div className="error-message">{error}</div>;
  if (!authUser)
    return (
      <div className="error-message">Vui lòng đăng nhập</div>
    );

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="title-with-bell">
            <NotificationBell count={unreadCount} />
            <h1>Thông báo của bạn</h1>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-all-read"
              onClick={markAllAsRead}
            >
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
            {notifications.map(notif => (
              <div
                key={notif.__clientKey}
                className={`notification-item ${
                  notif.isRead ? "read" : "unread"
                }`}
                onClick={() =>
                  handleClickNotification(notif)
                }
              >
                <div
                  className="notification-icon"
                  style={{
                    backgroundColor: getTypeColor(
                      notif.notificationType
                    )
                  }}
                >
                  {getTypeIcon(notif.notificationType)}
                </div>

                <div className="notification-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.content}</p>
                </div>

                <div className="notification-actions">
                  {!notif.isRead && (
                    <span className="unread-dot"></span>
                  )}
                  <button
                    className="delete-btn"
                    onClick={e => {
                      e.stopPropagation();
                      deleteNotification(
                        notif.__clientKey
                      );
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
