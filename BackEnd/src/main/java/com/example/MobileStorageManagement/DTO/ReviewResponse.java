package com.example.MobileStorageManagement.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long reviewID;
    private Integer productID;
    private Long orderID;
    private String userName;
    private Integer rating;
    private String comment;
    private String photoUrl;
    private String videoUrl;
}
