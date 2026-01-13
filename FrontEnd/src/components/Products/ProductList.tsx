import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "../ProductCard/ProductCard";
import productService from "../../services/ProductService";
import type { IProduct } from "../../services/Interface";
import "./ProductList.css";
import { useLocation } from "react-router-dom";


const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("");
  const [open, setOpen] = useState(false);

  const SORT_OPTIONS = [
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
  ];

  const location = useLocation();
  const sortedProducts = useMemo(() => {
    if (!sortBy) return products;

    const arr = [...products];

    if (sortBy === "price-asc") {
      arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }

    if (sortBy === "price-desc") {
      arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return arr;
  }, [products, sortBy]);

  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);

    return {
      keyword: params.get("keyword") || "",
      categoryId:
        params.get("categoryId") || params.get("category_id") || "",
    };
  }, [location.search]);


  const fetchProducts = async (keyword?: string, categoryId?: string) => {
    console.log("QUERY PARAM:", query);
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getAllProducts(keyword, categoryId);

      const safeProducts = data.filter(
        (p) => p && typeof p.productId === "number"
      );

      setProducts(safeProducts);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(query.keyword, query.categoryId);
  }, [query.keyword, query.categoryId]);

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
  if (error) return <div className="error">{error}</div>;
  return (
    <div className="product-list-page">
      <div className="product-container">
        <div className="page-header">
          <h1 className="page-title">Tất cả sản phẩm</h1>
          <span className="product-count">{products.length} sản phẩm</span>
        </div>

        <div className="filter-bar">
          <div
            className={`fake-select ${open ? "open" : ""}`}
            onClick={() => setOpen(v => !v)}
          >
            <span>
              {SORT_OPTIONS.find(o => o.value === sortBy)?.label || "Sắp xếp theo"}
            </span>
            <i className="arrow" />

            {open && (
              <div className="fake-options">
                {SORT_OPTIONS.map(o => (
                  <div
                    key={o.value}
                    className={`fake-option ${sortBy === o.value ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSortBy(o.value);
                      setOpen(false);
                    }}
                  >
                    {o.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="product-grid-inner">
          {sortedProducts.map((product) => (
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
