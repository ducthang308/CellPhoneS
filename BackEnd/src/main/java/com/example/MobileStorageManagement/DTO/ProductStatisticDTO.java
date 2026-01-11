package com.example.MobileStorageManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductStatisticDTO {
    private String productName;
    private String imageUrl;
    private Double unitPrice;
    private Integer quantity;
}
