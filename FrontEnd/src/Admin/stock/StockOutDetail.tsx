import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StockOutService from "../../services/StockOutService";
import type { StockOutResponse } from "../../services/Interface";
import styles from "./stockout_detail.module.css";

const StockOutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<StockOutResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await StockOutService.getById(Number(id));
        console.log("StockOut detail response:", res);
        setData(res);
      } catch (e) {
        console.error(e);
        alert("Không tìm thấy phiếu xuất");
        navigate("/admin/stock_management");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  if (loading) {
    return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  }

  if (!data) {
    return (
      <div className={styles.loading}>
        Không có dữ liệu phiếu xuất
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(-1)}
          className={styles.backBtn}
        >
          ← Quay lại
        </button>
        <h2>Chi tiết phiếu xuất kho</h2>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <span>ID phiếu xuất:</span>
          <b>#{data.stockOutID}</b>
        </div>

        <div className={styles.row}>
          <span>Batch ID:</span>
          <b>{data.batchID ?? "—"}</b>
        </div>

        <div className={styles.row}>
          <span>Số lượng xuất:</span>
          <b>{data.quantity}</b>
        </div>

        <div className={styles.row}>
          <span>Ngày xuất:</span>
          <b>{data.date ? data.date.slice(0, 10) : "—"}</b>
        </div>

        <div className={styles.row}>
          <span>Ghi chú:</span>
          <b>{data.note || "—"}</b>
        </div>

        <div className={styles.row}>
          <span>User ID:</span>
          <b>{data.userID ?? "—"}</b>
        </div>
      </div>
    </div>
  );
};

export default StockOutDetail;
