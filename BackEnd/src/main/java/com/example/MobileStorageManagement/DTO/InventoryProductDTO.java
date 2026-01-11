package com.example.MobileStorageManagement.DTO;

import lombok.Data;

@Data
public class InventoryProductDTO {
    private Integer productId;
    private String productName;
    private String imageUrl;
    private Integer quantity;
}
