package com.example.MobileStorageManagement.Entity;

import jakarta.persistence.*;
import org.springframework.web.bind.annotation.CrossOrigin;


@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="RoleID")
    private Integer roleId;

    @Column(name ="RoleName",length = 50, nullable = false)
    private String roleName;

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
