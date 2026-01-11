package com.example.MobileStorageManagement.Service;

import java.util.List;
import java.util.Optional;

import com.example.MobileStorageManagement.DTO.CartDetailResponse;
import com.example.MobileStorageManagement.DTO.StockInResponse;
import com.example.MobileStorageManagement.Entity.StockIn;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.MobileStorageManagement.DTO.CartDetailRequestDTO;
import com.example.MobileStorageManagement.Entity.Cart;
import com.example.MobileStorageManagement.Entity.CartDetail;
import com.example.MobileStorageManagement.Entity.Product;
import com.example.MobileStorageManagement.Repository.CartDetailRepository;
import com.example.MobileStorageManagement.Repository.CartRepository;
import com.example.MobileStorageManagement.Repository.ProductRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartDetailService {
    private final CartDetailRepository cartDetailRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    public List<CartDetailResponse> getAll() {
        return cartDetailRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<CartDetailResponse> getById(Integer id) {
        return cartDetailRepository.findById(id)
                .map(this::toResponse);
    }

    public List<CartDetailResponse> getByCartId(Integer cartId) {
        return cartDetailRepository.findByCartCartId(cartId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CartDetail createCartDetail(CartDetailRequestDTO dto) {
        System.out.println("Creating CartDetail with cartId=" + dto.getCartId() + ", productId=" + dto.getProductId());
        // Lấy Cart theo cartId
        Cart cart = cartRepository.findById(dto.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found with id " + dto.getCartId()));

        // Lấy Product theo productId
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id " + dto.getProductId()));

        // Tạo CartDetail
        CartDetail cartDetail = CartDetail.builder()
                .cart(cart)
                .product(product)
                .build();

        System.out.println("Created CartDetail: " + dto.getCartId() + ", " + dto.getProductId());

        return cartDetailRepository.save(cartDetail);
    }

    public CartDetail update(Integer id, CartDetailRequestDTO dto) {
        return cartDetailRepository.findById(id).map(existing -> {

            Cart cart = cartRepository.findById(dto.getCartId())
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            existing.setCart(cart);
            existing.setProduct(product);

            return cartDetailRepository.save(existing);

        }).orElseThrow(() -> new RuntimeException("CartDetail not found with id " + id));
    }


    public void delete(Integer id) {
        cartDetailRepository.deleteById(id);
    }

    @Transactional
    public void deleteByCartId(Integer id){
        cartDetailRepository.deleteByCartCartId(id);
    }

    public CartDetailResponse toResponse(CartDetail cartDetail) {

        CartDetailResponse dto = new CartDetailResponse();
        dto.setCartDetailsId(cartDetail.getCartDetailsId());
        dto.setCartId(cartDetail.getCart().getCartId());
        dto.setProduct(productService.toDTO(cartDetail.getProduct()));

        return dto;
    }


}
