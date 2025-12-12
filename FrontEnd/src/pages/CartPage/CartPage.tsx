import React, { useState } from "react";
import type { IProduct } from "../../services/Interface";
import type { IUser } from "../../services/Interface";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

interface CartItem extends IProduct {
  quantity: number;
}

const CartPage: React.FC = () => {
  const currentUser: IUser | null = {
    userID: 1,
    fullName: "Nguyễn Văn A",
    sdt: "0901234567",
    email: "nguyenvana@gmail.com",
    address: "123 Đường Láng, Hà Nội",
    roleId: 1,
  };

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      productID: 99,
      name: "iPhone Air 1TB - Chính hãng Apple Việt Nam",
      price: 40990000,
      stock_quantity: 10,
      image_url: "https://via.placeholder.com/80x80/333/fff?text=iPhone+Air",
      description: "Phiên bản: 1TB | Màu sắc: Đen Không Gian",
      quantity: 1,
    },
    {
      productID: 19,
      name: "iPhone 17 Pro Max 256GB",
      price: 37490000,
      stock_quantity: 5,
      image_url: "https://via.placeholder.com/80x80/orange/fff?text=iP17",
      description: "Phiên bản: 256GB | Màu sắc: Cam vũ trụ",
      quantity: 2,
    },
    {
      productID: 88,
      name: "MacBook Air M3 13 inch",
      price: 28990000,
      stock_quantity: 8,
      image_url: "https://via.placeholder.com/80x80/silver/333?text=MacBook",
      description: "Chip M3 | 8GB RAM | 256GB SSD",
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.productID === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.productID !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-left">
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
                Quay lại
            </button>
            <h1>Giỏ hàng</h1>
          </div>

          {cartItems.map((item) => (
            <div key={item.productID} className="cart-item">
              <img src={item.image_url} alt={item.name} className="item-img" onClick={() => navigate(`/product-detail/${item.productID}`)} />

              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-variant">{item.description}</div>

                <div className="quantity-and-price">
                  <div className="quantity-box">
                    <button onClick={() => updateQuantity(item.productID, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productID, 1)}>+</button>
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
                onClick={() => removeItem(item.productID)}
                title="Xóa sản phẩm"
              >
              </button>
            </div>
          ))}

          {/* Khuyến mãi */}
          <div className="promo-list">
            <div className="promo">
              <span className="tag km1">KM1</span>
              <span>Trả góp thẻ tín dụng 0% lãi – 0 phí – Kỳ hạn tới 12 tháng – Giảm thêm tới 2,5 triệu</span>
            </div>
            <div className="promo">
              <span className="tag km2">KM2</span>
              <span>Giảm tới 600.000đ khi thanh toán qua ví ZaloPay</span>
            </div>
            <a href="#" className="more-promo">Xem thêm 19 khuyến mãi nữa</a>
          </div>

          {/* Tổng tiền */}
          <div className="cart-total">
            <div className="total-row">
              <span>Tổng giá trị:</span>
              <strong>{totalPrice.toLocaleString("vi-VN")} ₫</strong>
            </div>
            <div className="total-row final">
              <span>Tổng thanh toán:</span>
              <strong>{totalPrice.toLocaleString("vi-VN")} ₫</strong>
            </div>
          </div>
        </div>

        <div className="cart-right">
          <h2>Thông tin đặt hàng</h2>
          <p className="note">Bạn cần nhập đầy đủ các trường thông tin có dấu *</p>

          <form className="checkout-form">
            <input type="text" placeholder="Họ và tên *" defaultValue={currentUser?.fullName || ""} required />
            <input type="text" placeholder="Số điện thoại *" defaultValue={currentUser?.sdt || ""} required />
            <input type="email" placeholder="Email" defaultValue={currentUser?.email || ""} />

            <div className="delivery-options">
              <label>
                <input type="radio" name="delivery" defaultChecked />
                <span>Nhận hàng tại nhà</span>
              </label>
              <label>
                <input type="radio" name="delivery" />
                <span>Nhận hàng tại cửa hàng</span>
              </label>
            </div>

            <div className="address-row">
              <select required>
                <option value="">Tỉnh/Thành phố *</option>
                <option>Hà Nội</option>
              </select>
              <select required>
                <option value="">Cửa hàng *</option>
                <option>FPT Shop Cầu Giấy</option>
              </select>
            </div>

            <textarea placeholder="Ghi chú (ví dụ: giao giờ hành chính)"></textarea>

            <div className="voucher">
              <input type="text" placeholder="Mã giảm giá (Nếu có)" />
              <button type="button">Sử dụng</button>
            </div>

            <button type="submit" className="btn-confirm">
              XÁC NHẬN VÀ ĐẶT HÀNG
            </button>

            <p className="policy">
              Quý khách có thể lựa chọn hình thức thanh toán sau khi đặt hàng.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartPage;