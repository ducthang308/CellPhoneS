import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./add_category.module.css";

const DanhMucForm: React.FC = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Bạn chưa đăng nhập!");

      const response = await fetch("http://localhost:8080/api/category", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameCategory: name
        }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi tạo danh mục: ${response.status}`);
      }

      navigate("/category");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className={styles["main-content"]}>
    <h1>Quản lí danh mục</h1>
  
  <div className={styles["form-section"]}>
    <form onSubmit={handleSubmit}>
      <div className={styles["form-group"]}>
        <label className={styles["form-label"]}>Tên danh mục</label>
        <input
          className={styles["form-input"]}
          type="text"
          placeholder="Tên danh mục..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className={styles["error-message"]}>
          {error}
        </div>
      )}

      <div className={styles["buttons"]}>
        <button
          type="submit"
          className={styles["add"]}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Thêm mới"}
        </button>
      </div>
    </form>
  </div>
  </main>

);
};

export default DanhMucForm;
