import LineChart from "@/components/charts/line-chart";
import BarChart from "@/components/charts/bar-chart";
import ProfessionalIndiaMap from "@/components/charts/professional-india-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { KpiInfoButton } from "@/components/ui/kpi-info-button";

interface MarketTabProps {
  timeRange: string;
}

export default function MarketTab({ timeRange }: MarketTabProps) {
  const { valueMap, kpiMeta } = useDashboardData("market", timeRange);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Lost Sales Value Map */}
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            Lost Sales Value by Region
            <KpiInfoButton 
              description={kpiMeta.lostSalesValue?.description || "Estimated revenue lost due to unavailability."}
              unit={kpiMeta.lostSalesValue?.unit}
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
              description={kpiMeta.salesReturnRate?.description || "Percentage of products returned."}
              unit={kpiMeta.salesReturnRate?.unit}
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
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    data: [2.1, 1.8, 1.9, 1.7, 1.8, 1.8],
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
              description={kpiMeta.retailerServiceLevel?.description || "Retailer perception of service reliability."}
              unit={kpiMeta.retailerServiceLevel?.unit}
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
              <div className="text-3xl font-bold market-purple">8.6</div>
              <div className="text-sm text-slate-600">Product Quality</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-3xl font-bold market-purple">8.2</div>
              <div className="text-sm text-slate-600">Delivery Time</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-3xl font-bold market-purple">8.7</div>
              <div className="text-sm text-slate-600">Support</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-3xl font-bold market-purple">8.1</div>
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
              description={kpiMeta.competitorStockPresence?.description || "Percentage of competitor stock presence where Amul is out-of-stock."}
              unit={kpiMeta.competitorStockPresence?.unit}
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
              data={{
                labels: ["Brand A", "Brand B", "Brand C", "Others"],
                datasets: [
                  {
                    label: "Amul",
                    data: [65.8, 78.2, 61.4, 58.9],
                    backgroundColor: "#E31E24",
                  },
                  {
                    label: "Competitors",
                    data: [34.2, 21.8, 38.6, 41.1],
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
              description={kpiMeta.dailyDemandSpikeResponseTime?.description || "Time taken to respond to sudden demand spikes."}
              unit={kpiMeta.dailyDemandSpikeResponseTime?.unit}
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
              data={{
                labels: Array.from({ length: 30 }, (_, i) => i + 1),
                datasets: [
                  {
                    label: "Demand Spike",
                    data: [120, 135, 180, 145, 160, 190, 175, 155, 140, 165, 185, 170, 145, 175, 195, 160, 150, 185, 170, 155, 145, 165, 180, 195, 175, 160, 145, 170, 185, 155],
                    borderColor: "#8B5CF6",
                    yAxisID: "y",
                  },
                  {
                    label: "Response Time",
                    data: [5.2, 4.8, 3.9, 4.6, 4.1, 3.7, 3.9, 4.3, 4.7, 4.2, 3.8, 4.0, 4.5, 3.9, 3.6, 4.3, 4.6, 3.8, 4.1, 4.4, 4.7, 4.2, 3.9, 3.5, 3.8, 4.3, 4.6, 4.0, 3.7, 4.2],
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
  );
}
