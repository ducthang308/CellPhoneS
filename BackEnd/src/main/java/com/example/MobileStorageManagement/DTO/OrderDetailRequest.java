package com.example.MobileStorageManagement.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class
OrderDetailRequest {
    private Long orderID;
    private Integer productID;
    private Integer quantity;
}
