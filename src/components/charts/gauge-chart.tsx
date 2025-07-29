import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";

Chart.register(...registerables);

interface GaugeChartProps {
  value: number;
  color: string;
  maxValue?: number;
}

export default function GaugeChart({ value, color, maxValue = 100 }: GaugeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const data = {
      datasets: [
        {
          data: [value, maxValue - value],
          backgroundColor: [color, "#E2E8F0"],
          borderWidth: 0,
          cutout: "70%",
          circumference: 180,
          rotation: 270,
        },
      ],
    };

    const options: ChartConfiguration<"doughnut">["options"] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data,
      options,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [value, color, maxValue]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
    </div>
  );
}
