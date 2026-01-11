package com.example.MobileStorageManagement.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.MobileStorageManagement.DTO.CategoryDTO;
import com.example.MobileStorageManagement.Entity.Category;
import com.example.MobileStorageManagement.Repository.CategoryRepository;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    private CategoryDTO convertToDTO(Category category) {
        return CategoryDTO.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .build();
    }

    public List<CategoryDTO> getAllCategories() {
        return this.categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Integer id) {
        Optional<Category> categoryOtp = this.categoryRepository.findById(id);
        if (categoryOtp.isPresent()) {
            return convertToDTO(categoryOtp.get());
        } else {
            throw new RuntimeException("Category not found with id: " + id);
        }
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        if (this.categoryRepository.existsByCategoryName(categoryDTO.getCategoryName())) {
            throw new RuntimeException("Category already exists with name: " + categoryDTO.getCategoryName());
        } else {
            Category category = new Category();
            category.setCategoryName(categoryDTO.getCategoryName());
            category.setDescription(categoryDTO.getDescription());
            return convertToDTO(this.categoryRepository.save(category));
        }
    }

    public CategoryDTO updateCategory(Integer id, CategoryDTO categoryDTO) {
        Optional<Category> categoryOtp = this.categoryRepository.findById(id);
        if (categoryOtp.isPresent()) {
            Category category = categoryOtp.get();
            category.setCategoryName(categoryDTO.getCategoryName());
            category.setDescription(categoryDTO.getDescription());
            return convertToDTO(this.categoryRepository.save(category));
        } else {
            throw new RuntimeException("Category not found with id: " + id);
        }
    }

    public void deleteCategory(Integer id) {
        if (this.categoryRepository.existsById(id)) {
            this.categoryRepository.deleteById(id);
        } else {
            throw new RuntimeException("Category not found with id: " + id);
        }
    }
}
