import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./manage_stock.module.css";

import StockInService from "../../services/StockInService";
import StockOutService from "../../services/StockOutService";
import type {
  StockInResponse,
  StockOutResponse
} from "../../services/Interface";

type TabType = "nhap" | "xuat";
const PAGE_SIZE = 5;

const StockManagement = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabType>("nhap");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [stockIn, setStockIn] = useState<StockInResponse[]>([]);
  const [stockOut, setStockOut] = useState<StockOutResponse[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===== DELETE CONFIRM ===== */
  const [deleteTarget, setDeleteTarget] =
    useState<StockInResponse | StockOutResponse | null>(null);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === "nhap") {
        const data = await StockInService.getAll();
        setStockIn(Array.isArray(data) ? data : []);
      } else {
        const data = await StockOutService.getStockOutAll();
        setStockOut(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tab]);

  /* ================= DATA PIPE ================= */
  const sourceData = tab === "nhap" ? stockIn : stockOut;

  const filteredData = useMemo(() => {
    if (!search.trim()) return sourceData;
    return sourceData.filter(i =>
      JSON.stringify(i)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, sourceData]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const pageData = filteredData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, tab]);

  /* ================= DELETE ================= */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    if (tab === "nhap") {
      await StockInService.delete(
        (deleteTarget as StockInResponse).stockInID
      );
    } else {
      await StockOutService.delete(
        (deleteTarget as StockOutResponse).stockOutId
      );
    }

    setDeleteTarget(null);
    loadData();
  };

  /* ================= RENDER ================= */
  return (
    <>
      <div className={styles.sm_container}>
        <h2 className={styles.sm_title}>Quản lý kho</h2>

        {/* ===== TOP BAR ===== */}
        <div className={styles.sm_topBar}>
          <div className={styles.sm_left}>
            <div className={styles.sm_tabs}>
              <button
                className={tab === "nhap" ? styles.sm_activeTab : ""}
                onClick={() => setTab("nhap")}
              >
                Phiếu nhập
              </button>
              <button
                className={tab === "xuat" ? styles.sm_activeTab : ""}
                onClick={() => setTab("xuat")}
              >
                Phiếu xuất
              </button>
            </div>

            <div className={styles.sm_searchWrap}>
              <span className={styles.sm_searchIcon}>🔍</span>
              <input
                className={styles.sm_search}
                placeholder="Tìm theo sản phẩm, ghi chú..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <button
            className={styles.sm_addBtn}
            onClick={() =>
              navigate(
                tab === "nhap"
                  ? "/admin/stockin_receipt"
                  : "/admin/stockout_receipt"
              )
            }
          >
            + Thêm {tab === "nhap" ? "phiếu nhập" : "phiếu xuất"}
          </button>
        </div>

        {/* ===== TABLE ===== */}
        <div className={styles.sm_tableWrap}>
          <table className={styles.sm_table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Ngày</th>
                <th>Ghi chú</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={styles.sm_loading}>
                    Đang tải...
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.sm_noData}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                pageData.map(item => {
                  const id =
                    tab === "nhap"
                      ? (item as StockInResponse).stockInID
                      : (item as StockOutResponse).stockOutId;

                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td>{item.batch?.product?.name ?? "—"}</td>
                      <td>{item.quantity}</td>
                      <td>{item.date?.slice(0, 10) ?? "—"}</td>
                      <td>{item.note ?? ""}</td>
                      <td className={styles.sm_actions}>
                        <button
                          className={styles.sm_btnEdit}
                          onClick={() =>
                            navigate(
                              tab === "nhap"
                                ? `/admin/stockin/${id}`
                                : `/admin/stockout/${id}`
                            )
                          }
                        >
                          Sửa
                        </button>

                        <button
                          className={styles.sm_btnDelete}
                          onClick={() => setDeleteTarget(item)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className={styles.sm_pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={
                  page === i + 1 ? styles.sm_activePage : ""
                }
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* ===== DELETE MODAL ===== */}
      {deleteTarget && (
        <div className={styles.sm_modalOverlay}>
          <div className={styles.sm_modal}>
            <h3 className={styles.sm_modalTitle}>
              Xác nhận xóa
            </h3>
            <p className={styles.sm_modalText}>
              Bạn có chắc chắn muốn xóa phiếu này không?
            </p>

            <div className={styles.sm_modalActions}>
              <button
                onClick={() => setDeleteTarget(null)}
              >
                Hủy
              </button>
              <button
                className={styles.sm_danger}
                onClick={handleDeleteConfirm}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StockManagement;
