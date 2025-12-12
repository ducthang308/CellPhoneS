import React from "react";
import "./ProductCard.css";
import type { IProduct } from "../../services/Interface";
import { useNavigate } from "react-router-dom";

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/product-detail/${product.ProductID}`); // ĐÃ SỬA ĐÚNG ID
  };

  const getProductImage = (): string => {
    if (product.productImages && product.productImages.length > 0) {
      return product.productImages[0].url || "/placeholder-image.jpg";
    }
    return "/placeholder-image.jpg";
  };

  const getStockQuantity = (): number => {
    return product.Stock_Quantity ?? product.stockQuantity ?? 0;
  };

  const getUpdatedDate = (): string => {
    const dateStr = product.Updated_At || product.updatedAt || new Date().toISOString();
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const formatPrice = (): string => {
    const price = product.price || 0;
    return price.toLocaleString("vi-VN");
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
            src={getProductImage()}
            alt={product.name || "Product Image"}
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
              Còn lại: <span>{getStockQuantity()}</span>
            </p>
            <p className="product-date">
              Ngày đăng: {getUpdatedDate()}
            </p>
          </div>

          <div className="product-price">
            {formatPrice()} ₫
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