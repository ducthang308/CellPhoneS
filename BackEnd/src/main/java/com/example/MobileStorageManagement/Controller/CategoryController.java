package com.example.MobileStorageManagement.Controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MobileStorageManagement.DTO.CategoryDTO;
import com.example.MobileStorageManagement.Service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public CategoryDTO getCategoryById(@PathVariable Integer id) {
        return this.categoryService.getCategoryById(id);
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @PostMapping
    public CategoryDTO createCategory(@RequestBody CategoryDTO categoryDTO) {
        return this.categoryService.createCategory(categoryDTO);
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @PutMapping("/{id}")
    public CategoryDTO updateCategory(
            @PathVariable Integer id,
            @RequestBody CategoryDTO categoryDTO) {
        return this.categoryService.updateCategory(id, categoryDTO);
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @DeleteMapping("/{id}")
    public Void deleteCategory(@PathVariable Integer id) {
        this.categoryService.deleteCategory(id);
        return null;
    }
}
