package com.example.MobileStorageManagement.Repository;

import java.util.List;
import com.example.MobileStorageManagement.Entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);

    boolean existsByCategoryName(String categoryName);
}
