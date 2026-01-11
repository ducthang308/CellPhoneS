package com.example.MobileStorageManagement.Controller;

import com.example.MobileStorageManagement.DTO.LoginRequest;
import com.example.MobileStorageManagement.DTO.LoginResponse;
import com.example.MobileStorageManagement.DTO.RegisterRequest;
import com.example.MobileStorageManagement.DTO.UpdateUserDTO;
import com.example.MobileStorageManagement.DTO.*;
import com.example.MobileStorageManagement.Entity.Cart;
import com.example.MobileStorageManagement.Entity.Role;
import com.example.MobileStorageManagement.Entity.User;
import com.example.MobileStorageManagement.JWT.JwtUtil;
import com.example.MobileStorageManagement.Repository.CartRepository;
import com.example.MobileStorageManagement.Repository.RoleRepository;
import com.example.MobileStorageManagement.Repository.UserRepository;
import com.example.MobileStorageManagement.Service.CartService;
import com.example.MobileStorageManagement.Service.GoogleAuthService;
import com.example.MobileStorageManagement.Service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private GoogleAuthService googleAuthService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        if (userService.existsBySdt(String.valueOf(req.getSdt()))) {
            return ResponseEntity.badRequest().body("SĐT đã tồn tại");
        }

        User user = new User();
        user.setSdt(String.valueOf(req.getSdt()));
        user.setPassword(passwordEncoder.encode(req.getMatKhau()));
        user.setAddress(req.getDiaChi());
        user.setFullName(req.getHoVaTen());
        user.setEmail(req.getEmail());

        Role role = roleRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền"));
        user.setRole(role);
        User savedUser = userService.saveUser(user);

        Cart cart = new Cart();
        cart.setUser(savedUser);
        cart.setStatus("ACTIVE");

        cartRepository.save(cart);

        return ResponseEntity.ok("Đăng ký thành công");
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        String input = (req.getSdt() != null && !req.getSdt().isBlank())
                ? req.getSdt()
                : req.getEmail();

        Authentication authentication;
        try {
            authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(input, req.getPassWord())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Sai thông tin đăng nhập");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Lấy role
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        // Lấy user
        User user = userRepository.findBySdtOrEmail(input, input)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // Get hoặc create cart
        Cart cartEntity = cartService.getCartByUserId(user.getUserId())
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(user)
                                .status("ACTIVE")
                                .build()
                ));

        // Generate token
        String jwt = jwtUtil.generateToken(input, roles);

        // Build response
        LoginResponse res = new LoginResponse();
        res.setUserId(user.getUserId());
        res.setSdt(user.getSdt());
        res.setFullName(user.getFullName());
        res.setEmail(user.getEmail());
        res.setAddress(user.getAddress());
        res.setAvatar(user.getAvatar());
        res.setRole(user.getRole().getRoleId());
        res.setCartId(cartEntity.getCartId());
        res.setToken(jwt);

        return ResponseEntity.ok(res);
    }


    @PreAuthorize("hasRole('ADMIN') or hasRole('WORKER')")
    @GetMapping("/sdt/{sdt}")
    public ResponseEntity<User> findBySdt(@PathVariable  String sdt){
        return userService.findBySdt(sdt)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole ('ADMIN') or hasRole('WORKER')")
    @GetMapping("/email/{email}")
    public ResponseEntity<User> findByEmail(@PathVariable  String email){
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> updateUserJson(
            @PathVariable Integer id,
            @RequestBody UpdateUserDTO dto
    ) {
        User updated = userService.updateUser(id, dto, null);
        return ResponseEntity.ok(userService.toResponse(updated));
    }

    @PatchMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateUserMultipart(
            @PathVariable Integer id,
            @RequestPart("data") String json,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        UpdateUserDTO dto = mapper.readValue(json, UpdateUserDTO.class);

        User updated = userService.updateUser(id, dto, avatar);
        return ResponseEntity.ok(userService.toResponse(updated));
    }


    @GetMapping
    public List<User> getAll(){
        return userService.getAllUser();
    }

    @PostMapping("/login/google")
    public ResponseEntity<?> loginWithGoogle(
            @RequestBody GoogleLoginRequest request
    ) {

        // 1. Verify token
        var payload = googleAuthService.verify(request.getIdToken());

        String googleId = payload.getSubject();
        String email = payload.getEmail();
        String fullName = (String) payload.get("name");
        String avatar = (String) payload.get("picture");

        // 2. Tìm user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // tạo user mới
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(fullName);
                    newUser.setAvatar(avatar);
                    newUser.setGoogleId(googleId);

                    Role role = roleRepository.findById(1)
                            .orElseThrow(() -> new RuntimeException("Role not found"));
                    newUser.setRole(role);

                    return userRepository.save(newUser);
                });

        // 3. Get hoặc create cart
        Cart cart = cartService.getCartByUserId(user.getUserId())
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(user)
                                .status("ACTIVE")
                                .build()
                ));

        // 4. Generate JWT
        List<String> roles = List.of("ROLE_" + user.getRole().getRoleName());
        String jwt = jwtUtil.generateToken(user.getEmail(), roles);

        // 5. Build response
        LoginResponse res = new LoginResponse();
        res.setUserId(user.getUserId());
        res.setEmail(user.getEmail());
        res.setFullName(user.getFullName());
        res.setAvatar(user.getAvatar());
        res.setRole(user.getRole().getRoleId());
        res.setCartId(cart.getCartId());
        res.setToken(jwt);

        return ResponseEntity.ok(res);
    }

}
