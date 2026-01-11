package com.example.MobileStorageManagement.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductID")
    private Integer productId;

    private String name;

    private Double price;

    @Column(name = "Stock_Quantity")
    private Integer stockQuantity;

    private String description;

    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL,
            fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ProductImage> productImages = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "BrandID")
    @JsonIgnore
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "CategoryID")
    @JsonIgnore
    private Category category;

    @ManyToOne
    @JoinColumn(name = "SupplierID")
    @JsonIgnore
    private Supplier supplier;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "SpecID")
    private Specification specification;

    @Column(name = "Created_At")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+7")
    private LocalDateTime createdAt;

    @Column(name = "Updated_At")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+7")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Column(name = "Deleted_At")
    @JsonIgnore
    private LocalDateTime deletedAt;

    public boolean isDeleted() {
        return deletedAt != null;
    }

}