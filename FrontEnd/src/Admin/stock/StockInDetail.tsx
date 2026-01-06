import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StockInService from "../../services/StockInService";
import type { StockInResponse } from "../../services/Interface";
import styles from "./stockin_detail.module.css";

const StockInDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<StockInResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await StockInService.getById(Number(id));

  
console.log("StockIn detail response:", res);
setData(res);
        setData(res);
      } catch (e) {
        console.error(e);
        alert("Không tìm thấy phiếu nhập");
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

  if (!data) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Quay lại
        </button>
        <h2>Chi tiết phiếu nhập kho</h2>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <span>ID phiếu nhập:</span>
          <b>#{data.stockInID}</b>
        </div>

        <div className={styles.row}>
          <span>Batch ID:</span>
          <b>{data.batchID}</b>
        </div>

        <div className={styles.row}>
          <span>Số lượng:</span>
          <b>{data.quantity}</b>
        </div>

        <div className={styles.row}>
          <span>Ngày nhập:</span>
          <b>{data.date?.slice(0, 10)}</b>
        </div>

        <div className={styles.row}>
          <span>Ghi chú:</span>
          <b>{data.note || "—"}</b>
        </div>

        <div className={styles.row}>
          <span>User ID:</span>
          <b>{data.userId}</b>
        </div>
      </div>
    </div>
  );
};

export default StockInDetail;
