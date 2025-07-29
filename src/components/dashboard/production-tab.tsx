import { ArrowUp } from "lucide-react";
import BarChart from "@/components/charts/bar-chart";
import GaugeChart from "@/components/charts/gauge-chart";
import DonutChart from "@/components/charts/donut-chart";
import LineChart from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { KpiInfoButton } from "@/components/ui/kpi-info-button";

interface ProductionTabProps {
  timeRange: string;
}

export default function ProductionTab({ timeRange }: ProductionTabProps) {
  const { valueMap, kpiMeta } = useDashboardData("production", timeRange);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Plant Utilization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Plant Utilization Rate
            <KpiInfoButton 
              description={kpiMeta.plantUtilizationRate?.description || "Manufacturing plant utilization efficiency."}
              unit={kpiMeta.plantUtilizationRate?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold efficiency-blue">
              {valueMap.plantUtilizationRate !== undefined ? `${valueMap.plantUtilizationRate.toFixed(1)}%` : "--"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container flex items-center justify-center">
            <GaugeChart value={valueMap.plantUtilizationRate !== undefined ? valueMap.plantUtilizationRate : 0} color="#3B82F6" />
          </div>
        </CardContent>
      </Card>

      {/* Production Cycle Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Production Cycle Time
            <KpiInfoButton 
              description={kpiMeta.productionCycleTime?.description || "Average production cycle time per SKU."}
              unit={kpiMeta.productionCycleTime?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-slate-700">
              {valueMap.productionCycleTime !== undefined ? `${valueMap.productionCycleTime.toFixed(1)}hrs` : "--"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            <BarChart
              data={{
                labels: ["Plant A", "Plant B", "Plant C", "Plant D"],
                datasets: [{
                  data: valueMap.productionCycleTime !== undefined ? [valueMap.productionCycleTime, 3.8, 4.5, 4.1] : [0, 0, 0, 0],
                  backgroundColor: "#3B82F6",
                }],
              }}
              options={{ indexAxis: "y" as const }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Turnover */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Inventory Turnover Ratio
            <KpiInfoButton 
              description={kpiMeta.inventoryTurnoverRatio?.description || "Speed at which inventory is sold and replaced."}
              unit={kpiMeta.inventoryTurnoverRatio?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold efficiency-blue">
              {valueMap.inventoryTurnoverRatio !== undefined ? `${valueMap.inventoryTurnoverRatio.toFixed(1)}x` : "--"}
            </span>
            <ArrowUp className="w-4 h-4 efficiency-blue" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            <LineChart
              data={{
                labels: Array.from({ length: 30 }, (_, i) => i + 1),
                datasets: [{
                  data: valueMap.inventoryTurnoverRatio !== undefined ? [6.2, 6.3, 6.1, 6.4, 6.5, 6.3, 6.7, valueMap.inventoryTurnoverRatio, 6.6, 6.9, 6.7, 6.8, 7.0, 6.9, 6.8, 7.1, 6.9, 7.0, 6.8, 6.9, 7.1, 6.8, 6.9, 7.0, 6.8, 6.7, 6.9, 6.8, 6.9, 6.8] : Array.from({ length: 30 }, () => 0),
                  borderColor: "#3B82F6",
                  borderWidth: 1,
                  pointRadius: 0,
                }],
              }}
              options={{
                scales: {
                  x: { display: false },
                  y: { display: false },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Finished Goods Inventory */}
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Finished Goods Inventory
            <KpiInfoButton 
              description={kpiMeta.finishedGoodsInventoryBySku?.description || "Stock levels of finished goods per SKU."}
              unit={kpiMeta.finishedGoodsInventoryBySku?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Select defaultValue="all-skus">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-skus">All SKUs</SelectItem>
                <SelectItem value="milk">Milk Products</SelectItem>
                <SelectItem value="cheese">Cheese</SelectItem>
                <SelectItem value="butter">Butter</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-2xl font-bold text-slate-700">
              {valueMap.finishedGoodsInventoryBySku !== undefined ? `${valueMap.finishedGoodsInventoryBySku.toLocaleString()}L` : "--"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            <BarChart
              data={{
                labels: ["Milk", "Butter", "Cheese", "Yogurt", "Ice Cream", "Powder"],
                datasets: [{
                  data: valueMap.finishedGoodsInventoryBySku !== undefined ? [12.4, 8.7, 6.2, 9.1, 4.8, valueMap.finishedGoodsInventoryBySku] : [0, 0, 0, 0, 0, 0],
                  backgroundColor: "#3B82F6",
                }],
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Scrap/Wastage Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Scrap/Wastage Rate
            <KpiInfoButton 
              description={kpiMeta.scrapWastageRate?.description || "Percentage of wastage in production."}
              unit={kpiMeta.scrapWastageRate?.unit}
            />
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-600">
              {valueMap.scrapWastageRate !== undefined ? `${valueMap.scrapWastageRate.toFixed(1)}%` : "--"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container flex items-center justify-center">
            <DonutChart
              data={{
                datasets: [{
                  data: valueMap.scrapWastageRate !== undefined ? [valueMap.scrapWastageRate, 100 - valueMap.scrapWastageRate] : [0, 100],
                  backgroundColor: ["#EF4444", "#E2E8F0"],
                  borderWidth: 0,
                }],
              }}
              centerText={valueMap.scrapWastageRate !== undefined ? `${valueMap.scrapWastageRate.toFixed(1)}%` : "--"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
