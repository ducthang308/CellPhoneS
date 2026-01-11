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

import com.example.MobileStorageManagement.DTO.SpecificationDTO;
import com.example.MobileStorageManagement.Service.SpecificationService;

@RestController
@RequestMapping("/api/specifications")
@CrossOrigin(origins = "*")
public class SpecificationController {
    private final SpecificationService specificationService;

    public SpecificationController(SpecificationService specificationService) {
        this.specificationService = specificationService;
    }
    @PreAuthorize("hasRole ('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<SpecificationDTO> getAllSpecifications() {
        return this.specificationService.getAllSpecifications();
    }

    @PreAuthorize("hasRole ('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public SpecificationDTO getSpecificationById(@PathVariable Integer id) {
        return this.specificationService.getSpecificationById(id);
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @PostMapping
    public SpecificationDTO createSpecification(@RequestBody SpecificationDTO specDTO) {
        return this.specificationService.createSpecification(specDTO);
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @PutMapping("/{id}")
    public SpecificationDTO updateSpecification(
            @PathVariable Integer id,
            @RequestBody SpecificationDTO specDTO) {
        return this.specificationService.updateSpecification(id, specDTO);
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @DeleteMapping("/{id}")
    public Void deleteSpecification(@PathVariable Integer id) {
        this.specificationService.deleteSpecification(id);
        return null;
    }
}
