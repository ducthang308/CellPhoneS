package com.example.MobileStorageManagement.DTO;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class AdminReplyRequest {
    private Long adminId; // tạm: lấy từ FE; chuẩn thì JWT
    private Long roomId;
    private String message;
}