package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.Entity.Discount;
import com.example.MobileStorageManagement.Repository.DiscountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final DiscountRepository discountRepository;

    /* =====================================================
       ===============  DÙNG KHI TẠO ORDER  ================
       ===================================================== */

    public Discount validate(String code, double subTotal) {

        Discount discount = discountRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

        if (!Boolean.TRUE.equals(discount.getActive())) {
            throw new RuntimeException("Mã giảm giá không còn hiệu lực");
        }

        LocalDateTime now = LocalDateTime.now();

        if (discount.getStartAt() != null && now.isBefore(discount.getStartAt())) {
            throw new RuntimeException("Mã giảm giá chưa bắt đầu");
        }

        if (discount.getEndAt() != null && now.isAfter(discount.getEndAt())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn");
        }

        if (discount.getUsageLimit() != null
                && discount.getUsedCount() >= discount.getUsageLimit()) {
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");
        }

        return discount;
    }

    public double calculate(Discount discount, double subTotal) {

        double discountAmount;

        if ("PERCENT".equalsIgnoreCase(discount.getType())) {
            discountAmount = subTotal * discount.getValue() / 100;
        } else {
            discountAmount = discount.getValue();
        }

        if (discount.getMaxDiscountAmount() != null) {
            discountAmount = Math.min(discountAmount, discount.getMaxDiscountAmount());
        }

        return Math.min(discountAmount, subTotal);
    }

    @Transactional
    public void markUsed(Discount discount) {
        discount.setUsedCount(discount.getUsedCount() + 1);
        discountRepository.save(discount);
    }

    /* =====================================================
       ===================  ADMIN CRUD  ====================
       ===================================================== */

    @Transactional
    public Discount createDiscount(Discount discount) {

        // check trùng code
        if (discountRepository.findByCode(discount.getCode()).isPresent()) {
            throw new RuntimeException("Mã giảm giá đã tồn tại");
        }

        validateTime(discount.getStartAt(), discount.getEndAt());

        discount.setUsedCount(0);
        discount.setActive(Boolean.TRUE.equals(discount.getActive()));

        return discountRepository.save(discount);
    }

    @Transactional
    public Discount updateDiscount(Long id, Discount data) {

        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount không tồn tại"));

        if (data.getCode() != null && !data.getCode().equals(discount.getCode())) {
            if (discountRepository.findByCode(data.getCode()).isPresent()) {
                throw new RuntimeException("Mã giảm giá đã tồn tại");
            }
            discount.setCode(data.getCode());
        }

        if (data.getType() != null) discount.setType(data.getType());
        if (data.getValue() != null) discount.setValue(data.getValue());
        if (data.getMaxDiscountAmount() != null) discount.setMaxDiscountAmount(data.getMaxDiscountAmount());
        if (data.getUsageLimit() != null) discount.setUsageLimit(data.getUsageLimit());
        if (data.getActive() != null) discount.setActive(data.getActive());

        validateTime(data.getStartAt(), data.getEndAt());

        if (data.getStartAt() != null) discount.setStartAt(data.getStartAt());
        if (data.getEndAt() != null) discount.setEndAt(data.getEndAt());

        return discountRepository.save(discount);
    }

    @Transactional
    public void deleteDiscount(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount không tồn tại"));
        discountRepository.delete(discount);
    }

    public Discount getById(Long id) {
        return discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount không tồn tại"));
    }

    public List<Discount> getAll() {
        return discountRepository.findAll();
    }

    /* =====================================================
       ===================  PRIVATE  =======================
       ===================================================== */

    private void validateTime(LocalDateTime start, LocalDateTime end) {
        if (start != null && end != null && end.isBefore(start)) {
            throw new RuntimeException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }
    }
}