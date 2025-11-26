import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import type { IProduct } from '../../services/Interface';
import './ProductList.css';

const mockProducts: IProduct[] = [ 
  {
    productID: 1,
    name: "Tủ lạnh LG Inverter 519 lít GR-B209BL",
    price: 11900000,
    stock_quantity: 25,
    image_url: "https://via.placeholder.com/300x300/4CAF50/white?text=Tủ+Lạnh+LG",
    description: "Công nghệ Inverter tiết kiệm điện, làm lạnh đa chiều",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-10").toISOString(),
  },
  {
    productID: 2,
    name: "Máy giặt Samsung 10kg WW10T634DLX/SV",
    price: 8990000,
    stock_quantity: 18,
    image_url: "https://via.placeholder.com/300x300/2196F3/white?text=Máy+Giặt",
    description: "Công nghệ giặt bong bóng EcoBubble, tiết kiệm nước",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-15").toISOString(),
  },
  {
    productID: 3,
    name: "Tivi Samsung 55 inch 4K Crystal UHD",
    price: 12990000,
    stock_quantity: 32,
    image_url: "https://via.placeholder.com/300x300/F44336/white?text=TV+Samsung",
    description: "Hình ảnh sắc nét 4K, kết nối thông minh",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-12").toISOString(),
  },
  {
    productID: 4,
    name: "Điều hòa Panasonic Inverter 12000 BTU",
    price: 10500000,
    stock_quantity: 8,
    image_url: "https://via.placeholder.com/300x300/9C27B0/white?text=Điều+Hòa",
    description: "Làm lạnh nhanh, tiết kiệm điện, lọc không khí Nanoe",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-08").toISOString(),
  },
  {
    productID: 6,
    name: "Tủ lạnh LG Inverter 519 lít GR-B209BL",
    price: 11900000,
    stock_quantity: 25,
    image_url: "https://via.placeholder.com/300x300/4CAF50/white?text=Tủ+Lạnh+LG",
    description: "Công nghệ Inverter tiết kiệm điện, làm lạnh đa chiều",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-10").toISOString(),
  }
];

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="product-list-page">
        <div className="product-container">
          <div className="page-header">
            <h1 className="page-title">Tất cả sản phẩm</h1>
            <p className="product-count">{products.length} sản phẩm</p>
          </div>

          <div className="filter-bar">
            <select defaultValue="">
              <option value="" disabled>Sắp xếp theo</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="bestseller">Bán chạy</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">Đang tải sản phẩm...</div>
          ) : (

              <div className="product-grid-inner">
               {products.map((product) => (
              <ProductCard 
                key={product.productID} 
                product={product}
              />
            ))}
              </div>
          )}

          {products.length === 0 && !loading && (
            <div className="empty-state">Không tìm thấy sản phẩm nào.</div>
          )}
        </div>
      </div>
  );
};

export default ProductList;