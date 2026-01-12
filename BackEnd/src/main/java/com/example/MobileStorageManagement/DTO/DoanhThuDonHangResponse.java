package com.example.MobileStorageManagement.DTO;

import lombok.Data;
import java.util.List;

@Data
public class DoanhThuDonHangResponse {

    // dữ liệu chi tiết (tuỳ filter year/month/day)
    private List<RevenueStatisticDTO> data;

    // tổng
    private Double tongDoanhThu;
    private Long tongDonHang;

    // phục vụ dropdown filter
    private List<Integer> years;

    // trạng thái filter hiện tại (FE rất cần)
    private Integer selectedYear;
    private Integer selectedMonth;
    private Integer selectedDay;
}
