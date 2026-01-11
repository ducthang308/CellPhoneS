package com.example.MobileStorageManagement.DTO;

import java.util.List;

import lombok.Data;

@Data
public class CartDTO {
    private Integer cartId;
    private Integer userId;
    private String status;
    private List<CartDetailRequestDTO> cartItems;
    private List<Integer> productIds;
}
