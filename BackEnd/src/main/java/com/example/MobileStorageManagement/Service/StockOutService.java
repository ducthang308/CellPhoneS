package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.DTO.*;
import com.example.MobileStorageManagement.Entity.*;
import com.example.MobileStorageManagement.Repository.BatchRepository;
import com.example.MobileStorageManagement.Repository.StockOutRepository;
import com.example.MobileStorageManagement.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class StockOutService {

    @Autowired
    private StockOutRepository stockOutRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private UserRepository userRepository;

    /* =========================
       GET
       ========================= */

    public List<StockOutResponse> getAll() {
        return stockOutRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StockOutResponse getById(Long id) {
        StockOut stockOut = stockOutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu xuất"));
        return toResponse(stockOut);
    }

    /* =========================
       CREATE
       ========================= */

    public StockOut create(StockOutRequest stockOutRequest) throws IOException {
        StockOut entity = new StockOut();
        entity.setQuantity(stockOutRequest.getQuantity());
        entity.setDate(stockOutRequest.getDate());
        entity.setNote(stockOutRequest.getNote());
        entity.setUser(getCurrentUser());

        if (stockOutRequest.getBatchID() != null) {
            Batch batch = batchRepository.findById(stockOutRequest.getBatchID())
                    .orElseThrow(() -> new RuntimeException("Lô hàng không tồn tại"));
            entity.setBatch(batch);
        }

        return stockOutRepository.save(entity);
    }

    /* =========================
       UPDATE
       ========================= */

    public StockOut update(Long id, StockOutRequest stockOutRequest) throws IOException {
        StockOut entity = stockOutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu xuất"));

        if (stockOutRequest.getQuantity() != null)
            entity.setQuantity(stockOutRequest.getQuantity());

        if (stockOutRequest.getDate() != null)
            entity.setDate(stockOutRequest.getDate());

        if (stockOutRequest.getNote() != null)
            entity.setNote(stockOutRequest.getNote());

        if (stockOutRequest.getBatchID() != null) {
            Batch batch = batchRepository.findById(stockOutRequest.getBatchID())
                    .orElseThrow(() -> new RuntimeException("Lô hàng không tồn tại"));
            entity.setBatch(batch);
        }

        entity.setUser(getCurrentUser());

        return stockOutRepository.save(entity);
    }

    /* =========================
       DELETE
       ========================= */

    public void delete(Long id) {
        stockOutRepository.deleteById(id);
    }

    /* =========================
       MAPPING
       ========================= */

    public StockOutResponse toResponse(StockOut stock) {

        StockOutResponse res = new StockOutResponse();
        res.setStockOutId(stock.getStockOutID());
        res.setQuantity(stock.getQuantity());
        res.setNote(stock.getNote());
        res.setDate(stock.getDate());

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
