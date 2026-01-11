import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./OrderPage.css";

import orderService from "../../services/OrderService";
import paymentService from "../../services/PaymentService";
import { useAuth } from "../../context/AuthContext";
import type { OrderFullResponse } from "../../services/Interface";
import { userService } from "../../services/UserService";

const OrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, setUser } = useAuth();

  /* ================= STATE ================= */

  const [order, setOrder] = useState<OrderFullResponse>({
    orderID: 0,
    orderDate: "",
    status: "",
    paymentStatus: "UNPAID",
    userID: 0,
    subTotal: 0,
    discountAmount: 0,
    totalAmount: 0,
    products: []
  });

  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [applying, setApplying] = useState(false);

  // 🔔 TOAST
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 📦 ADDRESS + PHONE
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [tempAddress, setTempAddress] = useState("");
  const [tempPhone, setTempPhone] = useState("");

  const [isEditAddress, setIsEditAddress] = useState(false);

  /* ================= LOAD ORDER ================= */

  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      try {
        const data = await orderService.getById(Number(orderId));
        setOrder(data);

        setAddress((data as any).address || user?.address || "");
        setPhone(user?.sdt || "");
      } catch (err) {
        console.error(err);
        alert("Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, user?.address, user?.sdt]);

  /* ================= PAYPAL ================= */

  const handlePayPalPayment = async () => {
    if (!orderId) return;

    try {
      const res = await paymentService.createPayPalPayment(Number(orderId));
      if (res.approvalUrl) {
        window.location.href = res.approvalUrl;
      } else {
        alert("Không lấy được link PayPal");
      }
    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại");
    }
  };

  /* ================= DISCOUNT ================= */

  const applyDiscount = async () => {
    if (!discountCode) return;

    try {
      setApplying(true);
      const updated = await orderService.applyDiscount(
        order.orderID,
        discountCode
      );
      setOrder(updated);
      setDiscountCode("");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Mã giảm giá không hợp lệ");
    } finally {
      setApplying(false);
    }
  };

  const formatPrice = (price?: number) =>
    new Intl.NumberFormat("vi-VN").format(price ?? 0) + "đ";

  if (loading) return <div className="loading">Đang tải đơn hàng...</div>;
  if (!order) return <div className="error">Không tìm thấy đơn hàng</div>;

  /* ================= RENDER ================= */

  return (
    <div className="order-page">
      {/* ===== PRODUCTS ===== */}
      {order.products.map((item) => (
        <div key={item.productID} className="product-section">
          <img
            src={item.imageUrl || "/no-image.png"}
            alt={item.name}
            className="product-image"
          />
          <div className="product-info">
            <h3 className="product-title">{item.name}</h3>
            <div className="product-price">
              <span className="discounted-price">
                {formatPrice(item.price)}
              </span>
            </div>
            <div className="quantity">Số lượng: {item.quantity}</div>
          </div>
        </div>
      ))}

      {/* ===== CUSTOMER INFO ===== */}
      <div className="customer-section">
        <h2 className="section-title">THÔNG TIN KHÁCH HÀNG</h2>

        <div className="customer-info">
          <div className="customer-name-row">
            <span className="customer-name">{user?.fullName}</span>
            <span className="phone">{phone}</span>
          </div>

          <div className="email-label">EMAIL</div>
          <div className="email">{user?.email}</div>

          <div className="email-label">ĐỊA CHỈ & SĐT GIAO HÀNG</div>

          <div className="address-row">
            <span className="address-text">
              {phone} – {address}
            </span>
            <button
              className="change-address-btn"
              onClick={() => {
                setTempAddress(address);
                setTempPhone(phone);
                setIsEditAddress(true);
              }}
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>

      {/* ===== DISCOUNT ===== */}
      <div className="discount-box">
        <input
          type="text"
          placeholder="Nhập mã giảm giá"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        <button disabled={!discountCode || applying} onClick={applyDiscount}>
          Áp dụng
        </button>
      </div>

      {/* ===== TOTAL ===== */}
      <div className="price-summary-full">
        <div className="summary-row">
          <span>Số lượng sản phẩm</span>
          <span>{order.products.reduce((s, p) => s + p.quantity, 0)}</span>
        </div>
        <div className="summary-row">
          <span>Tổng tiền hàng</span>
          <span>{formatPrice(order.subTotal)}</span>
        </div>
        <div className="summary-row">
          <span>Phí vận chuyển</span>
          <span className="free-shipping">Miễn phí</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="summary-row discount">
            <span>Giảm giá</span>
            <span>-{formatPrice(order.discountAmount)}</span>
          </div>
        )}
        <div className="total-row">
          <span>Tổng tiền</span>
          <span className="total-amount">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        {order.paymentStatus === "UNPAID" && (
          <div className="final-action">
            <button className="continue-button" onClick={handlePayPalPayment}>
              Thanh toán
            </button>
          </div>
        )}
      </div>

      {/* ===== MODAL EDIT PHONE + ADDRESS ===== */}
      {isEditAddress && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Chỉnh sửa thông tin giao hàng</h3>

            <input
              className="address-input"
              placeholder="Số điện thoại"
              value={tempPhone}
              onChange={(e) => setTempPhone(e.target.value)}
            />

            <textarea
              className="address-input"
              placeholder="Địa chỉ giao hàng"
              value={tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setIsEditAddress(false)}
              >
                Huỷ
              </button>

              <button
                className="btn-save"
                onClick={async () => {
                  if (!user?.userId) return alert("Vui lòng đăng nhập lại");
                  if (!tempPhone.trim() || !tempAddress.trim())
                    return alert("Không được để trống");

                  try {
                    const updatedUser = await userService.updateUser(
                      user.userId,
                      {
                        sdt: tempPhone,
                        address: tempAddress
                      }
                    );

                    const newUser = {
                      ...user,
                      sdt: updatedUser.sdt ?? tempPhone,
                      address: updatedUser.address ?? tempAddress
                    };

                    setPhone(newUser.sdt);
                    setAddress(newUser.address);

                    setUser(newUser);
                    localStorage.setItem("user", JSON.stringify(newUser));

                    setIsEditAddress(false);
                    setToastMessage("Cập nhật thông tin giao hàng thành công");
                    setTimeout(() => setToastMessage(null), 5000);
                  } catch (e) {
                    alert("Cập nhật thất bại");
                  }
                }}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && <div className="toast-success">{toastMessage}</div>}
    </div>
  );
};

export default OrderPage;
