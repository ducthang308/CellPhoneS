import React from 'react';
import { Link } from 'react-router-dom'; // Nếu dùng react-router-dom
import './OrderPage.css';

const OrderPage: React.FC = () => {
  // Fake data
  const orderData = {
    product: {
      imageUrl: "https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/300x300/9df78eab33525d08d6e5fb8d27136e95/c/a/cap-type-c-to-type-c-baseus-dynamic-series-fast-charging-data-cable-type-c-to-type-c-100w-1m-xanh-duong_3.jpg",
      name: "Cáp Type-C to Type-C Baseus Dynamic 1M 100W siêu nhanh - Xanh dương",
      originalPrice: 229000,
      discountedPrice: 120000,
      quantity: 2,
    },
    customer: {
      fullName: "Tân Quang Huy",
      membershipBadge: "S-NULL",
      phone: "0896444505",
      email: "tanquanghuy.2302@gmail.com",
      subscribeNewsletter: false,
    },
    summary: {
      quantity: 2,
      subtotal: 458000,
      shippingFee: 0,
      directDiscount: 218000,
      total: 240000,
    },
  };

  const { product, customer, summary } = orderData;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="order-page">
      {/* Phần sản phẩm */}
      <div className="product-section">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Image';
          }}
        />
        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <div className="product-price">
            <span className="discounted-price">{formatPrice(product.discountedPrice)}</span>
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          </div>
          <div className="quantity">Số lượng: {product.quantity}</div>
        </div>
      </div>

      {/* Phần thông tin khách hàng */}
      <div className="customer-section">
        <h2 className="section-title">THÔNG TIN KHÁCH HÀNG</h2>
        <div className="customer-info">
          <div className="customer-name-row">
            <span className="customer-name">{customer.fullName}</span>
            {customer.membershipBadge && (
              <span className="snull-badge">{customer.membershipBadge}</span>
            )}
            <span className="phone">{customer.phone}</span>
          </div>
          <div className="email-label">EMAIL</div>
          <div className="email">{customer.email}</div>
          <div className="note">
            (*) Hóa đơn VAT sẽ được gửi qua email này
          </div>
          <div className="newsletter">
            <input
              type="checkbox"
              id="newsletter"
              checked={customer.subscribeNewsletter}
              readOnly
            />
            <label htmlFor="newsletter">
              Nhận email thông báo và ưu đãi từ CellphoneS
            </label>
          </div>
        </div>
      </div>

      {/* Phần tóm tắt giá + Tổng tiền tạm tính + Nút Tiếp tục (gộp chung) */}
      <div className="price-summary-full">
        <div className="summary-rows">
          <div className="summary-row">
            <span>Số lượng sản phẩm</span>
            <span>{summary.quantity}</span>
          </div>
          <div className="summary-row">
            <span>Tổng tiền hàng</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <span className="free-shipping">Miễn phí</span>
          </div>
          <div className="summary-row discount">
            <span>Giảm giá trực tiếp</span>
            <span>-{formatPrice(summary.directDiscount)}</span>
          </div>
          <div className="total-row">
            <span>Tổng tiền</span>
            <span className="total-amount">{formatPrice(summary.total)}</span>
          </div>
          <div className="vat-note">
            Đã gồm VAT nếu được làm tròn
          </div>
        </div>

        {/* Tổng tiền tạm tính + Nút Tiếp tục */}
        <div className="final-action">
          <div className="final-total">
            <span>Tổng tiền tạm tính:</span>
            <span className="final-amount">{formatPrice(summary.total)}</span>
          </div>
          <Link to="/payment" className="continue-button">
            Thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;