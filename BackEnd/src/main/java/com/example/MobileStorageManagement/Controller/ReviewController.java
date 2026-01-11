package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.DTO.ReviewRequest;
import com.example.MobileStorageManagement.DTO.ReviewResponse;
import com.example.MobileStorageManagement.Entity.Review;
import com.example.MobileStorageManagement.Entity.User;
import com.example.MobileStorageManagement.Service.ReviewService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ReviewResponse> createReview(
            @RequestParam Integer productID,
            @RequestParam Integer rating,
            @RequestParam(required = false) Long orderID,
            @RequestParam(required = false) String comment,
            @RequestPart(required = false) MultipartFile photo,
            @RequestPart(required = false) MultipartFile video,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        ReviewRequest req = ReviewRequest.builder()
                .productID(productID)
                .orderID(orderID)
                .rating(rating)
                .comment(comment)
                .photo(photo)
                .video(video)
                .build();

        Review review = reviewService.createReview(req, user);

        return ResponseEntity.ok(reviewService.toResponse(review));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getByProduct(@PathVariable Long productId) {

        return ResponseEntity.ok(
                reviewService.getByProduct(productId)
                        .stream()
                        .map(reviewService::toResponse)
                        .toList()
        );
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @RequestParam(required = false) String comment,
            @RequestPart(required = false) MultipartFile photo,
            @RequestPart(required = false) MultipartFile video
    ) {

        ReviewRequest req = ReviewRequest.builder()
                .comment(comment)
                .photo(photo)
                .video(video)
                .build();

        Review updated = reviewService.updateReview(id, req);

        return ResponseEntity.ok(reviewService.toResponse(updated));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReview(@PathVariable Long id) {
        return reviewService.findById(id)
                .map(reviewService::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<ReviewResponse>> getByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(
                reviewService.findByOrderId(orderId)
                        .stream()
                        .map(reviewService::toResponse)
                        .toList()
        );
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAll() {
        return ResponseEntity.ok(
                reviewService.findAll()
                        .stream()
                        .map(reviewService::toResponse)
                        .toList()
        );
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Review deleted");
    }
}
