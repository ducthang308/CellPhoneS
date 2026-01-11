package com.example.MobileStorageManagement.Service;


import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.MobileStorageManagement.DTO.CartDTO;
import com.example.MobileStorageManagement.Entity.Cart;
import com.example.MobileStorageManagement.Entity.User;
import com.example.MobileStorageManagement.Repository.CartRepository;
import com.example.MobileStorageManagement.Repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public CartDTO toDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getCartId());
        dto.setUserId(cart.getUser().getUserId());
        dto.setStatus(cart.getStatus());
        return dto;
    }

    public Cart createCartForUser(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setStatus("ACTIVE");
        return cartRepository.save(cart);
    }


    public CartDTO createCart(CartDTO DTO) {
        User user = userRepository.findById(DTO.getUserId())
                .orElseThrow();

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setStatus(DTO.getStatus());

        Cart savedCart = cartRepository.save(cart);
        return toDTO(savedCart);
    }

    public Optional<Cart> getCartByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return cartRepository.findByUser(user);
    }


    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepository.findAll();
        return carts.stream().map(this::toDTO).toList();
    }

    public void deleteCartByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow();

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow();
        cartRepository.delete(cart);
    }


}
