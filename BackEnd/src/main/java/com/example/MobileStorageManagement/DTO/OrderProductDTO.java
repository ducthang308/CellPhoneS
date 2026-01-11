package com.example.MobileStorageManagement.DTO;

import lombok.Data;

@Data
public class OrderProductDTO {
    private Integer productID;
    private String name;
    private Double price;
    private Integer quantity;
    private String imageUrl;
}

