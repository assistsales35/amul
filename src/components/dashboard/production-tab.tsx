import { ArrowUp } from "lucide-react";
import BarChart from "@/components/charts/bar-chart";
import GaugeChart from "@/components/charts/gauge-chart";
import DonutChart from "@/components/charts/donut-chart";
import LineChart from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { KpiInfoButton } from "@/components/ui/kpi-info-button";
import { useState } from "react";
import { DashboardFilters } from "./dashboard-filters";

interface ProductionTabProps {
  timeRange: string;
}

const REGIONS = [
  { label: "All Regions", value: "all" },
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" }
];

export default function ProductionTab({ timeRange }: ProductionTabProps) {
  const [region, setRegion] = useState("all");
  const [timeRangeFilter, setTimeRangeFilter] = useState("last-30-days");
  const [productCategory, setProductCategory] = useState("all");
  const [channel, setChannel] = useState("all");

  // Generate mock data based on filters
  function getMockData(region: string, timeRange: string, productCategory: string, channel: string) {
    // Base values
    let plantUtilization = 87.5;
    let productionCycleTime = 4.2;
    let inventoryTurnover = 6.8;
    let finishedGoodsInventory = 8.5;
    let scrapWastageRate = 2.8;

    // Region adjustments
    switch (region) {
      case "north":
        plantUtilization = 85.2;
        productionCycleTime = 4.8;
        inventoryTurnover = 6.2;
        finishedGoodsInventory = 9.8;
        scrapWastageRate = 3.2;
        break;
      case "south":
        plantUtilization = 92.1;
        productionCycleTime = 3.6;
        inventoryTurnover = 7.5;
        finishedGoodsInventory = 6.2;
        scrapWastageRate = 2.1;
        break;
      case "east":
        plantUtilization = 79.8;
        productionCycleTime = 5.4;
        inventoryTurnover = 5.8;
        finishedGoodsInventory = 11.5;
        scrapWastageRate = 4.1;
        break;
      case "west":
        plantUtilization = 88.7;
        productionCycleTime = 4.1;
        inventoryTurnover = 6.9;
        finishedGoodsInventory = 8.1;
        scrapWastageRate = 2.9;
        break;
    }

    // Time range adjustments
    switch (timeRange) {
      case "last-7-days":
        plantUtilization -= 2.1;
        productionCycleTime += 0.3;
        inventoryTurnover -= 0.4;
        finishedGoodsInventory += 0.8;
        scrapWastageRate += 0.5;
        break;
      case "this-month":
        plantUtilization += 1.2;
        productionCycleTime -= 0.2;
        inventoryTurnover += 0.3;
        finishedGoodsInventory -= 0.4;
        scrapWastageRate -= 0.3;
        break;
      case "this-year":
        plantUtilization += 3.5;
        productionCycleTime -= 0.8;
        inventoryTurnover += 1.2;
        finishedGoodsInventory -= 1.8;
        scrapWastageRate -= 0.9;
        break;
    }

    // Product category adjustments
    if (productCategory !== "all") {
      switch (productCategory) {
        case "milk":
          plantUtilization += 2.8;
          productionCycleTime -= 0.6;
          inventoryTurnover += 1.1;
          finishedGoodsInventory -= 1.2;
          scrapWastageRate -= 0.8;
          break;
        case "butter":
          plantUtilization -= 1.2;
          productionCycleTime += 0.4;
          inventoryTurnover -= 0.7;
          finishedGoodsInventory += 0.9;
          scrapWastageRate += 0.6;
          break;
        case "cheese":
          plantUtilization += 1.5;
          productionCycleTime -= 0.3;
          inventoryTurnover += 0.8;
          finishedGoodsInventory -= 0.7;
          scrapWastageRate -= 0.4;
          break;
        case "yogurt":
          plantUtilization -= 2.1;
          productionCycleTime += 0.8;
          inventoryTurnover -= 1.2;
          finishedGoodsInventory += 1.5;
          scrapWastageRate += 1.1;
          break;
        case "ice-cream":
          plantUtilization += 0.9;
          productionCycleTime -= 0.2;
          inventoryTurnover += 0.5;
          finishedGoodsInventory -= 0.4;
          scrapWastageRate -= 0.2;
          break;
      }
    }

    // Channel adjustments
    switch (channel) {
      case "retail":
        plantUtilization += 1.8;
        productionCycleTime -= 0.4;
        inventoryTurnover += 0.9;
        finishedGoodsInventory -= 0.8;
        scrapWastageRate -= 0.5;
        break;
      case "wholesale":
        plantUtilization -= 0.6;
        productionCycleTime += 0.3;
        inventoryTurnover -= 0.4;
        finishedGoodsInventory += 0.6;
        scrapWastageRate += 0.3;
        break;
      case "online":
        plantUtilization -= 3.2;
        productionCycleTime += 1.1;
        inventoryTurnover -= 1.8;
        finishedGoodsInventory += 2.4;
        scrapWastageRate += 1.5;
        break;
    }

    return {
      plantUtilization: Math.max(70, Math.min(95, plantUtilization)),
      productionCycleTime: Math.max(2.5, Math.min(7, productionCycleTime)),
      inventoryTurnover: Math.max(4, Math.min(10, inventoryTurnover)),
      finishedGoodsInventory: Math.max(3, Math.min(15, finishedGoodsInventory)),
      scrapWastageRate: Math.max(1, Math.min(6, scrapWastageRate)),
    };
  }

  // Generate mock chart data based on filters
  function getChartData(region: string, timeRange: string, productCategory: string, channel: string) {
    // Base chart data
    let cycleTimeData = [4.2, 4.1, 4.3, 4.0];
    let inventoryTrend = [6.8, 7.2, 6.5, 7.1, 6.9, 7.3, 6.7, 7.0, 6.8, 7.4, 6.6, 7.2, 6.9, 7.1, 6.8, 7.3, 6.7, 7.0, 6.9, 7.2, 6.6, 7.1, 6.8, 7.3, 6.7, 7.0, 6.9, 7.2, 6.8, 7.1];
    let finishedGoodsData = [8.5, 7.2, 6.8, 9.1, 4.8, 8.5];

    // Region adjustments for chart data
    switch (region) {
      case "north":
        cycleTimeData = [4.8, 4.7, 4.9, 4.6];
        inventoryTrend = [6.2, 6.8, 5.9, 6.5, 6.3, 6.9, 6.1, 6.7, 6.4, 7.0, 6.2, 6.8, 6.5, 7.1, 6.3, 6.9, 6.6, 7.2, 6.4, 7.0, 6.7, 7.3, 6.5, 7.1, 6.8, 7.4, 6.6, 7.2, 6.9, 7.3];
        finishedGoodsData = [9.8, 8.5, 8.1, 10.4, 6.1, 9.8];
        break;
      case "south":
        cycleTimeData = [3.6, 3.5, 3.7, 3.4];
        inventoryTrend = [7.5, 8.1, 7.2, 7.8, 7.6, 8.2, 7.4, 8.0, 7.7, 8.3, 7.5, 8.1, 7.8, 8.4, 7.6, 8.2, 7.9, 8.5, 7.7, 8.3, 8.0, 8.6, 7.8, 8.4, 8.1, 8.7, 7.9, 8.5, 8.2, 8.6];
        finishedGoodsData = [6.2, 4.9, 4.5, 6.8, 2.5, 6.2];
        break;
      case "east":
        cycleTimeData = [5.4, 5.3, 5.5, 5.2];
        inventoryTrend = [5.8, 6.4, 5.5, 6.1, 5.9, 6.5, 5.7, 6.3, 6.0, 6.6, 5.8, 6.4, 6.1, 6.7, 5.9, 6.5, 6.2, 6.8, 6.0, 6.6, 6.3, 6.9, 6.1, 6.7, 6.4, 7.0, 6.2, 6.8, 6.5, 6.9];
        finishedGoodsData = [11.5, 10.2, 9.8, 12.1, 7.8, 11.5];
        break;
      case "west":
        cycleTimeData = [4.1, 4.0, 4.2, 3.9];
        inventoryTrend = [6.9, 7.5, 6.6, 7.2, 7.0, 7.6, 6.8, 7.4, 7.1, 7.7, 6.9, 7.5, 7.2, 7.8, 7.0, 7.6, 7.3, 7.9, 7.1, 7.7, 7.4, 8.0, 7.2, 7.8, 7.5, 8.1, 7.3, 7.9, 7.6, 8.0];
        finishedGoodsData = [8.1, 6.8, 6.4, 8.7, 4.4, 8.1];
        break;
    }

    // Time range adjustments
    switch (timeRange) {
      case "last-7-days":
        cycleTimeData = cycleTimeData.map(v => v + 0.3);
        inventoryTrend = inventoryTrend.map(v => v - 0.4);
        finishedGoodsData = finishedGoodsData.map(v => v + 0.8);
        break;
      case "this-month":
        cycleTimeData = cycleTimeData.map(v => v - 0.2);
        inventoryTrend = inventoryTrend.map(v => v + 0.3);
        finishedGoodsData = finishedGoodsData.map(v => v - 0.4);
        break;
      case "this-year":
        cycleTimeData = cycleTimeData.map(v => v - 0.8);
        inventoryTrend = inventoryTrend.map(v => v + 1.2);
        finishedGoodsData = finishedGoodsData.map(v => v - 1.8);
        break;
    }

    // Product category adjustments
    if (productCategory !== "all") {
      switch (productCategory) {
        case "milk":
          cycleTimeData = cycleTimeData.map(v => v - 0.6);
          inventoryTrend = inventoryTrend.map(v => v + 1.1);
          finishedGoodsData = finishedGoodsData.map(v => v - 1.2);
          break;
        case "butter":
          cycleTimeData = cycleTimeData.map(v => v + 0.4);
          inventoryTrend = inventoryTrend.map(v => v - 0.7);
          finishedGoodsData = finishedGoodsData.map(v => v + 0.9);
          break;
        case "cheese":
          cycleTimeData = cycleTimeData.map(v => v - 0.3);
          inventoryTrend = inventoryTrend.map(v => v + 0.8);
          finishedGoodsData = finishedGoodsData.map(v => v - 0.7);
          break;
        case "yogurt":
          cycleTimeData = cycleTimeData.map(v => v + 0.8);
          inventoryTrend = inventoryTrend.map(v => v - 1.2);
          finishedGoodsData = finishedGoodsData.map(v => v + 1.5);
          break;
        case "ice-cream":
          cycleTimeData = cycleTimeData.map(v => v - 0.2);
          inventoryTrend = inventoryTrend.map(v => v + 0.5);
          finishedGoodsData = finishedGoodsData.map(v => v - 0.4);
          break;
      }
    }

    // Channel adjustments
    switch (channel) {
      case "retail":
        cycleTimeData = cycleTimeData.map(v => v - 0.4);
        inventoryTrend = inventoryTrend.map(v => v + 0.9);
        finishedGoodsData = finishedGoodsData.map(v => v - 0.8);
        break;
      case "wholesale":
        cycleTimeData = cycleTimeData.map(v => v + 0.3);
        inventoryTrend = inventoryTrend.map(v => v - 0.4);
        finishedGoodsData = finishedGoodsData.map(v => v + 0.6);
        break;
      case "online":
        cycleTimeData = cycleTimeData.map(v => v + 1.1);
        inventoryTrend = inventoryTrend.map(v => v - 1.8);
        finishedGoodsData = finishedGoodsData.map(v => v + 2.4);
        break;
    }

    // Ensure values stay within reasonable bounds
    cycleTimeData = cycleTimeData.map(v => Math.max(2.5, Math.min(7, v)));
    inventoryTrend = inventoryTrend.map(v => Math.max(4, Math.min(10, v)));
    finishedGoodsData = finishedGoodsData.map(v => Math.max(3, Math.min(15, v)));

    return {
      cycleTimeData,
      inventoryTrend,
      finishedGoodsData,
    };
  }

  const valueMap = getMockData(region, timeRangeFilter, productCategory, channel);
  const chartData = getChartData(region, timeRangeFilter, productCategory, channel);
  const { kpiMeta } = useDashboardData("production", timeRange);

  return (
    <div>
      <DashboardFilters
        filters={{ region: true, timeRange: true, productCategory: true, channel: true }}
        initialValues={{ region, timeRange: timeRangeFilter, productCategory, channel }}
        onApply={({ region, timeRange, productCategory, channel }) => {
          setRegion(region);
          setTimeRangeFilter(timeRange);
          setProductCategory(productCategory);
          setChannel(channel);
        }}
      />
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
                {valueMap.plantUtilization !== undefined ? `${valueMap.plantUtilization.toFixed(2)}%` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container flex items-center justify-center">
              <GaugeChart 
                key={`gauge-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                value={valueMap.plantUtilization !== undefined ? Number(valueMap.plantUtilization.toFixed(2)) : 0} 
                color="#3B82F6" 
              />
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
                key={`barcycle-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                data={{
                  labels: ["Plant A", "Plant B", "Plant C", "Plant D"],
                  datasets: [{
                    data: chartData.cycleTimeData,
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
                {valueMap.inventoryTurnover !== undefined ? `${valueMap.inventoryTurnover.toFixed(1)}x` : "--"}
              </span>
              <ArrowUp className="w-4 h-4 efficiency-blue" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <LineChart
                key={`lineinv-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                data={{
                  labels: Array.from({ length: 30 }, (_, i) => i + 1),
                  datasets: [{
                    data: chartData.inventoryTrend,
                    borderColor: "#3B82F6",
                    borderWidth: 2,
                    pointRadius: 1,
                    pointBackgroundColor: "#3B82F6",
                    fill: false,
                    tension: 0.4,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: { 
                      display: true,
                      title: { display: true, text: "Day" },
                      grid: { display: false }
                    },
                    y: { 
                      display: true,
                      title: { display: true, text: "Turnover Ratio (x)" },
                      grid: { display: false }
                    },
                  },
                  elements: {
                    point: {
                      hoverRadius: 3,
                    },
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
                {valueMap.finishedGoodsInventory !== undefined ? `${valueMap.finishedGoodsInventory.toLocaleString()}L` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <BarChart
                key={`barfg-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                data={{
                  labels: ["Milk", "Butter", "Cheese", "Yogurt", "Ice Cream", "Powder"],
                  datasets: [{
                    data: chartData.finishedGoodsData,
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
                key={`donut-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
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
    </div>
  );
}
