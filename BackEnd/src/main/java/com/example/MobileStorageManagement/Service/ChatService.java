package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.Chat.ChatMode;
import com.example.MobileStorageManagement.Chat.SenderType;
import com.example.MobileStorageManagement.DTO.AdminReplyRequest;
import com.example.MobileStorageManagement.DTO.ChatSendResponse;
import com.example.MobileStorageManagement.DTO.MessageResponse;
import com.example.MobileStorageManagement.DTO.SendMessageRequest;
import com.example.MobileStorageManagement.Entity.ChatMessage;
import com.example.MobileStorageManagement.Entity.ChatRoom;
import com.example.MobileStorageManagement.Entity.User;
import com.example.MobileStorageManagement.Repository.ChatMessageRepository;
import com.example.MobileStorageManagement.Repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ChatService {

    private static final Integer AI_SENDER_ID = 0;

    private final ChatRoomRepository roomRepo;
    private final ChatMessageRepository msgRepo;
    private final CurrentUserService currentUserService;
    private final PhoneSearchService phoneSearchService;
    private final OpenAIService openAIService;

    public ChatSendResponse sendByUser(String rawMessage) {

        String message = rawMessage == null ? "" : rawMessage.trim();
        if (message.isEmpty()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        User user = currentUserService.getCurrentUser();
        if (!"USER".equalsIgnoreCase(user.getRole().getRoleName())) {
            throw new RuntimeException("Only USER can send");
        }

        ChatRoom room = roomRepo
                .findByUserIdAndActiveTrue(user.getUserId())
                .orElseGet(() -> {
                    ChatRoom r = new ChatRoom();
                    r.setUserId(user.getUserId());
                    r.setMode(ChatMode.AI);
                    r.setActive(true);
                    return roomRepo.save(r);
                });

        List<MessageResponse> responses = new ArrayList<>();

        // USER message
        ChatMessage userMsg = msgRepo.save(ChatMessage.builder()
                .roomId(room.getId())
                .senderId(user.getUserId())
                .senderType(SenderType.USER)
                .content(message)
                .build());

        responses.add(toResponse(userMsg));

        // AI MODE
        if (room.getMode() == ChatMode.AI) {
            var phones = phoneSearchService.search(message);
            String reply = openAIService.advise(message, phones);

            ChatMessage aiMsg = msgRepo.save(ChatMessage.builder()
                    .roomId(room.getId())
                    .senderId(AI_SENDER_ID)
                    .senderType(SenderType.AI)
                    .content(reply)
                    .build());

            responses.add(toResponse(aiMsg));

            return ChatSendResponse.builder()
                    .roomId(room.getId())
                    .mode(room.getMode())
                    .messages(responses)
                    .products(phones)
                    .build();
        }

        return ChatSendResponse.builder()
                .roomId(room.getId())
                .mode(room.getMode())
                .messages(responses)
                .products(List.of())
                .build();
    }

    public ChatSendResponse replyByAdmin(Long roomId, String rawMessage) {

        String message = rawMessage == null ? "" : rawMessage.trim();
        if (message.isEmpty()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        User admin = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin(admin)) {
            throw new RuntimeException("Only ADMIN can reply");
        }

        ChatRoom room = roomRepo.findById(roomId)
                .orElseThrow(() -> new NoSuchElementException("Room not found"));

        if (!room.getActive()) {
            throw new RuntimeException("Room is closed");
        }

        room.setAdminId(admin.getUserId());
        room.setMode(ChatMode.ADMIN);
        roomRepo.save(room);

        ChatMessage adminMsg = msgRepo.save(ChatMessage.builder()
                .roomId(roomId)
                .senderId(admin.getUserId())
                .senderType(SenderType.ADMIN)
                .content(message)
                .build());

        return ChatSendResponse.builder()
                .roomId(roomId)
                .mode(ChatMode.ADMIN)
                .messages(List.of(toResponse(adminMsg)))
                .products(List.of())
                .build();
    }

    public List<MessageResponse> getHistory(Long roomId) {
        return msgRepo.findByRoomIdOrderByCreatedAtAsc(roomId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private MessageResponse toResponse(ChatMessage m) {
        return MessageResponse.builder()
                .id(m.getId())
                .roomId(m.getRoomId())
                .senderId(m.getSenderId())
                .senderType(m.getSenderType())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .build();
    }
}