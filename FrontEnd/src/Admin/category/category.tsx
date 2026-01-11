import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./category.module.css";

import categoryService from "../../services/CategoryService";
import type { ICategory } from "../../services/Interface";

const DanhMucPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDanhMucs = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err: any) {
        console.error(err);
        setError("Không thể tải danh sách danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchDanhMucs();
  }, []);

  const filteredDanhMucs = useMemo(
    () =>
      categories.filter((c) =>
        c.categoryName
          .toLowerCase()
          .includes(search.toLowerCase().trim())
      ),
    [search, categories]
  );

  const handleRowClick = (id: number) => {
    navigate(`/admin/category/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate("/admin/category/create");
  };

  if (loading) {
    return (
      <div className="admin-category-loading">
        ⏳ Đang tải danh mục...
      </div>
    );
  }

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Quản lý danh mục</h1>
          <p>Tổng cộng {filteredDanhMucs.length} danh mục</p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <i className="fa fa-search"></i>
            <input
              type="text"
              placeholder="Tìm theo tên danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className={styles.addBtn}
            onClick={handleAddNew}
          >
            + Thêm danh mục
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBox}>{error}</div>
      )}

      {/* TABLE */}
      <section className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
            </tr>
          </thead>

          <tbody>
            {filteredDanhMucs.length === 0 ? (
              <tr>
                <td colSpan={3} className={styles.empty}>
                  Không có danh mục phù hợp
                </td>
              </tr>
            ) : (
              filteredDanhMucs.map((dm) => (
                <tr
                  key={dm.categoryId}
                  onClick={() => handleRowClick(dm.categoryId)}
                  className={styles.row}
                >
                  <td className={styles.id}>{dm.categoryId}</td>
                  <td className={styles.name}>{dm.categoryName}</td>
                  <td className={styles.desc}>
                    {dm.description || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );

};

export default DanhMucPage;
