import React, { useState } from "react";
import "./ProductCard.css";
import type { IProduct } from "../../services/Interface";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMG = "/placeholder-image.jpg";

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState<number>(1);

  const handleViewDetail = () => {
    if (!product.productId) return;
    navigate(`/product-detail/${product.productId}`);
  };

  const increaseQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) =>
      Math.min(prev + 1, getStockQuantity())
    );
  };

  const decreaseQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const getProductImage = (): string => {
    if (product.productImages && product.productImages.length > 0) {
      const sortedImages = [...product.productImages].sort(
        (a, b) => a.img_index - b.img_index
      );
      return sortedImages[0].url || PLACEHOLDER_IMG;
    }
    return product.Image_URL || PLACEHOLDER_IMG;
  };

  const getStockQuantity = (): number => {
    return product.Stock_Quantity ?? product.stockQuantity ?? 5;
  };

  const getUpdatedDate = (): string => {
    const dateStr =
      product.Updated_At ||
      product.updatedAt ||
      product.Created_At ||
      product.createdAt;

    return dateStr
      ? new Date(dateStr).toLocaleDateString("vi-VN")
      : "";
  };

  const formatPrice = (): string => {
    return product.price.toLocaleString("vi-VN");
  };

  const isOutOfStock = getStockQuantity() <= 0;

  return (
    <div
      className={`product-card-wrapper ${isOutOfStock ? "out-of-stock" : ""}`}
      data-installment="Trả góp 0%"
      onClick={handleViewDetail}
      role="button"
      tabIndex={0}
      aria-disabled={isOutOfStock}
    >
      <div className="product-card">
        <div className="product-thumb">
          <img
            src={getProductImage()}
            alt={product.name || "Product Image"}
            className="product-img"
            loading="lazy"
          />

          {isOutOfStock && (
            <span className="sold-out-badge">Hết hàng</span>
          )}
        </div>

        <div className="product-body">
          <div className="product-name" title={product.name || ""}>
            {product.name}
          </div>

          {product.description && (
            <p className="product-desc">{product.description}</p>
          )}

          <div className="product-info">
            <p className="product-stock">
              Còn lại: <span>{getStockQuantity()}</span>
            </p>
            {getUpdatedDate() && (
              <p className="product-date">
                Ngày đăng: {getUpdatedDate()}
              </p>
            )}
          </div>

          <div className="product-price">
            {formatPrice()} ₫
          </div>

          {!isOutOfStock && (
            <div className="quantity-box">
              <button onClick={decreaseQty}>−</button>
              <span>{quantity}</span>
              <button onClick={increaseQty}>+</button>
            </div>
          )}

          <div className="product-actions">
            <button
              className="btn-buy"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                alert(`Đã thêm ${quantity} sản phẩm vào giỏ (tạm)`);
              }}
            >
              Mua ngay
            </button>

            <button
              className="btn-detail"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetail();
              }}
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
