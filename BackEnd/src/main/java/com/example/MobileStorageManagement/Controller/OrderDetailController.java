package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.DTO.OrderDetailRequest;
import com.example.MobileStorageManagement.DTO.OrderDetailResponse;
import com.example.MobileStorageManagement.Entity.OrderDetail;
import com.example.MobileStorageManagement.Service.OrderDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    public OrderDetailController(OrderDetailService orderDetailService) {
        this.orderDetailService = orderDetailService;
    }

    // CREATE
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping
    public ResponseEntity<OrderDetailResponse> create(
            @RequestBody OrderDetailRequest dto
    ) {
        return ResponseEntity.ok(
                orderDetailService.create(dto)
        );
    }

    // GET BY ID
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                orderDetailService.getById(id)
        );
    }

    // GET BY ORDER ID
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetailResponse>> getByOrderId(
            @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(
                orderDetailService.getByOrderId(orderId)
        );
    }

    // GET ALL
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public ResponseEntity<List<OrderDetailResponse>> getAll() {
        return ResponseEntity.ok(
                orderDetailService.getAll()
        );
    }

    // UPDATE
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> update(
            @PathVariable Long id,
            @RequestBody OrderDetailRequest dto
    ) {
        return ResponseEntity.ok(
                orderDetailService.update(id, dto)
        );
    }

    // DELETE
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderDetailService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

