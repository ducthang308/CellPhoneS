import React, { useState } from "react";
import type { FormEvent } from "react";
import styles from "./ProductManagement.module.css";

const SupplierForm: React.FC = () => {
  const [tenNCC, setTenNCC] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!tenNCC.trim()) {
      alert("Vui lòng nhập tên nhà cung cấp!");
      return;
    }
    console.log("Tên nhà cung cấp:", tenNCC);
    // TODO: Gọi API thêm mới NCC
  };

  return (
    <main className={styles.mainContent}>
      <h1>Quản lí nhà cung cấp</h1>
      <div className={styles.formSection}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="product-name">Tên nhà cung cấp</label>
            <input
              id="product-name"
              type="text"
              value={tenNCC}
              onChange={(e) => setTenNCC(e.target.value)}
              placeholder="Tên nhà cung cấp..."
              required
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.add}>
              Thêm mới
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SupplierForm;
