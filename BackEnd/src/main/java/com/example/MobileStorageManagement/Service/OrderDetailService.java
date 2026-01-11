package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.DTO.OrderDetailRequest;
import com.example.MobileStorageManagement.DTO.OrderDetailResponse;
import com.example.MobileStorageManagement.DTO.StockOutResponse;
import com.example.MobileStorageManagement.Entity.Order;
import com.example.MobileStorageManagement.Entity.OrderDetail;
import com.example.MobileStorageManagement.Entity.Product;
import com.example.MobileStorageManagement.Entity.StockOut;
import com.example.MobileStorageManagement.Repository.OrderDetailRepository;
import com.example.MobileStorageManagement.Repository.OrderRepository;
import com.example.MobileStorageManagement.Repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // CREATE
    public OrderDetailResponse create(OrderDetailRequest dto) {
        Order order = orderRepository.findById(dto.getOrderID())
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

        Product product = productRepository.findById(dto.getProductID())
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));

        OrderDetail detail = OrderDetail.builder()
                .order(order)
                .product(product)
                .quantity(dto.getQuantity())
                .build();

        return toResponse(orderDetailRepository.save(detail));
    }

    // GET BY ID
    public OrderDetailResponse getById(Long id) {
        return toResponse(
                orderDetailRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("OrderDetail không tồn tại"))
        );
    }

    // GET BY ORDER ID
    public List<OrderDetailResponse> getByOrderId(Long orderId) {
        return orderDetailRepository.findByOrder_OrderID(orderId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // GET ALL
    public List<OrderDetailResponse> getAll() {
        return orderDetailRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // UPDATE
    public OrderDetailResponse update(Long id, OrderDetailRequest dto) {
        OrderDetail detail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetail không tồn tại"));

        detail.setQuantity(dto.getQuantity());

        if (dto.getOrderID() != null) {
            detail.setOrder(
                    orderRepository.findById(dto.getOrderID())
                            .orElseThrow(() -> new RuntimeException("Order không tồn tại"))
            );
        }

        if (dto.getProductID() != null) {
            detail.setProduct(
                    productRepository.findById(dto.getProductID())
                            .orElseThrow(() -> new RuntimeException("Product không tồn tại"))
            );
        }

        return toResponse(orderDetailRepository.save(detail));
    }

    // DELETE
    public void delete(Long id) {
        orderDetailRepository.deleteById(id);
    }

    // MAPPER
    private OrderDetailResponse toResponse(OrderDetail detail) {
        OrderDetailResponse dto = new OrderDetailResponse();
        dto.setId(detail.getOrderDetailID());
        dto.setQuantity(detail.getQuantity());
        dto.setOrderId(detail.getOrder().getOrderID());
        dto.setProductId(detail.getProduct().getProductId());
        return dto;
    }
}
