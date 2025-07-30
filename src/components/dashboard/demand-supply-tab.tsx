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
    // Just for demo: change numbers based on filter values
    let base = 90;
    if (region === "north") base -= 2;
    if (region === "south") base += 3;
    if (region === "east") base -= 1;
    if (region === "west") base += 1;
    if (productCategory !== "all") base += 0.5;
    if (channel === "online") base -= 1.5;
    if (timeRange === "last-7-days") base -= 0.5;
    if (timeRange === "this-year") base += 1.2;
    return {
      orderFillRate: base + 4.2,
      stockOutInstancesPerSku: Math.max(2, 10 - Math.floor(base / 10)),
      backorderVolume: Math.max(1.2, 3.5 - (base - 90) * 0.2),
      forecastAccuracy: base - 1.5,
      skuWiseSalesVsPlannedProductionVariance: Math.round((base - 90) * 2.5 + 12),
    };
  }

  // Generate mock chart data based on filters
  function getChartData(region: string, timeRange: string, productCategory: string, channel: string) {
    // Use the same base as getMockData for consistency
    let base = 90;
    if (region === "north") base -= 2;
    if (region === "south") base += 3;
    if (region === "east") base -= 1;
    if (region === "west") base += 1;
    if (productCategory !== "all") base += 0.5;
    if (channel === "online") base -= 1.5;
    if (timeRange === "last-7-days") base -= 0.5;
    if (timeRange === "this-year") base += 1.2;
    // Generate some mock chart data arrays
    return {
      fillRate: [base + 1, base + 2, base + 3, base + 4.2],
      stockOut: [5, 8, 3, 4, 3].map((v, i) => Math.max(1, v + Math.round((base - 90) / 2) + i)),
      backorder: [1.8, 2.1, 2.4, 1.9, 2.2, 2.4].map(v => v + (base - 90) * 0.05),
      salesVsProd: [15.2, -1.8, -0.5, -0.3, -0.8, 11.8].map(v => v + (base - 90) * 0.2),
      forecast: base - 1.5,
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
