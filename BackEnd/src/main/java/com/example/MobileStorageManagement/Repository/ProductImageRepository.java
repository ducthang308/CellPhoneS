package com.example.MobileStorageManagement.Repository;

import com.example.MobileStorageManagement.Entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    long countByProduct_ProductId(Integer productId);
}
