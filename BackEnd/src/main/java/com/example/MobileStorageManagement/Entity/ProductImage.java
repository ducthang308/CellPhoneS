package com.example.MobileStorageManagement.Entity;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "ProductImage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String url;

    private long img_index;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore // bỏ qua trường này khi gọi để tránh lặp vô hạn
    private Product product;
}
