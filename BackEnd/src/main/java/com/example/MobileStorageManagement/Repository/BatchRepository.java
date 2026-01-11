package com.example.MobileStorageManagement.Repository;

import com.example.MobileStorageManagement.Entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Long> {

    @Query("""
        SELECT 
            b.productionDate,
            b.priceIn
        FROM Batch b
        ORDER BY b.productionDate
    """)
    List<Object[]> getBatchPriceStatistic();

    @Query("""
    SELECT 
        p.productId,
        p.name,
        (
            SELECT img.url
            FROM ProductImage img
            WHERE img.product = p AND img.img_index = 0
        ),
        b.quantity,
        s.supplierName,
        b.batchID,
        b.expiry
    FROM Batch b
    JOIN b.product p
    LEFT JOIN p.supplier s
    WHERE (:year IS NULL OR YEAR(b.productionDate) = :year)
      AND (:month IS NULL OR MONTH(b.productionDate) = :month)
      AND (:day IS NULL OR DAY(b.productionDate) = :day)
    ORDER BY b.productionDate DESC
""")
    List<Object[]> getInventoryStatistic(
            @Param("year") Integer year,
            @Param("month") Integer month,
            @Param("day") Integer day
    );

    @Query("""
    SELECT DISTINCT YEAR(b.productionDate)
    FROM Batch b
    ORDER BY YEAR(b.productionDate)
""")
    List<Integer> getAvailableYears();

}
