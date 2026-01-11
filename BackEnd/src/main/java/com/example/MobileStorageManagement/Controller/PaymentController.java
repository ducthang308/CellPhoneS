package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.DTO.OrderPaymentResponse;
import com.example.MobileStorageManagement.Entity.Order;
import com.example.MobileStorageManagement.Entity.OrderDetail;
import com.example.MobileStorageManagement.Entity.Payment;
import com.example.MobileStorageManagement.Repository.OrderDetailRepository;
import com.example.MobileStorageManagement.Repository.OrderRepository;
import com.example.MobileStorageManagement.Repository.PaymentRepository;
import com.example.MobileStorageManagement.Service.PaymentService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/paypal")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> createPayment(
            @RequestParam Long orderId
    ) {
        String approvalUrl = paymentService.createPayment(orderId);
        return ResponseEntity.ok(Map.of("approvalUrl", approvalUrl));
    }

    @GetMapping("/payment/{orderId}")
    public ResponseEntity<?> getPaymentByOrderId(@PathVariable Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId);

        if (payment == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(payment);
    }

    @GetMapping("/payment/full/{orderId}")
    public ResponseEntity<?> getFullPayment(
            @PathVariable Long orderId
    ) {
        // 1. Lấy Payment
        Payment payment = paymentRepository.findByOrderId(orderId);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }

        // 2. Lấy Order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order"));

        // 3. Lấy OrderDetail
        List<OrderDetail> details = orderDetailRepository.findByOrder(order);

        // 4. Build response
        OrderPaymentResponse response = new OrderPaymentResponse(payment, order, details);

        return ResponseEntity.ok(response);
    }


    // PayPal redirect về: /paypal/return?token=XYZ
//    @GetMapping("/return")
//    public ResponseEntity<?> paymentReturn(
//            @RequestParam("token") String paypalOrderId
//    ) {
//        Payment payment = paymentService.completePayment(paypalOrderId);
//        return ResponseEntity.ok(payment);
//    }

    @GetMapping("/return")
    public void paymentReturn(
            @RequestParam("token") String paypalOrderId,
            HttpServletResponse response
    ) throws IOException {

        Payment payment = paymentService.completePayment(paypalOrderId);

        Long orderId = payment.getOrderId();

        response.sendRedirect(
                "http://localhost:5173/?payment=success&orderId=" + orderId
        );
    }


    // Nếu user cancel trên PayPal
    @GetMapping("/cancel")
    public ResponseEntity<?> cancel(
            @RequestParam("token") String paypalOrderId
    ) {
        paymentService.cancelPayment(paypalOrderId);
        return ResponseEntity.ok(Map.of("status", "CANCELLED"));
    }
}
