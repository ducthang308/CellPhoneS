import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import productService from '../../services/ProductService';
import type { IProduct } from '../../services/Interface';
import './ProductList.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy , setSortBy] = useState<string>('');  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);

    let sortedProducts = [...products];
    
    switch (value) {
      case 'newest':
        sortedProducts.sort((a, b) => {
          const dateA = new Date(a.Updated_At || a.updatedAt || 0).getTime();
          const dateB = new Date(b.Updated_At || b.updatedAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'price-asc':
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'bestseller':
        // Giả sử có trường salesCount để sắp xếp
        break;
      default:
        break;
    }
    
    setProducts(sortedProducts);
  };

  return (
    <div className="product-list-page">
        <div className="product-container">
          <div className="page-header">
            <h1 className="page-title">Tất cả sản phẩm</h1>
            <p className="product-count">{products.length} sản phẩm</p>
          </div>

          <div className="filter-bar">
            <select value={sortBy} onChange={handleSortChange} >
              <option value="" disabled>Sắp xếp theo</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="bestseller">Bán chạy</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">Đang tải sản phẩm...</div>
          ) : error ? (
              <div className="error-state"> 
                <p>{error}</p>
                <button onClick={fetchProducts}>Thử lại</button>
              </div>
            ) : (
              <div className="product-grid-inner">
               {products.map((product) => (
                <ProductCard 
                  key={product.ProductID} 
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