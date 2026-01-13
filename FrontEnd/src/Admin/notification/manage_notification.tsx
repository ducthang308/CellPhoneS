import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./manage_notification.module.css";
import type { Notification } from "../../services/Interface";
import { notificationService } from "../../services/NotificationService";

const ITEMS_PER_PAGE = 5;

const NotificationManagement = () => {
  const navigate = useNavigate();

  /* ================= DATA ================= */
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= MODAL ================= */
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= FORM ================= */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notificationType, setNotificationType] =
    useState<Notification["notificationType"]>("SYSTEM");

  /* ================= LOAD ================= */
  useEffect(() => {
    notificationService.getAll().then(setNotifications);
  }, []);

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    if (!search.trim()) return notifications;
    return notifications.filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, notifications]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ITEMS_PER_PAGE)
  );

  const pageData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ================= DELETE ================= */
  const handleDelete = async (
    e: React.MouseEvent,
    id: number
  ) => {
    e.stopPropagation();
    if (!confirm("Xóa thông báo này?")) return;

    await notificationService.delete(id);
    setNotifications(prev =>
      prev.filter(n => n.notificationId !== id)
    );
  };

  /* ================= CREATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await notificationService.create({
      title,
      content,
      notificationType,
      sendToAll: true
    });

    setShowModal(false);
    setTitle("");
    setContent("");
    setNotificationType("SYSTEM");

    setSuccessMsg("Đăng thông báo thành công!");
    setNotifications(await notificationService.getAll());
  };

  return (
    <main className={styles.ntfPage}>
      {/* HEADER */}
      <div className={styles.ntfHeader}>
        <div>
          <h1>Quản lý thông báo</h1>
          <p>Danh sách thông báo hệ thống</p>
        </div>

        <div className={styles.ntfActions}>
          <input
            className={styles.ntfSearch}
            placeholder="Tìm theo tiêu đề..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <button
            className={styles.ntfCreateBtn}
            onClick={() => setShowModal(true)}
          >
            + Đăng thông báo
          </button>
        </div>
      </div>

      {/* LIST */}
      <section className={styles.ntfList}>
        {pageData.length > 0 ? (
          pageData.map(n => (
            <div
              key={n.notificationId}
              className={styles.ntfCard}
              onClick={() =>
                navigate(`/admin/notifications/${n.notificationId}`, {
                  state: n
                })
              }
            >
              <div className={styles.ntfCardHeader}>
                <span className={styles.ntfType}>
                  {n.notificationType}
                </span>

                <button
                  className={styles.ntfDelete}
                  onClick={e =>
                    handleDelete(e, n.notificationId)
                  }
                >
                  Xóa
                </button>
              </div>

              <h3>{n.title}</h3>
              <p>{n.content}</p>
            </div>
          ))
        ) : (
          <p className={styles.ntfEmpty}>
            Không có thông báo
          </p>
        )}
      </section>

      {/* PAGINATION */}
      <div className={styles.ntfPagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          ‹
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={
              currentPage === i + 1
                ? styles.ntfPageActive
                : styles.ntfPageBtn
            }
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          ›
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className={styles.ntfModalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.ntfModal}
            onClick={e => e.stopPropagation()}
          >
            <h2>Đăng thông báo</h2>

            <form
              onSubmit={handleSubmit}
              className={styles.ntfForm}
            >
              <div className={styles.ntfField}>
                <label>Tiêu đề</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.ntfField}>
                <label>Loại</label>
                <select
                  value={notificationType}
                  onChange={e =>
                    setNotificationType(
                      e.target.value as any
                    )
                  }
                >
                  <option value="SYSTEM">SYSTEM</option>
                  <option value="PROMOTION">PROMOTION</option>
                  <option value="ORDER">ORDER</option>
                  <option value="PERSONAL">PERSONAL</option>
                </select>
              </div>

              <div className={styles.ntfField}>
                <label>Nội dung</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              <div className={styles.ntfModalActions}>
                <button type="submit">Đăng</button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Huỷ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successMsg && (
        <div className={styles.ntfToast}>
          {successMsg}
        </div>
      )}
    </main>
  );
};

export default NotificationManagement;
