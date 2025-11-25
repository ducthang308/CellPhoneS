import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import type { Product } from '../ProductCard/ProductCard';
import './ProductList.css';

// Mock data - bạn sẽ thay bằng API thật sau
const mockProducts: Product[] = [ 
  {
    productID: "1",
    name: "Tủ lạnh LG Inverter 519 lít GR-B209BL",
    price: 11900000,
    stock_quantity: "25",
    image_url: "https://via.placeholder.com/300x300/4CAF50/white?text=Tủ+Lạnh+LG",
    descripstion: "Công nghệ Inverter tiết kiệm điện, làm lạnh đa chiều",
    created_at: new Date(),
    updated_at: new Date("2025-11-10"),
  },
  {
    productID: "2",
    name: "Máy giặt Samsung 10kg WW10T634DLX/SV",
    price: 8990000,
    stock_quantity: "18",
    image_url: "https://via.placeholder.com/300x300/2196F3/white?text=Máy+Giặt",
    descripstion: "Công nghệ giặt bong bóng EcoBubble, tiết kiệm nước",
    created_at: new Date(),
    updated_at: new Date("2025-11-15"),
  },
  {
    productID: "3",
    name: "Tivi Samsung 55 inch 4K Crystal UHD",
    price: 12990000,
    stock_quantity: "32",
    image_url: "https://via.placeholder.com/300x300/F44336/white?text=TV+Samsung",
    descripstion: "Hình ảnh sắc nét 4K, kết nối thông minh",
    created_at: new Date(),
    updated_at: new Date("2025-11-12"),
  },
  {
    productID: "4",
    name: "Điều hòa Panasonic Inverter 12000 BTU",
    price: 10500000,
    stock_quantity: "8",
    image_url: "https://via.placeholder.com/300x300/9C27B0/white?text=Điều+Hòa",
    descripstion: "Làm lạnh nhanh, tiết kiệm điện, lọc không khí Nanoe",
    created_at: new Date(),
    updated_at: new Date("2025-11-08"),
  },
];

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập gọi API
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 800);

    // Thực tế bạn sẽ dùng:
    // axios.get('/api/products').then(res => setProducts(res.data))
  }, []);

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Tiêu đề trang */}
        <div className="page-header">
          <h1 className="page-title">Tất cả sản phẩm</h1>
          <p className="product-count">{products.length} sản phẩm</p>
        </div>

        {/* Bộ lọc nhanh (tùy chọn mở rộng sau) */}
        <div className="filter-bar">
          <select defaultValue="">
            <option value="" disabled>Sắp xếp theo</option>
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="bestseller">Bán chạy</option>
          </select>
        </div>

        {/* Danh sách sản phẩm */}
        {loading ? (
          <div className="loading">
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.productID} product={product} />
            ))}
          </div>
        )}

        {/* Nếu không có sản phẩm */}
        {products.length === 0 && !loading && (
          <div className="empty-state">
            <p>Không tìm thấy sản phẩm nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;