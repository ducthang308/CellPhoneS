package com.example.MobileStorageManagement.Repository;

import com.example.MobileStorageManagement.Entity.StockOut;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockOutRepository extends JpaRepository<StockOut,Long> {
}
