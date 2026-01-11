package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.DTO.NotificationRequest;
import com.example.MobileStorageManagement.DTO.NotificationResponse;
import com.example.MobileStorageManagement.Entity.Notification;
import com.example.MobileStorageManagement.Entity.ReceiveNotifications;
import com.example.MobileStorageManagement.Entity.ReceiveNotificationsId;
import com.example.MobileStorageManagement.Entity.User;
import com.example.MobileStorageManagement.Repository.NotificationRepository;
import com.example.MobileStorageManagement.Repository.ReceiveNotificationsRepository;
import com.example.MobileStorageManagement.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReceiveNotificationsRepository receiveNotificationsRepository;

    public List<Notification> getAll(){
        return notificationRepository.findAll();
    }

    public Optional<Notification> getById(Integer id){
        return notificationRepository.findById(id);
    }


    // Lấy theo userId
    public List<NotificationResponse> getByUserId(Integer userId) {
        List<ReceiveNotifications> list =
                receiveNotificationsRepository.findByUser_UserId(userId);

        return list.stream()
                .map(this::toDTO)
                .toList();
    }


    // Lấy theo role
    public List<NotificationResponse> getByRole(String roleName) {
        return receiveNotificationsRepository.findByUserRole(roleName)
                .stream()
                .map(this::toDTO)
                .distinct()
                .toList();
    }

    @Transactional
    public Notification save(Notification notification, NotificationRequest req) {
        // 1. Lưu thông báo
        Notification savedThongBao = notificationRepository.save(notification);

        // 2. Lấy danh sách user cần gửi
        List<User> targetUsers = new ArrayList<>();

        if (Boolean.TRUE.equals(req.getSendToAll())) {
            targetUsers = userRepository.findAll();
        } else if (req.getRoles() != null && !req.getRoles().isEmpty()) {
            targetUsers = userRepository.findByRole_RoleNameIn(req.getRoles());
        } else if (req.getUserIds() != null && !req.getUserIds().isEmpty()) {
            targetUsers = userRepository.findAllById(req.getUserIds());
        }

        // 3. Tạo các bản ghi nhận thông báo
        List<ReceiveNotifications> list = new ArrayList<>();
        for (User tk : targetUsers) {
            ReceiveNotificationsId id = new ReceiveNotificationsId();
            id.setUserId(tk.getUserId());
            id.setNotificationId(savedThongBao.getNotificationId());

            ReceiveNotifications ntb = new ReceiveNotifications();
            ntb.setId(id);
            ntb.setUser(tk);
            ntb.setNotification(savedThongBao);
            ntb.setIsRead(false);
            list.add(ntb);
        }
        receiveNotificationsRepository.saveAll(list);

        return savedThongBao;
    }

    @Transactional
    public void delete(Integer id){
        // 1. Xóa các bản ghi nhận thông báo trước
        receiveNotificationsRepository.deleteByNotification_NotificationId(id);

        // 2. Xóa notification
        notificationRepository.deleteById(id);
    }


    public NotificationResponse toDTO(ReceiveNotifications rn) {
        Notification n = rn.getNotification();

        NotificationResponse dto = new NotificationResponse();
        dto.setId(n.getNotificationId());
        dto.setTitle(n.getTitle());
        dto.setNotificationType(n.getNotificationType());
        dto.setContent(n.getContent());
        dto.setIsRead(rn.getIsRead());

        return dto;
    }
}
