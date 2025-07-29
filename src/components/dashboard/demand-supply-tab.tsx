import { ArrowUp, ArrowDown } from "lucide-react";
import LineChart from "@/components/charts/line-chart";
import BarChart from "@/components/charts/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { KpiInfoButton } from "@/components/ui/kpi-info-button";

interface DemandSupplyTabProps {
  timeRange: string;
}

export default function DemandSupplyTab({ timeRange }: DemandSupplyTabProps) {
  const { valueMap, kpiMeta } = useDashboardData("demand-supply", timeRange);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Order Fill Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Order Fill Rate
            <KpiInfoButton 
              description={kpiMeta.orderFillRate?.description || "Percentage of customer orders fulfilled on time."}
              unit={kpiMeta.orderFillRate?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold fulfillment-green">
              {valueMap.orderFillRate !== undefined ? `${valueMap.orderFillRate.toFixed(1)}%` : "--"}
            </span>
            <ArrowUp className="w-4 h-4 fulfillment-green" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            <LineChart
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [{
                  label: "Fill Rate %",
                  data: [91.2, 93.8, 94.2, 94.2],
                  borderColor: "#10B981",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  tension: 0.4,
                }],
              }}
              options={{
                scales: { y: { beginAtZero: false, min: 85 } },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stock-Out Instances */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Stock-Out Instances per SKU
            <KpiInfoButton 
              description={kpiMeta.stockOutInstancesPerSku?.description || "Number of times products are unavailable per SKU per region."}
              unit={kpiMeta.stockOutInstancesPerSku?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-600">
              {valueMap.stockOutInstancesPerSku ?? "--"}
            </span>
            <ArrowDown className="w-4 h-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            <BarChart
              data={{
                labels: ["Milk", "Butter", "Cheese", "Yogurt", "Ice Cream"],
                datasets: [{
                  data: [5, 8, 3, 4, 3],
                  backgroundColor: "#EF4444",
                }],
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backorder Volume */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Backorder Volume
            <KpiInfoButton 
              description={kpiMeta.backorderVolume?.description || "Units pending fulfillment."}
              unit={kpiMeta.backorderVolume?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-slate-700">
              {valueMap.backorderVolume !== undefined ? `₹${valueMap.backorderVolume.toLocaleString()}M` : "--"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            <LineChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{
                  label: "Backorder Value",
                  data: [1.8, 2.1, 2.4, 1.9, 2.2, 2.4],
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderColor: "#3B82F6",
                  fill: true,
                }],
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Forecast Accuracy */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Forecast Accuracy
            <KpiInfoButton 
              description={kpiMeta.forecastAccuracy?.description || "Weekly forecast accuracy versus actual sales."}
              unit={kpiMeta.forecastAccuracy?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold fulfillment-green">
              {valueMap.forecastAccuracy !== undefined ? `${valueMap.forecastAccuracy.toFixed(1)}%` : "--"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Current</span>
              <span className="text-sm font-medium">87.3%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-fulfillment-green h-2 rounded-full" style={{ width: "87.3%" }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Target: 85%</span>
              <span>Excellent: 90%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales vs Production Variance */}
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Sales vs Planned Production Variance
            <KpiInfoButton 
              description={kpiMeta.skuWiseSalesVsPlannedProductionVariance?.description || "Variance between sales and planned production per SKU."}
              unit={kpiMeta.skuWiseSalesVsPlannedProductionVariance?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-slate-700">
              {valueMap.skuWiseSalesVsPlannedProductionVariance !== undefined ? `${valueMap.skuWiseSalesVsPlannedProductionVariance.toLocaleString()}%` : "--"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            <BarChart
              data={{
                labels: ["Planned", "Material Cost", "Labor Variance", "Overhead", "Quality Issues", "Actual"],
                datasets: [{
                  data: [15.2, -1.8, -0.5, -0.3, -0.8, 11.8],
                  backgroundColor: (context: any) => context.parsed.y >= 0 ? "#10B981" : "#EF4444",
                }],
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
