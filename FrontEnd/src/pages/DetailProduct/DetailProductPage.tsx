import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../DetailProduct/DetailProductPage.css";
import productService from "../../services/ProductService";
import type { IProduct, ProductImage } from "../../services/Interface";
import IP from "../../assets/img/ip.png";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string>("1TB");
  const [selectedColor, setSelectedColor] = useState<string>("Titan Sa Mạc");

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(Number(id));
        setProduct(data);

        if (data.productImages && data.productImages.length > 0) {
          const firstImg = [...data.productImages]
            .sort((a, b) => a.img_index - b.img_index)[0]?.url;
          setSelectedImage(firstImg || null);
        } else {
          setSelectedImage(data.Image_URL || null);
        }
      } catch (error) {
        console.error("Không tải được chi tiết sản phẩm", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const images: ProductImage[] = useMemo(() => {
    return [...(product?.productImages || [])].sort(
      (a, b) => a.img_index - b.img_index
    );
  }, [product?.productImages]);

  if (loading) {
    return <div className="loading">Đang tải sản phẩm...</div>;
  }

  if (!product) {
    return <div className="error-state">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="product-container">
      <h1 className="product-title">{product.name}</h1>

      <div className="rating-row">
        <span className="star">★</span>
        <span className="rating">4.9</span>
        <span className="rating-count">(15 đánh giá)</span>
      </div>

      <div className="product-grid">
        <div className="image-box">
          <img
            src={selectedImage || IP}
            className="main-img"
            alt={product.name || "product"}
          />

          {images.length > 0 && (
            <div className="thumb-list">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.url || IP}
                  className={`thumb ${selectedImage === img.url ? "active" : ""
                    }`}
                  onClick={() => setSelectedImage(img.url)}
                  alt="thumb"
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-box">
          <div className="price-block">
            <div className="price-main">
              {product.price.toLocaleString("vi-VN")}đ
            </div>
            <div className="price-old">
              {(product.price * 1.1).toLocaleString("vi-VN")}đ
            </div>
          </div>

          <h3 className="section-title">Phiên bản</h3>
          <div className="options-row">
            {["1TB", "512GB", "256GB"].map((opt) => (
              <button
                key={opt}
                className={`option-btn ${selectedStorage === opt ? "active" : ""
                  }`}
                onClick={() => setSelectedStorage(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <h3 className="section-title">Màu sắc</h3>
          <div className="color-grid">
            {[
              "Titan Sa Mạc",
              "Titan Đen",
              "Titan Trắng",
              "Titan Tự Nhiên",
            ].map((color) => (
              <button
                key={color}
                className={`color-btn ${selectedColor === color ? "active" : ""
                  }`}
                onClick={() => setSelectedColor(color)}
              >
                <img
                  src={selectedImage || IP}
                  className="color-img"
                  alt={color}
                />
                <div className="color-info">
                  <p className="color-name">{color}</p>
                  <p className="color-price">
                    {product.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="action-row">
            <button className="btn blue">Trả góp 0%</button>
            <button
              className="btn red"
              onClick={() => navigate("/cartShop")}
            >
              Mua ngay
            </button>
          </div>

          <button className="btn-outline">Liên hệ</button>
        </div>
      </div>

      <div className="feature-box">
        <h2 className="feature-title">TÍNH NĂNG NỔI BẬT</h2>
        <ul className="feature-list">
          <li>{product.description || "Màn hình Super Retina XDR"}</li>
          <li>Chip xử lý mạnh mẽ</li>
          <li>Camera cải tiến</li>
          <li>Pin dung lượng lớn</li>
        </ul>
      </div>
    </div>
  );
}
