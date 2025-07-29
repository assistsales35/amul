import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";

Chart.register(...registerables);

interface DonutChartProps {
  data: ChartConfiguration<"doughnut">["data"];
  options?: ChartConfiguration<"doughnut">["options"];
  centerText?: string;
}

export default function DonutChart({ data, options = {}, centerText }: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const defaultOptions: ChartConfiguration<"doughnut">["options"] = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      ...options,
    };

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data,
      options: defaultOptions,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} />
      {centerText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-red-600">{centerText}</span>
        </div>
      )}
    </div>
  );
}
