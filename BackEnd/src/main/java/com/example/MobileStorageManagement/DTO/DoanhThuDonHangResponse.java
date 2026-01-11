package com.example.MobileStorageManagement.DTO;

import lombok.Data;
import java.util.List;

@Data
public class DoanhThuDonHangResponse {
    private List<MonthlyRevenueDTO> data;
    private Double tongDoanhThu;
    private Long tongDonHang;
    private List<Integer> years;
}

