package com.example.MobileStorageManagement.Repository;

import com.example.MobileStorageManagement.Entity.Notification;
import com.example.MobileStorageManagement.Entity.ReceiveNotifications;
import com.example.MobileStorageManagement.Entity.ReceiveNotificationsId;
import com.example.MobileStorageManagement.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReceiveNotificationsRepository extends JpaRepository<ReceiveNotifications, ReceiveNotificationsId> {
    List<ReceiveNotifications> findByUser(User user);
    List<ReceiveNotifications> findByNotification(Notification notification);
    List<ReceiveNotifications> findByUser_UserId(Integer userId);
    @Query("SELECT rn FROM ReceiveNotifications rn " +
            "WHERE rn.user.role.roleName = :roleName")
    List<ReceiveNotifications> findByUserRole(String roleName);

    void deleteByNotification_NotificationId(Integer notificationId);
}
