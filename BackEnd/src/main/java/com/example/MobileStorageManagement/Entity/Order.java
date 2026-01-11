package com.example.MobileStorageManagement.Entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "`order`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Long orderID;

    @Column(name = "Order_Date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "Status", nullable = false)
    private String status;

    @Column(name = "PaymentStatus", nullable = false)
    private String paymentStatus;

    /* ================= DISCOUNT SNAPSHOT ================= */

    @Column(name = "DiscountCode")
    private String discountCode; // VD: NEWYEAR2026

    @Column(name = "DiscountType")
    private String discountType; // PERCENT | FIXED

    @Column(name = "DiscountValue")
    private Double discountValue; // 10 (%) hoặc 50000

    @Column(name = "DiscountAmount")
    private Double discountAmount; // số tiền giảm thực tế

    /* ================= PRICE ================= */

    @Column(name = "SubTotal", nullable = false)
    private Double subTotal;

    @Column(name = "TotalAmount", nullable = false)
    private Double totalAmount;

    /* ================= RELATION ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;
}