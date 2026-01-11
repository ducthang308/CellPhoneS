package com.example.MobileStorageManagement.DTO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class InventoryBatchDTO {
    private Long batchId;
    private LocalDate expiryDate;
}
