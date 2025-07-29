import { ArrowUp, Thermometer } from "lucide-react";
import LineChart from "@/components/charts/line-chart";
import BarChart from "@/components/charts/bar-chart";
import GaugeChart from "@/components/charts/gauge-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { KpiInfoButton } from "@/components/ui/kpi-info-button";

interface LogisticsTabProps {
  timeRange: string;
}

export default function LogisticsTab({ timeRange }: LogisticsTabProps) {
  const { valueMap, kpiMeta } = useDashboardData("logistics", timeRange);

  const coldChainData = Array(7).fill(0); // placeholder week data

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* On-Time Dispatch Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            On-Time Dispatch Rate
            <KpiInfoButton 
              description={kpiMeta.onTimeDispatchRate?.description || "Goods leaving warehouse on schedule."}
              unit={kpiMeta.onTimeDispatchRate?.unit}
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
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [{
                  data: [90.2, 91.5, 92.8, 92.8],
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
              description={kpiMeta.fleetUtilization?.description || "Utilization of logistics fleet."}
              unit={kpiMeta.fleetUtilization?.unit}
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
            <GaugeChart value={valueMap.fleetUtilization ?? 0} color="#F97316" />
          </div>
        </CardContent>
      </Card>

      {/* Average Delivery Lead Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Avg Delivery Lead Time
            <KpiInfoButton 
              description={kpiMeta.averageDeliveryLeadTime?.description || "Average time to deliver goods."}
              unit={kpiMeta.averageDeliveryLeadTime?.unit}
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
              data={{
                labels: ["12-15h", "15-18h", "18-21h", "21-24h", "24h+"],
                datasets: [{
                  data: [5, 12, 18, 8, 3],
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
              description={kpiMeta.coldChainTemperatureBreachInstances?.description || "Number of cold chain temperature breaches."}
              unit={kpiMeta.coldChainTemperatureBreachInstances?.unit}
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
                {coldChainData.map((value, index) => (
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
              description={kpiMeta.distributorFillRate?.description || "Percentage of distributor orders fulfilled."}
              unit={kpiMeta.distributorFillRate?.unit}
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
              data={{
                labels: ["Region A", "Region B", "Region C", "Region D", "Region E"],
                datasets: [{
                  label: "Fill Rate",
                  data: [92.1, 87.3, 89.4, 91.2, 85.6],
                  backgroundColor: "#F97316",
                }],
              }}
              options={{ indexAxis: "y" as const }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
