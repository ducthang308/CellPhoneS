import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./batch.module.css";
import BatchService from "../../services/BatchService";
import type { BatchResponse } from "../../services/Interface";

const Batch = () => {
  /* ================= DATA ================= */
  const [data, setData] = useState<BatchResponse[]>([]);
  const [search, setSearch] = useState("");

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  /* ================= FETCH ================= */
  useEffect(() => {
    BatchService.getAll().then(setData);
  }, []);

  /* ================= SEARCH ================= */
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(item =>
      item.product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ================= DELETE ================= */
  const handleDelete = async (
    e: React.MouseEvent,
    batchID: number
  ) => {
    e.stopPropagation();

    if (!window.confirm("Xóa lô hàng này?")) return;

    await BatchService.delete(batchID);
    setData(prev => prev.filter(b => b.batchID !== batchID));
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles.batchPage}>
      <div className={styles.batchCard}>
        {/* ===== HEADER ===== */}
        <div className={styles.batchHeader}>
          <div>
            <h1 className={styles.batchTitle}>Quản lý lô hàng</h1>
            <p className={styles.batchSub}>
              Danh sách các lô hàng trong kho
            </p>
          </div>

          <div className={styles.batchActions}>
            <input
              className={styles.batchSearch}
              type="text"
              placeholder="Tìm theo tên sản phẩm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <button
              className={styles.batchAddBtn}
              onClick={() => navigate("/Admin/batch/add")}
            >
              + Thêm lô hàng
            </button>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className={styles.batchTableWrap}>
          <table className={styles.batchTable}>
            <thead>
              <tr>
                <th>ID Lô</th>
                <th>ID SP</th>
                <th>Tên sản phẩm</th>
                <th>Giá bán</th>
                <th>Ngày SX</th>
                <th>Hạn SD</th>
                <th>Số lượng</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {pageData.length > 0 ? (
                pageData.map(item => (
                  <tr
                    key={item.batchID}
                    className={styles.clickableRow}
                    onClick={() =>
                      navigate(`/Admin/batch/${item.batchID}/edit`)
                    }
                  >
                    <td>{item.batchID}</td>
                    <td>{item.product.productId}</td>
                    <td>{item.product.name}</td>
                    <td>
                      {item.product.price.toLocaleString("vi-VN")} ₫
                    </td>
                    <td>
                      {item.productionDate
                        ? new Date(item.productionDate).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td>
                      {item.expiry
                        ? new Date(item.expiry).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td>{item.quantity ?? 0}</td>
                    <td>
                      <button
                        className={styles.batchDeleteBtn}
                        onClick={e =>
                          handleDelete(e, item.batchID)
                        }
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className={styles.noData}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        <div className={styles.batchPagination}>
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            ‹
          </button>

          <span>
            Trang {totalPages === 0 ? 0 : currentPage}/{totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default Batch;
