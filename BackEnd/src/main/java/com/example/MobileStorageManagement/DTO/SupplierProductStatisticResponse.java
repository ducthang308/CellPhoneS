package com.example.MobileStorageManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupplierProductStatisticResponse {
    private SupplierDTO supplier;
    private ProductStatisticDTO product;
}
