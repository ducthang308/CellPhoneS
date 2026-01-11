package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.Entity.Product;
import com.example.MobileStorageManagement.Repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PhoneSearchService {

    private final ProductRepository repo;

    public PhoneSearchService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Map<String, Object>> search(String message) {
        String text = message.toLowerCase();

        // 1️⃣ Lấy toàn bộ máy còn hàng + chưa bị xóa
        List<Product> products =
                repo.findByStockQuantityGreaterThanAndDeletedAtIsNull(0);

        // 2️⃣ LỌC HÃNG
        Map<String, String> brands = Map.of(
                "samsung", "samsung",
                "iphone", "apple",
                "apple", "apple",
                "xiaomi", "xiaomi",
                "oppo", "oppo",
                "vivo", "vivo"
        );

        for (var entry : brands.entrySet()) {
            if (text.contains(entry.getKey())) {
                products = products.stream()
                        .filter(p ->
                                p.getBrand() != null &&
                                        p.getBrand().getName() != null &&
                                        p.getBrand().getName().toLowerCase()
                                                .contains(entry.getValue())
                        )
                        .toList();
                break;
            }
        }

        // 3️⃣ LỌC GIÁ (MỀM)
        Matcher m = Pattern
                .compile("(\\d+)\\s*(triệu|tr)")
                .matcher(text);

        if (m.find()) {
            long budget = Long.parseLong(m.group(1)) * 1_000_000;
            long min = (long) (budget * 0.7);
            long max = (long) (budget * 1.3);

            products = products.stream()
                    .filter(p ->
                            p.getPrice() != null &&
                                    p.getPrice() >= min &&
                                    p.getPrice() <= max
                    )
                    .toList();
        }

        // 4️⃣ FALLBACK (chỉ lấy máy còn hàng + chưa xóa)
        if (products.isEmpty()) {
            products =
                    repo.findTop3ByStockQuantityGreaterThanAndDeletedAtIsNullOrderByPriceAsc(0);
        }

        // 5️⃣ MAP DATA
        List<Map<String, Object>> result = new ArrayList<>();

        for (Product p : products) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", p.getName());
            map.put("price", p.getPrice());
            map.put("brand",
                    p.getBrand() != null ? p.getBrand().getName() : null);
            map.put("ram",
                    p.getSpecification() != null ? p.getSpecification().getRam() : null);
            map.put("battery",
                    p.getSpecification() != null ? p.getSpecification().getBattery() : null);

            result.add(map);
        }

        return result;
    }
}
