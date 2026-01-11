package com.example.MobileStorageManagement.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StockOutResponse {
    private Long stockOutId;
    private BatchResponse batch;
    private Integer quantity;
    private String note;
    private LocalDateTime date;
    private UserResponse user;
}