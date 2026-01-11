package com.example.MobileStorageManagement.DTO;


import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class SendMessageRequest {
    private Long userId;     // tạm: lấy từ FE; chuẩn thì lấy từ JWT
    private Long roomId;     // optional (null thì auto find/create)
    private String message;
}
