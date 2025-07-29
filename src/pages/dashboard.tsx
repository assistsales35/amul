import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/dashboard/header";
import TabNavigation from "@/components/dashboard/tab-navigation";
import DemandSupplyTab from "@/components/dashboard/demand-supply-tab";
import ProductionTab from "@/components/dashboard/production-tab";
import LogisticsTab from "@/components/dashboard/logistics-tab";
import MarketTab from "@/components/dashboard/market-tab";
import ExecutiveSummaryTab from "@/components/dashboard/executive-summary-tab";
import IntelligentChatbot from "@/components/intelligent-chatbot";

export type TabType = "executive-summary" | "demand-supply" | "production" | "logistics" | "market";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("executive-summary");
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [showChatbot, setShowChatbot] = useState(false);
  const [location] = useLocation();
  
  // Parse tab from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['executive-summary', 'demand-supply', 'production', 'logistics', 'market'].includes(tabParam)) {
      setActiveTab(tabParam as TabType);
    }
  }, [location]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "executive-summary":
        return <ExecutiveSummaryTab timeRange={timeRange} />;
      case "demand-supply":
        return <DemandSupplyTab timeRange={timeRange} />;
      case "production":
        return <ProductionTab timeRange={timeRange} />;
      case "logistics":
        return <LogisticsTab timeRange={timeRange} />;
      case "market":
        return <MarketTab timeRange={timeRange} />;
      default:
        return <ExecutiveSummaryTab timeRange={timeRange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        timeRange={timeRange} 
        onTimeRangeChange={setTimeRange} 
        showChatbot={showChatbot}
        onToggleChatbot={() => setShowChatbot(!showChatbot)}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <div className={`transition-all duration-300 ${showChatbot ? 'w-3/4' : 'w-full'} overflow-y-auto`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <TabNavigation activeTab={activeTab} onTabChange={(tab) => {
              setActiveTab(tab);
              // Update URL parameter
              const url = new URL(window.location.href);
              url.searchParams.set('tab', tab);
              window.history.pushState({}, '', url.toString());
            }} />
            
            <div className="py-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
        
        {showChatbot && (
          <div className="w-1/4 border-l border-slate-200 h-full overflow-hidden">
            <IntelligentChatbot isVisible={showChatbot} />
          </div>
        )}
      </div>
    </div>
  );
}
