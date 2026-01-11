package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.Entity.Order;
import com.example.MobileStorageManagement.Entity.OrderDetail;
import com.example.MobileStorageManagement.Entity.Payment;
import com.example.MobileStorageManagement.Repository.OrderDetailRepository;
import com.example.MobileStorageManagement.Repository.OrderRepository;
import com.example.MobileStorageManagement.Repository.PaymentRepository;
import com.example.MobileStorageManagement.Client.PayPalClient;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PayPalClient payPalClient;
    private final OrderDetailRepository orderDetailRepository;
    private final FxRateService fxRateService;

    @Value("${app.base-url}")
    private String appBaseUrl;

    public String createPayment(Long orderId) {

        // 1. Lấy Order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

        // 2. Lấy OrderDetail
        List<OrderDetail> details = orderDetailRepository.findByOrder(order);
        if (details.isEmpty()) {
            throw new RuntimeException("Order không có sản phẩm");
        }

        // 3. Tổng tiền VND
        BigDecimal totalVnd = BigDecimal.ZERO;
        for (OrderDetail d : details) {
            BigDecimal priceVnd = BigDecimal.valueOf(d.getProduct().getPrice());
            BigDecimal qty = BigDecimal.valueOf(d.getQuantity());
            totalVnd = totalVnd.add(priceVnd.multiply(qty));
        }

        // 4. Tỷ giá realtime
        BigDecimal usdVndRate = fxRateService.getUsdVndRate();

        // 5. Quy đổi sang USD
        BigDecimal totalUsd = totalVnd
                .divide(usdVndRate, 2, RoundingMode.HALF_UP);

        if (totalUsd.compareTo(new BigDecimal("0.01")) < 0) {
            throw new RuntimeException("Số tiền USD quá nhỏ cho PayPal");
        }

        // 6. Tạo PayPal Order
        JsonNode orderRes = payPalClient.createOrder(
                Double.parseDouble(totalUsd.toPlainString()),
                "USD",
                "Thanh toán Order #" + orderId,
                appBaseUrl + "/paypal/return",
                appBaseUrl + "/paypal/cancel"
        );

        String paypalOrderId = orderRes.get("id").asText();

        // 7. Lưu Payment (KHUYÊN LƯU CẢ VND + RATE)
        paymentRepository.save(
                Payment.builder()
                        .orderId(orderId)
                        .paypalOrderId(paypalOrderId)
                        .amount(totalUsd.doubleValue())     // USD
                        // .amountVnd(totalVnd.longValue())  // nếu có field
                        // .exchangeRate(usdVndRate.doubleValue())
                        .currency("USD")
                        .status("CREATED")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        );

        // 8. Lấy approval URL
        for (JsonNode link : orderRes.get("links")) {
            if ("approve".equals(link.get("rel").asText())) {
                return link.get("href").asText();
            }
        }

        throw new RuntimeException("Không lấy được approvalUrl từ PayPal");
    }

    public Payment completePayment(String paypalOrderId) {
        JsonNode capture = payPalClient.captureOrder(paypalOrderId);
        String status = capture.get("status").asText();

        // extract captureId
        String captureId = null;
        try {
            captureId = capture
                    .get("purchase_units").get(0)
                    .get("payments").get("captures").get(0)
                    .get("id").asText();
        } catch (Exception ignored) { }

        Payment payment = paymentRepository.findByPaypalOrderId(paypalOrderId);
        if (payment == null) {
            throw new RuntimeException("Không tìm thấy payment");
        }

        payment.setPaypalCaptureId(captureId);
        payment.setStatus(status);
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // cập nhật Order
        if ("COMPLETED".equalsIgnoreCase(status)) {
            Order order = orderRepository.findById(payment.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

            order.setPaymentStatus("PAID"); // ← khớp với entity bro đưa
            orderRepository.save(order);
        }

        return payment;
    }

    public void cancelPayment(String paypalOrderId) {
        Payment payment = paymentRepository.findByPaypalOrderId(paypalOrderId);
        if (payment != null) {
            payment.setStatus("CANCELLED");
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        }
    }
}
