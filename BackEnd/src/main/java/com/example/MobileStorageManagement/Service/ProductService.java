package com.example.MobileStorageManagement.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.MobileStorageManagement.DTO.*;
import com.example.MobileStorageManagement.Entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import com.example.MobileStorageManagement.Repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    @PersistenceContext
    private EntityManager entityManager;


    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .description(product.getDescription())
                .brandId(product.getBrand() != null ? product.getBrand().getBrandId() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null)
                .supplierId(product.getSupplier() != null ? product.getSupplier().getSupplierId() : null)
                .specification(product.getSpecification() != null ? SpecificationDTO.builder()
                        .specId(product.getSpecification().getSpecId())
                        .screen(product.getSpecification().getScreen())
                        .os(product.getSpecification().getOs())
                        .cpu(product.getSpecification().getCpu())
                        .ram(product.getSpecification().getRam())
                        .battery(product.getSpecification().getBattery())
                        .camera(product.getSpecification().getCamera())
                        .storage(product.getSpecification().getStorage())
                        .build() : null)
                .productImages(product.getProductImages().stream()
                        .map(img -> ProductImageDTO.builder()
                                .id(img.getId())
                                .url(img.getUrl())
                                .img_index(img.getImg_index())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private Product toEntity(ProductDTO dto) {
        Product product = new Product();
        product.setProductId(dto.getProductId());
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setDescription(dto.getDescription());

        if (dto.getBrandId() != null) {
            product.setBrand(
                    entityManager.getReference(Brand.class, dto.getBrandId())
            );
        }

        if (dto.getCategoryId() != null) {
            product.setCategory(
                    entityManager.getReference(Category.class, dto.getCategoryId())
            );
        }

        if (dto.getSupplierId() != null) {
            product.setSupplier(
                    entityManager.getReference(Supplier.class, dto.getSupplierId())
            );
        }

        // SPEC
        if (dto.getSpecification() != null) {
            Specification s = new Specification();
            s.setScreen(dto.getSpecification().getScreen());
            s.setOs(dto.getSpecification().getOs());
            s.setCpu(dto.getSpecification().getCpu());
            s.setRam(dto.getSpecification().getRam());
            s.setBattery(dto.getSpecification().getBattery());
            s.setStorage(dto.getSpecification().getStorage());
            s.setCamera(dto.getSpecification().getCamera());
            product.setSpecification(s);
        }

        // IMAGES
        if (dto.getProductImages() != null) {
            List<ProductImage> images = dto.getProductImages().stream()
                    .map(i -> {
                        ProductImage img = new ProductImage();
                        img.setUrl(i.getUrl());
                        img.setImg_index(i.getImg_index());
                        img.setProduct(product);
                        return img;
                    })
                    .toList();
            product.setProductImages(images);
        }

        return product;
    }

    public List<ProductDTO> searchProducts(String keyword, Integer categoryId) {

        List<Product> products = productRepository.searchProduct(categoryId, keyword);

        return products.stream()
                .map(product -> ProductDTO.builder()
                        .productId(product.getProductId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .stockQuantity(product.getStockQuantity())
                        .description(product.getDescription())
                        .brandId(product.getBrand() != null
                                ? product.getBrand().getBrandId()
                                : null)
                        .categoryId(product.getCategory() != null
                                ? product.getCategory().getCategoryId()
                                : null)
                        .supplierId(product.getSupplier() != null
                                ? product.getSupplier().getSupplierId()
                                : null)
                        .specification(product.getSpecification() != null
                                ? SpecificationDTO.builder()
                                .specId(product.getSpecification().getSpecId())
                                .screen(product.getSpecification().getScreen())
                                .os(product.getSpecification().getOs())
                                .cpu(product.getSpecification().getCpu())
                                .ram(product.getSpecification().getRam())
                                .battery(product.getSpecification().getBattery())
                                .storage(product.getSpecification().getStorage())
                                .camera(product.getSpecification().getCamera())
                                .build()
                                : null)
                        .productImages(product.getProductImages() != null
                                ? product.getProductImages().stream()
                                .map(img -> ProductImageDTO.builder()
                                        .id(img.getId())
                                        .url(img.getUrl())
                                        .img_index(img.getImg_index())
                                        .build())
                                .collect(Collectors.toList())
                                : List.of())
                        .build()
                )
                .collect(Collectors.toList());
    }
//    public List<ProductDTO> getAll() {
//        return productRepository.findAll().stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }

    public ProductDTO getById(Integer id) {
        return productRepository
                .findByProductIdAndDeletedAtIsNull(id)
                .map(this::toDTO)
                .orElse(null);
    }

    public ProductDTO create(ProductDTO dto) {
        Product saved = productRepository.save(toEntity(dto));
        return toDTO(saved);
    }

    public ProductDTO update(Integer id, ProductDTO dto) {
        Product exist = productRepository.findById(id).orElse(null);
        if (exist == null)
            return null;

        exist.setName(dto.getName());
        exist.setPrice(dto.getPrice());
        exist.setStockQuantity(dto.getStockQuantity());
        exist.setDescription(dto.getDescription());

        if (dto.getBrandId() != null) {
            exist.setBrand(
                    entityManager.getReference(Brand.class, dto.getBrandId())
            );
        }

        if (dto.getCategoryId() != null) {
            exist.setCategory(
                    entityManager.getReference(Category.class, dto.getCategoryId())
            );
        }

        if (dto.getSupplierId() != null) {
            exist.setSupplier(
                    entityManager.getReference(Supplier.class, dto.getSupplierId())
            );
        }

        // Update specification
        if (dto.getSpecification() != null) {
            if (exist.getSpecification() == null) {
                exist.setSpecification(new Specification());
            }

            exist.getSpecification().setScreen(dto.getSpecification().getScreen());
            exist.getSpecification().setOs(dto.getSpecification().getOs());
            exist.getSpecification().setCpu(dto.getSpecification().getCpu());
            exist.getSpecification().setRam(dto.getSpecification().getRam());
            exist.getSpecification().setBattery(dto.getSpecification().getBattery());
            exist.getSpecification().setStorage(dto.getSpecification().getStorage());
            exist.getSpecification().setCamera(dto.getSpecification().getCamera());
        }

        // Update images properly
        exist.getProductImages().clear();

        if (dto.getProductImages() != null) {
            for (ProductImageDTO i : dto.getProductImages()) {
                ProductImage img = new ProductImage();
                img.setUrl(i.getUrl());
                img.setImg_index(i.getImg_index());
                img.setProduct(exist); // gắn lại quan hệ
                exist.getProductImages().add(img);
            }
        }

        return toDTO(productRepository.save(exist));
    }

    public void delete(Integer id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) return;

        product.setDeletedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    public List<SupplierProductStatisticResponse> getProductStatisticBySupplier() {

        return productRepository.getProductStatisticBySupplier()
                .stream()
                .map(r -> new SupplierProductStatisticResponse(
                        SupplierDTO.builder()
                                .supplierId((Integer) r[0])
                                .supplierName((String) r[1])
                                .build(),
                        new ProductStatisticDTO(
                                (String) r[2],                 // productName
                                (String) r[5],                 // imageUrl
                                ((Number) r[3]).doubleValue(), // unitPrice
                                (Integer) r[4]                 // quantity
                        )
                ))
                .toList();
    }
}
