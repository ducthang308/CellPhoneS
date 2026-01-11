import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./order_approval.module.css";

import OrderService from "../../services/StatusService";
import type { OrderWithUserResponse } from "../../services/Interface";

/* ================= HELPERS ================= */
const mapTrangThai = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Chưa duyệt";
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Đã từ chối";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

const formatDate = (d?: string | null) =>
  d ? d.slice(0, 10).split("-").reverse().join("/") : "—";

/* ================= VIEW MODEL ================= */
interface OrderRowVM {
  orderId: number;
  orderDate: string;
  status: string;
  paymentStatus: string;
  customerName: string;
  phone: string;
  address: string;
  totalAmount: number;
}

/* ================= COMPONENT ================= */
const OrderApproval = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderRowVM[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== SEARCH ===== */
  const [keyword, setKeyword] = useState("");

  /* ===== PAGINATION ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const raw: OrderWithUserResponse[] =
          await OrderService.getOrdersWithUser();

        const rows: OrderRowVM[] = raw
          .filter(o => o.status === "PENDING")
          .map(o => ({
            orderId: o.orderId,
            orderDate: o.orderDate,
            status: o.status,
            paymentStatus: o.paymentStatus,
            totalAmount: o.totalAmount,
            customerName: o.user?.fullName ?? "—",
            phone: o.user?.phone ?? "—",
            address: o.user?.address ?? "—"
          }));

        setOrders(rows);
      } catch (err) {
        console.error(err);
        alert("Không tải được danh sách đơn cần duyệt");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredOrders = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    if (!kw) return orders;

    return orders.filter(o =>
      o.orderId.toString().includes(kw) ||
      o.customerName.toLowerCase().includes(kw) ||
      o.phone.toLowerCase().includes(kw)
    );
  }, [orders, keyword]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  /* reset page khi search */
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  /* ================= RENDER ================= */
  return (
    <div className={styles.oa_container}>
      <div className={styles.oa_header}>
        <h1 className={styles.oa_title}>Danh sách đơn cần duyệt</h1>

        {/* ===== SEARCH BOX ===== */}
        <input
          className={styles.oa_search}
          placeholder="🔍 Tìm theo mã đơn, tên khách, SĐT..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.oa_loading}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <table className={styles.oa_table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {pagedOrders.length > 0 ? (
                pagedOrders.map(o => (
                  <tr
                    key={o.orderId}
                    onClick={() =>
                      navigate(`/admin/orders/${o.orderId}`)
                    }
                  >
                    <td>#{o.orderId}</td>
                    <td>{formatDate(o.orderDate)}</td>
                    <td>{o.customerName}</td>
                    <td>{o.phone}</td>
                    <td className={styles.oa_address}>
                      {o.address}
                    </td>
                    <td>
                      {o.totalAmount.toLocaleString("vi-VN")} ₫
                    </td>
                    <td>
                      <span className={styles.oa_statusPending}>
                        {mapTrangThai(o.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.oa_noData}>
                    Không tìm thấy đơn phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ===== PAGINATION ===== */}
          <div className={styles.oa_pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ◀
            </button>

            <span>
              Trang {currentPage} / {totalPages || 1}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderApproval;
