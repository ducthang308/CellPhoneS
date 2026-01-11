import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BatchService from "../../services/BatchService";
import ProductService from "../../services/ProductService";
import type { BatchRequest, IProduct } from "../../services/Interface";
import styles from "./batch_add.module.css";

const BatchAdd = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<BatchRequest>({
    productId: 0,
    quantity: 0,
    priceIn: 0,
    productionDate: "",
    expiry: ""
  });

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    ProductService.getAllProducts().then(setProducts);
  }, []);

  /* ================= SUBMIT ================= */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.productId) {
      alert("Vui lòng chọn sản phẩm");
      return;
    }

    try {
      setSaving(true);

      await BatchService.create({
        productID: form.productId,
        quantity: form.quantity,
        priceIn: form.priceIn,
        productionDate: form.productionDate || null,
        expiry: form.expiry || null
      } as any);

      alert("Thêm lô hàng thành công");
      navigate("/Admin/batch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.batchAdd__page}>
      <div className={styles.batchAdd__card}>
        <h1 className={styles.batchAdd__title}>
          Thêm lô hàng
        </h1>

        <form
          className={styles.batchAdd__form}
          onSubmit={submit}
        >
          {/* PRODUCT */}
          <div className={`${styles.batchAdd__field} ${styles.batchAdd__full}`}>
            <label className={styles.batchAdd__label}>
              Sản phẩm
            </label>
            <select
              className={styles.batchAdd__input}
              value={form.productId}
              onChange={e =>
                setForm({
                  ...form,
                  productId: Number(e.target.value)
                })
              }
              required
            >
              <option value={0}>-- Chọn sản phẩm --</option>
              {products.map(p => (
                <option key={p.productId} value={p.productId}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCTION DATE */}
          <div className={styles.batchAdd__field}>
            <label className={styles.batchAdd__label}>
              Ngày sản xuất
            </label>
            <input
              type="date"
              className={styles.batchAdd__input}
              value={form.productionDate || ""}
              onChange={e =>
                setForm({
                  ...form,
                  productionDate: e.target.value
                })
              }
            />
          </div>

          {/* EXPIRY */}
          <div className={styles.batchAdd__field}>
            <label className={styles.batchAdd__label}>
              Hạn sử dụng
            </label>
            <input
              type="date"
              className={styles.batchAdd__input}
              value={form.expiry || ""}
              onChange={e =>
                setForm({
                  ...form,
                  expiry: e.target.value
                })
              }
            />
          </div>

          {/* QUANTITY */}
          <div className={styles.batchAdd__field}>
            <label className={styles.batchAdd__label}>
              Số lượng
            </label>
            <input
              type="number"
              min={1}
              className={styles.batchAdd__input}
              value={form.quantity}
              onChange={e =>
                setForm({
                  ...form,
                  quantity: Number(e.target.value)
                })
              }
              required
            />
          </div>

          {/* PRICE IN */}
          <div className={styles.batchAdd__field}>
            <label className={styles.batchAdd__label}>
              Giá nhập
            </label>
            <input
              type="number"
              min={0}
              className={styles.batchAdd__input}
              value={form.priceIn}
              onChange={e =>
                setForm({
                  ...form,
                  priceIn: Number(e.target.value)
                })
              }
              required
            />
          </div>

          {/* ACTIONS */}
          <div className={styles.batchAdd__actions}>
            <button
              type="submit"
              className={styles.batchAdd__submit}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>

            <button
              type="button"
              className={styles.batchAdd__cancel}
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

export default BatchAdd;
