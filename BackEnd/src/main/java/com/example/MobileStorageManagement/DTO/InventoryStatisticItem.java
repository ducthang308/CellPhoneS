package com.example.MobileStorageManagement.DTO;

import lombok.Data;

@Data
public class InventoryStatisticItem {
    private InventoryProductDTO product;
    private InventorySupplierDTO supplier;
    private InventoryBatchDTO batch;
}
