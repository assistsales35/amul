import { useQuery } from "@tanstack/react-query";
// Import static KPI definitions (compiled thanks to `resolveJsonModule` in tsconfig)
// Path: hooks -> src/hooks -> ../../data/kpis.json
import kpis from "../../data/kpis.json";

type KPI = {
  id: number;
  name: string;
  unit: string;
  section: string;
  description: string;
  value: number;
};

// Map UI category -> KPI section name from the JSON
const sectionByCategory: Record<string, string> = {
  "executive-summary": "Financial Health",
  "demand-supply": "Demand–Supply Mismatch",
  production: "Production & Inventory Health",
  logistics: "Logistics & Distribution",
  market: "Sales, Revenue & Market Insights",
};

// Map KPI name from JSON -> property name expected by dashboard tabs
const nameToKey: Record<string, string> = {
  // Financial Health KPIs
  "Gross Profit Margin": "grossProfitMargin",
  "Operating Profit Margin": "operatingProfitMargin",
  "Cash Flow from Operations": "cashFlowFromOperations",
  "Return on Investment": "returnOnInvestment",

  // Demand-Supply KPIs
  "Order Fill Rate": "orderFillRate",
  "Stock-Out Instances per SKU": "stockOutInstancesPerSku",
  "Backorder Volume": "backorderVolume",
  "Forecast Accuracy": "forecastAccuracy",
  "SKU-Wise Sales vs Planned Production Variance": "skuWiseSalesVsPlannedProductionVariance",

  // Production KPIs
  "Plant Utilization Rate": "plantUtilizationRate",
  "Production Cycle Time": "productionCycleTime",
  "Inventory Turnover Ratio": "inventoryTurnoverRatio",
  "Finished Goods Inventory by SKU": "finishedGoodsInventoryBySku",
  "Scrap/Wastage Rate": "scrapWastageRate",

  // Logistics KPIs
  "On-Time Dispatch Rate": "onTimeDispatchRate",
  "Fleet Utilization": "fleetUtilization",
  "Average Delivery Lead Time": "averageDeliveryLeadTime",
  "Cold Chain Temperature Breach Instances": "coldChainTemperatureBreachInstances",
  "Distributor Fill Rate": "distributorFillRate",

  // Market / Sales KPIs
  "Lost Sales Value (Estimated)": "lostSalesValue",
  "Sales Return Rate": "salesReturnRate",
  "Retailer Service Level": "retailerServiceLevel",
  "Competitor Stock Presence in Key Markets": "competitorStockPresence",
  "Daily Demand Spike Events vs Response Time": "dailyDemandSpikeResponseTime",
};

export function useDashboardData(category: string, timeRange: string) {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard/metrics/latest"],
  });

  const { data: targets } = useQuery({
    queryKey: ["/api/dashboard/targets"],
  });

  // Build a value map for the requested category directly from the KPI JSON
  const valueMap = (() => {
    const section = sectionByCategory[category];
    if (!section) return {};

    return (kpis as KPI[])
      .filter((k) => k.section === section && nameToKey[k.name])
      .reduce<Record<string, number>>((acc, k) => {
        acc[nameToKey[k.name]] = k.value;
        return acc;
      }, {});
  })();

  // Build KPI metadata map for info buttons
  const kpiMeta = (() => {
    const section = sectionByCategory[category];
    if (!section) return {};

    return (kpis as KPI[])
      .filter((k) => k.section === section && nameToKey[k.name])
      .reduce<Record<string, { description: string; unit: string }>>((acc, k) => {
        acc[nameToKey[k.name]] = {
          description: k.description,
          unit: k.unit
        };
        return acc;
      }, {});
  })();

  return {
    metrics,
    targets,
    valueMap,
    kpiMeta,
    isLoading,
    error,
  };
}
