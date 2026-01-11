import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BatchService from "../../services/BatchService";
import ProductService from "../../services/ProductService";
import type { BatchRequest, IProduct } from "../../services/Interface";
import styles from "./batch_update.module.css";

const BatchUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BatchRequest | null>(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    ProductService.getAllProducts().then(setProducts);

    if (id) {
      BatchService.getById(Number(id)).then(res =>
        setForm({
          productId: res.product.productId ?? 0,
          productionDate: res.productionDate ?? "",
          expiry: res.expiry ?? "",
          quantity: res.quantity ?? 0,
          priceIn: res.priceIn ?? 0
        })
      );
    }
  }, [id]);

  if (!form) {
    return <p className={styles.batchUpd__loading}>Đang tải…</p>;
  }

  const productName =
    products.find(p => p.productId === form.productId)?.name ?? "—";

  /* ================= SUBMIT ================= */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await BatchService.update(Number(id), form);
      alert("✅ Cập nhật lô hàng thành công");
      navigate("/Admin/batch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.batchUpd__page}>
      <div className={styles.batchUpd__card}>
        <h1 className={styles.batchUpd__title}>
          Cập nhật lô hàng
        </h1>

        <form
          className={styles.batchUpd__form}
          onSubmit={submit}
        >
          {/* PRODUCT (READ ONLY) */}
          <div className={`${styles.batchUpd__field} ${styles.batchUpd__full}`}>
            <label className={styles.batchUpd__label}>
              Sản phẩm
            </label>
            <input
              className={styles.batchUpd__input}
              value={productName}
              disabled
            />
          </div>

          {/* PRODUCTION DATE */}
          <div className={styles.batchUpd__field}>
            <label className={styles.batchUpd__label}>
              Ngày sản xuất
            </label>
            <input
              type="date"
              className={styles.batchUpd__input}
              value={form.productionDate}
              onChange={e =>
                setForm({
                  ...form,
                  productionDate: e.target.value
                })
              }
            />
          </div>

          {/* EXPIRY */}
          <div className={styles.batchUpd__field}>
            <label className={styles.batchUpd__label}>
              Hạn sử dụng
            </label>
            <input
              type="date"
              className={styles.batchUpd__input}
              value={form.expiry}
              onChange={e =>
                setForm({
                  ...form,
                  expiry: e.target.value
                })
              }
            />
          </div>

          {/* QUANTITY */}
          <div className={styles.batchUpd__field}>
            <label className={styles.batchUpd__label}>
              Số lượng
            </label>
            <input
              type="number"
              min={1}
              className={styles.batchUpd__input}
              value={form.quantity}
              onChange={e =>
                setForm({
                  ...form,
                  quantity: Number(e.target.value)
                })
              }
            />
          </div>

          {/* PRICE IN */}
          <div className={styles.batchUpd__field}>
            <label className={styles.batchUpd__label}>
              Giá nhập
            </label>
            <input
              type="number"
              min={0}
              className={styles.batchUpd__input}
              value={form.priceIn}
              onChange={e =>
                setForm({
                  ...form,
                  priceIn: Number(e.target.value)
                })
              }
            />
          </div>

          {/* ACTIONS */}
          <div className={styles.batchUpd__actions}>
            <button
              type="submit"
              className={styles.batchUpd__submit}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Cập nhật"}
            </button>

            <button
              type="button"
              className={styles.batchUpd__cancel}
              onClick={() => navigate("/Admin/batch")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchUpdate;
