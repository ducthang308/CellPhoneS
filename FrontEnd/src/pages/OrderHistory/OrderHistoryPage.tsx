import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IOrder } from "../../services/Interface";       
import type { IOrderDetail } from "../../services/Interface"; 
import type { IProduct } from "../../services/Interface";     
import "./OrderHistoryPage.css";  

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [orders] = useState<IOrder[]>([
    { orderID: 1001, order_date: "2025-04-15 14:30:00", status: "Đã giao" },
    { orderID: 1002, order_date: "2025-04-10 09:15:00", status: "Hoàn thành" },
    { orderID: 1003, order_date: "2025-04-08 18:22:00", status: "Đang xử lý" },
    { orderID: 1004, order_date: "2025-03-28 11:05:00", status: "Đã hủy" },
  ]);

  const [orderDetails] = useState<(IOrderDetail & {
    product: Pick<IProduct, "name" | "image_url" | "price">
  })[]>([
    { orderDetailID: 1, orderID: 1001, productID: 99, quantity: 1, product: { name: "iPhone Air 1TB", image_url: "https://via.placeholder.com/80x80/333/fff?text=iPhone", price: 40990000 } },
    { orderDetailID: 2, orderID: 1001, productID: 88, quantity: 1, product: { name: "MacBook Air M3", image_url: "https://via.placeholder.com/80x80/silver/333?text=Mac", price: 28990000 } },
    { orderDetailID: 3, orderID: 1002, productID: 19, quantity: 2, product: { name: "iPhone 17 Pro Max 256GB", image_url: "https://via.placeholder.com/80x80/orange/fff?text=iP17", price: 37490000 } },
    { orderDetailID: 4, orderID: 1003, productID: 99, quantity: 1, product: { name: "iPhone Air 1TB", image_url: "https://via.placeholder.com/80x80/333/fff?text=iPhone", price: 40990000 } },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  // Lọc chi tiết theo đơn hàng được chọn
  const currentDetails = selectedOrder
    ? orderDetails.filter(d => d.orderID === selectedOrder.orderID)
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành": return "#00c853";
      case "Đã giao": return "#0066cc";
      case "Đang xử lý": return "#ff9800";
      case "Đã hủy": return "#d70018";
      default: return "#666";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString("vi-VN")} lúc ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
  };

  const totalAmount = currentDetails.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="order-history-page">
      <div className="order-container">

        <button className="back-btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>

        <h1 className="page-title">Lịch sử đơn hàng</h1>

        <div className="orders-grid">

          <div className="orders-list">
            {orders.map(order => (
              <div
                key={order.orderID}
                className={`order-card ${selectedOrder?.orderID === order.orderID ? "active" : ""}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-header">
                  <div>
                    <div className="order-id">Đơn hàng #{order.orderID}</div>
                    <div className="order-date">{formatDate(order.order_date)}</div>
                  </div>
                  <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                    {order.status}
                  </div>
                </div>

                {/* Hiển thị ảnh nhỏ của sản phẩm trong đơn */}
                <div className="order-items-preview">
                  {orderDetails
                    .filter(d => d.orderID === order.orderID)
                    .slice(0, 3)
                    .map(item => (
                      <img key={item.orderDetailID} src={item.product.image_url} alt={item.product.name} />
                    ))}
                  {orderDetails.filter(d => d.orderID === order.orderID).length > 3 && (
                    <span className="more-items">
                      +{orderDetails.filter(d => d.orderID === order.orderID).length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="order-detail-panel">
            {selectedOrder ? (
              <>
                <h2>Chi tiết đơn hàng #{selectedOrder.orderID}</h2>
                <div className="detail-info">
                  <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.order_date)}</p>
                  <p><strong>Trạng thái:</strong> <span style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status}</span></p>
                </div>

                <div className="detail-products">
                  {currentDetails.map(item => (
                    <div key={item.orderDetailID} className="detail-item">
                      <img src={item.product.image_url} alt={item.product.name} />
                      <div className="detail-item-info">
                        <h4>{item.product.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                        <p>Giá: {item.product.price.toLocaleString("vi-VN")} ₫</p>
                      </div>
                      <div className="detail-price">
                        {(item.product.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                  ))}
                </div>

                <div className="detail-total">
                  <strong>Tổng thanh toán:</strong>
                  <span className="final-price">{totalAmount.toLocaleString("vi-VN")} ₫</span>
                </div>

                <div className="detail-actions">
                  <button className="btn-reorder">Mua lại đơn hàng</button>
                  <button className="btn-support">Liên hệ hỗ trợ</button>
                </div>
              </>
            ) : (
              <div className="no-order-selected">
                <p>Chọn một đơn hàng để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;