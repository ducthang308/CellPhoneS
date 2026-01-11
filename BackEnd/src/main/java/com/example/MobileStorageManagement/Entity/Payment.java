package com.example.MobileStorageManagement.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Long orderId;
    private String paypalOrderId;
    private String paypalCaptureId;
    private String status;
    private Double amount;
    private String currency;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
