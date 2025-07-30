import LineChart from "@/components/charts/line-chart";
import BarChart from "@/components/charts/bar-chart";
import ProfessionalIndiaMap from "@/components/charts/professional-india-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiInfoButton } from "@/components/ui/kpi-info-button";
import { useState } from "react";
import { DashboardFilters } from "./dashboard-filters";

interface MarketTabProps {
  timeRange: string;
}

const REGIONS = [
  { label: "All Regions", value: "all" },
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" }
];

// Dummy meta info for KPIs
const kpiMeta = {
  lostSalesValue: { description: "Estimated revenue lost due to unavailability.", unit: "M" },
  salesReturnRate: { description: "Percentage of products returned.", unit: "%" },
  retailerServiceLevel: { description: "Retailer perception of service reliability.", unit: "/10" },
  competitorStockPresence: { description: "Percentage of competitor stock presence where Amul is out-of-stock.", unit: "%" },
  dailyDemandSpikeResponseTime: { description: "Time taken to respond to sudden demand spikes.", unit: "hrs" },
};

export default function MarketTab({ timeRange }: MarketTabProps) {
  const [region, setRegion] = useState("all");
  const [timeRangeFilter, setTimeRangeFilter] = useState("last-30-days");
  const [productCategory, setProductCategory] = useState("all");
  const [channel, setChannel] = useState("all");

  // Generate mock data based on filters
  function getMockData(region: string, timeRange: string, productCategory: string, channel: string) {
    let lostSalesValue = 12.5;
    let salesReturnRate = 1.8;
    let retailerServiceLevel = 8.3;
    let competitorStockPresence = 62.5;
    let dailyDemandSpikeResponseTime = 4.2;

    // Region adjustments
    switch (region) {
      case "north":
        lostSalesValue = 15.2;
        salesReturnRate = 2.1;
        retailerServiceLevel = 8.1;
        competitorStockPresence = 65.8;
        dailyDemandSpikeResponseTime = 4.5;
        break;
      case "south":
        lostSalesValue = 10.8;
        salesReturnRate = 1.5;
        retailerServiceLevel = 8.7;
        competitorStockPresence = 59.2;
        dailyDemandSpikeResponseTime = 3.8;
        break;
      case "east":
        lostSalesValue = 9.6;
        salesReturnRate = 2.3;
        retailerServiceLevel = 8.0;
        competitorStockPresence = 68.1;
        dailyDemandSpikeResponseTime = 4.7;
        break;
      case "west":
        lostSalesValue = 13.9;
        salesReturnRate = 1.7;
        retailerServiceLevel = 8.5;
        competitorStockPresence = 61.4;
        dailyDemandSpikeResponseTime = 4.0;
        break;
    }

    // Time range adjustments
    switch (timeRange) {
      case "last-7-days":
        lostSalesValue -= 1.2;
        salesReturnRate += 0.2;
        retailerServiceLevel -= 0.1;
        competitorStockPresence += 1.5;
        dailyDemandSpikeResponseTime += 0.3;
        break;
      case "this-month":
        lostSalesValue += 0.8;
        salesReturnRate -= 0.1;
        retailerServiceLevel += 0.2;
        competitorStockPresence -= 0.8;
        dailyDemandSpikeResponseTime -= 0.2;
        break;
      case "this-year":
        lostSalesValue += 2.5;
        salesReturnRate -= 0.3;
        retailerServiceLevel += 0.4;
        competitorStockPresence -= 2.1;
        dailyDemandSpikeResponseTime -= 0.5;
        break;
    }

    // Product category adjustments
    if (productCategory !== "all") {
      switch (productCategory) {
        case "milk":
          lostSalesValue += 1.5;
          salesReturnRate -= 0.2;
          retailerServiceLevel += 0.3;
          competitorStockPresence -= 1.2;
          dailyDemandSpikeResponseTime -= 0.2;
          break;
        case "butter":
          lostSalesValue -= 0.8;
          salesReturnRate += 0.3;
          retailerServiceLevel -= 0.2;
          competitorStockPresence += 0.9;
          dailyDemandSpikeResponseTime += 0.1;
          break;
        case "cheese":
          lostSalesValue += 0.6;
          salesReturnRate -= 0.1;
          retailerServiceLevel += 0.2;
          competitorStockPresence -= 0.7;
          dailyDemandSpikeResponseTime -= 0.1;
          break;
        case "yogurt":
          lostSalesValue -= 1.1;
          salesReturnRate += 0.4;
          retailerServiceLevel -= 0.3;
          competitorStockPresence += 1.4;
          dailyDemandSpikeResponseTime += 0.2;
          break;
        case "ice-cream":
          lostSalesValue += 0.9;
          salesReturnRate -= 0.2;
          retailerServiceLevel += 0.1;
          competitorStockPresence -= 0.5;
          dailyDemandSpikeResponseTime -= 0.1;
          break;
      }
    }

    // Channel adjustments
    switch (channel) {
      case "retail":
        lostSalesValue += 0.7;
        salesReturnRate -= 0.1;
        retailerServiceLevel += 0.2;
        competitorStockPresence -= 0.6;
        dailyDemandSpikeResponseTime -= 0.1;
        break;
      case "wholesale":
        lostSalesValue -= 0.5;
        salesReturnRate += 0.2;
        retailerServiceLevel -= 0.1;
        competitorStockPresence += 0.8;
        dailyDemandSpikeResponseTime += 0.2;
        break;
      case "online":
        lostSalesValue += 1.1;
        salesReturnRate -= 0.3;
        retailerServiceLevel += 0.3;
        competitorStockPresence -= 1.0;
        dailyDemandSpikeResponseTime -= 0.3;
        break;
    }

    return {
      lostSalesValue: Math.max(5, Math.min(25, lostSalesValue)),
      salesReturnRate: Math.max(1, Math.min(4, salesReturnRate)),
      retailerServiceLevel: Math.max(6, Math.min(10, retailerServiceLevel)),
      competitorStockPresence: Math.max(40, Math.min(80, competitorStockPresence)),
      dailyDemandSpikeResponseTime: Math.max(2, Math.min(8, dailyDemandSpikeResponseTime)),
    };
  }

  // Generate mock chart data based on filters
  function getChartData(region: string, timeRange: string, productCategory: string, channel: string) {
    // Sales Return Rate trend
    let salesReturnTrend = [2.1, 1.8, 1.9, 1.7, 1.8, 1.8];
    // Competitor Stock Presence
    let competitorStockData = [65.8, 78.2, 61.4, 58.9];
    let competitorData = [34.2, 21.8, 38.6, 41.1];
    // Demand Spike vs Response Time
    let demandSpike = [120, 135, 180, 145, 160, 190, 175, 155, 140, 165, 185, 170, 145, 175, 195, 160, 150, 185, 170, 155, 145, 165, 180, 195, 175, 160, 145, 170, 185, 155];
    let responseTime = [5.2, 4.8, 3.9, 4.6, 4.1, 3.7, 3.9, 4.3, 4.7, 4.2, 3.8, 4.0, 4.5, 3.9, 3.6, 4.3, 4.6, 3.8, 4.1, 4.4, 4.7, 4.2, 3.9, 3.5, 3.8, 4.3, 4.6, 4.0, 3.7, 4.2];

    // Region adjustments
    switch (region) {
      case "north":
        salesReturnTrend = [2.3, 2.0, 2.1, 1.9, 2.0, 2.1];
        competitorStockData = [68.1, 80.2, 64.4, 61.9];
        competitorData = [31.9, 19.8, 35.6, 38.1];
        demandSpike = demandSpike.map(v => v + 10);
        responseTime = responseTime.map(v => v + 0.2);
        break;
      case "south":
        salesReturnTrend = [1.7, 1.5, 1.6, 1.4, 1.5, 1.5];
        competitorStockData = [59.2, 72.2, 55.4, 52.9];
        competitorData = [40.8, 27.8, 44.6, 47.1];
        demandSpike = demandSpike.map(v => v - 8);
        responseTime = responseTime.map(v => v - 0.3);
        break;
      case "east":
        salesReturnTrend = [2.5, 2.2, 2.3, 2.1, 2.2, 2.3];
        competitorStockData = [71.1, 84.2, 68.4, 65.9];
        competitorData = [28.9, 15.8, 31.6, 34.1];
        demandSpike = demandSpike.map(v => v - 12);
        responseTime = responseTime.map(v => v + 0.4);
        break;
      case "west":
        salesReturnTrend = [1.9, 1.7, 1.8, 1.6, 1.7, 1.7];
        competitorStockData = [61.4, 74.2, 57.4, 54.9];
        competitorData = [38.6, 25.8, 42.6, 45.1];
        demandSpike = demandSpike.map(v => v + 5);
        responseTime = responseTime.map(v => v - 0.1);
        break;
    }

    // Time range adjustments
    switch (timeRange) {
      case "last-7-days":
        salesReturnTrend = salesReturnTrend.map(v => v + 0.2);
        competitorStockData = competitorStockData.map(v => v + 1.5);
        competitorData = competitorData.map(v => v - 1.5);
        demandSpike = demandSpike.map(v => v - 5);
        responseTime = responseTime.map(v => v + 0.1);
        break;
      case "this-month":
        salesReturnTrend = salesReturnTrend.map(v => v - 0.1);
        competitorStockData = competitorStockData.map(v => v - 0.8);
        competitorData = competitorData.map(v => v + 0.8);
        demandSpike = demandSpike.map(v => v + 3);
        responseTime = responseTime.map(v => v - 0.2);
        break;
      case "this-year":
        salesReturnTrend = salesReturnTrend.map(v => v - 0.3);
        competitorStockData = competitorStockData.map(v => v - 2.1);
        competitorData = competitorData.map(v => v + 2.1);
        demandSpike = demandSpike.map(v => v + 8);
        responseTime = responseTime.map(v => v - 0.3);
        break;
    }

    // Product category adjustments
    if (productCategory !== "all") {
      switch (productCategory) {
        case "milk":
          salesReturnTrend = salesReturnTrend.map(v => v - 0.2);
          competitorStockData = competitorStockData.map(v => v - 1.2);
          competitorData = competitorData.map(v => v + 1.2);
          demandSpike = demandSpike.map(v => v + 2);
          responseTime = responseTime.map(v => v - 0.1);
          break;
        case "butter":
          salesReturnTrend = salesReturnTrend.map(v => v + 0.3);
          competitorStockData = competitorStockData.map(v => v + 0.9);
          competitorData = competitorData.map(v => v - 0.9);
          demandSpike = demandSpike.map(v => v - 3);
          responseTime = responseTime.map(v => v + 0.2);
          break;
        case "cheese":
          salesReturnTrend = salesReturnTrend.map(v => v - 0.1);
          competitorStockData = competitorStockData.map(v => v - 0.7);
          competitorData = competitorData.map(v => v + 0.7);
          demandSpike = demandSpike.map(v => v + 1);
          responseTime = responseTime.map(v => v - 0.1);
          break;
        case "yogurt":
          salesReturnTrend = salesReturnTrend.map(v => v + 0.4);
          competitorStockData = competitorStockData.map(v => v + 1.4);
          competitorData = competitorData.map(v => v - 1.4);
          demandSpike = demandSpike.map(v => v - 2);
          responseTime = responseTime.map(v => v + 0.3);
          break;
        case "ice-cream":
          salesReturnTrend = salesReturnTrend.map(v => v - 0.2);
          competitorStockData = competitorStockData.map(v => v - 0.5);
          competitorData = competitorData.map(v => v + 0.5);
          demandSpike = demandSpike.map(v => v + 1);
          responseTime = responseTime.map(v => v - 0.1);
          break;
      }
    }

    // Channel adjustments
    switch (channel) {
      case "retail":
        salesReturnTrend = salesReturnTrend.map(v => v - 0.1);
        competitorStockData = competitorStockData.map(v => v - 0.6);
        competitorData = competitorData.map(v => v + 0.6);
        demandSpike = demandSpike.map(v => v + 2);
        responseTime = responseTime.map(v => v - 0.1);
        break;
      case "wholesale":
        salesReturnTrend = salesReturnTrend.map(v => v + 0.2);
        competitorStockData = competitorStockData.map(v => v + 0.8);
        competitorData = competitorData.map(v => v - 0.8);
        demandSpike = demandSpike.map(v => v - 1);
        responseTime = responseTime.map(v => v + 0.2);
        break;
      case "online":
        salesReturnTrend = salesReturnTrend.map(v => v - 0.3);
        competitorStockData = competitorStockData.map(v => v - 1.0);
        competitorData = competitorData.map(v => v + 1.0);
        demandSpike = demandSpike.map(v => v + 3);
        responseTime = responseTime.map(v => v - 0.2);
        break;
    }

    // Bound values
    salesReturnTrend = salesReturnTrend.map(v => Math.max(1, Math.min(4, v)));
    competitorStockData = competitorStockData.map(v => Math.max(40, Math.min(90, v)));
    competitorData = competitorData.map(v => Math.max(10, Math.min(60, v)));
    demandSpike = demandSpike.map(v => Math.max(80, Math.min(250, v)));
    responseTime = responseTime.map(v => Math.max(2, Math.min(8, v)));

    return {
      salesReturnTrend,
      competitorStockData,
      competitorData,
      demandSpike,
      responseTime,
    };
  }

  const valueMap = getMockData(region, timeRangeFilter, productCategory, channel);
  const chartData = getChartData(region, timeRangeFilter, productCategory, channel);

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
        {/* Lost Sales Value Map */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              Lost Sales Value by Region
              <KpiInfoButton 
                description={kpiMeta.lostSalesValue.description}
                unit={kpiMeta.lostSalesValue.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-red-600">
                {valueMap.lostSalesValue !== undefined ? `₹${valueMap.lostSalesValue.toLocaleString()}M` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-80">
              <ProfessionalIndiaMap />
            </div>
          </CardContent>
        </Card>

        {/* Sales Return Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              Sales Return Rate
              <KpiInfoButton 
                description={kpiMeta.salesReturnRate.description}
                unit={kpiMeta.salesReturnRate.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold market-purple">
                {valueMap.salesReturnRate !== undefined ? `${valueMap.salesReturnRate.toFixed(1)}%` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <LineChart
                key={`salesreturn-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [
                    {
                      data: chartData.salesReturnTrend,
                      borderColor: "#8B5CF6",
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                      tension: 0.4,
                    },
                    {
                      label: "Threshold",
                      data: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0],
                      borderColor: "#EF4444",
                      borderDash: [5, 5],
                      pointRadius: 0,
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Retailer Service Level */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              Retailer Service Level Score
              <KpiInfoButton 
                description={kpiMeta.retailerServiceLevel.description}
                unit={kpiMeta.retailerServiceLevel.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold market-purple">
                {valueMap.retailerServiceLevel !== undefined ? `${valueMap.retailerServiceLevel.toFixed(1)}/10` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold market-purple">{(valueMap.retailerServiceLevel + 0.3).toFixed(1)}</div>
                <div className="text-sm text-slate-600">Product Quality</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold market-purple">{(valueMap.retailerServiceLevel - 0.1).toFixed(1)}</div>
                <div className="text-sm text-slate-600">Delivery Time</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold market-purple">{(valueMap.retailerServiceLevel + 0.4).toFixed(1)}</div>
                <div className="text-sm text-slate-600">Support</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold market-purple">{(valueMap.retailerServiceLevel - 0.2).toFixed(1)}</div>
                <div className="text-sm text-slate-600">Overall Exp</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Stock Presence */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              Competitor Stock Presence
              <KpiInfoButton 
                description={kpiMeta.competitorStockPresence.description}
                unit={kpiMeta.competitorStockPresence.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-700">
                {valueMap.competitorStockPresence !== undefined ? `${valueMap.competitorStockPresence.toFixed(1)}%` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <BarChart
                key={`compstock-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                data={{
                  labels: ["Brand A", "Brand B", "Brand C", "Others"],
                  datasets: [
                    {
                      label: "Amul",
                      data: chartData.competitorStockData,
                      backgroundColor: "#E31E24",
                    },
                    {
                      label: "Competitors",
                      data: chartData.competitorData,
                      backgroundColor: "#94A3B8",
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: true, position: "bottom" as const } },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Demand Spike vs Response Time */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              Daily Demand Spike vs Response Time
              <KpiInfoButton 
                description={kpiMeta.dailyDemandSpikeResponseTime.description}
                unit={kpiMeta.dailyDemandSpikeResponseTime.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Avg Response:</span>
              <span className="text-xl font-bold market-purple">
                {valueMap.dailyDemandSpikeResponseTime !== undefined ? `${valueMap.dailyDemandSpikeResponseTime.toFixed(1)}hrs` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <LineChart
                key={`demandresp-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                data={{
                  labels: Array.from({ length: 30 }, (_, i) => i + 1),
                  datasets: [
                    {
                      label: "Demand Spike",
                      data: chartData.demandSpike,
                      borderColor: "#8B5CF6",
                      yAxisID: "y",
                    },
                    {
                      label: "Response Time",
                      data: chartData.responseTime,
                      borderColor: "#F97316",
                      yAxisID: "y1",
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: { type: "linear" as const, display: true, position: "left" as const },
                    y1: { type: "linear" as const, display: true, position: "right" as const, grid: { drawOnChartArea: false } },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
