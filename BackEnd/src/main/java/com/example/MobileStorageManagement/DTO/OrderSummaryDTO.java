package com.example.MobileStorageManagement.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderSummaryDTO {

    private Long orderId;
    private LocalDateTime orderDate;
    private String status;
    private String paymentStatus;
    private Double totalAmount;

    private OrderUserDTO user;
}
