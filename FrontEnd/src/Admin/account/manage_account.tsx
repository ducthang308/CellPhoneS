import { useEffect, useMemo, useState } from "react";
import styles from "./manage_account.module.css";

/* ===== TYPES ===== */
export interface Role {
  id: number;
  name: string;
}

export interface Account {
  sdt: string;
  hoVaTen: string;
  email: string;
  matKhau: string;
  diaChi: string;
  idQuyen?: number | null;
  tenQuyen?: string;
}

const ITEMS_PER_PAGE = 5;

const AccountManagement = () => {
  /* ===== DATA STATE ===== */
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  /* ===== UI STATE ===== */
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  /* ===== MOCK DATA ===== */
  useEffect(() => {
    setRoles([
      { id: 1, name: "Admin" },
      { id: 2, name: "User" }
    ]);

    setAccounts([
      {
        sdt: "0989123456",
        hoVaTen: "Nguyễn Văn A",
        email: "a@gmail.com",
        matKhau: "123456",
        diaChi: "Đà Nẵng",
        idQuyen: 1,
        tenQuyen: "Admin"
      },
      {
        sdt: "0977123456",
        hoVaTen: "Trần Thị B",
        email: "b@gmail.com",
        matKhau: "123456",
        diaChi: "Huế",
        idQuyen: null,
        tenQuyen: "Chưa phân quyền"
      }
    ]);
  }, []);

  /* ===== FILTER + SEARCH ===== */
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (filterRole !== "all") {
      result =
        filterRole === "null"
          ? result.filter(a => !a.idQuyen)
          : result.filter(a => String(a.idQuyen) === filterRole);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(a => a.hoVaTen.toLowerCase().includes(s));
    }

    return result;
  }, [accounts, filterRole, search]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE)
  );

  const pagedAccounts = filteredAccounts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRole]);

  /* ===== HANDLERS ===== */
  const openEdit = (acc: Account) => {
    setEditingAccount(acc);
    setShowEditModal(true);
  };

  /* ===== RENDER ===== */
  return (
    <div className={styles["container"]}>
      <div className={styles["content-container"]}>
        {/* HEADER */}
        <div className={styles["content-header"]}>
          <h1>Quản lý tài khoản</h1>

          <div className={styles["search-filter-container"]}>
            <div className={styles["search-box"]}>
              <i className="fas fa-search" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm tài khoản theo tên"
              />
            </div>

            <div className={styles["filter-dropdown"]}>
              <div className={styles["filter-button"]}>
                <i className="fas fa-filter" />
                <span>
                  {filterRole === "all"
                    ? "Quyền hạn"
                    : filterRole === "null"
                    ? "Chưa phân quyền"
                    : roles.find(r => String(r.id) === filterRole)?.name}
                </span>
              </div>

              <div className={styles["filter-content"]}>
                <button onClick={() => setFilterRole("all")}>
                  Tất cả quyền hạn
                </button>

                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setFilterRole(String(r.id))}
                  >
                    {r.name}
                  </button>
                ))}

                <button onClick={() => setFilterRole("null")}>
                  Chưa phân quyền
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className={styles["accounts-table"]}>
          <table>
            <thead>
              <tr>
                <th>SĐT</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Mật khẩu</th>
                <th>Địa chỉ</th>
                <th>Quyền hạn</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {pagedAccounts.map(acc => (
                <tr key={acc.sdt}>
                  <td>
                    <span className={styles["phone-badge"]}>{acc.sdt}</span>
                  </td>
                  <td>{acc.hoVaTen}</td>
                  <td>{acc.email}</td>
                  <td>{acc.matKhau}</td>
                  <td>{acc.diaChi}</td>
                  <td>{acc.tenQuyen ?? "Chưa phân quyền"}</td>
                  <td>
                    <button
                      className={styles["edit-btn"]}
                      onClick={() => openEdit(acc)}
                    >
                      <i className="fas fa-edit" />
                    </button>

                    <button
                      className={styles["lock-btn"]}
                      onClick={() =>
                        confirm(`Xoá tài khoản ${acc.sdt}?`)
                      }
                    >
                      <i className="fas fa-lock" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className={styles["pagination-container"]}>
          <div className={styles["pagination-info"]}>
            <div>
              Trang {currentPage}/{totalPages}
            </div>
            <div>
              Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredAccounts.length
              )}
              /{filteredAccounts.length}
            </div>
          </div>

          <div className={styles["pagination-controls"]}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ◀
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              ▶
            </button>
          </div>

          <button
            className={styles["add-account-btn"]}
            onClick={() => setShowAddModal(true)}
          >
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showEditModal && editingAccount && (
        <div className={styles["modal"]}>
          <div className={styles["modal-content"]}>
            <h2>Sửa tài khoản</h2>
            <button onClick={() => setShowEditModal(false)}>Đóng</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className={styles["modal"]}>
          <div className={styles["modal-content"]}>
            <h2>Thêm tài khoản</h2>
            <button onClick={() => setShowAddModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
