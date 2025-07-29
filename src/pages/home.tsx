import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import EnhancedKPICard from "@/components/dashboard/enhanced-kpi-card";
import IntelligentChatbot from "@/components/intelligent-chatbot";

import Header from "@/components/dashboard/header";
import { Scale, Factory, Truck, TrendingUp, ArrowRight, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const businessComponents = [
  {
    id: "executive-summary",
    title: "Executive Summary",
    description: "Top-level strategic KPIs and critical alerts",
    icon: Award,
    color: "summary-teal",
    bgColor: "bg-teal-50",
    summary: "Brand value stands at $4.1B with a healthy 11.1% growth trajectory and current turnover of ₹90,000 cr, underscoring robust brand equity and financial performance.",
    metrics: [
      "Brand Value: $4.1B",
      "Growth Trajectory: +11.1%",
      "Current Turnover: ₹90,000cr"
    ]
  },
  {
    id: "demand-supply",
    title: "Demand ↔ Supply",
    description: "Monitor order fill rates, stock-outs, backorders, and forecast accuracy",
    icon: Scale,
    color: "fulfillment-green",
    bgColor: "bg-green-50",
    metrics: ["Order Fill Rate: 96%", "Stock-Out Instances: 12", "Forecast Accuracy: 88.5%"]
  },
  {
    id: "production",
    title: "Production & Inventory",
    description: "Track plant utilization, cycle times, inventory turnover, and wastage",
    icon: Factory,
    color: "efficiency-blue",
    bgColor: "bg-blue-50",
    metrics: ["Plant Utilization: 82.1%", "Cycle Time: 3.9hrs", "Inventory Turnover: 8.2x"]
  },
  {
    id: "logistics",
    title: "Logistics & Distribution",
    description: "Analyze dispatch rates, fleet utilization, delivery times, and cold chain",
    icon: Truck,
    color: "logistics-orange",
    bgColor: "bg-orange-50",
    metrics: ["On-Time Dispatch: 94.5%", "Fleet Utilization: 78.6%", "Lead Time: 20.3hrs"]
  },
  {
    id: "market",
    title: "Sales, Revenue & Market",
    description: "Monitor sales performance, revenue growth, market share, and competitive positioning",
    icon: TrendingUp,
    color: "market-purple",
    bgColor: "bg-purple-50",
    metrics: [
      "Revenue Growth: 12.5% YoY",
      "Market Share: 28.3%",
      "Customer Acquisition: 15K/month",
      "Avg. Order Value: ₹1,250",
      "Repeat Purchase Rate: 42%"
    ],
    highlights: [
      { label: "Top Performing Region", value: "South (+18.2%)" },
      { label: "Fastest Growing Category", value: "Premium Dairy (+24.7%)" },
      { label: "Market Position", value: "#1 in Dairy" }
    ]
  }
];

const chatMessages = [
  {
    type: "bot",
    message: "Hello! I'm your Amul Business Intelligence Assistant. I can help you analyze performance across different business areas.",
    time: "now"
  },
  {
    type: "bot",
    message: "Which business area would you like to explore today? Select from the options below:",
    time: "now"
  }
];

// -------------------------
// Types & mock definitions
// -------------------------
interface KPI {
  id: number;
  name: string;
  unit: string;
  section: string;
  description: string;
  value: number;
  trend?: string;
  change?: number;
  target?: number;
  priority?: string;
  benchmark?: string;
  history?: number[];
}

// Navigation targets for business areas
const businessAreas = [
  { id: "demand-supply", title: "Demand ↔ Supply", description: "Monitor order fill rates, stock-outs, backorders and forecast accuracy." },
  { id: "production", title: "Production & Inventory", description: "Track plant utilisation, cycle times, inventory turnover and wastage." },
  { id: "logistics", title: "Logistics & Distribution", description: "Analyse dispatch rates, fleet utilisation and lead times." },
  { id: "market", title: "Sales, Revenue & Market", description: "Review lost sales, service levels and competitor analysis." }
];

export default function Home() {
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [showChatbot, setShowChatbot] = useState(false);
  const [, setLocation] = useLocation();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  // KPI state
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load KPI data once
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/data/kpis.json');
        const data = await res.json();
        setKpiData(data);
      } catch (err) {
        console.error('Failed to fetch KPI data', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
    // Navigate to dashboard with the selected tab
    setTimeout(() => {
      setLocation(`/dashboard?tab=${componentId}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Reusable Executive Header */}
      <Header
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        showChatbot={showChatbot}
        onToggleChatbot={() => setShowChatbot((prev) => !prev)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Chatbot Interface */}
          <div className="lg:col-span-1 space-y-4">
            <IntelligentChatbot isVisible={true} />
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm font-medium text-slate-700 mb-4">Quick Actions:</p>
              <Button
                variant="default"
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => setLocation('/dashboard?tab=executive-summary')}
              >
                Executive Summary
              </Button>
              <div className="space-y-2">
                {businessComponents.map((component) => (
                  <Button
                    key={component.id}
                    variant="outline"
                    size="sm"
                    className={`w-full justify-start text-left transition-all duration-200 ${
                      selectedComponent === component.id ? 'bg-slate-100 border-slate-400' : ''
                    }`}
                    onClick={() => handleComponentSelect(component.id)}
                  >
                    <component.icon className="w-4 h-4 mr-2" />
                    {component.title}
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Business Components Grid */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Business Intelligence Dashboard</h2>
              <p className="text-slate-600">Select a business area to view detailed KPIs and analytics</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {businessComponents.map((component) => {
                const Icon = component.icon;
                return (
                  <Card
                    key={component.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 flex flex-col ${
                      selectedComponent === component.id ? 'ring-2 ring-slate-400 shadow-lg scale-105' : ''
                    } ${component.bgColor}`}
                    style={{ height: '320px' }}
                    onClick={() => handleComponentSelect(component.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${component.color === 'fulfillment-green' ? 'bg-green-100' : component.color === 'efficiency-blue' ? 'bg-blue-100' : component.color === 'logistics-orange' ? 'bg-orange-100' : 'bg-purple-100'}`}>
                          <Icon className={`w-5 h-5 ${component.color}`} />
                        </div>
                        <span className="text-lg font-semibold">{component.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-slate-600 text-sm mb-4">{component.description}</p>
                      {/* Show summary paragraph if provided, else show metrics list */}
                      {component.summary ? (
                        <p className="text-slate-700 text-sm mb-4">{component.summary}</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Key Metrics:</p>
                          {component.metrics.map((metric, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-slate-700">{metric.split(':')[0]}</span>
                              <span className={`text-sm font-semibold ${component.color}`}>
                                {metric.split(':')[1]?.trim()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto pt-3 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Click to explore</span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}