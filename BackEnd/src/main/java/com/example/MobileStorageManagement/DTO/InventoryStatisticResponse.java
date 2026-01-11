package com.example.MobileStorageManagement.DTO;

import lombok.Data;
import java.util.List;

@Data
public class InventoryStatisticResponse {
    private List<Integer> availableYears;
    private Integer selectedYear;
    private Integer selectedMonth;
    private Integer selectedDay;
    private List<InventoryStatisticItem> items;
}
