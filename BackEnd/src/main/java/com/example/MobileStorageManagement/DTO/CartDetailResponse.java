package com.example.MobileStorageManagement.DTO;

import com.example.MobileStorageManagement.Entity.Cart;
import com.example.MobileStorageManagement.Entity.Product;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartDetailResponse {
    private Integer cartDetailsId;
    private Integer cartId;
    private ProductDTO product;
}
