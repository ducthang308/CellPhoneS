package com.example.MobileStorageManagement.DTO;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {

    private Integer productID;
    private Long orderID;
    private Integer rating;
    private String comment;
    private MultipartFile photo;
    private MultipartFile video;
}