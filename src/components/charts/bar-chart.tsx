import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";

Chart.register(...registerables);

interface BarChartProps {
  data: ChartConfiguration<"bar">["data"];
  options?: ChartConfiguration<"bar">["options"];
}

export default function BarChart({ data, options = {} }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const defaultOptions: ChartConfiguration<"bar">["options"] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { color: "#f1f5f9" },
        },
      },
      ...options,
    };

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data,
      options: defaultOptions,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={canvasRef} />;
}
