package com.example.MobileStorageManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueStatisticDTO {
    private Integer year;
    private Integer month;
    private Integer day;
    private Long totalOrders;
    private Double revenue;
}

