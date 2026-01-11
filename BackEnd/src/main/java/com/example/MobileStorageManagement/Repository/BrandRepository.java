package com.example.MobileStorageManagement.Repository;

import com.example.MobileStorageManagement.Entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    List<Brand> findByNameContainingIgnoreCase(String name);

    List<Brand> findByCountry(String country);

    boolean existsByName(String name);
}