import React from "react";
import "./ProductCard.css";

export interface Product {
  productID: string;
  name: string;
  price: number;
  stock_quantity: string;
  image_url: string;
  descripstion: string;
  created_at: Date;
  updated_at: Date;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-thumb">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-img"
        />
      </div>

      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.descripstion}</p>

        <div className="product-info">
          <p className="product-stock">
            Còn lại: <span>{product.stock_quantity}</span>
          </p>
          <p className="product-date">
            Ngày đăng:{" "}
            {new Date(product.updated_at).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="product-price">
          <span>{product.price.toLocaleString("vi-VN")} ₫</span>
        </div>

        <div className="product-actions">
          <button className="btn-buy">Mua ngay</button>
          <button className="btn-detail">Chi tiết</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
