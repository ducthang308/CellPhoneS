import React from "react";
import "./ProductCard.css";
import type { IProduct } from "../../services/Interface";
import { useNavigate } from "react-router-dom";

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/product-detail/${product.productID}`); // ĐÃ SỬA ĐÚNG ID
  };

  return (
    <div
      className="product-card-wrapper"
      data-installment="Trả góp 0%"
      onClick={handleViewDetail}
    >
      <div className="product-card">
        {/* Hình ảnh */}
        <div className="product-thumb">
          <img
            src={product.image_url || "/placeholder-image.jpg"}
            alt={product.name}
            className="product-img"
            loading="lazy"
          />
        </div>

        {/* Nội dung */}
        <div className="product-body">
          <div className="product-name">{product.name}</div>
          <p className="product-desc">{product.description}</p>

          <div className="product-info">
            <p className="product-stock">
              Còn lại: <span>{product.stock_quantity}</span>
            </p>
            <p className="product-date">
              Ngày đăng: {new Date(product.updated_at || Date.now()).toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="product-price">
            {product.price.toLocaleString("vi-VN")} ₫
          </div>

          <div className="product-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Có thể thêm vào giỏ ở đây sau
                alert("Đã thêm vào giỏ hàng!");
              }}
              className="btn-buy"
            >
              Mua ngay
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetail();
              }}
              className="btn-detail"
            >
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;