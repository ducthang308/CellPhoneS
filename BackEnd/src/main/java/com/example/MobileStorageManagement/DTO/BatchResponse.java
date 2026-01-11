package com.example.MobileStorageManagement.DTO;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchResponse {

    private Long batchID;
    private ProductDTO product;
    private LocalDate productionDate;
    private Integer quantity;
    private Double priceIn;
    private LocalDate expiry;
}
