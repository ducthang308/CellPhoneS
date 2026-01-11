package com.example.MobileStorageManagement.DTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String sdt;
    private String hoVaTen;
    private String email;
    private String diaChi;
    private String matKhau;

    public RegisterRequest(String sdt, String hoVaTen, String email, String diaChi, String matKhau) {
        this.sdt = sdt;
        this.hoVaTen = hoVaTen;
        this.email = email;
        this.diaChi = diaChi;
        this.matKhau = matKhau;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getHoVaTen() {
        return hoVaTen;
    }

    public void setHoVaTen(String hoVaTen) {
        this.hoVaTen = hoVaTen;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }
}
