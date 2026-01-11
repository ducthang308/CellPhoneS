package com.example.MobileStorageManagement.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.MobileStorageManagement.DTO.SpecificationDTO;
import com.example.MobileStorageManagement.Entity.Specification;
import com.example.MobileStorageManagement.Repository.SpecificationRepository;

@Service
public class SpecificationService {
    private final SpecificationRepository specificationRepository;

    public SpecificationService(SpecificationRepository specificationRepository) {
        this.specificationRepository = specificationRepository;
    }

    private SpecificationDTO convertToDTO(Specification spec) {
        return SpecificationDTO.builder()
                .specId(spec.getSpecId())
                .screen(spec.getScreen())
                .cpu(spec.getCpu())
                .ram(spec.getRam())
                .storage(spec.getStorage())
                .camera(spec.getCamera())
                .battery(spec.getBattery())
                .os(spec.getOs())
                .build();
    }

    public List<SpecificationDTO> getAllSpecifications() {
        return this.specificationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SpecificationDTO getSpecificationById(Integer id) {
        Specification spec = this.specificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specification not found with id: " + id));
        return convertToDTO(spec);
    }

    public SpecificationDTO createSpecification(SpecificationDTO specDTO) {
        Specification spec = Specification.builder()
                .screen(specDTO.getScreen())
                .cpu(specDTO.getCpu())
                .ram(specDTO.getRam())
                .storage(specDTO.getStorage())
                .camera(specDTO.getCamera())
                .battery(specDTO.getBattery())
                .os(specDTO.getOs())
                .build();
        return convertToDTO(this.specificationRepository.save(spec));
    }

    public SpecificationDTO updateSpecification(Integer id, SpecificationDTO specDTO) {
        Optional<Specification> optionalSpec = this.specificationRepository.findById(id);
        if (optionalSpec.isPresent()) {
            Specification specification = optionalSpec.get();
            specification.setScreen(specDTO.getScreen());
            specification.setCpu(specDTO.getCpu());
            specification.setRam(specDTO.getRam());
            specification.setStorage(specDTO.getStorage());
            specification.setCamera(specDTO.getCamera());
            specification.setBattery(specDTO.getBattery());
            specification.setOs(specDTO.getOs());

            return convertToDTO(this.specificationRepository.save(specification));
        } else {
            throw new RuntimeException("Specification not found with id: " + id);
        }
    }

    public void deleteSpecification(Integer id) {
        if (!specificationRepository.existsById(id)) {
            throw new RuntimeException("Specification not found with id: " + id);
        }
        this.specificationRepository.deleteById(id);
    }
}
