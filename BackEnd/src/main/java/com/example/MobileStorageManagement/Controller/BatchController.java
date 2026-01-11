package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.DTO.BatchPriceStatisticDTO;
import com.example.MobileStorageManagement.DTO.BatchRequest;
import com.example.MobileStorageManagement.DTO.BatchResponse;
import com.example.MobileStorageManagement.DTO.InventoryStatisticResponse;
import com.example.MobileStorageManagement.Service.BatchService;
import com.example.MobileStorageManagement.Entity.Batch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/batch")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<BatchResponse> getAll() {
        return batchService.getAll();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public BatchResponse getById(@PathVariable Long id) {
        return batchService.getById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public BatchResponse create(@RequestBody BatchRequest request) {
        return batchService.create(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public BatchResponse update(
            @PathVariable Long id,
            @RequestBody BatchRequest request
    ) {
        return batchService.update(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        batchService.delete(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/statistic/price-in")
    public List<BatchPriceStatisticDTO> getBatchPriceStatistic() {
        return batchService.getBatchPriceStatistic();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/statistic/inventory")
    public InventoryStatisticResponse getInventoryStatistic(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer day
    ) {
        return batchService.getInventoryStatistic(year, month, day);
    }

}
