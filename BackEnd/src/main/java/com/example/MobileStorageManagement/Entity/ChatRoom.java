package com.example.MobileStorageManagement.Entity;

import com.example.MobileStorageManagement.Chat.ChatMode;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room")
@Data
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user gửi chat
    @Column(name = "UserID", nullable = false)
    private Integer userId;

    // admin nhận chat (User có role ADMIN)
    @Column(name = "AdminID")
    private Integer adminId;

    @Enumerated(EnumType.STRING)
    private ChatMode mode; // AI | ADMIN

    private Boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (mode == null) mode = ChatMode.AI;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

