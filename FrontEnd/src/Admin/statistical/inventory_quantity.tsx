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

      <div className={styles["filters"]}>
        <span>Hạn sử dụng:</span>

        <select
          value={filters.year ?? ""}
          onChange={e =>
            onChangeFilter({
              year: e.target.value ? Number(e.target.value) : undefined
            })
          }
        >
          <option value="">-- Năm --</option>
          {danhSachNam.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={filters.month ?? ""}
          disabled={!filters.year}
          onChange={e =>
            onChangeFilter({
              year: filters.year,
              month: e.target.value ? Number(e.target.value) : undefined
            })
          }
        >
          <option value="">-- Tháng --</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>
              Tháng {m}
            </option>
          ))}
        </select>

        <select
          value={filters.day ?? ""}
          disabled={!filters.month}
          onChange={e =>
            onChangeFilter({
              year: filters.year,
              month: filters.month,
              day: e.target.value ? Number(e.target.value) : undefined
            })
          }
        >
          <option value="">-- Ngày --</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>
              Ngày {d}
            </option>
          ))}
        </select>
      </div>

      <div className={styles["table-container"]}>
        <table>
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Nhà cung cấp</th>
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
                <td>{item.supplier.supplierName ?? "—"}</td>
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
