package com.example.MobileStorageManagement.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MobileStorageManagement.Entity.CartDetail;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {
    List<CartDetail> findByCartCartId(Integer cartId);
    void deleteByCartCartId(Integer cartId);
}
