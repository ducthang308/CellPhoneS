import Sidebar from "../sidebar/Sidebar";
import Header from "../headerAdmin/Header";
import styles from "./style_frame.module.css";
import { Outlet } from "react-router-dom";
import FloatingChat from "../Chat/FloatingChat";

const Layout = () => {
  return (
    <div className={styles["lo-main-wrapper"]} >
      <Sidebar />

      <div className={styles["lo-main-content"]}>
        <Header />

        <div className={styles["lo-container"]} >
          <Outlet />
        </div>
      </div>
       <FloatingChat roomId={1} />
    </div>
  );
};

export default Layout;
