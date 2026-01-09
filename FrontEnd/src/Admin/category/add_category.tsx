import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./add_category.module.css";
import categoryService from "../../services/CategoryService";

const DanhMucForm: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }

    try {
      setLoading(true);

      await categoryService.createCategory({
        categoryName: name.trim(),
        description: description.trim(),
      });

      navigate("/admin/category");
    } catch (err: any) {
      setError(err?.message || "Thêm danh mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.centerColumn}>
        {/* HEADER */}
        <div className={styles.pageHeader}>
          <h1>Thêm danh mục</h1>
          <p className={styles.pageSubTitle}>
            Tạo mới danh mục để phân loại sản phẩm
          </p>
        </div>

        {/* FORM */}
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Tên danh mục</label>
            <input
              type="text"
              placeholder="Ví dụ: Smartphone, Tablet..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả</label>
            <textarea
              placeholder="Mô tả ngắn cho danh mục..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.addBtn}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Thêm danh mục"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default DanhMucForm;
