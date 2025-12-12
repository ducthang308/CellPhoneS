import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import productService from "../../services/ProductService";
import type { IProduct } from "../../services/Interface";
import "./ProductList.css";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getAllProducts();

      if (!Array.isArray(data)) {
        console.warn("API trả về không phải array");
        setProducts([]);
        return;
      }

      // Defensive filter – loại product bẩn
      const safeProducts = data.filter(
        (p) => p && typeof p.productId === "number"
      );

      setProducts(safeProducts);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sản phẩm");
      setProducts([]); // FE không chết
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);

    const sorted = [...products];

    switch (value) {
      case "price-asc":
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      default:
        break;
    }

    setProducts(sorted);
  };

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;

  if (error)
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={fetchProducts}>Thử lại</button>
      </div>
    );

  return (
    <div className="product-list-page">
      <div className="product-container">
        <div className="page-header">
          <h1>Tất cả sản phẩm</h1>
          <span>{products.length} sản phẩm</span>
        </div>

        <div className="filter-bar">
          <select value={sortBy} onChange={handleSortChange}>
            <option value="" disabled>
              Sắp xếp theo
            </option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>

        <div className="product-grid-inner">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="empty-state">Không có sản phẩm</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
