import React, { useEffect, useState } from "react";
import styles from "./inventory_quantity.module.css";
import StatisticService from "../../services/StatisticService";
import type {
  InventoryStatisticItem,
  InventoryStatisticResponse
} from "../../services/Interface";


const InventoryQuantity: React.FC = () => {

  const [filters, setFilters] = useState<{
    year?: number;
    month?: number;
    day?: number;
  }>({});

  const [data, setData] = useState<InventoryStatisticResponse>();

  const model: InventoryStatisticItem[] = data?.items ?? [];
  const danhSachNam = data?.availableYears ?? [];

  /* ===================== FETCH API ===================== */
  useEffect(() => {
    StatisticService.getInventoryStatistic(filters).then(res => {
      setData(res);
    });
  }, [filters]);

  /* ===================== HANDLER ===================== */
  const onChangeFilter = (f: {
    year?: number;
    month?: number;
    day?: number;
  }) => {
    setFilters(f);
  };

  /* ===================== RENDER ===================== */
  return (
    <main className={styles["main-content"]}>
      <div className={styles["Title"]}>
        <h1>Thống kê số lượng tồn kho</h1>
      </div>

      <div className={styles["table-container"]}>
        <table>
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Số lượng tồn</th>
              <th>Lô</th>
              <th>Hạn sử dụng</th>
            </tr>
          </thead>

          <tbody>
            {model.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}

            {model.map((item, index) => (
              <tr key={index}>
                <td>{item.product.productId}</td>
                <td>{item.product.productName}</td>
                <td>
                  <img
                    src={
                      item.product.imageUrl ??
                      "/Uploads/placeholder.jpg"
                    }
                    alt={item.product.productName}
                    className={styles["rounded-img"]}
                  />
                </td>
                <td>{item.product.quantity}</td>
                <td>{item.batch.batchId}</td>
                <td>
                  {item.batch.expiryDate
                    ? new Date(
                      item.batch.expiryDate
                    ).toLocaleDateString("vi-VN")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default InventoryQuantity;
