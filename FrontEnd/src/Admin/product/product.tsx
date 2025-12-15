import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./product.module.css";

interface SanPham {
  idSanPham: number;
  tenSanPham: string;
  soLuong: number;
  donGia: number;
  moTa: string;
  hinhAnh?: string | null;
}

const SanPhamPage: React.FC = () => {
  const navigate = useNavigate();

  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/product", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) throw new Error("Lỗi tải sản phẩm");

        const data: SanPham[] = await res.json();
        setSanPhams(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  const filteredRows = useMemo(() => {
    const lower = search.toLowerCase();
    return sanPhams.filter((sp) => 
      sp.tenSanPham.toLowerCase().includes(lower)
    );
  }, [sanPhams, search]);

  const handleEdit = (id: number) => {
    navigate(`/products/edit/${id}`);
  };

  const handleAdd = () => {
    navigate("/products/create");
  };

  return (
    <main className={styles["main-content"]}>
      {/* Search */}
      <div className={styles["search-bar"]}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.Title}>
        <h1>QUẢN LÝ SẢN PHẨM</h1>
      </div>

      {/* Filter + Add */}
      <div className={styles["add-button"]}>
        <button className={styles["filter-btn"]}>
          Tất cả ({filteredRows.length})
        </button>
        <button className={styles.add} onClick={handleAdd}>
          Thêm mới &nbsp;&nbsp;&nbsp;<span className={styles["plus-sign"]}>+</span>
        </button>
      </div>

      {/* Table */}
      <section className={styles["table-container"]}>
        <table className={styles["product-table"]}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((item) => (
              <tr key={item.idSanPham}
                onClick={() => handleEdit(item.idSanPham)}>
                <td>{item.idSanPham}</td>
                <td>
                  <img
                    src={item.hinhAnh || "/uploads/placeholder.jpg"}
                    alt={item.tenSanPham}
                    className={styles["rounded-img"]}
                  />
                </td>
                <td>{item.tenSanPham}</td>
                <td>{item.soLuong}</td>
                <td>{item.donGia.toLocaleString()}</td>
                <td>{item.moTa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default SanPhamPage;
