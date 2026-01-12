package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.Adapter.CloudinaryAdapter;
import com.example.MobileStorageManagement.DTO.UpdateUserDTO;
import com.example.MobileStorageManagement.Entity.User;
import com.example.MobileStorageManagement.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final CloudinaryAdapter cloudinaryAdapter;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> findBySdt(String sdt) {
        return userRepository.findBySdt(sdt);
    }

    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public boolean existsBySdt(String sdt) {
        return userRepository.existsBySdt(sdt);
    }

    public List<User> getAllUser(){
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Integer id, UpdateUserDTO dto, MultipartFile avatar) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        if (dto.getSdt() != null && !dto.getSdt().isBlank())
            user.setSdt(dto.getSdt());

        if (dto.getFullName() != null && !dto.getFullName().isBlank())
            user.setFullName(dto.getFullName());

        if (dto.getEmail() != null && !dto.getEmail().isBlank())
            user.setEmail(dto.getEmail());

        if (dto.getAddress() != null && !dto.getAddress().isBlank())
            user.setAddress(dto.getAddress());

        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {

            if (user.getGoogleId() != null) {
                throw new RuntimeException(
                        "Tài khoản đăng nhập bằng Google không thể đổi mật khẩu"
                );
            }

            if (dto.getOldPassword() == null || dto.getOldPassword().isBlank()) {
                throw new RuntimeException("Vui lòng nhập mật khẩu hiện tại");
            }

            if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
                throw new RuntimeException("Mật khẩu hiện tại không đúng");
            }

            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        if (avatar != null && !avatar.isEmpty()) {
            String avatarUrl = cloudinaryAdapter.uploadImage(avatar, "avatars");
            user.setAvatar(avatarUrl);
        }

        return userRepository.save(user);
    }



    public UpdateUserDTO toResponse(User user) {
        UpdateUserDTO dto = new UpdateUserDTO();

        dto.setSdt(user.getSdt());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setAddress(user.getAddress());
        dto.setAvatar(user.getAvatar());
        dto.setGoogleId(user.getGoogleId());

        return dto;
    }



}
