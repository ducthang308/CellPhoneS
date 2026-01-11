import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BatchService from "../../services/BatchService";
import type { BatchResponse } from "../../services/Interface";

const BatchDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<BatchResponse | null>(null);

  useEffect(() => {
    if (id) {
      BatchService.getById(Number(id)).then(setData);
    }
  }, [id]);

  if (!data) return <p>Đang tải...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Chi tiết lô #{data.batchID}</h1>

      <p><b>Sản phẩm:</b> {data.product.name}</p>
      <p><b>Giá nhập:</b> {data.priceIn.toLocaleString("vi-VN")} ₫</p>
      <p><b>Số lượng:</b> {data.quantity}</p>
      <p>
        <b>Ngày SX:</b>{" "}
        {data.productionDate
          ? new Date(data.productionDate).toLocaleDateString("vi-VN")
          : "—"}
      </p>
      <p>
        <b>Hạn SD:</b>{" "}
        {data.expiry
          ? new Date(data.expiry).toLocaleDateString("vi-VN")
          : "—"}
      </p>
    </div>
  );
};

export default BatchDetail;
