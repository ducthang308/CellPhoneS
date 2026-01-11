package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.DTO.ChatSendResponse;
import com.example.MobileStorageManagement.DTO.MessageResponse;
import com.example.MobileStorageManagement.Service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ChatSendResponse send(@RequestBody Map<String, String> body) {
        return chatService.sendByUser(body.get("message"));
    }

    @PostMapping("/admin/reply")
    public ChatSendResponse adminReply(
            @RequestParam Long roomId,
            @RequestBody Map<String, String> body
    ) {
        return chatService.replyByAdmin(roomId, body.get("message"));
    }

    @GetMapping("/history")
    public List<MessageResponse> history(@RequestParam Long roomId) {
        return chatService.getHistory(roomId);
    }
}


