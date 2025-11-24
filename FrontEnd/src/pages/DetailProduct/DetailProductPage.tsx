import React, { useState } from "react";
import "../DetailProduct/DetailProductPage.css";
import IP from "../../assets/img/ip.png"

export default function ProductDetail() {
  const [selectedStorage, setSelectedStorage] = useState("1TB");
  const [selectedColor, setSelectedColor] = useState("Titan Sa Mạc");

  return (
    <div className="product-container">
      <h1 className="product-title">iPhone 16 Pro Max 1TB | Chính hãng VN/A</h1>

      <div className="rating-row">
        <span className="star">★</span>
        <span className="rating">4.9</span>
        <span className="rating-count">(15 đánh giá)</span>
      </div>

      <div className="product-grid">

        <div className="image-box">
          <img src={IP} className="main-img" alt="IP" />

          <div className="thumb-list">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <img key={i} src={`/thumb-${i}.png`} className="thumb" />
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="detail-box">

          <div className="price-block">
            <div className="price-main">42.990.000đ</div>
            <div className="price-old">46.990.000đ</div>
          </div>

          {/* Storage options */}
          <h3 className="section-title">Phiên bản</h3>
          <div className="options-row">
            {["1TB", "512GB", "256GB"].map(opt => (
              <button
                key={opt}
                className={
                  selectedStorage === opt
                    ? "option-btn active"
                    : "option-btn"
                }
                onClick={() => setSelectedStorage(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Color options */}
          <h3 className="section-title">Màu sắc</h3>
          <div className="color-grid">
            {["Titan Sa Mạc", "Titan Đen", "Titan Trắng", "Titan Tự Nhiên"].map(
              color => (
                <button
                  key={color}
                  className={
                    selectedColor === color
                      ? "color-btn active"
                      : "color-btn"
                  }
                  onClick={() => setSelectedColor(color)}
                >
                  <img src="/iphone-main.png" className="color-img" />
                  <div className="color-info">
                    <p className="color-name">{color}</p>
                    <p className="color-price">42.990.000đ</p>
                  </div>
                </button>
              )
            )}
          </div>

          <div className="action-row">
            <button className="btn blue">Trả góp 0%</button>
            <button className="btn red">Mua Ngay</button>
          </div>

          <button className="btn-outline">Liên hệ</button>

        </div>
      </div>

      {/* Feature Box */}
      <div className="feature-box">
        <h2 className="feature-title">TÍNH NĂNG NỔI BẬT</h2>
        <ul className="feature-list">
          <li>Màn hình Super Retina XDR 6.9 inch sắc nét</li>
          <li>Chip A18 Pro cực mạnh</li>
          <li>Camera chụp đêm đẹp hơn</li>
          <li>Pin lớn sử dụng đến 30 giờ</li>
        </ul>
      </div>
    </div>
  );
}
