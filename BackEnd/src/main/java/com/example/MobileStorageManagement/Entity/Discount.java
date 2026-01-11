package com.example.MobileStorageManagement.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "discount")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // NEWYEAR2026

    @Column(nullable = false)
    private String type; // PERCENT | FIXED

    @Column(nullable = false)
    private Double value; // 10 (%) | 50000

    private Double maxDiscountAmount;

    private LocalDateTime startAt;
    private LocalDateTime endAt;

    private Integer usageLimit;
    private Integer usedCount;

    private Boolean active;
}