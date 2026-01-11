package com.example.MobileStorageManagement.Repository;

import com.example.MobileStorageManagement.Entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByUserIdAndActiveTrue(Integer userId);
}
