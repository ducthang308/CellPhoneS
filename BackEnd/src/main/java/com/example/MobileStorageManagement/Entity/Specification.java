package com.example.MobileStorageManagement.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Specification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Specification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer specId;

    private String screen;

    private String cpu;

    private String ram;

    private String storage;

    private String camera;

    private String battery;

    private String os;

    @OneToOne(mappedBy = "specification")
    private Product product;
}
