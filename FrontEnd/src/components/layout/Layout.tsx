import React from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../headerAdmin/Header";
import styles from "./style_frame.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles["lo-main-wrapper"]}>
      <Sidebar />
      <div className={styles["lo-main-content"]}>
        <Header />
        <div className={styles["lo-container"]}>{children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
