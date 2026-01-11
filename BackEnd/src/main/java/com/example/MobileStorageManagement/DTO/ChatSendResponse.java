package com.example.MobileStorageManagement.DTO;

import com.example.MobileStorageManagement.Chat.ChatMode;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ChatSendResponse {
    private Long roomId;
    private ChatMode mode;

    // danh sách message mới nhất trong response (để FE render)
    private List<MessageResponse> messages;

    // nếu mode AI và bạn muốn trả thêm products giống cái chat AI hiện tại
    private List<Map<String, Object>> products;
}

