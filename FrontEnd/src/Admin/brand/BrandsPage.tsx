import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./brand_page.module.css";
import { brandService } from "../../services/BrandService";
import type { Brand } from "../../services/Interface";

const PAGE_SIZE = 10;

const BrandsTableView = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await brandService.getAll();
        setBrands(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Không tải được danh sách thương hiệu"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(brands.length / PAGE_SIZE);

  const pagedBrands = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return brands.slice(start, start + PAGE_SIZE);
  }, [brands, page]);

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm("Xóa thương hiệu này?")) return;

    try {
      await brandService.delete(id);
      setBrands(prev => prev.filter(b => b.brandId !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Xóa thất bại");
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <main className={styles["brandPage-root"]}>
        <section className={styles["brandPage-content"]}>
          <h1>Quản lý thương hiệu</h1>
          <p>Đang tải dữ liệu...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles["brandPage-root"]}>
        <section className={styles["brandPage-content"]}>
          <h1>Quản lý thương hiệu</h1>
          <p className={styles["brandPage-error"]}>{error}</p>
        </section>
      </main>
    );
  }

  /* ================= RENDER ================= */
  return (
    <main className={styles["brandPage-root"]}>
      <section className={styles["brandPage-content"]}>
        {/* HEADER */}
        <header className={styles["brandPage-header"]}>
          <h1 className={styles["brandPage-title"]}>
            Quản lý thương hiệu
          </h1>

          <button
            className={styles["brandPage-addBtn"]}
            onClick={() => navigate("/admin/brands/create")}
          >
            <i className="fa fa-plus"></i>
            <span>Thêm thương hiệu</span>
          </button>
        </header>

        {/* TABLE */}
        <table className={styles["brandPage-table"]}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Quốc gia</th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {pagedBrands.length > 0 ? (
              pagedBrands.map(b => (
                <tr key={b.brandId}>
                  <td>{b.brandId}</td>
                  <td>{b.name}</td>
                  <td>{b.country}</td>
                  <td className={styles["brandPage-desc"]}>
                    {b.description || "-"}
                  </td>
                  <td className={styles["brandPage-actions"]}>
                    <button
                      className={styles["brandPage-editBtn"]}
                      onClick={() =>
                        navigate(`/admin/brands/edit/${b.brandId}`)
                      }
                      title="Sửa"
                    >
                      <i className="fa fa-pen"></i>
                    </button>

                    <button
                      className={styles["brandPage-deleteBtn"]}
                      onClick={() => handleDelete(b.brandId)}
                      title="Xóa"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles["brandPage-empty"]}>
                  Không có thương hiệu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <nav className={styles["brandPage-pagination"]}>
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
                    ? styles["brandPage-pageActive"]
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

export default BrandsTableView;
