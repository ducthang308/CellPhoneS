package com.example.MobileStorageManagement.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DiscountRequest {

    private String code;              // SALE10
    private String type;              // PERCENT | FIXED
    private Double value;             // 10 | 50000
    private Double maxDiscountAmount; // optional

    private LocalDateTime startAt;
    private LocalDateTime endAt;

    private Integer usageLimit;
    private Boolean active;
}