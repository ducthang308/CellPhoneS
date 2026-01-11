package com.example.MobileStorageManagement.Controller;

import java.util.List;

import com.example.MobileStorageManagement.DTO.CartDetailResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MobileStorageManagement.DTO.CartDetailRequestDTO;
import com.example.MobileStorageManagement.Entity.CartDetail;
import com.example.MobileStorageManagement.Service.CartDetailService;

@RestController
@RequestMapping("/api/cart-details")
public class CartDetailController {
    private final CartDetailService cartDetailService;

    public CartDetailController(CartDetailService cartDetailService) {
        this.cartDetailService = cartDetailService;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<CartDetailResponse> getAll() {
        return cartDetailService.getAll();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<CartDetailResponse> getById(@PathVariable Integer id) {
        return cartDetailService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/cart/{cartId}")
    public List<CartDetailResponse> getByCartId(@PathVariable Integer cartId) {
        return cartDetailService.getByCartId(cartId);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping
    public ResponseEntity<CartDetailResponse> create(@RequestBody CartDetailRequestDTO cartDetailDTO) throws Exception{
        CartDetail cartDetail = cartDetailService.createCartDetail(cartDetailDTO);
        return ResponseEntity.ok(cartDetailService.toResponse(cartDetail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartDetailResponse> update(
            @PathVariable Integer id,
            @RequestBody CartDetailRequestDTO cartDetailRequestDTO
    ) throws Exception {
        CartDetail updated = cartDetailService.update(id, cartDetailRequestDTO);
        return ResponseEntity.ok(cartDetailService.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        cartDetailService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @DeleteMapping("/cart/{cartId}")
    public void clearCart(@PathVariable Integer cartId) {
        cartDetailService.deleteByCartId(cartId);
    }
}
