import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Chart from "chart.js/auto";
import styles from "./order_status_by_time.module.css";
import StatisticService from "../../services/StatisticService";

/* ===================== TYPES ===================== */
interface OrderStatusStatistic {
  availableYears: number[];
  selectedYear: number | null;
  selectedMonth: number | null;
  selectedDay: number | null;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

/* ===================== COMPONENT ===================== */
const OrderStatusByTime = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  /* ===================== FILTER STATE ===================== */
  const [year, setYear] = useState<number | null>(() => {
    const q = searchParams.get("year");
    return q ? Number(q) : null;
  });

  const [month, setMonth] = useState<number | "">(() => {
    const q = searchParams.get("month");
    return q ? Number(q) : "";
  });

  const [day, setDay] = useState<number | "">(() => {
    const q = searchParams.get("day");
    return q ? Number(q) : "";
  });

  /* ===================== DATA STATE ===================== */
  const [data, setData] = useState<OrderStatusStatistic | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===================== SYNC QUERY PARAM ===================== */
  useEffect(() => {
    const q: Record<string, string> = {};
    if (year !== null) q.year = String(year);
    if (month) q.month = String(month);
    if (day) q.day = String(day);

    setSearchParams(q, { replace: true });
  }, [year, month, day, setSearchParams]);

  /* ===================== FETCH API ===================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await StatisticService.getOrderStatusByTime({
          year: year ?? undefined,
          month: month || undefined,
          day: day || undefined
        });

        // 🔥 NORMALIZE RESPONSE (FIX CRASH)
        setData({
          availableYears: Array.isArray(res.availableYears)
            ? res.availableYears
            : [],
          selectedYear: res.selectedYear ?? null,
          selectedMonth: res.selectedMonth ?? null,
          selectedDay: res.selectedDay ?? null,
          totalOrders: res.totalOrders ?? 0,
          completedOrders: res.completedOrders ?? 0,
          cancelledOrders: res.cancelledOrders ?? 0
        });
      } catch (e) {
        console.error(e);
        alert("Không tải được thống kê trạng thái đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, day]);

  /* ===================== SAFE YEARS ===================== */
  const availableYears = useMemo(
    () => (data?.availableYears ? data.availableYears : []),
    [data]
  );

  /* ===================== CHART ===================== */
  useEffect(() => {
    if (!chartRef.current || !data) return;

    chartInstance.current?.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Hoàn thành", "Đã hủy"],
        datasets: [
          {
            data: [data.completedOrders, data.cancelledOrders],
            backgroundColor: ["#22c55e", "#ef4444"],
            borderRadius: 8,
            maxBarThickness: 60
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Tình trạng đơn hàng"
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [data]);

  /* ===================== RENDER ===================== */
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Thống kê trạng thái đơn hàng</h1>

      {/* ===== FILTER ===== */}
      <div className={styles.filters}>
        {/* YEAR */}
        <select
          value={year === null ? "" : year}
          onChange={e => {
            const v = e.target.value;
            setYear(v === "" ? null : Number(v));
            setMonth("");
            setDay("");
          }}
        >
          <option value="">-- Năm --</option>
          {availableYears.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* MONTH */}
        <select
          value={month}
          disabled={year === null}
          onChange={e => setMonth(Number(e.target.value) || "")}
        >
          <option value="">-- Tất cả tháng --</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        {/* DAY */}
        <select
          value={day}
          disabled={!month}
          onChange={e => setDay(Number(e.target.value) || "")}
        >
          <option value="">-- Tất cả ngày --</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Ngày {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* ===== SUMMARY ===== */}
      <div className={styles.stats}>
        <div>Tổng đơn: {data?.totalOrders ?? 0}</div>
        <div>Hoàn thành: {data?.completedOrders ?? 0}</div>
        <div>Đã hủy: {data?.cancelledOrders ?? 0}</div>
      </div>

      {/* ===== CHART ===== */}
      <div className={styles.chartBox}>
        {loading ? <p>Đang tải...</p> : <canvas ref={chartRef} />}
      </div>
    </main>
  );
};

export default OrderStatusByTime;
