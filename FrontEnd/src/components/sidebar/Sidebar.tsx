import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import "remixicon/fonts/remixicon.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) =>
    currentPath.toLowerCase().includes(path.toLowerCase()) ? "lo-active" : "";

  return (
    <div className={styles["lo-sidebar"]}>
      <div className={styles["lo-sidebar-header"]}>Danh mục quản lý</div>

      <Link
        to="/products"
        className={`${styles["lo-menu-item"]} ${isActive("products")}`}
      >
        <i className="ri-box-3-line"></i> Quản lý sản phẩm
      </Link>

      <Link
        to="/suppliers"
        className={`${styles["lo-menu-item"]} ${isActive("suppliers")}`}
      >
        <i className="ri-truck-line"></i> Quản lý nhà cung cấp
      </Link>

      <Link
        to="/category"
        className={`${styles["lo-menu-item"]} ${isActive("category")}`}
      >
        <i className="ri-file-list-3-line"></i> Quản lý danh mục
      </Link>

      <Link
        to="/sales_and_quantity"
        className={`${styles["lo-menu-item"]} ${isActive("sales_and_quantity")}`}
      >
        <i className="ri-bar-chart-box-line"></i> Thống kê
      </Link>

      <Link
        to="/manage_account"
        className={`${styles["lo-menu-item"]} ${isActive("manage_account")}`}
      >
        <i className="ri-user-line"></i> Quản lý tài khoản
      </Link>

      <Link
        to="/manage_notification"
        className={`${styles["lo-menu-item"]} ${isActive("manage_notification")}`}
      >
        <i className="ri-notification-line"></i> Quản lý thông báo
      </Link>

      <Link
        to="/order_approval"
        className={`${styles["lo-menu-item"]} ${isActive("order_approval")}`}
      >
        <i className="ri-checkbox-line"></i> Duyệt đơn hàng
      </Link>

      <Link
        to="/stock_management"
        className={`${styles["lo-menu-item"]} ${isActive("stock_management")}`}
      >
        <i className="ri-store-line"></i> Quản lý kho
      </Link>

      <div className={`${styles["lo-menu-item"]} ${styles["lo-logout"]}`}>
        <Link to="/login">
          <i className="ri-logout-box-line"></i> Đăng xuất
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;