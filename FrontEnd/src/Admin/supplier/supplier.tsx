import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./supplier.module.css";

interface Supplier {
  id: number;
  name: string;
}

const SupplierManagement: React.FC = () => {
    const navigate = useNavigate();
  // Giả lập data (thay bằng API call sau)
  const [suppliers] = useState<Supplier[]>([
    { id: 1, name: "Apple VN" },
    { id: 2, name: "Samsung VN" },
    { id: 3, name: "Asus Distributor" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleRowClick = (id: number) => {
    // chuyển trang edit sau khi có router
    console.log(`Đi tới trang sửa nhà cung cấp có ID: ${id}`);
  };

      const handleAddNew = () => {
      navigate("/category/create"); };

  return (
    <main className={styles["main-content"]}>
      {/* Thanh tìm kiếm */}
      <div className={styles["search-bar"]}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tiêu đề */}
      <div className={styles.Title}>
        <h1>QUẢN LÝ NHÀ CUNG CẤP</h1>
      </div>

      {/* Nút chức năng */}
      <div className={styles["add-button"]}>
        <button className={styles["filter-btn"]}>
          Tất cả ({filteredSuppliers.length})
        </button>
        <button
          className={styles["add"]}
          onClick={handleAddNew}
        >
          Thêm mới&nbsp;&nbsp;&nbsp;<span className={styles["plus-sign"]}>+</span>
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <section className={styles["table-container"]}>
        <table className={styles["product-table"]}>
          <thead>
            <tr>
              <th>Mã nhà cung cấp</th>
              <th>Tên nhà cung cấp</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((item) => (
              <tr key={item.id} onClick={() => handleRowClick(item.id)}>
                <td>{item.id}</td>
                <td>{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default SupplierManagement;
