package com.example.MobileStorageManagement.DTO;


import com.example.MobileStorageManagement.Entity.Cart;
import com.example.MobileStorageManagement.Entity.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Integer userId;
    private String sdt;
    private String fullName;
    private String email;
    private String address;
    private String avatar;
    private Integer role;
    private Integer cartId;
    private String token;
}
