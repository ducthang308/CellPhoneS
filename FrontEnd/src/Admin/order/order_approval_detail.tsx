import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./order_approval_detail.module.css";

import OrderService from "../../services/StatusService";
import type { OrderWithUserResponse } from "../../services/Interface";

/* ================= VIEW MODEL ================= */
type OrderApprovalVM = {
  idDon: number;
  ngayDat?: string;
  tenNguoiNhan: string;
  sdtNguoiNhan: string;
  diaChiNhan: string;
  trangThai: string;
  paymentStatus: string;
  tongTien: number;
};

/* ================= HELPERS ================= */
const formatVND = (n?: number | null) =>
  `${(n ?? 0).toLocaleString("vi-VN")} ₫`;

const formatDate = (d?: string | null) =>
  d ? d.slice(0, 10).split("-").reverse().join("/") : "—";

const mapTrangThai = (s: string) => {
  switch (s) {
    case "PENDING":
      return "Chưa duyệt";
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Đã từ chối";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return s;
  }
};

/* ================= COMPONENT ================= */
const OrderApprovalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderApprovalVM | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===== confirm modal ===== */
  const [confirmType, setConfirmType] =
    useState<"APPROVE" | "CANCELLED" | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!id || isNaN(Number(id))) return;

    const load = async () => {
      try {
        setLoading(true);

        const orders: OrderWithUserResponse[] =
          await OrderService.getOrdersWithUser();

        const found = orders.find(
          o => o.orderId === Number(id)
        );

        if (!found) {
          alert("Không tìm thấy đơn hàng");
          navigate("/admin/order_approval");
          return;
        }

        setOrder({
          idDon: found.orderId,
          ngayDat: found.orderDate,
          tenNguoiNhan: found.user?.fullName ?? "—",
          sdtNguoiNhan: found.user?.phone ?? "—",
          diaChiNhan: found.user?.address ?? "—",
          trangThai: mapTrangThai(found.status),
          paymentStatus: found.paymentStatus,
          tongTien: found.totalAmount,
        });
      } catch (e) {
        console.error(e);
        alert("Không tải được đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  /* ================= ACTION ================= */
  const canApproveReject = useMemo(
    () => order?.trangThai === "Chưa duyệt",
    [order]
  );

  const handleConfirm = async () => {
    if (!order || !confirmType) return;

    try {
      setConfirmLoading(true);

      await OrderService.updateStatus(
        order.idDon,
        confirmType === "APPROVE" ? "APPROVED" : "CANCELLED"
      );

      setOrder(prev =>
        prev
          ? {
              ...prev,
              trangThai:
                confirmType === "APPROVE"
                  ? "Đã duyệt"
                  : "Đã từ chối",
            }
          : prev
      );

      setConfirmType(null);
    } catch {
      alert("Cập nhật trạng thái thất bại");
    } finally {
      setConfirmLoading(false);
    }
  };

  /* ================= RENDER ================= */
  if (loading)
    return <div className={styles.oad_page}>Đang tải dữ liệu…</div>;

  if (!order) return null;

  return (
    <>
      <div className={styles.oad_container}>
        <button
          className={styles.oad_backBtn}
          onClick={() => navigate("/admin/order_approval")}
        >
          ← Quay lại
        </button>

        <h2 className={styles.oad_title}>
          Đơn hàng #{order.idDon}
        </h2>

        <div className={styles.oad_infoBox}>
          <p><strong>Ngày đặt:</strong> {formatDate(order.ngayDat)}</p>
          <p><strong>Người nhận:</strong> {order.tenNguoiNhan}</p>
          <p><strong>SĐT:</strong> {order.sdtNguoiNhan}</p>
          <p><strong>Địa chỉ:</strong> {order.diaChiNhan}</p>
          <p><strong>Thanh toán:</strong> {order.paymentStatus}</p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className={styles.oad_statusPending}>
              {order.trangThai}
            </span>
          </p>
        </div>

        <div className={styles.oad_total}>
          Tổng tiền: {formatVND(order.tongTien)}
        </div>

        {canApproveReject && (
          <div className={styles.oad_actions}>
            <button
              className={styles.oad_btnApprove}
              onClick={() => setConfirmType("APPROVE")}
            >
              ✔ Duyệt
            </button>
            <button
              className={styles.oad_btnReject}
              onClick={() => setConfirmType("CANCELLED")}
            >
              ✖ Từ chối
            </button>
          </div>
        )}
      </div>

      {/* ================= MODAL CONFIRM ================= */}
      {confirmType && (
        <div className={styles.oad_modalOverlay}>
          <div className={styles.oad_modal}>
            <h3
              className={
                confirmType === "APPROVE"
                  ? styles.oad_modalTitleApprove
                  : styles.oad_modalTitleReject
              }
            >
              {confirmType === "APPROVE"
                ? "Xác nhận duyệt đơn hàng"
                : "Xác nhận từ chối đơn hàng"}
            </h3>

            <p className={styles.oad_modalText}>
              {confirmType === "APPROVE"
                ? "Bạn có chắc chắn muốn duyệt đơn hàng này không?"
                : "Bạn có chắc chắn muốn từ chối đơn hàng này không?"}
            </p>

            <div className={styles.oad_modalActions}>
              <button
                className={styles.oad_modalCancel}
                onClick={() => setConfirmType(null)}
                disabled={confirmLoading}
              >
                Hủy
              </button>

              <button
                className={
                  confirmType === "APPROVE"
                    ? styles.oad_modalConfirmApprove
                    : styles.oad_modalConfirmReject
                }
                onClick={handleConfirm}
                disabled={confirmLoading}
              >
                {confirmLoading ? "Đang xử lý…" : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderApprovalDetailPage;
