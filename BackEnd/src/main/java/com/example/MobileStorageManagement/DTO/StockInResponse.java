package com.example.MobileStorageManagement.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StockInResponse {

    private Long stockInID;
    private BatchResponse batch;
    private Integer quantity;
    private String note;
    private UserResponse user;
    private LocalDateTime date;

}
