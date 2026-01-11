package com.example.MobileStorageManagement.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "stockout")

public class StockOut {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "stockOutID")
        private Long stockOutID;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "BatchID", nullable = false)
        private Batch batch;

        @Column(name = "quantity", nullable = false)
        private Integer quantity;

        @Column(name = "note")
        private String note;

        @Column(name = "date", nullable = false)
        private LocalDateTime date;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "UserID", nullable = false)
        private User user;

        public Long getStockOutID() {
                return stockOutID;
        }

        public void setStockOutID(Long stockOutID) {
                this.stockOutID = stockOutID;
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

        public LocalDateTime getDate() {
                return date;
        }

        public void setDate(LocalDateTime date) {
                this.date = date;
        }

        public User getUser() {
                return user;
        }

        public void setUser(User user) {
                this.user = user;
        }
}
