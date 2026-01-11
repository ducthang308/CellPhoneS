package com.example.MobileStorageManagement.DTO;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Integer productId;
    private String name;
    private Double price;
    private Integer stockQuantity;
    private String description;
    private Integer brandId;
    private Integer categoryId;
    private Integer supplierId;
    private SpecificationDTO specification;
    private List<ProductImageDTO> productImages;
}
