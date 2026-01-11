package com.example.MobileStorageManagement.DTO;

import com.example.MobileStorageManagement.Chat.SenderType;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MessageResponse {
    private Long id;
    private Long roomId;
    private Integer senderId;
    private SenderType senderType;
    private String content;
    private LocalDateTime createdAt;
}

