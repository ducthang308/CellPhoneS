package com.example.MobileStorageManagement.Repository;

import com.example.MobileStorageManagement.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    Payment findByPaypalOrderId(String paypalOrderId);
    Payment findByOrderId(Long OrderId);
}
