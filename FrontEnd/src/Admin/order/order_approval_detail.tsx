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
  status: "PENDING" | "APPROVED" | "CANCELLED";
  paymentStatus: string;
  tongTien: number;
};

/* ================= HELPERS ================= */
const formatVND = (n?: number | null) =>
  `${(n ?? 0).toLocaleString("vi-VN")} ₫`;

const formatDate = (d?: string | null) =>
  d ? d.slice(0, 10).split("-").reverse().join("/") : "—";

const mapTrangThaiLabel = (s: string) => {
  switch (s) {
    case "PENDING":
      return "Chưa duyệt";
    case "APPROVED":
      return "Đã duyệt";
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

  /* ===== STATUS CONTROL ===== */
  const [selectedStatus, setSelectedStatus] =
    useState<"PENDING" | "APPROVED" | "CANCELLED">("PENDING");
  const [saving, setSaving] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!id || isNaN(Number(id))) return;

    const load = async () => {
      try {
        setLoading(true);

        const orders: OrderWithUserResponse[] =
          await OrderService.getOrdersWithUser();

        const found = orders.find(o => o.orderId === Number(id));

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
          status: found.status as any,
          paymentStatus: found.paymentStatus,
          tongTien: found.totalAmount,
        });

        setSelectedStatus(found.status as any);
      } catch (e) {
        console.error(e);
        alert("Không tải được đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  /* ================= SAVE STATUS ================= */
  const handleSaveStatus = async () => {
    if (!order || saving) return;
    if (selectedStatus === order.status) return;

    try {
      setSaving(true);

      await OrderService.updateStatus(order.idDon, selectedStatus);

      setOrder(prev =>
        prev ? { ...prev, status: selectedStatus } : prev
      );

      alert("Cập nhật trạng thái thành công");
    } catch {
      alert("Cập nhật trạng thái thất bại");
    } finally {
      setSaving(false);
    }
  };

  /* ================= RENDER ================= */
  if (loading)
    return <div className={styles.oad_page}>Đang tải dữ liệu…</div>;

  if (!order) return null;

  return (
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

        {/* ===== STATUS SELECT ===== */}
        <div className={styles.oad_statusRow}>
          <strong>Trạng thái:</strong>
          <select
            className={styles.oad_statusSelect}
            value={selectedStatus}
            onChange={e =>
              setSelectedStatus(e.target.value as any)
            }
            disabled={saving}
          >
            <option value="PENDING">Chưa duyệt</option>
            <option value="APPROVED">Duyệt</option>
            <option value="CANCELLED">Hủy</option>
          </select>
        </div>
      </div>

      <div className={styles.oad_total}>
        Tổng tiền: {formatVND(order.tongTien)}
      </div>

      <div className={styles.oad_actions}>
        <button
          className={styles.oad_btnSave}
          onClick={handleSaveStatus}
          disabled={
            saving || selectedStatus === order.status
          }
        >
          {saving ? "Đang lưu…" : "💾 Cập nhật trạng thái"}
        </button>
      </div>
    </div>
  );
};

export default OrderApprovalDetailPage;
