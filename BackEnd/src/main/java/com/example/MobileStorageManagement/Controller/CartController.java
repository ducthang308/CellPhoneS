package com.example.MobileStorageManagement.Controller;

import java.util.List;
import java.util.Optional;

import com.example.MobileStorageManagement.Entity.Cart;
import com.example.MobileStorageManagement.Entity.User;
import com.example.MobileStorageManagement.Repository.CartRepository;
import com.example.MobileStorageManagement.Repository.CategoryRepository;
import com.example.MobileStorageManagement.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MobileStorageManagement.DTO.CartDTO;
import com.example.MobileStorageManagement.Service.CartService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    private final CartService cartService;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public CartController(CartService cartService, UserRepository userRepository, CartRepository cartRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("")
    public ResponseEntity<List<CartDTO>> getAllCart() {
        return ResponseEntity.ok(this.cartService.getAllCarts());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public Optional<Cart> getCartByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return cartRepository.findByUser(user);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("")
    public ResponseEntity<CartDTO> create(@RequestBody CartDTO dto) {
        return ResponseEntity.ok(cartService.createCart(dto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCartByUser(@PathVariable Integer id) {
        cartService.deleteCartByUserId(id);
        return ResponseEntity.ok("Deleted cart of userId = " + id);
    }
}