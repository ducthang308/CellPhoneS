package com.example.MobileStorageManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupplierStatisticResponse {

    private SupplierDTO nhaCungCap;
    private ProductStatisticDTO sanPhams;
}
