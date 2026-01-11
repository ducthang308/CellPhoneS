package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.Adapter.CloudinaryAdapter;
import com.example.MobileStorageManagement.DTO.ProductImageDTO;
import com.example.MobileStorageManagement.Entity.ProductImage;
import com.example.MobileStorageManagement.Service.ProductImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    private final CloudinaryAdapter cloudinaryAdapter;

    public ImageUploadController(
            CloudinaryAdapter cloudinaryAdapter,
            ProductImageService productImageService
    ) {
        this.cloudinaryAdapter = cloudinaryAdapter;
        this.productImageService = productImageService;
    }

    private ProductImageService productImageService;


    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/img-upload")
    public ResponseEntity<String> uploadImg(@RequestParam("files") MultipartFile file) {
        String url = cloudinaryAdapter.uploadImage(file, "img-folder");
        return ResponseEntity.ok(url);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/{productId}")
    public ResponseEntity<List<ProductImageDTO>> uploadProductImages(
            @PathVariable Integer productId,
            @RequestParam("files") MultipartFile[] files
    ) {

        List<ProductImage> images =
                productImageService.uploadProductImages(productId, files);

        List<ProductImageDTO> result = images.stream()
                .map(img -> ProductImageDTO.builder()
                        .id(img.getId())
                        .url(img.getUrl())
                        .img_index(img.getImg_index())
                        .build())
                .toList();

        return ResponseEntity.ok(result);
    }
}
