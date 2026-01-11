import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./supplier.module.css";
import supplierService from "../../services/supplierService";
import type { ISupplier } from "../../services/Interface";

const PAGE_SIZE = 10;

const SupplierManagement: React.FC = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const data = await supplierService.getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Load suppliers failed", error);
        setSuppliers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  /* ================= SEARCH ================= */
  const filteredSuppliers = useMemo(() => {
    const lower = search.toLowerCase().trim();
    return suppliers.filter(s =>
      s.supplierName.toLowerCase().includes(lower)
    );
  }, [suppliers, search]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredSuppliers.length / PAGE_SIZE);

  const pagedSuppliers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSuppliers.slice(start, start + PAGE_SIZE);
  }, [filteredSuppliers, page]);

  /* ================= HANDLERS ================= */
  const handleRowClick = (id: number) => {
    navigate(`/admin/supplier/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate("/admin/supplier/create");
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <main className={styles["supplierPage-root"]}>
        <section className={styles["supplierPage-content"]}>
          <h1>Quản lý nhà cung cấp</h1>
          <p>Đang tải dữ liệu...</p>
        </section>
      </main>
    );
  }

  /* ================= RENDER ================= */
  return (
    <main className={styles["supplierPage-root"]}>
      <section className={styles["supplierPage-content"]}>
        {/* HEADER */}
        <header className={styles["supplierPage-header"]}>
          <h1 className={styles["supplierPage-title"]}>
            Quản lý nhà cung cấp
          </h1>

          <div className={styles["supplierPage-actionsTop"]}>
            {/* SEARCH */}
            <div className={styles["supplierPage-search"]}>
              <i className="fa fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm nhà cung cấp..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* ADD */}
            <button
              className={styles["supplierPage-addBtn"]}
              onClick={handleAddNew}
            >
              <i className="fa fa-plus"></i>
              <span>Thêm nhà cung cấp</span>
            </button>
          </div>
        </header>

        {/* TABLE */}
        <table className={styles["supplierPage-table"]}>
          <thead>
            <tr>
              <th>Mã NCC</th>
              <th>Tên nhà cung cấp</th>
            </tr>
          </thead>

          <tbody>
            {pagedSuppliers.length > 0 ? (
              pagedSuppliers.map(item => (
                <tr
                  key={item.supplierId}
                  onClick={() => handleRowClick(item.supplierId)}
                >
                  <td>{item.supplierId}</td>
                  <td className={styles["supplierPage-name"]}>
                    {item.supplierName}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className={styles["supplierPage-empty"]}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <nav className={styles["supplierPage-pagination"]}>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <i className="fa fa-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={
                  page === i + 1
                    ? styles["supplierPage-pageActive"]
                    : ""
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
              <i className="fa fa-chevron-right"></i>
            </button>
          </nav>
        )}
      </section>
    </main>
  );
};

export default SupplierManagement;
