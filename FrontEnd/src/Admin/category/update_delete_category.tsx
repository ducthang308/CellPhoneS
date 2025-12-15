import React, { useState } from "react";
import styles from "./update_delete_category.module.css";

interface DanhMuc {
  IDDanhMuc: number;
  TenDanhMuc: string;
}

interface Props {
  model?: DanhMuc;
  onSubmit?: (action: string) => void;
}

const DanhMucEdit: React.FC<Props> = ({
  model = { IDDanhMuc: 0, TenDanhMuc: "" },
  onSubmit = () => {}
}) => {

  const [tenDM, setTenDM] = useState(model?.TenDanhMuc ?? "");
  const [showDelete, setShowDelete] = useState(false);

return (
    <main className={styles["main-content"]}>
      <h1>Quản lí danh mục</h1>

      <div className={styles["form-section"]}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit("update");
          }}
        >
          <input type="hidden" value={model.IDDanhMuc} />
          <div>
            <label>Tên danh mục</label>
            <input
              type="text"
              value={tenDM}
              onChange={(e) => setTenDM(e.target.value)}
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" name="action" value="update" className="update">
              Cập nhật
            </button>
            <button type="button" className="delete" onClick={() => setShowDelete(true)}>
              Xóa
            </button>
          </div>
        </form>
      </div>

      {showDelete && (
        <div className={styles.deleteModal}>
          <div className={styles.modal}>
            <div className={styles["modal-header"]}>
              <h2>Xác nhận xóa!</h2>
              <i className="fas fa-times" onClick={() => setShowDelete(false)}></i>
            </div>

            <div className={styles["modal-body"]}>
              <p className="warning">
                Bạn có chắc chắn muốn xóa danh mục <strong>{tenDM}</strong>?
              </p>
              <p className="note">Lưu ý: Không thể hoàn tác sau khi xác nhận!!</p>
            </div>

            <div className={styles["modal-footer"]}>
              <button className="cancel" onClick={() => setShowDelete(false)}>
                Hủy
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit("delete");
                }}
              >
                <input type="hidden" value={model.IDDanhMuc} />
                <button type="submit" name="action" value="delete" className="delete">
                  Xóa
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DanhMucEdit;
