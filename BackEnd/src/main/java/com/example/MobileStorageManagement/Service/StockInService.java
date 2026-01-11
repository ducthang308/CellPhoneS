package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.DTO.*;
import com.example.MobileStorageManagement.Entity.*;
import com.example.MobileStorageManagement.Repository.BatchRepository;
import com.example.MobileStorageManagement.Repository.StockInRepository;
import com.example.MobileStorageManagement.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class StockInService {

    @Autowired
    private StockInRepository stockInRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private UserRepository userRepository;

    /* =========================
       GET
       ========================= */

    public List<StockInResponse> getAll() {
        return stockInRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StockInResponse getById(Integer id) {
        StockIn stockIn = stockInRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu nhập"));
        return toResponse(stockIn);
    }

    /* =========================
       CREATE
       ========================= */

    public StockIn create(StockInRequest stockInRequest) throws IOException {
        StockIn entity = new StockIn();
        entity.setQuantity(stockInRequest.getQuantity());
        entity.setDate(stockInRequest.getDate());
        entity.setNote(stockInRequest.getNote());
        entity.setUser(getCurrentUser());

        if (stockInRequest.getBatchId() != null) {
            Batch batch = batchRepository.findById(stockInRequest.getBatchId())
                    .orElseThrow(() -> new RuntimeException("Lô hàng không tồn tại"));
            entity.setBatch(batch);
        }

        return stockInRepository.save(entity);
    }

    /* =========================
       UPDATE
       ========================= */

    public StockIn update(Integer id, StockInRequest stockInRequest) throws IOException {
        StockIn entity = stockInRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu nhập"));

        if (stockInRequest.getQuantity() != null)
            entity.setQuantity(stockInRequest.getQuantity());

        if (stockInRequest.getDate() != null)
            entity.setDate(stockInRequest.getDate());

        if (stockInRequest.getNote() != null)
            entity.setNote(stockInRequest.getNote());

        if (stockInRequest.getBatchId() != null) {
            Batch batch = batchRepository.findById(stockInRequest.getBatchId())
                    .orElseThrow(() -> new RuntimeException("Lô hàng không tồn tại"));
            entity.setBatch(batch);
        }

        entity.setUser(getCurrentUser());

        return stockInRepository.save(entity);
    }

    /* =========================
       DELETE
       ========================= */

    public void delete(Integer id) {
        stockInRepository.deleteById(id);
    }

    /* =========================
       MAPPING
       ========================= */

    public StockInResponse toResponse(StockIn stock) {

        StockInResponse res = new StockInResponse();
        res.setStockInID(stock.getStockInID());
        res.setQuantity(stock.getQuantity());
        res.setDate(stock.getDate());
        res.setNote(stock.getNote());

        // Batch + Product
        if (stock.getBatch() != null) {
            Batch batch = stock.getBatch();

            BatchResponse batchRes = BatchResponse.builder()
                    .batchID(batch.getBatchID())
                    .productionDate(batch.getProductionDate())
                    .quantity(batch.getQuantity())
                    .priceIn(batch.getPriceIn())
                    .expiry(batch.getExpiry())
                    .product(mapProduct(batch.getProduct()))
                    .build();

            res.setBatch(batchRes);
        }

        // User
        if (stock.getUser() != null) {
            User user = stock.getUser();

            UserResponse userRes = new UserResponse(
                    user.getUserId(),
                    user.getSdt(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getAddress(),
                    user.getAvatar()
            );

            res.setUser(userRes);
        }

        return res;
    }

    /* =========================
       HELPERS
       ========================= */

    private ProductDTO mapProduct(Product product) {
        if (product == null) return null;

        return ProductDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .description(product.getDescription())
                .build();
    }

    private User getCurrentUser() {
        String identity = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        if (identity.contains("@")) {
            return userRepository.findByEmail(identity)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại (email)"));
        }

        return userRepository.findBySdt(identity)
                .orElseThrow(() -> new RuntimeException("User không tồn tại (sdt)"));
    }
}
