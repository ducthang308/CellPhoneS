package com.example.MobileStorageManagement.DTO;

public class LoginRequest {
    private String sdt;
    private String passWord;
    private String email;


    public LoginRequest(String sdt, String passWord, String email) {
        this.sdt = sdt;
        this.passWord = passWord;
        this.email = email;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
