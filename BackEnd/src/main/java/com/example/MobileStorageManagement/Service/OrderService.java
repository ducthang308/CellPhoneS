package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.DTO.*;
import com.example.MobileStorageManagement.Entity.*;
import com.example.MobileStorageManagement.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final DiscountService discountService;

    /* ================= CREATE ================= */

    @Transactional
    public Order createOrder(OrderRequest dto) {

        User user = userRepository.findById(dto.getUserID())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new RuntimeException("Order phải có ít nhất 1 sản phẩm");
        }

        // 1️⃣ Tạo Order object (CHƯA save)
        Order order = Order.builder()
                .orderDate(LocalDateTime.now())
                .status("PENDING")
                .paymentStatus("UNPAID")
                .user(user)
                .build();

        // 2️⃣ Tạo OrderDetails + subtotal
        double subTotal = 0;
        List<OrderDetail> orderDetails = new ArrayList<>();

        for (OrderItemRequest item : dto.getItems()) {

            if (item.getQuantity() <= 0) {
                throw new RuntimeException("Số lượng phải > 0");
            }

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product không tồn tại"));

        /* ===============================
           ✅ TRỪ KHO THEO PRODUCT (ĐÚNG LUẬT MỚI)
           =============================== */

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException(
                        "Không đủ hàng cho sản phẩm: " + product.getName()
                );
            }

            // ✅ TRỪ TỒN KHO THỰC
            product.setStockQuantity(
                    product.getStockQuantity() - item.getQuantity()
            );
            productRepository.save(product);

        /* ===============================
           🔥 LOGIC CŨ – GIỮ NGUYÊN
           =============================== */

            OrderDetail detail = OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .quantity(item.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            subTotal += detail.getUnitPrice() * detail.getQuantity();
            orderDetails.add(detail);
        }

        // 3️⃣ Discount (GIỮ NGUYÊN)
        double discountAmount = 0;

        if (dto.getDiscountCode() != null && !dto.getDiscountCode().isBlank()) {
            Discount discount = discountService.validate(dto.getDiscountCode(), subTotal);
            discountAmount = discountService.calculate(discount, subTotal);

            order.setDiscountCode(discount.getCode());
            order.setDiscountType(discount.getType());
            order.setDiscountValue(discount.getValue());
            order.setDiscountAmount(discountAmount);

            discountService.markUsed(discount);
        }

        // 4️⃣ Set tiền
        order.setSubTotal(subTotal);
        order.setTotalAmount(subTotal - discountAmount);
        order.setOrderDetails(orderDetails);

        // 5️⃣ Save order
        Order savedOrder = orderRepository.save(order);

        // 6️⃣ Save details
        orderDetailRepository.saveAll(orderDetails);

        return savedOrder;
    }

    /* ================= GET ================= */

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));
    }

    @Transactional(readOnly = true)
    public List<OrderFullResponse> getOrdersByUser(Integer userId) {
        return orderRepository.findByUser_UserId(userId)
                .stream()
                .map(this::toFullResponse)
                .toList();
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderService::toResponse)
                .toList();
    }

    /* ================= UPDATE ================= */

    @Transactional
    public Order updateOrder(Long id, OrderRequest dto) {

        Order order = getOrderById(id);

        // chỉ cho phép admin / hệ thống update
        if (dto.getStatus() != null) {
            order.setStatus(dto.getStatus());
        }

        if (dto.getPaymentStatus() != null) {
            order.setPaymentStatus(dto.getPaymentStatus());
        }

        return orderRepository.save(order);
    }

    /* ================= DELETE ================= */

    @Transactional
    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }

    /* ================= MAPPER ================= */

    public OrderFullResponse toFullResponse(Order order) {

        OrderFullResponse res = new OrderFullResponse();
        res.setOrderID(order.getOrderID());
        res.setOrderDate(order.getOrderDate());
        res.setStatus(order.getStatus());
        res.setPaymentStatus(order.getPaymentStatus());
        res.setUserID(order.getUser().getUserId());
        res.setSubTotal(order.getSubTotal());
        res.setDiscountAmount(order.getDiscountAmount());
        res.setTotalAmount(order.getTotalAmount());

        List<OrderProductDTO> products = order.getOrderDetails()
                .stream()
                .map(od -> {
                    OrderProductDTO p = new OrderProductDTO();
                    p.setProductID(od.getProduct().getProductId());
                    p.setName(od.getProduct().getName());
                    p.setPrice(od.getUnitPrice());
                    p.setQuantity(od.getQuantity());

                    String imageUrl = od.getProduct()
                            .getProductImages()
                            .stream()
                            .filter(img -> img.getImg_index() == 0)
                            .map(ProductImage::getUrl)
                            .findFirst()
                            .orElse(null);

                    p.setImageUrl(imageUrl);
                    return p;
                })
                .toList();

        res.setProducts(products);
        return res;
    }

    @Transactional
    public Order applyDiscount(Long orderId, String code) {

        Order order = getOrderById(orderId);

        if (!"UNPAID".equals(order.getPaymentStatus())) {
            throw new RuntimeException("Không thể áp mã cho đơn đã thanh toán");
        }

        double subTotal = order.getSubTotal();

        Discount discount = discountService.validate(code, subTotal);
        double discountAmount = discountService.calculate(discount, subTotal);

        order.setDiscountCode(discount.getCode());
        order.setDiscountType(discount.getType());
        order.setDiscountValue(discount.getValue());
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(subTotal - discountAmount);

        discountService.markUsed(discount);

        return orderRepository.save(order);
    }

    public static OrderResponse toResponse(Order order) {
        OrderResponse res = new OrderResponse();
        res.setOrderID(order.getOrderID());
        res.setStatus(order.getStatus());
        res.setPaymentStatus(order.getPaymentStatus());
        res.setUserID(order.getUser().getUserId());
        return res;
    }


    public DoanhThuDonHangResponse getDoanhThuDonHang(
            Integer year,
            Integer month,
            Integer day
    ) {

        // 1️⃣ Detail data
        List<Object[]> rows = orderRepository.getRevenueStatistic(year, month, day);

        List<RevenueStatisticDTO> data = rows.stream()
                .map(r -> new RevenueStatisticDTO(
                        (Integer) r[0],
                        (Integer) r[1],
                        (Integer) r[2],
                        ((Number) r[3]).longValue(),
                        r[4] != null ? ((Number) r[4]).doubleValue() : 0
                ))
                .toList();

        // 2️⃣ Tổng
        List<Object[]> totalrows =
                orderRepository.getTotalRevenueWithFilter(year, month, day);

        long tongDonHang = 0;
        double tongDoanhThu = 0;

        if (!totalrows.isEmpty()) {
            Object[] row = totalrows.get(0);

            tongDonHang = row[0] != null ? ((Number) row[0]).longValue() : 0;
            tongDoanhThu = row[1] != null ? ((Number) row[1]).doubleValue() : 0;
        }

        // 3️⃣ Response
        DoanhThuDonHangResponse res = new DoanhThuDonHangResponse();
        res.setData(data);
        res.setTongDonHang(tongDonHang);
        res.setTongDoanhThu(tongDoanhThu);
        res.setYears(orderRepository.getAvailableYears());

        res.setSelectedYear(year);
        res.setSelectedMonth(month);
        res.setSelectedDay(day);

        return res;
    }

    public OrderStatusStatisticResponse getOrderStatusStatistic(
            Integer year,
            Integer month,
            Integer day
    ) {

        OrderStatusStatisticResponse res = new OrderStatusStatisticResponse();

        res.setAvailableYears(orderRepository.getAvailableYears());

        res.setSelectedYear(year);
        res.setSelectedMonth(month);
        res.setSelectedDay(day);

        res.setTotalOrders(
                orderRepository.countTotalOrders(year, month, day)
        );

        res.setCompletedOrders(
                orderRepository.countCompletedOrders(year, month, day)
        );

        res.setCancelledOrders(
                orderRepository.countCancelledOrders(year, month, day)
        );

        return res;
    }

    public List<OrderSummaryDTO> getOrdersWithUserInfo() {

        return orderRepository.findAllWithUser()
                .stream()
                .map(order -> {
                    OrderSummaryDTO dto = new OrderSummaryDTO();

                    dto.setOrderId(order.getOrderID());
                    dto.setOrderDate(order.getOrderDate());
                    dto.setStatus(order.getStatus());
                    dto.setPaymentStatus(order.getPaymentStatus());
                    dto.setTotalAmount(order.getTotalAmount());

                    OrderUserDTO userDTO = new OrderUserDTO();
                    userDTO.setFullName(order.getUser().getFullName());
                    userDTO.setPhone(order.getUser().getSdt());
                    userDTO.setAddress(order.getUser().getAddress());

                    dto.setUser(userDTO);
                    return dto;
                })
                .toList();
    }


}