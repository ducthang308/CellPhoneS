package com.example.MobileStorageManagement.DTO;

import lombok.Data;
import java.util.List;

@Data
public class OrderStatusStatisticResponse {

    private List<Integer> availableYears;

    private Integer selectedYear;
    private Integer selectedMonth;
    private Integer selectedDay;

    private Long totalOrders;
    private Long completedOrders;
    private Long cancelledOrders;
}
