package com.example.MobileStorageManagement.DTO;

import java.time.LocalDateTime;

public class StockOutRequest {
    private Long batchID;
    private Integer quantity;
    private String note;
    private LocalDateTime date;
    private Long userID;

    public StockOutRequest(Long batchID, Integer quantity, String note, LocalDateTime date, Long userID) {
        this.batchID = batchID;
        this.quantity = quantity;
        this.note = note;
        this.date = date;
        this.userID = userID;
    }

    public Long getBatchID() {
        return batchID;
    }

    public void setBatchID(Long batchID) {
        this.batchID = batchID;
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

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }
}
