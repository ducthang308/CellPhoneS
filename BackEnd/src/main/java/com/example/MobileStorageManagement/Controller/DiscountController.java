package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.DTO.DiscountRequest;
import com.example.MobileStorageManagement.Entity.Discount;
import com.example.MobileStorageManagement.Service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;

    /* ================= CREATE ================= */

    @PostMapping
    public Discount create(@RequestBody DiscountRequest dto) {

        Discount discount = Discount.builder()
                .code(dto.getCode())
                .type(dto.getType())
                .value(dto.getValue())
                .maxDiscountAmount(dto.getMaxDiscountAmount())
                .startAt(dto.getStartAt())
                .endAt(dto.getEndAt())
                .usageLimit(dto.getUsageLimit())
                .active(dto.getActive())
                .build();

        return discountService.createDiscount(discount);
    }

    /* ================= UPDATE ================= */

    @PutMapping("/{id}")
    public Discount update(
            @PathVariable Long id,
            @RequestBody DiscountRequest dto
    ) {

        Discount discount = Discount.builder()
                .code(dto.getCode())
                .type(dto.getType())
                .value(dto.getValue())
                .maxDiscountAmount(dto.getMaxDiscountAmount())
                .startAt(dto.getStartAt())
                .endAt(dto.getEndAt())
                .usageLimit(dto.getUsageLimit())
                .active(dto.getActive())
                .build();

        return discountService.updateDiscount(id, discount);
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        discountService.deleteDiscount(id);
    }

    /* ================= GET ================= */

    @GetMapping
    public List<Discount> getAll() {
        return discountService.getAll();
    }

    @GetMapping("/{id}")
    public Discount getById(@PathVariable Long id) {
        return discountService.getById(id);
    }
}