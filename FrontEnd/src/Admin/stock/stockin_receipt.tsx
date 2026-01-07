import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./stockin_receipt.module.css";
import StockInService from "../../services/StockInService";
import BatchService from "../../services/BatchService";
import type { BatchResponse } from "../../services/Interface";

/* ================= COMPONENT ================= */
const StockinReceipt = () => {
  const navigate = useNavigate();

  /* ===== FORM STATE ===== */
  const [batchId, setBatchId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState<BatchResponse[]>([]);

  /* ===== LOAD BATCH LIST ===== */
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await BatchService.getAll();

       
console.log("Batch API data:", data);
setBatches(data);

        setBatches(data);
      } catch (e) {
        console.error(e);
        alert("Không thể tải danh sách lô hàng");
      }
    };

    fetchBatches();
  }, []);

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!batchId) {
      alert("Vui lòng chọn lô hàng");
      return;
    }

    if (!date) {
      alert("Vui lòng chọn ngày nhập");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        batchId,
        quantity,
        date: `${date}T00:00:00`, 
        note,
      };

      await StockInService.create(payload);

      alert("Thêm phiếu nhập kho thành công!");
      navigate("/admin/stock_management");
    } catch (error: any) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
        "❌ Lỗi khi tạo phiếu nhập kho"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles["main-content"]}>
      {/* ===== HEADER ===== */}
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
        {/* ===== TABS ===== */}
        <div className={styles["tabs-container"]}>
          <div className={`${styles.tab} ${styles.active}`}>
            Nhập kho
          </div>
          <div
            className={styles.tab}
            onClick={() => navigate("/admin/stockout_receipt")}
            style={{ cursor: "pointer" }}
          >
            Xuất kho
          </div>
        </div>

        {/* ===== FORM ===== */}
        <form
          className={styles["form-container"]}
          onSubmit={handleSubmit}
        >
          {/* ROW 1 */}
          <div className={`${styles["form-row"]} ${styles["form-row-2-col"]}`}>
            {/* BATCH SELECT */}
            <div className={styles["form-col"]}>
              <label className={styles["form-row-label"]}>
                Lô hàng (Batch)
              </label>
              <select
                className={styles["form-input"]}
                value={batchId}
                onChange={(e) => setBatchId(Number(e.target.value))}
                required
              >
                <option value="">-- Chọn lô hàng --</option>
                {batches.map((batch) => (
                  <option key={batch.batchID} value={batch.batchID}>
                     {batch.batchID}
                  </option>
                ))}
              </select>
            </div>

            {/* QUANTITY */}
            <div className={styles["form-col"]}>
              <label className={styles["form-row-label"]}>
                Số lượng nhập
              </label>
              <input
                type="number"
                className={styles["form-input"]}
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Số lượng nhập"
                required
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className={styles["form-row"]}>
            <label className={styles["form-row-label"]}>
              Ngày nhập kho
            </label>
            <input
              type="date"
              className={styles["form-input"]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* ROW 3 */}
          <div className={styles["form-row"]}>
            <label className={styles["form-row-label"]}>
              Ghi chú
            </label>
            <textarea
              className={styles["form-textarea"]}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thêm (nếu có)"
            />
          </div>

          {/* SUBMIT */}
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

export default StockinReceipt;
