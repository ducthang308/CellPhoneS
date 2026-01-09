import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./stock_form.module.css";

import StockInService from "../../services/StockInService";
import BatchService from "../../services/BatchService";
import type { BatchResponse, StockInResponse } from "../../services/Interface";

const StockInEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<StockInResponse | null>(null);
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [batchID, setBatchID] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      StockInService.getById(Number(id)),
      BatchService.getAll()
    ]).then(([stock, batchList]) => {
      setData(stock);
      setBatchID(stock.batch?.batchID ?? "");
      setQuantity(stock.quantity);
      setNote(stock.note ?? "");
      setDate(stock.date?.slice(0, 10) ?? "");
      setBatches(batchList);
    });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !batchID || !date) return;

    try {
      setSaving(true);
      await StockInService.update(data.stockInID, {
        batchId: batchID,
        quantity,
        date: `${date}T00:00:00`,
        note
      });
      alert("✅ Đã cập nhật phiếu nhập");
      navigate(-1);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return null;

  return (
    <main className={styles.siEdit__page}>
      <section className={styles.siEdit__card}>
        <h2 className={styles.siEdit__title}>
          Sửa phiếu nhập #{data.stockInID}
        </h2>

        <form onSubmit={submit} className={styles.siEdit__form}>
          {/* LÔ HÀNG */}
          <div className={styles.siEdit__field}>
            <label>Lô hàng</label>
            <select
              value={batchID}
              onChange={(e) => setBatchID(Number(e.target.value))}
              required
            >
              <option value="">-- Chọn lô hàng --</option>
              {batches.map((b) => (
                <option key={b.batchID} value={b.batchID}>
                  {b.product?.name} (Batch #{b.batchID})
                </option>
              ))}
            </select>
          </div>

          {/* SỐ LƯỢNG */}
          <div className={styles.siEdit__field}>
            <label>Số lượng</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          {/* NGÀY NHẬP */}
          <div className={styles.siEdit__field}>
            <label>Ngày nhập</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* GHI CHÚ */}
          <div className={`${styles.siEdit__field} ${styles.siEdit__full}`}>
            <label>Ghi chú</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className={styles.siEdit__divider} />

          <div className={styles.siEdit__actions}>
            <button
              type="submit"
              className={styles.siEdit__save}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>

            <button
              type="button"
              className={styles.siEdit__cancel}
              onClick={() => navigate(-1)}
            >
              Hủy
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default StockInEdit;
