package com.example.MobileStorageManagement.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.MobileStorageManagement.Entity.Batch;

import java.time.LocalDateTime;

@Entity
@Table(name = "stockin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stockInID")
    private Long stockInID;

    @ManyToOne
    @JoinColumn(name = "BatchId", referencedColumnName = "BatchID")
    private Batch batch;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 255)
    private String note;

    @ManyToOne
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    public Long getStockInID() {
        return stockInID;
    }

    public void setStockInID(Long stockInID) {
        this.stockInID = stockInID;
    }

    public Batch getBatch() {
        return batch;
    }

    public void setBatch(Batch batch) {
        this.batch = batch;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
