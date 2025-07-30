import { ArrowUp, ArrowDown } from "lucide-react";
import LineChart from "@/components/charts/line-chart";
import BarChart from "@/components/charts/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { KpiInfoButton } from "@/components/ui/kpi-info-button";
import { useState } from "react";
import { DashboardFilters } from "./dashboard-filters";

interface DemandSupplyTabProps {
  timeRange: string;
}

const REGIONS = [
  { label: "All Regions", value: "all" },
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" }
];

// Additional filters for the tile
const TIME_RANGES = [
  { label: "Last 7 Days", value: "last-7-days" },
  { label: "Last 30 Days", value: "last-30-days" },
  { label: "This Month", value: "this-month" },
  { label: "This Year", value: "this-year" }
];

const PRODUCT_CATEGORIES = [
  { label: "All Categories", value: "all" },
  { label: "Milk", value: "milk" },
  { label: "Butter", value: "butter" },
  { label: "Cheese", value: "cheese" },
  { label: "Yogurt", value: "yogurt" },
  { label: "Ice Cream", value: "ice-cream" }
];

const CHANNELS = [
  { label: "All Channels", value: "all" },
  { label: "Retail", value: "retail" },
  { label: "Wholesale", value: "wholesale" },
  { label: "Online", value: "online" }
];

export default function DemandSupplyTab({ timeRange }: DemandSupplyTabProps) {
  // Pending filter states (for dropdowns)
  const [pendingRegion, setPendingRegion] = useState("all");
  const [pendingTimeRange, setPendingTimeRange] = useState("last-30-days");
  const [pendingProductCategory, setPendingProductCategory] = useState("all");
  const [pendingChannel, setPendingChannel] = useState("all");

  // Active filter states (for data)
  const [region, setRegion] = useState("all");
  const [timeRangeFilter, setTimeRangeFilter] = useState("last-30-days");
  const [productCategory, setProductCategory] = useState("all");
  const [channel, setChannel] = useState("all");

  // Generate mock data based on filters
  function getMockData(region: string, timeRange: string, productCategory: string, channel: string) {
    // Base values
    let orderFillRate = 94.2;
    let stockOutInstances = 3.2;
    let backorderVolume = 2.1;
    let forecastAccuracy = 88.5;
    let salesVsProduction = 12.5;

    // Region adjustments
    switch (region) {
      case "north":
        orderFillRate = 91.8;
        stockOutInstances = 4.1;
        backorderVolume = 2.8;
        forecastAccuracy = 85.2;
        salesVsProduction = 15.3;
        break;
      case "south":
        orderFillRate = 96.7;
        stockOutInstances = 2.1;
        backorderVolume = 1.4;
        forecastAccuracy = 92.1;
        salesVsProduction = 8.9;
        break;
      case "east":
        orderFillRate = 89.5;
        stockOutInstances = 5.3;
        backorderVolume = 3.2;
        forecastAccuracy = 82.7;
        salesVsProduction = 18.7;
        break;
      case "west":
        orderFillRate = 93.1;
        stockOutInstances = 3.8;
        backorderVolume = 2.5;
        forecastAccuracy = 87.9;
        salesVsProduction = 13.4;
        break;
    }

    // Time range adjustments
    switch (timeRange) {
      case "last-7-days":
        orderFillRate -= 1.2;
        stockOutInstances += 0.8;
        backorderVolume += 0.3;
        forecastAccuracy -= 2.1;
        salesVsProduction += 1.5;
        break;
      case "this-month":
        orderFillRate += 0.5;
        stockOutInstances -= 0.3;
        backorderVolume -= 0.2;
        forecastAccuracy += 1.2;
        salesVsProduction -= 0.8;
        break;
      case "this-year":
        orderFillRate += 1.8;
        stockOutInstances -= 1.2;
        backorderVolume -= 0.8;
        forecastAccuracy += 3.5;
        salesVsProduction -= 2.1;
        break;
    }

    // Product category adjustments
    if (productCategory !== "all") {
      switch (productCategory) {
        case "milk":
          orderFillRate += 2.1;
          stockOutInstances -= 1.5;
          backorderVolume -= 0.8;
          forecastAccuracy += 1.8;
          salesVsProduction -= 1.2;
          break;
        case "butter":
          orderFillRate -= 0.8;
          stockOutInstances += 0.9;
          backorderVolume += 0.4;
          forecastAccuracy -= 0.7;
          salesVsProduction += 0.8;
          break;
        case "cheese":
          orderFillRate += 1.2;
          stockOutInstances -= 0.6;
          backorderVolume -= 0.3;
          forecastAccuracy += 1.1;
          salesVsProduction -= 0.5;
          break;
        case "yogurt":
          orderFillRate -= 1.5;
          stockOutInstances += 1.2;
          backorderVolume += 0.7;
          forecastAccuracy -= 1.3;
          salesVsProduction += 1.1;
          break;
        case "ice-cream":
          orderFillRate += 0.9;
          stockOutInstances -= 0.4;
          backorderVolume -= 0.2;
          forecastAccuracy += 0.8;
          salesVsProduction -= 0.3;
          break;
      }
    }

    // Channel adjustments
    switch (channel) {
      case "retail":
        orderFillRate += 1.3;
        stockOutInstances -= 0.8;
        backorderVolume -= 0.4;
        forecastAccuracy += 1.5;
        salesVsProduction -= 0.9;
        break;
      case "wholesale":
        orderFillRate -= 0.7;
        stockOutInstances += 0.5;
        backorderVolume += 0.3;
        forecastAccuracy -= 0.8;
        salesVsProduction += 0.6;
        break;
      case "online":
        orderFillRate -= 2.1;
        stockOutInstances += 1.8;
        backorderVolume += 1.2;
        forecastAccuracy -= 2.5;
        salesVsProduction += 2.3;
        break;
    }

    return {
      orderFillRate: Math.max(75, Math.min(99, orderFillRate)),
      stockOutInstancesPerSku: Math.max(0.5, Math.min(8, stockOutInstances)),
      backorderVolume: Math.max(0.5, Math.min(5, backorderVolume)),
      forecastAccuracy: Math.max(75, Math.min(95, forecastAccuracy)),
      skuWiseSalesVsPlannedProductionVariance: Math.round(salesVsProduction),
    };
  }

  // Generate mock chart data based on filters
  function getChartData(region: string, timeRange: string, productCategory: string, channel: string) {
    // Base chart data
    let fillRate = [94.2, 94.8, 95.1, 95.5];
    let stockOut = [3.2, 2.8, 3.1, 2.9, 3.0];
    let backorder = [2.1, 2.3, 2.0, 2.2, 2.1, 2.0];
    let salesVsProd = [12.5, -1.2, -0.8, -0.5, -1.1, 11.8];
    let forecast = 88.5;

    // Region adjustments for chart data
    switch (region) {
      case "north":
        fillRate = [91.8, 92.1, 91.5, 91.9];
        stockOut = [4.1, 3.8, 4.3, 4.0, 4.2];
        backorder = [2.8, 3.0, 2.7, 2.9, 2.8, 2.7];
        salesVsProd = [15.3, -0.8, -0.4, -0.2, -0.7, 14.2];
        forecast = 85.2;
        break;
      case "south":
        fillRate = [96.7, 97.1, 96.8, 97.2];
        stockOut = [2.1, 1.8, 2.3, 2.0, 2.2];
        backorder = [1.4, 1.6, 1.3, 1.5, 1.4, 1.3];
        salesVsProd = [8.9, -1.8, -1.2, -0.8, -1.5, 7.8];
        forecast = 92.1;
        break;
      case "east":
        fillRate = [89.5, 89.8, 89.2, 89.6];
        stockOut = [5.3, 5.0, 5.5, 5.2, 5.4];
        backorder = [3.2, 3.4, 3.1, 3.3, 3.2, 3.1];
        salesVsProd = [18.7, -0.2, 0.2, 0.6, 0.1, 17.6];
        forecast = 82.7;
        break;
      case "west":
        fillRate = [93.1, 93.5, 92.9, 93.3];
        stockOut = [3.8, 3.5, 4.0, 3.7, 3.9];
        backorder = [2.5, 2.7, 2.4, 2.6, 2.5, 2.4];
        salesVsProd = [13.4, -1.0, -0.6, -0.3, -0.9, 12.3];
        forecast = 87.9;
        break;
    }

    // Time range adjustments
    switch (timeRange) {
      case "last-7-days":
        fillRate = fillRate.map(v => v - 1.2);
        stockOut = stockOut.map(v => v + 0.8);
        backorder = backorder.map(v => v + 0.3);
        forecast -= 2.1;
        salesVsProd = salesVsProd.map(v => v + 1.5);
        break;
      case "this-month":
        fillRate = fillRate.map(v => v + 0.5);
        stockOut = stockOut.map(v => v - 0.3);
        backorder = backorder.map(v => v - 0.2);
        forecast += 1.2;
        salesVsProd = salesVsProd.map(v => v - 0.8);
        break;
      case "this-year":
        fillRate = fillRate.map(v => v + 1.8);
        stockOut = stockOut.map(v => v - 1.2);
        backorder = backorder.map(v => v - 0.8);
        forecast += 3.5;
        salesVsProd = salesVsProd.map(v => v - 2.1);
        break;
    }

    // Product category adjustments
    if (productCategory !== "all") {
      switch (productCategory) {
        case "milk":
          fillRate = fillRate.map(v => v + 2.1);
          stockOut = stockOut.map(v => v - 1.5);
          backorder = backorder.map(v => v - 0.8);
          forecast += 1.8;
          salesVsProd = salesVsProd.map(v => v - 1.2);
          break;
        case "butter":
          fillRate = fillRate.map(v => v - 0.8);
          stockOut = stockOut.map(v => v + 0.9);
          backorder = backorder.map(v => v + 0.4);
          forecast -= 0.7;
          salesVsProd = salesVsProd.map(v => v + 0.8);
          break;
        case "cheese":
          fillRate = fillRate.map(v => v + 1.2);
          stockOut = stockOut.map(v => v - 0.6);
          backorder = backorder.map(v => v - 0.3);
          forecast += 1.1;
          salesVsProd = salesVsProd.map(v => v - 0.5);
          break;
        case "yogurt":
          fillRate = fillRate.map(v => v - 1.5);
          stockOut = stockOut.map(v => v + 1.2);
          backorder = backorder.map(v => v + 0.7);
          forecast -= 1.3;
          salesVsProd = salesVsProd.map(v => v + 1.1);
          break;
        case "ice-cream":
          fillRate = fillRate.map(v => v + 0.9);
          stockOut = stockOut.map(v => v - 0.4);
          backorder = backorder.map(v => v - 0.2);
          forecast += 0.8;
          salesVsProd = salesVsProd.map(v => v - 0.3);
          break;
      }
    }

    // Channel adjustments
    switch (channel) {
      case "retail":
        fillRate = fillRate.map(v => v + 1.3);
        stockOut = stockOut.map(v => v - 0.8);
        backorder = backorder.map(v => v - 0.4);
        forecast += 1.5;
        salesVsProd = salesVsProd.map(v => v - 0.9);
        break;
      case "wholesale":
        fillRate = fillRate.map(v => v - 0.7);
        stockOut = stockOut.map(v => v + 0.5);
        backorder = backorder.map(v => v + 0.3);
        forecast -= 0.8;
        salesVsProd = salesVsProd.map(v => v + 0.6);
        break;
      case "online":
        fillRate = fillRate.map(v => v - 2.1);
        stockOut = stockOut.map(v => v + 1.8);
        backorder = backorder.map(v => v + 1.2);
        forecast -= 2.5;
        salesVsProd = salesVsProd.map(v => v + 2.3);
        break;
    }

    // Ensure values stay within reasonable bounds
    fillRate = fillRate.map(v => Math.max(75, Math.min(99, v)));
    stockOut = stockOut.map(v => Math.max(0.5, Math.min(8, v)));
    backorder = backorder.map(v => Math.max(0.5, Math.min(5, v)));
    forecast = Math.max(75, Math.min(95, forecast));

    return {
      fillRate,
      stockOut,
      backorder,
      salesVsProd,
      forecast,
    };
  }

  const valueMap = getMockData(region, timeRangeFilter, productCategory, channel);
  const chartData = getChartData(region, timeRangeFilter, productCategory, channel);
  const { kpiMeta } = useDashboardData("demand-supply", timeRange);

  // Handler for Apply Filters
  function handleApplyFilters() {
    setRegion(pendingRegion);
    setTimeRangeFilter(pendingTimeRange);
    setProductCategory(pendingProductCategory);
    setChannel(pendingChannel);
  }

  return (
    <div>
      <DashboardFilters
        filters={{ region: true, timeRange: true, productCategory: true, channel: true }}
        initialValues={{
          region: pendingRegion,
          timeRange: pendingTimeRange,
          productCategory: pendingProductCategory,
          channel: pendingChannel,
        }}
        onApply={({ region, timeRange, productCategory, channel }) => {
          setPendingRegion(region);
          setPendingTimeRange(timeRange);
          setPendingProductCategory(productCategory);
          setPendingChannel(channel);
          setRegion(region);
          setTimeRangeFilter(timeRange);
          setProductCategory(productCategory);
          setChannel(channel);
        }}
      />
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
                    data: chartData.fillRate,
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
                {valueMap.stockOutInstancesPerSku !== undefined ? valueMap.stockOutInstancesPerSku.toFixed(2) : "--"}
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
                    data: chartData.stockOut,
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
                    data: chartData.backorder,
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
                <span className="text-sm font-medium">{chartData.forecast.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-fulfillment-green h-2 rounded-full" style={{ width: `${chartData.forecast}%` }} />
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
                {valueMap.skuWiseSalesVsPlannedProductionVariance !== undefined ? `${valueMap.skuWiseSalesVsPlannedProductionVariance.toLocaleString()}%` : null}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <BarChart
                data={{
                  labels: ["Planned", "Material Cost", "Labor Variance", "Overhead", "Quality Issues", "Actual"],
                  datasets: [{
                    data: chartData.salesVsProd,
                    backgroundColor: (context: any) => context.parsed.y >= 0 ? "#10B981" : "#EF4444",
                  }],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
