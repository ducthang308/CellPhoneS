package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.DTO.*;
import com.example.MobileStorageManagement.Entity.Batch;
import com.example.MobileStorageManagement.Entity.Product;
import com.example.MobileStorageManagement.Repository.BatchRepository;
import com.example.MobileStorageManagement.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private ProductRepository productRepository;

    /* =========================
       GET
       ========================= */

    public List<BatchResponse> getAll() {
        return batchRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BatchResponse getById(Long id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lô hàng"));
        return toResponse(batch);
    }

    /* =========================
       CREATE
       ========================= */

    public BatchResponse create(BatchRequest batchRequest) {
        Batch batch = new Batch();

        batch.setQuantity(batchRequest.getQuantity());
        batch.setPriceIn(batchRequest.getPriceIn());
        batch.setExpiry(batchRequest.getExpiry());
        batch.setProductionDate(batchRequest.getProductionDate());

        if (batchRequest.getProductID() != null) {
            Product product = productRepository.findById(batchRequest.getProductID())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
            batch.setProduct(product);
        }

        return toResponse(batchRepository.save(batch));
    }

    /* =========================
       UPDATE
       ========================= */

    public BatchResponse update(Long id, BatchRequest batchRequest) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lô hàng"));

        if (batchRequest.getQuantity() != null)
            batch.setQuantity(batchRequest.getQuantity());

        if (batchRequest.getPriceIn() != null)
            batch.setPriceIn(batchRequest.getPriceIn());

        if (batchRequest.getExpiry() != null)
            batch.setExpiry(batchRequest.getExpiry());

        if (batchRequest.getProductionDate() != null)
            batch.setProductionDate(batchRequest.getProductionDate());

        if (batchRequest.getProductID() != null) {
            Product product = productRepository.findById(batchRequest.getProductID())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
            batch.setProduct(product);
        }

        return toResponse(batchRepository.save(batch));
    }

    /* =========================
       DELETE
       ========================= */

    public void delete(Long id) {
        batchRepository.deleteById(id);
    }

    /* =========================
       MAPPING
       ========================= */

    private BatchResponse toResponse(Batch batch) {

        BatchResponse res = new BatchResponse();
        res.setBatchID(batch.getBatchID());
        res.setProductionDate(batch.getProductionDate());
        res.setQuantity(batch.getQuantity());
        res.setPriceIn(batch.getPriceIn());
        res.setExpiry(batch.getExpiry());

        if (batch.getProduct() != null) {
            res.setProduct(mapProduct(batch.getProduct()));
        }

        return res;
    }

    private ProductDTO mapProduct(Product product) {
        if (product == null) return null;

        return ProductDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .description(product.getDescription())
                .brandId(
                        product.getBrand() != null
                                ? product.getBrand().getBrandId()
                                : null
                )
                .categoryId(
                        product.getCategory() != null
                                ? product.getCategory().getCategoryId()
                                : null
                )
                .build();
    }

    public List<BatchPriceStatisticDTO> getBatchPriceStatistic() {

        return batchRepository.getBatchPriceStatistic()
                .stream()
                .map(r -> new BatchPriceStatisticDTO(
                        (java.time.LocalDate) r[0],
                        ((Number) r[1]).doubleValue()
                ))
                .toList();
    }

    public InventoryStatisticResponse getInventoryStatistic(
            Integer year,
            Integer month,
            Integer day
    ) {
        InventoryStatisticResponse res = new InventoryStatisticResponse();

        res.setAvailableYears(batchRepository.getAvailableYears());
        res.setSelectedYear(year);
        res.setSelectedMonth(month);
        res.setSelectedDay(day);

        List<InventoryStatisticItem> items = batchRepository
                .getInventoryStatistic(year, month, day)
                .stream()
                .map(r -> {
                    InventoryStatisticItem item = new InventoryStatisticItem();

                    InventoryProductDTO product = new InventoryProductDTO();
                    product.setProductId((Integer) r[0]);
                    product.setProductName((String) r[1]);
                    product.setImageUrl((String) r[2]);
                    product.setQuantity((Integer) r[3]);

                    InventorySupplierDTO supplier = new InventorySupplierDTO();
                    supplier.setSupplierName((String) r[4]);

                    InventoryBatchDTO batch = new InventoryBatchDTO();
                    batch.setBatchId((Long) r[5]);
                    batch.setExpiryDate((java.time.LocalDate) r[6]);

                    item.setProduct(product);
                    item.setSupplier(supplier);
                    item.setBatch(batch);

                    return item;
                })
                .toList();

        res.setItems(items);
        return res;
    }


}
