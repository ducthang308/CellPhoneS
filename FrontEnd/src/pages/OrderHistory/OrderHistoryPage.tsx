import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { OrderFullResponse } from "../../services/Interface";
import orderService from "../../services/OrderService";
import "./OrderHistoryPage.css";

const PLACEHOLDER_IMG =
  "https://via.placeholder.com/100x100?text=No+Image";

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  /* ================= USER ================= */
  const rawUser = localStorage.getItem("user");
  const userId = rawUser ? JSON.parse(rawUser).userId : null;

  /* ================= STATE ================= */
  const [orders, setOrders] = useState<OrderFullResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] =
    useState<OrderFullResponse | null>(null);

  /* ================= HELPERS ================= */
  const safeNumber = (v?: number | null) => v ?? 0;
  const safeArray = <T,>(arr?: T[] | null): T[] => arr ?? [];

  const getProductImage = (p: any): string => {
    if (p?.imageUrl) return p.imageUrl;
    if (p?.productImages?.length > 0)
      return p.productImages[0].url;
    return PLACEHOLDER_IMG;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString(
      "vi-VN",
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "#16a34a";
      case "DELIVERED":
        return "#2563eb";
      case "PENDING":
        return "#f59e0b";
      case "CANCELLED":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  /* ================= LOAD ORDERS ================= */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    orderService
      .getByUser(userId)
      .then(data => {
        const safeOrders: OrderFullResponse[] = (data || []).map(
          o => ({
            ...o,
            products: o.products ?? [],
            subTotal: o.subTotal ?? 0,
            discountAmount: o.discountAmount ?? 0,
            totalAmount: o.totalAmount ?? 0
          })
        );

        setOrders(safeOrders);
      })
      .catch(err => {
        console.error("❌ Lỗi load order:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  /* ================= RENDER ================= */
  return (
    <div className="ohp-page">
      <div className="ohp-container">
        <button className="ohp-back-btn" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <h1 className="ohp-title">Lịch sử đơn hàng</h1>

        {loading ? (
          <div className="ohp-loading">Đang tải đơn hàng…</div>
        ) : (
          <div className="ohp-grid">
            {/* LEFT */}
            <div className="ohp-list">
              {orders.length === 0 && (
                <div className="ohp-empty">
                  Bạn chưa có đơn hàng nào
                </div>
              )}

              {orders.map(order => (
                <div
                  key={order.orderID}
                  className={`ohp-card ${
                    selectedOrder?.orderID === order.orderID
                      ? "ohp-active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedOrder({
                      ...order,
                      products: safeArray(order.products),
                      subTotal: safeNumber(order.subTotal),
                      discountAmount: safeNumber(order.discountAmount),
                      totalAmount: safeNumber(order.totalAmount)
                    })
                  }
                >
                  <div className="ohp-card-header">
                    <div>
                      <div className="ohp-order-id">
                        Đơn hàng #{order.orderID}
                      </div>
                      <div className="ohp-order-date">
                        {formatDate(order.orderDate)}
                      </div>
                    </div>

                    <span
                      className="ohp-status"
                      style={{
                        color: getStatusColor(order.status)
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="ohp-preview">
                    {safeArray(order.products).length} sản phẩm
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="ohp-detail">
              {selectedOrder ? (
                <>
                  <h2 className="ohp-detail-title">
                    Chi tiết đơn #{selectedOrder.orderID}
                  </h2>

                  <div className="ohp-meta">
                    <p>
                      <strong>Ngày đặt:</strong>{" "}
                      {formatDate(selectedOrder.orderDate)}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>{" "}
                      <span
                        style={{
                          color: getStatusColor(
                            selectedOrder.status
                          )
                        }}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p>
                      <strong>Thanh toán:</strong>{" "}
                      {selectedOrder.paymentStatus}
                    </p>
                  </div>

                  {/* PRODUCTS */}
                  <div className="ohp-products">
                    {safeArray(selectedOrder.products).map(p => (
                      <div
                        key={p.productID}
                        className="ohp-product"
                      >
                        <img
                          src={getProductImage(p)}
                          alt={p.name}
                          className="ohp-product-img"
                        />

                        <div className="ohp-product-info">
                          <h3>{p.name}</h3>
                          <p>Số lượng: {p.quantity}</p>
                        </div>

                        <div className="ohp-product-price">
                          {(
                            safeNumber(p.price) *
                            safeNumber(p.quantity)
                          ).toLocaleString("vi-VN")}{" "}
                          ₫
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SUMMARY */}
                  <div className="ohp-summary">
                    <div>
                      <span>Tạm tính</span>
                      <span>
                        {safeNumber(
                          selectedOrder.subTotal
                        ).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>

                    <div>
                      <span>Giảm giá</span>
                      <span className="ohp-discount">
                        -
                        {safeNumber(
                          selectedOrder.discountAmount
                        ).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>

                    <div className="ohp-final">
                      <strong>Tổng thanh toán</strong>
                      <strong>
                        {safeNumber(
                          selectedOrder.totalAmount
                        ).toLocaleString("vi-VN")} ₫
                      </strong>
                    </div>
                  </div>
                </>
              ) : (
                <div className="ohp-empty">
                  Chọn một đơn hàng để xem chi tiết
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
