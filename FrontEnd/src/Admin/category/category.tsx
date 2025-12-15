import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./category.module.css";

interface DanhMuc {
  idCategory: number;
  nameCategory: string;
}

const DanhMucPage: React.FC = () => {
  const navigate = useNavigate();

  const [danhMucs] = useState<DanhMuc[]>([ 
    { idCategory: 1, nameCategory: "Điện thoại" }, 
    { idCategory: 2, nameCategory: "Laptop" }, 
    { idCategory: 3, nameCategory: "Phụ kiện" }, ]); 
    
    const [search, setSearch] = useState(""); 
    
    const [error] = useState<string | null>(null); 
    
    const filteredDanhMucs = useMemo( 
      () => danhMucs.filter((dm) => 
      dm.nameCategory.toLowerCase().includes(search.toLowerCase()) ),
      [search, danhMucs] ); 

    const handleRowClick = (idCategory: number) => {
      navigate(`/category/edit/${idCategory}`); }; 
       
    const handleAddNew = () => {
      navigate("/category/create"); };

  // const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
  // const [search, setSearch] = useState("");
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchDanhMucs = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await fetch("http://localhost:8080/api/category", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (response.status === 403) {
  //         throw new Error("Bạn không có quyền truy cập dữ liệu này 😢");
  //       }

  //       if (!response.ok) {
  //         throw new Error(`Lỗi tải dữ liệu (${response.status})`);
  //       }

  //       const data: DanhMuc[] = await response.json();
  //       setDanhMucs(data);
  //     } catch (err: any) {
  //       console.error("Fetch error:", err);
  //       setError(err.message || "Không thể tải danh sách danh mục.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDanhMucs();
  // }, []);

  // const filteredDanhMucs = useMemo(
  //   () =>
  //     danhMucs.filter((dm) =>
  //       dm.nameCategory.toLowerCase().includes(search.toLowerCase())
  //     ),
  //   [search, danhMucs]
  // );

  // const handleRowClick = (id: number) => {
  //   navigate(`/danhmucs/edit/${id}`);
  // };

  // const handleAddNew = () => {
  //   navigate("/danhmucs/create");
  // };

  // if (loading)
  //   return <p style={{ padding: "20px" }}>⏳ Đang tải dữ liệu danh mục...</p>;

  return (
    <main className={styles["main-content"]}>
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
        <h1>QUẢN LÝ DANH MỤC</h1>
      </div>

      <div className={styles["add-button"]}>
        <button className={styles["filter-btn"]}>
          Tất cả ({filteredDanhMucs.length})
        </button>
        <button className={styles.add} onClick={handleAddNew}>
          Thêm mới &nbsp;&nbsp;&nbsp;
          <span className={styles["plus-sign"]}>+</span>
        </button>
      </div>

      {error && <div className={styles["alert-danger"]}>{error}</div>}

      <section className={styles["table-container"]}>
        <table className={styles["product-table"]}>
          <thead>
            <tr>
              <th>Mã danh mục</th>
              <th>Tên danh mục</th>
            </tr>
          </thead>
          <tbody>
            {filteredDanhMucs.map((dm) => (
              <tr
                key={dm.idCategory}
                onClick={() => handleRowClick(dm.idCategory)}
              >
                <td>{dm.idCategory}</td>
                <td>{dm.nameCategory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default DanhMucPage;
