package com.example.MobileStorageManagement.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "receivenotification")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ReceiveNotifications {

    @EmbeddedId
    private ReceiveNotificationsId id;

    @MapsId("notificationId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "NotificationID", nullable = false)
    private Notification notification;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Column(name = "isRead", nullable = false)
    private Boolean isRead = false; // mặc định false

    // Getters, Setters, Constructors
    public ReceiveNotifications() {}

    public ReceiveNotificationsId getId() {
        return id;
    }

    public void setId(ReceiveNotificationsId id) {
        this.id = id;
    }

    public Boolean getRead() {
        return isRead;
    }

    public void setRead(Boolean read) {
        isRead = read;
    }

    public Notification getNotification() { return notification; }
    public void setNotification(Notification notification) { this.notification = notification; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
}
