import { ArrowUp, Thermometer } from "lucide-react";
import LineChart from "@/components/charts/line-chart";
import BarChart from "@/components/charts/bar-chart";
import GaugeChart from "@/components/charts/gauge-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiInfoButton } from "@/components/ui/kpi-info-button";
import { useState } from "react";
import { DashboardFilters } from "./dashboard-filters";

interface LogisticsTabProps {
  timeRange: string;
}

const REGIONS = [
  { label: "All Regions", value: "all" },
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" }
];

const kpiMeta = {
  onTimeDispatchRate: { description: "Goods leaving warehouse on schedule.", unit: "%" },
  fleetUtilization: { description: "Utilization of logistics fleet.", unit: "%" },
  averageDeliveryLeadTime: { description: "Average time to deliver goods.", unit: "hrs" },
  coldChainTemperatureBreachInstances: { description: "Number of cold chain temperature breaches.", unit: "" },
  distributorFillRate: { description: "Percentage of distributor orders fulfilled.", unit: "%" },
};

export default function LogisticsTab({ timeRange }: LogisticsTabProps) {
  const [region, setRegion] = useState("all");
  const [timeRangeFilter, setTimeRangeFilter] = useState("last-30-days");
  const [productCategory, setProductCategory] = useState("all");
  const [channel, setChannel] = useState("all");

  // Generate mock data based on filters
  function getMockData(region: string, timeRange: string, productCategory: string, channel: string) {
    let onTimeDispatchRate = 91.5;
    let fleetUtilization = 84.2; // Lower base for more spread
    let averageDeliveryLeadTime = 17.5;
    let coldChainTemperatureBreachInstances = 3;
    let distributorFillRate = 89.4;
    let coldChainGrid = [0, 0, 0, 0, 0, 0, 0];

    // Region adjustments
    switch (region) {
      case "north":
        onTimeDispatchRate = 92.8;
        fleetUtilization = 78.6;
        averageDeliveryLeadTime = 18.2;
        coldChainTemperatureBreachInstances = 4;
        distributorFillRate = 87.3;
        coldChainGrid = [0, 1, 0, 0, 1, 0, 0];
        break;
      case "south":
        onTimeDispatchRate = 90.2;
        fleetUtilization = 92.1;
        averageDeliveryLeadTime = 16.8;
        coldChainTemperatureBreachInstances = 2;
        distributorFillRate = 92.1;
        coldChainGrid = [0, 0, 0, 1, 0, 0, 0];
        break;
      case "east":
        onTimeDispatchRate = 89.7;
        fleetUtilization = 74.9;
        averageDeliveryLeadTime = 19.4;
        coldChainTemperatureBreachInstances = 5;
        distributorFillRate = 85.6;
        coldChainGrid = [1, 0, 1, 0, 0, 1, 0];
        break;
      case "west":
        onTimeDispatchRate = 93.1;
        fleetUtilization = 96.4;
        averageDeliveryLeadTime = 17.1;
        coldChainTemperatureBreachInstances = 3;
        distributorFillRate = 91.2;
        coldChainGrid = [0, 0, 0, 0, 0, 0, 0];
        break;
    }

    // Time range adjustments
    switch (timeRange) {
      case "last-7-days":
        onTimeDispatchRate -= 1.2;
        fleetUtilization -= 0.8;
        averageDeliveryLeadTime += 0.7;
        coldChainTemperatureBreachInstances += 1;
        distributorFillRate -= 1.5;
        coldChainGrid = coldChainGrid.map((v, i) => (i % 2 === 0 ? v : 1));
        break;
      case "this-month":
        onTimeDispatchRate += 0.9;
        fleetUtilization += 1.1;
        averageDeliveryLeadTime -= 0.5;
        coldChainTemperatureBreachInstances -= 1;
        distributorFillRate += 1.2;
        coldChainGrid = coldChainGrid.map((v, i) => (i % 3 === 0 ? 1 : v));
        break;
      case "this-year":
        onTimeDispatchRate += 2.1;
        fleetUtilization += 2.3;
        averageDeliveryLeadTime -= 1.2;
        coldChainTemperatureBreachInstances -= 2;
        distributorFillRate += 2.5;
        coldChainGrid = coldChainGrid.map((v, i) => (i % 4 === 0 ? 1 : v));
        break;
    }

    // Product category adjustments
    if (productCategory !== "all") {
      switch (productCategory) {
        case "milk":
          onTimeDispatchRate += 1.1;
          fleetUtilization += 0.7;
          averageDeliveryLeadTime -= 0.6;
          coldChainTemperatureBreachInstances -= 1;
          distributorFillRate += 0.8;
          coldChainGrid = coldChainGrid.map((v, i) => (i === 0 ? 1 : v));
          break;
        case "butter":
          onTimeDispatchRate -= 0.8;
          fleetUtilization -= 0.5;
          averageDeliveryLeadTime += 0.4;
          coldChainTemperatureBreachInstances += 1;
          distributorFillRate -= 0.6;
          coldChainGrid = coldChainGrid.map((v, i) => (i === 1 ? 1 : v));
          break;
        case "cheese":
          onTimeDispatchRate += 0.5;
          fleetUtilization += 0.3;
          averageDeliveryLeadTime -= 0.2;
          coldChainTemperatureBreachInstances -= 1;
          distributorFillRate += 0.4;
          coldChainGrid = coldChainGrid.map((v, i) => (i === 2 ? 1 : v));
          break;
        case "yogurt":
          onTimeDispatchRate -= 1.2;
          fleetUtilization -= 0.9;
          averageDeliveryLeadTime += 0.8;
          coldChainTemperatureBreachInstances += 1;
          distributorFillRate -= 0.7;
          coldChainGrid = coldChainGrid.map((v, i) => (i === 3 ? 1 : v));
          break;
        case "ice-cream":
          onTimeDispatchRate += 0.7;
          fleetUtilization += 0.4;
          averageDeliveryLeadTime -= 0.3;
          coldChainTemperatureBreachInstances -= 1;
          distributorFillRate += 0.5;
          coldChainGrid = coldChainGrid.map((v, i) => (i === 4 ? 1 : v));
          break;
      }
    }

    // Channel adjustments
    switch (channel) {
      case "retail":
        onTimeDispatchRate += 0.6;
        fleetUtilization += 0.5;
        averageDeliveryLeadTime -= 0.2;
        coldChainTemperatureBreachInstances -= 1;
        distributorFillRate += 0.3;
        coldChainGrid = coldChainGrid.map((v, i) => (i === 5 ? 1 : v));
        break;
      case "wholesale":
        onTimeDispatchRate -= 0.4;
        fleetUtilization -= 0.3;
        averageDeliveryLeadTime += 0.3;
        coldChainTemperatureBreachInstances += 1;
        distributorFillRate -= 0.2;
        coldChainGrid = coldChainGrid.map((v, i) => (i === 6 ? 1 : v));
        break;
      case "online":
        onTimeDispatchRate += 0.9;
        fleetUtilization += 0.8;
        averageDeliveryLeadTime -= 0.4;
        coldChainTemperatureBreachInstances -= 1;
        distributorFillRate += 0.6;
        coldChainGrid = coldChainGrid.map((v, i) => (i === 0 ? 1 : v));
        break;
    }

    return {
      onTimeDispatchRate: Math.max(80, Math.min(99, onTimeDispatchRate)),
      fleetUtilization: Math.max(70, Math.min(99, fleetUtilization)),
      averageDeliveryLeadTime: Math.max(10, Math.min(30, averageDeliveryLeadTime)),
      coldChainTemperatureBreachInstances: Math.max(0, Math.min(10, coldChainTemperatureBreachInstances)),
      distributorFillRate: Math.max(70, Math.min(99, distributorFillRate)),
      coldChainGrid,
    };
  }

  function getChartData(region: string, timeRange: string, productCategory: string, channel: string) {
    // On-Time Dispatch Rate trend
    let dispatchTrend = [90.2, 94.5, 87.8, 92.8];
    // Delivery Lead Time distribution
    let leadTimeDist = [5, 17, 11, 8, 3];
    // Distributor Fill Rate by region
    let fillRate = [92.1, 77.3, 89.4, 95.2, 81.6];

    // Region adjustments
    switch (region) {
      case "north":
        dispatchTrend = [91.8, 92.2, 93.1, 92.7];
        leadTimeDist = [4, 10, 20, 9, 2];
        fillRate = [90.1, 85.3, 88.4, 90.2, 83.6];
        break;
      case "south":
        dispatchTrend = [89.2, 90.5, 91.8, 91.8];
        leadTimeDist = [6, 14, 15, 7, 5];
        fillRate = [94.1, 89.3, 91.4, 93.2, 87.6];
        break;
      case "east":
        dispatchTrend = [88.7, 89.5, 90.8, 90.8];
        leadTimeDist = [7, 15, 18, 10, 4];
        fillRate = [88.1, 83.3, 85.4, 87.2, 81.6];
        break;
      case "west":
        dispatchTrend = [92.1, 93.5, 94.8, 94.8];
        leadTimeDist = [3, 9, 22, 6, 2];
        fillRate = [93.1, 88.3, 90.4, 92.2, 86.6];
        break;
    }

    // Time range adjustments
    switch (timeRange) {
      case "last-7-days":
        dispatchTrend = dispatchTrend.map(v => v - 1.2);
        leadTimeDist = leadTimeDist.map((v, i) => i === 2 ? v + 2 : v);
        fillRate = fillRate.map(v => v - 1.5);
        break;
      case "this-month":
        dispatchTrend = dispatchTrend.map(v => v + 0.9);
        leadTimeDist = leadTimeDist.map((v, i) => i === 1 ? v + 2 : v);
        fillRate = fillRate.map(v => v + 1.2);
        break;
      case "this-year":
        dispatchTrend = dispatchTrend.map(v => v + 2.1);
        leadTimeDist = leadTimeDist.map((v, i) => i === 0 ? v + 2 : v);
        fillRate = fillRate.map(v => v + 2.5);
        break;
    }

    // Product category adjustments
    if (productCategory !== "all") {
      switch (productCategory) {
        case "milk":
          dispatchTrend = dispatchTrend.map(v => v + 1.1);
          leadTimeDist = leadTimeDist.map((v, i) => i === 0 ? v + 1 : v);
          fillRate = fillRate.map(v => v + 0.8);
          break;
        case "butter":
          dispatchTrend = dispatchTrend.map(v => v - 0.8);
          leadTimeDist = leadTimeDist.map((v, i) => i === 1 ? v + 1 : v);
          fillRate = fillRate.map(v => v - 0.6);
          break;
        case "cheese":
          dispatchTrend = dispatchTrend.map(v => v + 0.5);
          leadTimeDist = leadTimeDist.map((v, i) => i === 2 ? v + 1 : v);
          fillRate = fillRate.map(v => v + 0.4);
          break;
        case "yogurt":
          dispatchTrend = dispatchTrend.map(v => v - 1.2);
          leadTimeDist = leadTimeDist.map((v, i) => i === 3 ? v + 1 : v);
          fillRate = fillRate.map(v => v - 0.7);
          break;
        case "ice-cream":
          dispatchTrend = dispatchTrend.map(v => v + 0.7);
          leadTimeDist = leadTimeDist.map((v, i) => i === 4 ? v + 1 : v);
          fillRate = fillRate.map(v => v + 0.5);
          break;
      }
    }

    // Channel adjustments
    switch (channel) {
      case "retail":
        dispatchTrend = dispatchTrend.map(v => v + 0.6);
        leadTimeDist = leadTimeDist.map((v, i) => i === 0 ? v + 1 : v);
        fillRate = fillRate.map(v => v + 0.3);
        break;
      case "wholesale":
        dispatchTrend = dispatchTrend.map(v => v - 0.4);
        leadTimeDist = leadTimeDist.map((v, i) => i === 1 ? v + 1 : v);
        fillRate = fillRate.map(v => v - 0.2);
        break;
      case "online":
        dispatchTrend = dispatchTrend.map(v => v + 0.9);
        leadTimeDist = leadTimeDist.map((v, i) => i === 2 ? v + 1 : v);
        fillRate = fillRate.map(v => v + 0.6);
        break;
    }

    // Bound values
    dispatchTrend = dispatchTrend.map(v => Math.max(80, Math.min(99, v)));
    leadTimeDist = leadTimeDist.map(v => Math.max(0, Math.min(30, v)));
    fillRate = fillRate.map(v => Math.max(70, Math.min(99, v)));

    return {
      dispatchTrend,
      leadTimeDist,
      fillRate,
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
        {/* On-Time Dispatch Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              On-Time Dispatch Rate
              <KpiInfoButton 
                description={kpiMeta.onTimeDispatchRate.description}
                unit={kpiMeta.onTimeDispatchRate.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold logistics-orange">
                {valueMap.onTimeDispatchRate !== undefined ? `${valueMap.onTimeDispatchRate.toFixed(1)}%` : "--"}
              </span>
              <ArrowUp className="w-4 h-4 logistics-orange" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <LineChart
                key={`dispatch-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                data={{
                  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                  datasets: [{
                    data: chartData.dispatchTrend,
                    borderColor: "#F97316",
                    backgroundColor: "rgba(249, 115, 22, 0.1)",
                    tension: 0.4,
                  }],
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fleet Utilization */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              Fleet Utilization
              <KpiInfoButton 
                description={kpiMeta.fleetUtilization.description}
                unit={kpiMeta.fleetUtilization.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold logistics-orange">
                {valueMap.fleetUtilization !== undefined ? `${valueMap.fleetUtilization.toFixed(1)}%` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container flex items-center justify-center">
              <GaugeChart value={valueMap.fleetUtilization !== undefined ? Number(valueMap.fleetUtilization.toFixed(2)) : 0} color="#F97316" />
            </div>
          </CardContent>
        </Card>

        {/* Average Delivery Lead Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              Avg Delivery Lead Time
              <KpiInfoButton 
                description={kpiMeta.averageDeliveryLeadTime.description}
                unit={kpiMeta.averageDeliveryLeadTime.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-700">
                {valueMap.averageDeliveryLeadTime !== undefined ? `${valueMap.averageDeliveryLeadTime.toFixed(1)}hrs` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <BarChart
                key={`leadtime-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                data={{
                  labels: ["12-15h", "15-18h", "18-21h", "21-24h", "24h+"],
                  datasets: [{
                    data: chartData.leadTimeDist,
                    backgroundColor: "#F97316",
                  }],
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cold Chain Breach */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              Cold Chain Breach Instances
              <KpiInfoButton 
                description={kpiMeta.coldChainTemperatureBreachInstances.description}
                unit={kpiMeta.coldChainTemperatureBreachInstances.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-red-600">
                {valueMap.coldChainTemperatureBreachInstances ?? "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Thermometer className="w-16 h-16 text-red-600 mb-4 mx-auto" />
                <p className="text-sm text-slate-600 mb-4">This Month</p>
                <div className="grid grid-cols-7 gap-1">
                  {valueMap.coldChainGrid.map((value: number, index: number) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        value === 0 ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <span className={`text-xs ${value === 0 ? "text-green-600" : "text-red-600"}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distributor Fill Rate */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              Distributor Fill Rate
              <KpiInfoButton 
                description={kpiMeta.distributorFillRate.description}
                unit={kpiMeta.distributorFillRate.unit}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold logistics-orange">
                {valueMap.distributorFillRate !== undefined ? `${valueMap.distributorFillRate.toFixed(1)}%` : "--"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <BarChart
                key={`fillrate-${region}-${timeRangeFilter}-${productCategory}-${channel}`}
                data={{
                  labels: ["North", "South", "East", "West", "Central"],
                  datasets: [{
                    label: "Fill Rate",
                    data: chartData.fillRate,
                    backgroundColor: "#F97316",
                  }],
                }}
                options={{ indexAxis: "y" as const }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
