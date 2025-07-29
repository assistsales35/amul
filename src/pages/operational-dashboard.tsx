 import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import IntelligentChatbot from "@/components/intelligent-chatbot";
import { AlertCircle, AlertTriangle, Info, ArrowUp, ArrowDown, X, CheckCircle, TrendingUp, RefreshCw, MessageSquare, Package, Truck, Globe, Bot } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { fetchOperationalKPIs } from "@/lib/api";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
export interface KPI {
  id: string;
  name: string;
  value: number;
  unit?: string;
  change?: number; // %+/- vs last period
  status: "critical" | "warning" | "normal" | "good";
  target?: number;
  description: string;
  trend?: { name: string; value: number }[];
  affected?: { sku: string; value: number; status: "critical" | "warning" | "normal" }[];
}

// ────────────────────────────────────────────────
// Mock data (replace with API later)
// ────────────────────────────────────────────────
const mockKpis: KPI[] = [
  {
    id: "isdi",
    name: "Inventory Sync Delay Impact Index",
    value: 1.8,
    unit: "days",
    change: 0.3,
    status: "warning",
    target: 1.0,
    description: "Operational impact from inventory sync lags",
    trend: [
      { name: "Mon", value: 1.2 },
      { name: "Tue", value: 1.4 },
      { name: "Wed", value: 1.6 },
      { name: "Thu", value: 1.8 },
      { name: "Fri", value: 1.7 },
      { name: "Sat", value: 1.9 },
      { name: "Sun", value: 1.8 }
    ]
  },
  {
    id: "oor",
    name: "Order Overbooking Ratio",
    value: 0.15,
    change: -0.02,
    status: "normal",
    target: 0.1,
    description: "Ratio of orders exceeding available stock"
  },
  {
    id: "lfv",
    name: "Live Fill Rate Variance",
    value: -4.2,
    unit: "%",
    status: "critical",
    description: "Variance in expected vs actual fill rate"
  },
  {
    id: "lag",
    name: "Acceptance Lag vs Refresh Lag",
    value: 3.7,
    unit: "hrs",
    change: 0.5,
    status: "warning",
    description: "Time gap between order acceptance and inventory refresh"
  },
  {
    id: "odr",
    name: "Order Drop Rate",
    value: 2.1,
    unit: "%",
    change: 0.4,
    status: "warning",
    description: "Percentage of orders cancelled after placement"
  },
  {
    id: "eiri",
    name: "Expired Inventory Risk Index",
    value: 5.4,
    unit: "%",
    status: "critical",
    description: "Risk score for inventory nearing expiry"
  },
  {
    id: "ferror",
    name: "Forecast Error During Inventory Lag",
    value: 7.6,
    unit: "%",
    status: "normal",
    description: "Forecast error while inventory data lag exists"
  }
];

// ────────────────────────────────────────────────
// Helper components
// ────────────────────────────────────────────────
function StatusBadge({ status }: { status: KPI["status"] }) {
  const map = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    normal: "bg-blue-100 text-blue-800 border-blue-200",
    good: "bg-green-100 text-green-800 border-green-200"
  } as const;
  const icon = status === "critical" ? <AlertCircle className="w-3 h-3 mr-1" /> : status === "warning" ? <AlertTriangle className="w-3 h-3 mr-1" /> : status === "normal" ? <Info className="w-3 h-3 mr-1" /> : <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />;
  return (
    <Badge variant="outline" className={cn("text-xs", map[status])}>{icon}{status}</Badge>
  );
}

function CardTrend({ change }: { change?: number }) {
  if (change === undefined) return null;
  const positive = change > 0;
  const color = positive ? "text-red-500" : change < 0 ? "text-green-500" : "text-gray-500";
  const Icon = positive ? ArrowUp : change < 0 ? ArrowDown : Info;
  return (
    <span className={cn("flex items-center text-xs", color)}>
      <Icon className="w-3 h-3 mr-0.5" />{Math.abs(change).toFixed(1)}% vs last
    </span>
  );
}

function KPICard({ kpi, onSelect }: { kpi: KPI; onSelect: () => void }) {
  return (
    <Card onClick={onSelect} className={cn("cursor-pointer hover:shadow-lg transition-shadow duration-300 animate-fade-in", kpi.status === "critical" && "border-l-4 border-red-500", kpi.status === "warning" && "border-l-4 border-yellow-500") }>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-slate-300 leading-tight">{kpi.name}</CardTitle>
          <StatusBadge status={kpi.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold">{kpi.value}{kpi.unit && <span className="text-base font-medium ml-0.5">{kpi.unit}</span>}</div>
            <CardTrend change={kpi.change} />
          </div>
          {kpi.target && (
            <div className="text-right">
              <div className="text-[10px] text-slate-500 mb-1">Target {kpi.target}{kpi.unit}</div>
              <Progress value={Math.min(100, (kpi.value / kpi.target) * 100)} className="h-1 w-20" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────
// Executive Dashboard for Amul MD - Strategic Oversight
export default function OperationalDashboard() {
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selected, setSelected] = useState<KPI | null>(null);
  
  const { data: kpis = mockKpis, refetch } = useQuery({ 
    queryKey: ['kpis', timeRange], 
    queryFn: () => fetchOperationalKPIs(timeRange), 
    refetchInterval: autoRefresh ? 15000 : false, 
    initialData: mockKpis 
  });

  // Executive Brand & Revenue Metrics
  const brandMetrics = {
    brandValue: 4.1, // USD billion
    currentTurnover: 90000, // ₹ crores
    projectedTurnover: 100000, // ₹ crores FY26
    growthRate: 11.1 // percentage
  };

  // Critical Risk Alerts for MD
  const riskAlerts = [
    {
      id: 'cold-chain',
      title: 'Cold-Chain Spoilage Risk',
      value: '2.3%',
      status: 'warning',
      description: 'Temperature-triggered alerts across rural cold-chain'
    },
    {
      id: 'ims-compliance',
      title: 'IMS Act Compliance',
      value: 'Flagged',
      status: 'critical',
      description: 'Infant formula regulatory risk status'
    },
    {
      id: 'regional-access',
      title: 'Regional Access Score',
      value: 'Bengaluru: 2/10',
      status: 'critical',
      description: 'Political pressure impact on outlet availability'
    }
  ];

  // Supply Chain & Distribution KPIs
  const supplyChainKPIs = [
    {
      id: 'stockout-frequency',
      name: 'Stock-out Frequency',
      value: '12.5%',
      unit: 'regions',
      status: 'warning',
      description: 'Demand-supply gaps across regions'
    },
    {
      id: 'lead-time',
      name: 'Lead Time Variance',
      value: '+18%',
      unit: 'vs target',
      status: 'critical',
      description: '3PL inefficiency indicators'
    },
    {
      id: 'cold-chain-uptime',
      name: 'Cold-Chain Uptime',
      value: '94.2%',
      unit: 'solar-powered',
      status: 'info',
      description: 'Solar coverage vs spoilage risk'
    }
  ];

  // Executive color scheme based on urgency
  const getCardStyle = (status: string) => {
    switch (status) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-50/50 hover:bg-red-100/50';
      case 'warning': return 'border-l-4 border-amber-500 bg-amber-50/50 hover:bg-amber-100/50';
      case 'normal': return 'border-l-4 border-blue-500 bg-blue-50/50 hover:bg-blue-100/50';
      case 'good': return 'border-l-4 border-green-500 bg-green-50/50 hover:bg-green-100/50';
    }
  };

  const getExecutiveStyle = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500/20 border-red-500/50';
      case 'warning': return 'bg-amber-500/20 border-amber-500/50';
      case 'normal': return 'bg-blue-500/20 border-blue-500/50';
      case 'good': return 'bg-green-500/20 border-green-500/50';
      default: return 'bg-slate-500/20 border-slate-500/50';
    }
  };

  const getAlertIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'normal': return <Info className="w-5 h-5 text-blue-500" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  // Executive grouping
  const riskMetrics = kpis.filter((k: KPI) => ["isdi", "odr", "eiri", "lfv"].includes(k.id));
  const performanceMetrics = kpis.filter((k: KPI) => ["oor", "lag"].includes(k.id));
  const forecastMetrics = kpis.filter((k: KPI) => k.id === "ferror");

  const renderMetricGroup = (title: string, metrics: KPI[], color: string) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full mr-2 ${color}`} />
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <span className="ml-auto text-sm text-slate-500">{metrics.length} metrics</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((kpi: KPI) => (
          <Card 
            key={kpi.id}
            className={`${getCardStyle(kpi.status)} cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            onClick={() => setSelected(kpi)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {getAlertIcon(kpi.status)}
                  <CardTitle className="text-sm font-medium text-slate-700 leading-tight">
                    {kpi.name}
                  </CardTitle>
                </div>
                <Badge variant="outline" className={cn(
                  "text-xs",
                  kpi.status === 'critical' && "bg-red-100 text-red-800 border-red-200",
                  kpi.status === 'warning' && "bg-amber-100 text-amber-800 border-amber-200",
                  kpi.status === 'normal' && "bg-blue-100 text-blue-800 border-blue-200",
                  kpi.status === 'good' && "bg-green-100 text-green-800 border-green-200"
                )}>
                  {kpi.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-white">
                  {kpi.value}
                  {kpi.unit && <span className="text-lg font-medium text-slate-300 ml-1">{kpi.unit}</span>}
                </div>
                
                {kpi.change && (
                  <div className={cn(
                    "flex items-center text-sm",
                    kpi.change > 0 ? "text-red-600" : "text-green-600"
                  )}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {Math.abs(kpi.change).toFixed(1)}% vs last period
                  </div>
                )}
                
                {kpi.target && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (kpi.value / kpi.target) * 100)} 
                      className={cn(
                        "h-2",
                        kpi.status === 'critical' && "bg-red-200",
                        kpi.status === 'warning' && "bg-amber-200",
                        kpi.status === 'normal' && "bg-blue-200",
                        kpi.status === 'good' && "bg-green-200"
                      )} 
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Use existing brand metrics and data from above
  const inventoryKPIs = kpis.filter((kpi: KPI) => 
    kpi.name.includes("Overbooking") || 
    kpi.name.includes("Stock") || 
    kpi.name.includes("Order") ||
    kpi.name.includes("Inventory")
  );

  // Use existing supplyChainKPIs from top
  // const supplyChainKPIs = kpis.filter((kpi: KPI) => 
  //   kpi.name.includes("Supply") || 
  //   kpi.name.includes("Distribution") || 
  //   kpi.name.includes("Logistics")
  // );

  const geoMetrics = [
    {
      region: "North India",
      availability: 95,
      products: ["Milk", "Butter", "Ghee", "Ice Cream"]
    },
    {
      region: "West India",
      availability: 88,
      products: ["Cheese", "Dahi", "Milk", "Butter"]
    },
    {
      region: "South India",
      availability: 92,
      products: ["Ice Cream", "Milk", "Ghee", "Cheese"]
    }
  ];

  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Executive Header with Brand & Revenue Metrics */}
      <div className="flex-shrink-0 bg-white shadow-sm border-b border-slate-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-600">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src="/attached_assets/logo.png" 
                  alt="Amul Logo" 
                  className="h-8 w-auto object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    Executive Command Center
                  </h1>
                  <p className="text-sm text-slate-500">Strategic oversight for Managing Director</p>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-3xl font-bold text-green-700">₹{brandMetrics.currentTurnover.toLocaleString()} cr</div>
                  <div className="text-sm text-green-600">Current FY Turnover</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-700">${brandMetrics.brandValue}B USD</div>
                  <div className="text-sm text-blue-600">Brand Value</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-3xl font-bold text-purple-700">₹{brandMetrics.projectedTurnover.toLocaleString()} cr</div>
                  <div className="text-sm text-purple-600">FY26 Target</div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600 font-semibold">+{brandMetrics.growthRate}% growth trajectory</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk Alerts Panel */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
          <Accordion type="multiple" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {riskAlerts.map((alert) => (
              <AccordionItem key={alert.id} value={alert.id} className={`${getExecutiveStyle(alert.status)} border-0 rounded-lg`}>
                <AccordionTrigger className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.status)}
                    <span className="text-sm font-semibold text-slate-800 text-left">
                      {alert.title}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800 text-right">
                    {alert.value}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {alert.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Executive Dashboard Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-12 gap-6 p-6 h-full">
          {/* Main Executive Canvas */}
          <div className="col-span-9 overflow-y-auto pr-2 space-y-6">
          {/* Inventory & Order KPIs */}
          <div>
            <div className="flex items-center mb-4">
              <Package className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-slate-800">Inventory & Order KPIs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {inventoryKPIs.map((kpi: KPI) => (
                <Card 
                  key={kpi.id}
                  className="bg-white border-slate-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => setSelected(kpi)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-slate-800">{kpi.name}</CardTitle>
                      {getAlertIcon(kpi.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800 mb-2">
                      {kpi.value}
                      {kpi.unit && <span className="text-base ml-1">{kpi.unit}</span>}
                    </div>
                    <p className="text-sm text-slate-600">{kpi.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Supply Chain Metrics */}
          <div>
            <div className="flex items-center mb-4">
              <Truck className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-slate-800">Supply Chain & Distribution</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supplyChainKPIs.map((kpi) => (
                <Card key={kpi.id} className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">{kpi.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800 mb-2">{kpi.value}</div>
                    <p className="text-sm text-slate-600">{kpi.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Geographic Diversification */}
          <div>
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-slate-800">Geographic & Product Diversification</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {geoMetrics.map((region) => (
                <Card key={region.region} className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">{region.region}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800 mb-2">{region.availability}%</div>
                    <div className="text-sm text-slate-600 mb-3">SKU Availability</div>
                    <div className="flex flex-wrap gap-1">
                      {region.products.map((product) => (
                        <span key={product} className="text-xs bg-slate-100 text-slate-700 rounded px-2 py-1">
                          {product}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Executive AI Assistant */}
        <div className="col-span-3 h-full">
          <div className="bg-white rounded-xl shadow-lg h-full flex flex-col border border-slate-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Executive AI Assistant</h3>
                  <p className="text-sm text-slate-600">Strategic decision support</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <IntelligentChatbot isVisible={true} />
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Executive Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-white border-slate-200">
          {selected && (
            <div className="flex flex-col h-full">
              <div className="bg-slate-50 border-b border-slate-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{selected.name}</h3>
                    <p className="text-slate-600 mt-1">{selected.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected(null)}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-8 bg-white">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <Card className="bg-slate-50 border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-800">Current Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-slate-800">
                        {selected.value}
                        {selected.unit && <span className="text-2xl ml-2">{selected.unit}</span>}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {selected.target && (
                    <Card className="bg-slate-50 border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Target</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-slate-800">
                          {selected.target}
                          {selected.unit && <span className="text-2xl ml-2">{selected.unit}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card className="bg-slate-50 border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-800">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-slate-800">
                        {selected.status === 'critical' ? '⚠️' : selected.status === 'warning' ? '⚡' : '✅'}
                      </div>
                      <div className="text-sm text-slate-600 capitalize">{selected.status}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-slate-800 mb-4">Performance Trend</h4>
                  {selected.trend ? (
                    <div className="h-64 bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selected.trend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: '#ffffff', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              color: '#334155'
                            }}
                          />
                          <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-600">No trend data available</p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <h4 className="text-xl font-semibold text-slate-800 mb-4">Executive Summary</h4>
                  <p className="text-slate-600 text-lg leading-relaxed">{selected.description}</p>
                  {selected.change !== undefined && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600">
                        Performance Change: <span className={selected.change > 0 ? "text-red-600" : "text-green-600"}>
                          {selected.change > 0 ? '+' : ''}{selected.change}%
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
