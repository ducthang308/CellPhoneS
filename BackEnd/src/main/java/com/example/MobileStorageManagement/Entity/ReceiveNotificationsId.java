package com.example.MobileStorageManagement.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.util.Objects;

@Embeddable
public class ReceiveNotificationsId {

    @Column(name = "NotificationID")
    private Integer notificationId; // IDThongBao
    @Column(name = "UserID")
    private Integer userId; // userId

    public ReceiveNotificationsId() {
    }

    public ReceiveNotificationsId(Integer notificationId, Integer userId) {
        this.notificationId = notificationId;
        this.userId = userId;
    }

    public Integer getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Integer notificationId) {
        this.notificationId = notificationId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ReceiveNotificationsId that = (ReceiveNotificationsId) o;
        return Objects.equals(notificationId, that.notificationId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(notificationId, userId);
    }
}
