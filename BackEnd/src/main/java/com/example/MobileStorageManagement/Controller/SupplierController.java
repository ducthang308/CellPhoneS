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

import com.example.MobileStorageManagement.DTO.SupplierDTO;
import com.example.MobileStorageManagement.Service.SupplierService;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<SupplierDTO> getAllSuppliers() {
        return this.supplierService.getAllSuppliers();
    }

    @PreAuthorize("hasRole('ADMIN') ")
    @GetMapping("/{id}")
    public SupplierDTO getSupplierById(@PathVariable Integer id) {
        return this.supplierService.getSupplierById(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping
    public SupplierDTO createSupplier(@RequestBody SupplierDTO supplierDTO) {
        return this.supplierService.createSupplier(supplierDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public SupplierDTO updateSupplier(
            @PathVariable Integer id,
            @RequestBody SupplierDTO supplierDTO) {
        return this.supplierService.updateSupplier(id, supplierDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public Void deleteSupplier(@PathVariable Integer id) {
        this.supplierService.deleteSupplier(id);
        return null;
    }
}
