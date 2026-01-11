package com.example.MobileStorageManagement.Service;

import com.example.MobileStorageManagement.Entity.Role;
import com.example.MobileStorageManagement.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {
    @Autowired
    private RoleRepository r;

    public List<Role> getAll(){
        return r.findAll();
    }

    public Optional<Role> getById(Integer id){
        return r.findById(id);
    }

    public Role save(Role role){
        return r.save(role);
    }

    public void delete(Integer id){
        r.deleteById(id);
    }
}
