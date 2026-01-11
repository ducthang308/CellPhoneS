package com.example.MobileStorageManagement.DTO;

import lombok.Data;

@Data
public class UpdateUserDTO {
    private String sdt;
    private String fullName;
    private String email;
    private String address;
    private String avatar;
    private String googleId;
    private String newPassword;
}

