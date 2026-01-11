package com.example.MobileStorageManagement.Controller;


import com.example.MobileStorageManagement.Entity.Role;
import com.example.MobileStorageManagement.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
@CrossOrigin(origins = "*")
public class RoleController {
    @Autowired
    private RoleService r;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Role> getAll(){
        return r.getAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Role> getById(@PathVariable Integer id) {
        return r.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Role create(@RequestBody Role role) {
        return r.save(role);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Role update(@PathVariable Integer id, @RequestBody Role role) {
        role.setRoleId(id);
        return r.save(role);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        r.delete(id);
    }
}
