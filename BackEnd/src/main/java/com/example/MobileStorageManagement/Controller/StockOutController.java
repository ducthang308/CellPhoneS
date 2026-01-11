package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.DTO.StockInResponse;
import com.example.MobileStorageManagement.DTO.StockOutRequest;
import com.example.MobileStorageManagement.DTO.StockOutResponse;
import com.example.MobileStorageManagement.Entity.StockOut;
import com.example.MobileStorageManagement.Service.StockOutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stockout")
public class StockOutController {
    @Autowired
    private StockOutService stockOutService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<StockOutResponse>> getAll() {
        return ResponseEntity.ok(
                stockOutService.getAll()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<StockOutResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
                stockOutService.getById(id)
        );
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @PostMapping
    public ResponseEntity<StockOutResponse> create(
            @RequestBody StockOutRequest stockOutRequest
    ) throws IOException {
        StockOut created = stockOutService.create(stockOutRequest);
        return ResponseEntity.ok(stockOutService.toResponse(created));
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<StockOutResponse> update(
            @PathVariable Long id,
            @RequestBody StockOutRequest stockOutRequest
    ) throws IOException {
        StockOut updated = stockOutService.update(id, stockOutRequest);
        return ResponseEntity.ok(stockOutService.toResponse(updated));
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        stockOutService.delete(id);
    }
}
