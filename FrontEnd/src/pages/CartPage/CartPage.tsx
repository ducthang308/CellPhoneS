import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

import orderService from "../../services/OrderService";
import cartDetailService from "../../services/CartDetailService";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/UserService";

import type { IProduct } from "../../services/Interface";

interface CartItem extends IProduct {
  quantity: number;
  cartDetailsId: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  /* ================= EDIT STATE ================= */
  const [isEdit, setIsEdit] = useState<null | "phone" | "address">(null);
  const [tempPhone, setTempPhone] = useState("");
  const [tempAddress, setTempAddress] = useState("");

  /* ================= CART STATE ================= */
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const loadCart = async () => {
      if (!user?.cartId) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const details = await cartDetailService.getByCartId(user.cartId);

        const items: CartItem[] = details.map((detail) => ({
          ...detail.product,
          quantity: 1,
          cartDetailsId: detail.cartDetailsId,
        }));

        setCartItems(items);
      } catch (err) {
        console.error(err);
        alert("Không thể tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user?.cartId]);

  /* ================= UPDATE QTY ================= */
  const updateQuantity = (productId: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (cartDetailsId: number) => {
    try {
      await cartDetailService.delete(cartDetailsId);
      setCartItems((prev) =>
        prev.filter((item) => item.cartDetailsId !== cartDetailsId)
      );
    } catch {
      alert("Không thể xoá sản phẩm");
    }
  };

  /* ================= CONFIRM ORDER ================= */
  const handleConfirmOrder = async () => {
    if (isPlacingOrder) return;

    if (!user) {
      alert("Vui lòng đăng nhập");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const orderPayload = {
        userID: user.userId,
        items: cartItems.map((item) => ({
          productId: item.productId!,
          quantity: item.quantity,
        })),
      };

      const order = await orderService.create(orderPayload);

      if (user?.cartId) {
        await cartDetailService.deleteByCartId(user.cartId);
      }

      setCartItems([]);
      navigate(`/order/${order.orderID}`);
    } catch (err) {
      console.error(err);
      alert("Đặt hàng thất bại");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  /* ================= TOTAL ================= */
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  if (loading) return <div className="loading">Đang tải giỏ hàng...</div>;

  /* ================= RENDER ================= */
  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* ================= LEFT ================= */}
        <div className="cart-left">
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              Quay lại
            </button>
            <h1>Giỏ hàng</h1>
          </div>

          {cartItems.length === 0 && (
            <p className="empty-cart">Giỏ hàng trống</p>
          )}

          {cartItems.map((item) => (
            <div key={item.cartDetailsId} className="cart-item">
              <img
                className="item-img"
                src={item.productImages?.[0]?.url || "/no-image.png"}
                alt={item.name}
              />

              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>

                <div className="quantity-and-price">
                  <div className="quantity-box">
                    <button onClick={() => updateQuantity(item.productId ?? 0, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId ?? 0, 1)}>
                      +
                    </button>
                  </div>

                  <div className="price-wrapper">
                    <span className="current-price">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </span>
                    {item.quantity > 1 && (
                      <div className="total-for-item">
                        = {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="remove-item-btn fa-solid fa-trash"
                onClick={() => removeItem(item.cartDetailsId)}
                title="Xóa sản phẩm"
              />
            </div>
          ))}

          <div className="cart-total">
            <div className="total-row">
              <span>Tổng thanh toán (tạm tính):</span>
              <strong>{totalPrice.toLocaleString("vi-VN")} ₫</strong>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="cart-right">
          <h2>Thông tin đặt hàng</h2>

          <div className="checkout-info">
            <div className="info-row">
              <span>Họ và tên</span>
              <strong>{user?.fullName}</strong>
            </div>

            <div className="info-row">
              <span>Số điện thoại</span>
              <div className="info-edit">
                <span>
                  {user?.sdt?.trim() ? user.sdt : "Chưa có số điện thoại"}
                </span>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setTempPhone(user?.sdt || "");
                    setIsEdit("phone");
                  }}
                >
                  ✏️
                </button>
              </div>
            </div>

            <div className="info-row">
              <span>Địa chỉ</span>
              <div className="info-edit">
                <span>
                  {user?.address?.trim()
                    ? user.address
                    : "Chưa có địa chỉ"}
                </span>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setTempAddress(user?.address || "");
                    setIsEdit("address");
                  }}
                >
                  ✏️
                </button>
              </div>
            </div>

            <div className="info-row">
              <span>Email</span>
              <span>{user?.email}</span>
            </div>

            <button
              type="button"
              className="btn-confirm"
              onClick={handleConfirmOrder}
            >
              XÁC NHẬN VÀ ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL EDIT ================= */}
      {isEdit && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>
              {isEdit === "phone"
                ? "Cập nhật số điện thoại"
                : "Cập nhật địa chỉ"}
            </h3>

            {isEdit === "phone" ? (
              <input
                type="text"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <textarea
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                placeholder="Nhập địa chỉ"
              />
            )}

            <div className="modal-actions">
              <button onClick={() => setIsEdit(null)}>Huỷ</button>
              <button
                onClick={async () => {
                  if (!user?.userId) return;

                  try {
                    const updatedUser = await userService.updateUser(
                      user.userId,
                      isEdit === "phone"
                        ? { sdt: tempPhone }
                        : { address: tempAddress }
                    );

                    const newUser = {
                      ...user,
                      sdt: updatedUser.sdt ?? user.sdt,
                      address: updatedUser.address ?? user.address,
                    };

                    setUser(newUser);
                    localStorage.setItem("user", JSON.stringify(newUser));
                    setIsEdit(null);
                  } catch {
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

      {isPlacingOrder && (
        <div className="fullscreen-loading">
          <div className="loading-box">
            <div className="spinner-lg"></div>
            <p>Đang xử lý đơn hàng...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
