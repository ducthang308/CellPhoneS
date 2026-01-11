package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.DTO.*;
import com.example.MobileStorageManagement.Entity.Order;
import com.example.MobileStorageManagement.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // CREATE
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody OrderRequest dto
    ) {
        Order order = orderService.createOrder(dto);
        return ResponseEntity.ok(OrderService.toResponse(order));
    }


    // GET BY ID
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<OrderFullResponse> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(orderService.toFullResponse(order));
    }

    // GET ALL ORDERS BY USER
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderFullResponse>> getOrdersByUser(
            @PathVariable Integer userId
    ) {
        return ResponseEntity.ok(
                orderService.getOrdersByUser(userId)
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{id}/apply-discount")
    public ResponseEntity<OrderFullResponse> applyDiscount(
            @PathVariable Long id,
            @RequestParam String code
    ) {
        Order order = orderService.applyDiscount(id, code);
        return ResponseEntity.ok(orderService.toFullResponse(order));
    }

    // GET ALL
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }


    // UPDATE
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(
            @PathVariable Long id,
            @RequestBody OrderRequest dto
    ) {
        Order order = orderService.updateOrder(id, dto);
        return ResponseEntity.ok(orderService.toResponse(order));
    }

    // DELETE
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order đã được xoá thành công");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/doanh-thu")
    public ResponseEntity<DoanhThuDonHangResponse> getDoanhThuDonHang(
            @RequestParam int year
    ) {
        return ResponseEntity.ok(
                orderService.getDoanhThuDonHang(year)
        );
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/statistic/order-status")
    public OrderStatusStatisticResponse getOrderStatusStatistic(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer day
    ) {
        return orderService.getOrderStatusStatistic(year, month, day);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/list/with-user")
    public ResponseEntity<List<OrderSummaryDTO>> getOrdersWithUserInfo() {
        return ResponseEntity.ok(
                orderService.getOrdersWithUserInfo()
        );
    }

}