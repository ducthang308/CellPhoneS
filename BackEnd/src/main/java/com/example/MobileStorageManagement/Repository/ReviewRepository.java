package com.example.MobileStorageManagement.Repository;

import com.example.MobileStorageManagement.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByOrder_OrderID(Long orderID);
    List<Review> findByProduct_ProductId(Long productId);
}
