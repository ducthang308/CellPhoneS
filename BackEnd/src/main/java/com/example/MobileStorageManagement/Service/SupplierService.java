package com.example.MobileStorageManagement.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.MobileStorageManagement.DTO.SupplierDTO;
import com.example.MobileStorageManagement.Entity.Supplier;
import com.example.MobileStorageManagement.Repository.SupplierRepository;

@Service
public class SupplierService {
    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    private SupplierDTO convertToSupplierDTO(Supplier s) {
        return SupplierDTO.builder()
                .supplierId(s.getSupplierId())
                .supplierName(s.getSupplierName())
                .build();
    }

    public List<SupplierDTO> getAllSuppliers() {
        return this.supplierRepository.findAll().stream()
                .map(this::convertToSupplierDTO)
                .toList();
    }

    public SupplierDTO getSupplierById(Integer id) {
        Optional<Supplier> supplierOpt = this.supplierRepository.findById(id);
        if (supplierOpt.isPresent()) {
            return convertToSupplierDTO(supplierOpt.get());
        } else {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
    }

    public SupplierDTO createSupplier(SupplierDTO supplierDTO) {
        if (this.supplierRepository.existsBySupplierName(supplierDTO.getSupplierName())) {
            throw new RuntimeException("Supplier name already exists: " + supplierDTO.getSupplierName());
        }

        Supplier supplier = Supplier.builder()
                .supplierName(supplierDTO.getSupplierName())
                .build();

        Supplier savedSupplier = this.supplierRepository.save(supplier);
        return convertToSupplierDTO(savedSupplier);
    }

    public SupplierDTO updateSupplier(Integer id, SupplierDTO supplierDTO) {
        Optional<Supplier> supplierOtp = this.supplierRepository.findById(id);
        if (supplierOtp.isPresent()) {
            Supplier supplier = supplierOtp.get();
            if (supplierDTO.getSupplierName().equals(supplier.getSupplierName())) {
                throw new RuntimeException("Supplier is exist: " + id);
            } else {
                supplier.setSupplierName(supplierDTO.getSupplierName());
                return convertToSupplierDTO(this.supplierRepository.save(supplier));
            }

        } else {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
    }

    public void deleteSupplier(Integer id) {
        if (!this.supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
        this.supplierRepository.deleteById(id);
    }
}
