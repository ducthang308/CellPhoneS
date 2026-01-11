import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import supplierService from "../../services/supplierService";
import styles from "./add_supplier.module.css";

const SupplierForm: React.FC = () => {
  const navigate = useNavigate();
  const [tenNCC, setTenNCC] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!tenNCC.trim()) {
      alert("Vui lòng nhập tên nhà cung cấp!");
      return;
    }

    try {
      setLoading(true);
      await supplierService.createSupplier(tenNCC.trim());
      alert("Thêm nhà cung cấp thành công!");
      navigate("/admin/suppliers");
    } catch (error) {
      console.error("Create supplier failed", error);
      alert("Thêm nhà cung cấp thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.mainContent}>
      <div className={styles.centerColumn}>
        {/* HEADER */}
        <div className={styles.pageHeader}>
          <h1>Quản lý nhà cung cấp</h1>
          <p className={styles.pageSubTitle}>
            Thêm mới nhà cung cấp vào hệ thống
          </p>
        </div>

        {/* FORM */}
        <form className={styles.formSection} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="supplier-name">Tên nhà cung cấp</label>
            <input
              id="supplier-name"
              type="text"
              value={tenNCC}
              onChange={(e) => setTenNCC(e.target.value)}
              placeholder="Tên nhà cung cấp..."
              disabled={loading}
              required
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.add}
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

export default SupplierForm;
