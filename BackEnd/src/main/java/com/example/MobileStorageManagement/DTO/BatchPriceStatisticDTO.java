package com.example.MobileStorageManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class BatchPriceStatisticDTO {
    private LocalDate ngaySanXuat;
    private Double gia;
}
