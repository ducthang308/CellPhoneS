package com.example.MobileStorageManagement.DTO;

import lombok.Data;

@Data
public class OrderResponse {
    private Long orderID;
    private String status;
    private String paymentStatus;
    private Integer userID;
}
