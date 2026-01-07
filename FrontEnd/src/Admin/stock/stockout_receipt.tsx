import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./stockout_receipt.module.css";
import StockOutService from "../../services/StockOutService";
import BatchService from "../../services/BatchService";
import type { BatchResponse } from "../../services/Interface";

const StockoutReceipt = () => {
  const navigate = useNavigate();

  /* ===== FORM STATE ===== */
  const [batchId, setBatchId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState("");
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===== LOAD BATCH ===== */
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await BatchService.getAll();
        setBatches(data);
      } catch (e) {
        console.error(e);
        alert("❌ Không thể tải danh sách lô hàng");
      }
    };

    fetchBatches();
  }, []);

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!batchId) {
      alert("❌ Vui lòng chọn lô hàng");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        batchID: batchId,
        quantity,
        note,
        date: new Date().toISOString(), 
      };

      // await StockOutService.create(payload);

      // alert("✅ Thêm phiếu xuất kho thành công");
      // navigate("/admin/stock_management");
    } catch (error: any) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
        "❌ Lỗi khi tạo phiếu xuất kho"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles["main-content"]}>
      {/* HEADER */}
      <div className={styles["content-header"]}>
        <div
          className={styles["content-header"]}
          onClick={() => navigate("/admin/stock_management")}
          style={{ cursor: "pointer" }}
        >
          <div className={styles["back-button"]}>
            <i className="fas fa-chevron-left"></i>
          </div>
          <h1 className={styles["content-title"]}>Quản lý kho</h1>
        </div>
      </div>

      <div className={styles.container}>
        {/* TABS */}
        <div className={styles["tabs-container"]}>
          <div
            className={styles.tab}
            onClick={() => navigate("/admin/stockin_receipt")}
          >
            Nhập kho
          </div>
          <div className={`${styles.tab} ${styles.active}`}>
            Xuất kho
          </div>
        </div>

        {/* FORM */}
        <form
          className={styles["form-container"]}
          onSubmit={handleSubmit}
        >
          <div className={`${styles["form-row"]} ${styles["form-row-2-col"]}`}>
            <div className={styles["form-col"]}>
              <label className={styles["form-row-label"]}>
                Lô hàng (Batch)
              </label>
              <select
                className={styles["form-input"]}
                value={batchId}
                onChange={e => setBatchId(Number(e.target.value))}
                required
              >
                {/* <option value="">-- Chọn lô hàng --</option>
                {batches.map(batch => (
                  <option key={batch.batchID} value={batch.batchID}>
                    {batch.batchID?.name} — tồn {batch.stockQuantity}
                  </option>
                ))} */}
              </select>
            </div>

            <div className={styles["form-col"]}>
              <label className={styles["form-row-label"]}>
                Số lượng xuất
              </label>
              <input
                type="number"
                className={styles["form-input"]}
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className={styles["form-row"]}>
            <label className={styles["form-row-label"]}>
              Ghi chú
            </label>
            <textarea
              className={styles["form-textarea"]}
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={styles["submit-button"]}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockoutReceipt;
