package com.example.MobileStorageManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.MobileStorageManagement.Entity.Product;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // 🔍 Search product (lọc soft delete + fetch đầy đủ)
    @Query("""
        SELECT DISTINCT p
        FROM Product p
        LEFT JOIN FETCH p.productImages
        LEFT JOIN FETCH p.specification
        WHERE p.deletedAt IS NULL
          AND (:categoryId IS NULL OR :categoryId = 0 OR p.category.categoryId = :categoryId)
          AND (
                :keyword IS NULL 
                OR :keyword = '' 
                OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
          )
    """)
    List<Product> searchProduct(
            @Param("categoryId") Integer categoryId,
            @Param("keyword") String keyword
    );

    // 📦 Lấy sản phẩm còn hàng (chưa bị xóa)
    List<Product> findByStockQuantityGreaterThanAndDeletedAtIsNull(Integer stockQuantity);

    // 💸 3 sản phẩm rẻ nhất còn hàng (chưa bị xóa)
    List<Product> findTop3ByStockQuantityGreaterThanAndDeletedAtIsNullOrderByPriceAsc(
            Integer stockQuantity
    );

    // 🔎 Lấy theo id nhưng chưa bị xóa
    Optional<Product> findByProductIdAndDeletedAtIsNull(Integer id);

    // 📋 Lấy tất cả chưa bị xóa
    List<Product> findByDeletedAtIsNull();

    @Query("""
    SELECT 
        s.supplierId,
        s.supplierName,
        p.name,
        p.price,
        p.stockQuantity,
        (
            SELECT img.url
            FROM ProductImage img
            WHERE img.product = p
              AND img.img_index = 0
        )
    FROM Product p
    JOIN p.supplier s
    WHERE p.deletedAt IS NULL
""")
    List<Object[]> getProductStatisticBySupplier();

}
