package com.example.MobileStorageManagement.Repository;

import com.example.MobileStorageManagement.DTO.OrderResponse;
import com.example.MobileStorageManagement.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Integer userId);
    // Doanh thu theo tháng (CHỈ TÍNH ĐƠN ĐÃ THANH TOÁN)
    @Query("""
    SELECT 
        MONTH(o.orderDate),
        COUNT(DISTINCT o.orderID),
        SUM(od.quantity * od.unitPrice)
    FROM Order o
    JOIN o.orderDetails od
    WHERE YEAR(o.orderDate) = :year
      AND o.paymentStatus = 'PAID'
    GROUP BY MONTH(o.orderDate)
    ORDER BY MONTH(o.orderDate)
""")
    List<Object[]> getMonthlyRevenue(@Param("year") int year);


    // Tổng đơn + tổng doanh thu
    @Query("""
    SELECT 
        COUNT(DISTINCT o.orderID),
        SUM(od.quantity * od.unitPrice)
    FROM Order o
    JOIN o.orderDetails od
    WHERE YEAR(o.orderDate) = :year
      AND o.paymentStatus = 'PAID'
""")
    List<Object[]> getTotalRevenue(@Param("year") int year);


    // Danh sách năm có order
    @Query("""
        SELECT DISTINCT YEAR(o.orderDate)
        FROM Order o
        ORDER BY YEAR(o.orderDate)
    """)
    List<Integer> getAvailableYears();

    // Total orders (all statuses)
    @Query("""
    SELECT COUNT(o)
    FROM Order o
    WHERE (:year IS NULL OR YEAR(o.orderDate) = :year)
      AND (:month IS NULL OR MONTH(o.orderDate) = :month)
      AND (:day IS NULL OR DAY(o.orderDate) = :day)
""")
    Long countTotalOrders(
            @Param("year") Integer year,
            @Param("month") Integer month,
            @Param("day") Integer day
    );

    // Completed orders
    @Query("""
    SELECT COUNT(o)
    FROM Order o
    WHERE o.status = 'APPROVED'
      AND (:year IS NULL OR YEAR(o.orderDate) = :year)
      AND (:month IS NULL OR MONTH(o.orderDate) = :month)
      AND (:day IS NULL OR DAY(o.orderDate) = :day)
""")
    Long countCompletedOrders(
            @Param("year") Integer year,
            @Param("month") Integer month,
            @Param("day") Integer day
    );

    // Cancelled orders
    @Query("""
    SELECT COUNT(o)
    FROM Order o
    WHERE o.status = 'CANCELLED'
      AND (:year IS NULL OR YEAR(o.orderDate) = :year)
      AND (:month IS NULL OR MONTH(o.orderDate) = :month)
      AND (:day IS NULL OR DAY(o.orderDate) = :day)
""")
    Long countCancelledOrders(
            @Param("year") Integer year,
            @Param("month") Integer month,
            @Param("day") Integer day
    );

    @Query("""
        SELECT o
        FROM Order o
        JOIN FETCH o.user u
        ORDER BY o.orderDate DESC
    """)
    List<Order> findAllWithUser();

}