import { Scale, Factory, Truck, TrendingUp, BarChart4 } from "lucide-react";
import type { TabType } from "@/pages/dashboard";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  {
    id: "executive-summary" as TabType,
    label: "Executive Summary",
    icon: BarChart4,
    indicatorColor: "bg-amul-red",
  },
  {
    id: "demand-supply" as TabType,
    label: "Demand ↔ Supply",
    icon: Scale,
    indicatorColor: "bg-fulfillment-green",
  },
  {
    id: "production" as TabType,
    label: "Production & Inventory",
    icon: Factory,
    indicatorColor: "bg-efficiency-blue",
  },
  {
    id: "logistics" as TabType,
    label: "Logistics & Distribution",
    icon: Truck,
    indicatorColor: "bg-logistics-orange",
  },
  {
    id: "market" as TabType,
    label: "Sales, Revenue & Market",
    icon: TrendingUp,
    indicatorColor: "bg-market-purple",
  },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="flex space-x-8" role="tablist">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="w-4 h-4 mr-2" />
            <span>{tab.label}</span>
            <div className={`tab-indicator ${tab.indicatorColor}`} />
          </button>
        );
      })}
    </nav>
  );
}
