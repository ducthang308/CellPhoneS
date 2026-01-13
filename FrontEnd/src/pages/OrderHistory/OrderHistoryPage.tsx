import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { OrderFullResponse } from "../../services/Interface";
import orderService from "../../services/OrderService";
import "./OrderHistoryPage.css";

const PLACEHOLDER_IMG =
  "https://via.placeholder.com/100x100?text=No+Image";

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xử lý",
  APPROVED: "Hoàn thành",
  CANCELLED: "Đã huỷ",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  REFUNDED: "Hoàn tiền",
};

/* ================= STATUS TABS ================= */
const STATUS_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Chờ xử lý" },
  { key: "APPROVED", label: "Hoàn Thành" },
  { key: "CANCELLED", label: "Đã hủy" }
];

const OrderHistoryPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const rawUser = localStorage.getItem("user");
  const userId = rawUser ? JSON.parse(rawUser).userId : null;

  const [orders, setOrders] = useState<OrderFullResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderFullResponse | null>(null);

  const params = new URLSearchParams(location.search);
  const defaultTab = params.get("tab") || "ALL";

  const [activeStatus, setActiveStatus] = useState<string>(defaultTab);


  const safeArray = <T,>(arr?: T[] | null): T[] => arr ?? [];

  const getProductImage = (p: any): string => {
    if (p?.imageUrl) return p.imageUrl;
    if (p?.productImages?.length) return p.productImages[0].url;
    return PLACEHOLDER_IMG;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString(
      "vi-VN",
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "PENDING":
        return "orange";
      case "CANCELLED":
        return "red";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || "ALL";

    setActiveStatus(tab);
    setSelectedOrder(null);
  }, [location.search]);

  /* ================= LOAD ORDERS ================= */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    orderService
      .getByUser(userId)
      .then(data => setOrders(data || []))
      .finally(() => setLoading(false));
  }, [userId]);

  const filteredOrders = orders.filter(o =>
    activeStatus === "ALL" ? true : o.status === activeStatus
  );

  return (
    <div className="ohp-page">
      <div className="ohp-container">
        <button className="ohp-back-btn" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <h1 className="ohp-title">Lịch sử đơn hàng</h1>

        {/* ===== TABS ===== */}
        <div className="ohp-tabs">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              className={`ohp-tab ${activeStatus === tab.key ? "active" : ""
                }`}
              onClick={() => {
                setActiveStatus(tab.key);
                setSelectedOrder(null);
              }}
            >
              {tab.label}
              <span className="ohp-tab-count">
                {tab.key === "ALL"
                  ? orders.length
                  : orders.filter(o => o.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="ohp-loading">Đang tải đơn hàng…</div>
        ) : (
          <div className="ohp-grid">
            <div className="ohp-list">
              {filteredOrders.map(order => (
                <div
                  key={order.orderID}
                  className={`ohp-card ${selectedOrder?.orderID === order.orderID
                    ? "ohp-active"
                    : ""
                    }`}
                  onClick={() =>
                    setSelectedOrder({
                      ...order,
                      products: safeArray(order.products)
                    })
                  }
                >
                  <div className="ohp-card-header">
                    <div>
                      <div className="ohp-order-id">
                        Đơn #{order.orderID}
                      </div>
                      <div className="ohp-order-date">
                        {formatDate(order.orderDate)}
                      </div>
                    </div>

                    <span className={`badge ${getStatusClass(order.status)}`}>
                      {ORDER_STATUS_LABEL[order.status] || order.status}
                    </span>

                  </div>

                  <div className="ohp-preview">
                    {safeArray(order.products).length} sản phẩm
                  </div>
                </div>
              ))}
            </div>

            {/* ===== RIGHT ===== */}
            <div className="ohp-detail">
              {selectedOrder ? (
                <>
                  <div className="ohp-detail-header">
                    <h2 className="ohp-detail-title">
                      Đơn hàng #{selectedOrder.orderID}
                    </h2>

                    {selectedOrder.status === "APPROVED" && (
                      <button
                        className="review-btn header-review-btn"
                        onClick={() =>
                          navigate(
                            `/product/${selectedOrder.products?.[0]?.productID}/reviews?orderId=${selectedOrder.orderID}`
                          )
                        }
                      >
                        Viết đánh giá
                      </button>
                    )}
                  </div>

                  <div className="ohp-meta">
                    <span>{formatDate(selectedOrder.orderDate)}</span>
                    <span className={`badge ${getStatusClass(selectedOrder.status)}`}>
                      {ORDER_STATUS_LABEL[selectedOrder.status] || selectedOrder.status}
                    </span>

                    <span className="badge gray">
                      {PAYMENT_STATUS_LABEL[selectedOrder.paymentStatus] ||
                        selectedOrder.paymentStatus}
                    </span>

                  </div>

                  <div className="ohp-products">
                    {safeArray(selectedOrder.products).map(p => (
                      <div
                        key={`${p.productID}-${selectedOrder.orderID}`}
                        className="od-product"
                      >
                        <img
                          src={getProductImage(p)}
                          alt={p.name}
                        />

                        <div className="od-info">
                          <h4>{p.name}</h4>
                          <span>Số lượng: {p.quantity}</span>
                        </div>

                        <div className="od-right">
                          <div className="od-price">
                            {(p.price * p.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            ₫
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="ohp-summary">
  {selectedOrder.subTotal != null && (
    <div className="summary-row">
      <span>Tạm tính</span>
      <span>
        {selectedOrder.subTotal.toLocaleString("vi-VN")} ₫
      </span>
    </div>
  )}

  {selectedOrder.discountAmount != null &&
    selectedOrder.discountAmount > 0 && (
      <div className="summary-row discount">
        <span>Giảm giá</span>
        <span>
          -{selectedOrder.discountAmount.toLocaleString("vi-VN")} ₫
        </span>
      </div>
    )}

  <div className="summary-row total">
    <span>Tổng thanh toán</span>
    <strong>
      {selectedOrder.totalAmount.toLocaleString("vi-VN")} ₫
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
