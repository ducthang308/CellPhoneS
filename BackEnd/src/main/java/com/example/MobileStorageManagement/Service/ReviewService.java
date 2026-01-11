package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.Adapter.CloudinaryAdapter;
import com.example.MobileStorageManagement.DTO.ReviewRequest;
import com.example.MobileStorageManagement.DTO.ReviewResponse;
import com.example.MobileStorageManagement.Entity.Order;
import com.example.MobileStorageManagement.Entity.Product;
import com.example.MobileStorageManagement.Entity.Review;
import com.example.MobileStorageManagement.Entity.User;
import com.example.MobileStorageManagement.Repository.OrderRepository;
import com.example.MobileStorageManagement.Repository.ProductRepository;
import com.example.MobileStorageManagement.Repository.ReviewRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CloudinaryAdapter cloudinaryAdapter;


    // ===================== CREATE ===================== //
    public Review createReview(ReviewRequest req, User user) {

        Product product = productRepository.findById(req.getProductID())
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));

        Order order = null;
        if (req.getOrderID() != null) {
            order = orderRepository.findById(req.getOrderID())
                    .orElseThrow(() -> new RuntimeException("Order không tồn tại"));
        }

        String photoUrl = null;
        String videoUrl = null;

        if (req.getPhoto() != null && !req.getPhoto().isEmpty()) {
            photoUrl = cloudinaryAdapter.uploadImage(req.getPhoto(), "reviews/photos");
        }

        if (req.getVideo() != null && !req.getVideo().isEmpty()) {
            videoUrl = cloudinaryAdapter.uploadVideo(req.getVideo(), "reviews/videos");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .order(order)
                .rating(req.getRating())
                .comment(req.getComment())
                .photoUrl(photoUrl)
                .videoUrl(videoUrl)
                .createdAt(LocalDateTime.now())
                .build();

        return reviewRepository.save(review);
    }

    public List<Review> getByProduct(Long productId) {
        return reviewRepository.findByProduct_ProductId(productId);
    }


    // ===================== GET ===================== //
    public Optional<Review> findById(Long id) {
        return reviewRepository.findById(id);
    }

    public List<Review> findByOrderId(Long orderId) {
        return reviewRepository.findByOrder_OrderID(orderId);
    }

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }


    // ===================== UPDATE ===================== //
    public Review updateReview(Long id, ReviewRequest req) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));

        if (req.getComment() != null) {
            review.setComment(req.getComment());
        }

        // Update photo
        if (req.getPhoto() != null && !req.getPhoto().isEmpty()) {

            if (review.getPhotoUrl() != null) {
                cloudinaryAdapter.deleteFile(extractPublicId(review.getPhotoUrl()), "image");
            }

            review.setPhotoUrl(
                    cloudinaryAdapter.uploadImage(req.getPhoto(), "reviews/photos")
            );
        }

        // Update video
        if (req.getVideo() != null && !req.getVideo().isEmpty()) {

            if (review.getVideoUrl() != null) {
                cloudinaryAdapter.deleteFile(extractPublicId(review.getVideoUrl()), "video");
            }

            review.setVideoUrl(
                    cloudinaryAdapter.uploadVideo(req.getVideo(), "reviews/videos")
            );
        }

        return reviewRepository.save(review);
    }


    // ===================== DELETE ===================== //
    public void deleteReview(Long id) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));

        if (review.getPhotoUrl() != null) {
            cloudinaryAdapter.deleteFile(extractPublicId(review.getPhotoUrl()), "image");
        }

        if (review.getVideoUrl() != null) {
            cloudinaryAdapter.deleteFile(extractPublicId(review.getVideoUrl()), "video");
        }

        reviewRepository.delete(review);
    }


    // ===================== Extract public_id ===================== //
    public String extractPublicId(String url) {
        try {
            String noExt = url.substring(0, url.lastIndexOf('.'));
            int idx = noExt.indexOf("/upload/") + "/upload/".length();
            return noExt.substring(idx);
        } catch (Exception e) {
            throw new RuntimeException("Cannot extract public_id: " + url);
        }
    }


    public ReviewResponse toResponse(Review review) {

        return ReviewResponse.builder()
                .reviewID(review.getReviewID())
                .productID(review.getProduct().getProductId())
                .orderID(review.getOrder() != null ? review.getOrder().getOrderID() : null)
                .userName(review.getUser().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .photoUrl(review.getPhotoUrl())
                .videoUrl(review.getVideoUrl())
                .build();
    }
}
