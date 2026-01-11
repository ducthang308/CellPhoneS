package com.example.MobileStorageManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MobileStorageManagement.Entity.Cart;
import com.example.MobileStorageManagement.Entity.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    java.util.Optional<Cart> findByUser(User user);
}
