package com.example.MobileStorageManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MobileStorageManagement.Entity.Specification;

public interface SpecificationRepository extends JpaRepository<Specification, Integer> {
}
