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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MobileStorageManagement.DTO.BrandDTO;
import com.example.MobileStorageManagement.Service.BrandService;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*")
public class BrandController {
    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping()
    public List<BrandDTO> getAllBrand() {
        return this.brandService.getAllBrands();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public BrandDTO getBrandById(@PathVariable Integer id) {
        return this.brandService.getBrandById(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/search")
    public List<BrandDTO> searchBrands(@RequestParam String name) {
        return this.brandService.searchBrandByName(name);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/country/{country}")
    public List<BrandDTO> getBrandsByCountry(@PathVariable String country) {
        return this.brandService.getBrandsByCountry(country);
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @PostMapping
    public BrandDTO createBrand(@RequestBody BrandDTO brandDTO) {
        return this.brandService.createBrand(brandDTO);
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @PutMapping("/{id}")
    public BrandDTO updateBrand(
            @PathVariable Integer id,
            @RequestBody BrandDTO brandDTO) {
        return this.brandService.updateBrand(id, brandDTO);
    }

    @PreAuthorize("hasRole ('ADMIN')")
    @DeleteMapping("/{id}")
    public Void deleteBrand(@PathVariable Integer id) {
        this.brandService.deleteBrand(id);
        return null;
    }
}
