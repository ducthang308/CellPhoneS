package com.example.MobileStorageManagement.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserResponse {
    private Integer userId;
    private String sdt;
    private String fullName;
    private String email;
    private String address;
    private String avatar;
}
