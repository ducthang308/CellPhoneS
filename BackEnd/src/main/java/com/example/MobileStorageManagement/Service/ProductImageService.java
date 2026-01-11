package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.Adapter.CloudinaryAdapter;
import com.example.MobileStorageManagement.DTO.ProductImageDTO;
import com.example.MobileStorageManagement.Entity.Product;
import com.example.MobileStorageManagement.Entity.ProductImage;
import com.example.MobileStorageManagement.Repository.ProductImageRepository;
import com.example.MobileStorageManagement.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final CloudinaryAdapter cloudinaryAdapter;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public List<ProductImage> uploadProductImages(
            Integer productId,
            MultipartFile[] files
    ) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        long startIndex = productImageRepository.countByProduct_ProductId(productId);

        List<ProductImage> savedImages = new ArrayList<>();

        String folder = "products/" + productId;

        for (int i = 0; i < files.length; i++) {

            MultipartFile file = files[i];

            String url = cloudinaryAdapter.uploadImage(file, folder);

            ProductImage image = ProductImage.builder()
                    .url(url)
                    .img_index(startIndex + i)
                    .product(product)
                    .build();

            savedImages.add(productImageRepository.save(image));
        }

        return savedImages;
    }
}
