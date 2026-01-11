package com.example.MobileStorageManagement.Controller;


import com.example.MobileStorageManagement.DTO.NotificationRequest;
import com.example.MobileStorageManagement.DTO.NotificationResponse;
import com.example.MobileStorageManagement.Entity.Notification;
import com.example.MobileStorageManagement.Entity.ReceiveNotifications;
import com.example.MobileStorageManagement.Repository.ReceiveNotificationsRepository;
import com.example.MobileStorageManagement.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ReceiveNotificationsRepository receiveNotificationsRepository;

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<Notification> getAll() {
        return notificationService.getAll();
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponse> getByUser(@PathVariable Integer userId) {
        return notificationService.getByUserId(userId);
    }

    @GetMapping("/role/{roleName}")
    public List<NotificationResponse> getByRole(@PathVariable String roleName) {
        return notificationService.getByRole(roleName);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public Notification create(@RequestBody NotificationRequest req) {
        Notification tb = new Notification();
        tb.setTitle(req.getTitle());
        tb.setNotificationType(req.getNotificationType());
        tb.setContent(req.getContent());

        return notificationService.save(tb, req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Notification> update(
            @PathVariable Integer id,
            @RequestBody NotificationRequest req) {

        return notificationService.getById(id)
                .map(old -> {
                    // cập nhật
                    old.setTitle(req.getTitle());
                    old.setNotificationType(req.getNotificationType());
                    old.setContent(req.getContent());

                    Notification updated = notificationService.save(old, req);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        notificationService.delete(id);
    }
}
