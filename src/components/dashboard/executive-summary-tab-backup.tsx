import { useState, useEffect } from "react";
import LineChart from "@/components/charts/line-chart";
import BarChart from "@/components/charts/bar-chart";
import GaugeChart from "@/components/charts/gauge-chart";
import EnhancedKPICard from "@/components/dashboard/enhanced-kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, AlertTriangle, TrendingUp, Target, Clock, CheckCircle2, Zap, DollarSign, Users, Award, Activity, BarChart3 } from "lucide-react";

interface ExecutiveSummaryTabProps {
  timeRange: string;
}

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
}

interface Alert {
  type: string;
  message: string;
  impact: string;
  action: string;
  priority: string;
}

export default function ExecutiveSummaryTab({ timeRange }: ExecutiveSummaryTabProps) {
  const [activeView, setActiveView] = useState("overview");
  const [kpiData, setKpiData] = useState<KPI[]>([]);

  // Load KPI data
  useEffect(() => {
    const loadKPIData = async () => {
      try {
        const response = await fetch('/data/kpis.json');
        const data = await response.json();
        setKpiData(data);
      } catch (error) {
        console.error('Failed to load KPI data:', error);
      }
    };
    loadKPIData();
  }, []);

  // Generate dynamic critical alerts based on KPI data
  const getCriticalAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    
    // Check for critical KPIs
    const criticalKPIs = kpiData.filter(kpi => kpi.priority === 'critical');
    
    criticalKPIs.forEach(kpi => {
      if (kpi.name === 'Stock-Out Instances per SKU' && kpi.value > 10) {
        alerts.push({
          type: "stock-out",
          message: `Critical: ${kpi.value} stock-out instances detected across SKUs`,
          impact: "Estimated ₹2.4M revenue loss",
          action: "Expedite production and distribution",
          priority: "critical"
        });
      }
      
      if (kpi.name === 'Cash Flow from Operations' && kpi.value < kpi.target!) {
        alerts.push({
          type: "cash-flow",
          message: "Cash flow below target - immediate attention required",
          impact: `₹${(kpi.target! - kpi.value).toFixed(2)}B gap to target`,
          action: "Review working capital management",
          priority: "critical"
        });
      }
      
      if (kpi.name === 'Market Share' && kpi.value < 43) {
        alerts.push({
          type: "market-share",
          message: "Market share decline detected in key segments",
          impact: "Potential ₹5.8M revenue opportunity",
          action: "Increase distribution and marketing",
          priority: "high"
        });
      }
    });
    
    return alerts.slice(0, 3); // Show top 3 alerts
  };
  
  const criticalAlerts = getCriticalAlerts();

  // Dynamic key metrics from KPI data
  const getKeyMetrics = () => {
    const strategicKPIs = kpiData.filter(kpi => kpi.section === 'Strategic Performance');
    const financialKPIs = kpiData.filter(kpi => kpi.section === 'Financial Health');
    
    const keyMetrics = [];
    
    // Revenue Growth
    const revenueGrowth = strategicKPIs.find(kpi => kpi.name === 'Revenue Growth Rate');
    if (revenueGrowth) {
      keyMetrics.push({
        name: "Revenue Growth",
        value: `${revenueGrowth.value}%`,
        change: revenueGrowth.change || 0,
        trend: revenueGrowth.trend || "stable",
        target: `${revenueGrowth.target}%`,
        progress: Math.round((revenueGrowth.value / (revenueGrowth.target || revenueGrowth.value)) * 100),
        icon: TrendingUp,
        color: "text-green-600"
      });
    }
    
    // Market Share
    const marketShare = strategicKPIs.find(kpi => kpi.name === 'Market Share');
    if (marketShare) {
      keyMetrics.push({
        name: "Market Share",
        value: `${marketShare.value}%`,
        change: marketShare.change || 0,
        trend: marketShare.trend || "stable",
        target: `${marketShare.target}%`,
        progress: Math.round((marketShare.value / (marketShare.target || marketShare.value)) * 100),
        icon: Target,
        color: "text-blue-600"
      });
    }
    
    // Customer Satisfaction
    const customerSat = strategicKPIs.find(kpi => kpi.name === 'Customer Satisfaction Score');
    if (customerSat) {
      keyMetrics.push({
        name: "Customer Satisfaction",
        value: `${customerSat.value}/10`,
        change: customerSat.change || 0,
        trend: customerSat.trend || "stable",
        target: `${customerSat.target}/10`,
        progress: Math.round((customerSat.value / (customerSat.target || customerSat.value)) * 100),
        icon: Users,
        color: "text-purple-600"
      });
    }
    
    // Gross Profit Margin
    const grossMargin = financialKPIs.find(kpi => kpi.name === 'Gross Profit Margin');
    if (grossMargin) {
      keyMetrics.push({
        name: "Gross Profit Margin",
        value: `${grossMargin.value}%`,
        change: grossMargin.change || 0,
        trend: grossMargin.trend || "stable",
        target: `${grossMargin.target}%`,
        progress: Math.round((grossMargin.value / (grossMargin.target || grossMargin.value)) * 100),
        icon: DollarSign,
        color: "text-green-600"
      });
    }
    
    return keyMetrics;
  };
  
  const keyMetrics = getKeyMetrics();

  // Mock data for financial health
  const financialHealth = [
    {
      name: "Gross Profit Margin",
      value: "32.8%",
      change: 1.5,
      trend: "up",
      target: "35%",
      progress: 94
    },
    {
      name: "Operating Profit Margin",
      value: "18.4%",
      change: 0.7,
      trend: "up",
      target: "20%",
      progress: 92
    },
    {
      name: "Cash Flow from Operations",
      value: "₹1.24B",
      change: 12.5,
      trend: "up",
      target: "₹1.5B",
      progress: 83
    },
    {
      name: "Return on Investment",
      value: "21.6%",
      change: -0.8,
      trend: "down",
      target: "25%",
      progress: 86
    }
  ];

  // Mock data for regional performance
  const regionalPerformance = [
    {
      region: "North",
      revenue: "₹4.2B",
      growth: 7.8,
      marketShare: 38.5
    },
    {
      region: "South",
      revenue: "₹3.8B",
      growth: 9.2,
      marketShare: 41.2
    },
    {
      region: "East",
      revenue: "₹2.9B",
      growth: 6.5,
      marketShare: 36.8
    },
    {
      region: "West",
      revenue: "₹5.1B",
      growth: 8.9,
      marketShare: 45.3
    }
  ];

  // Mock data for strategic initiatives
  const strategicInitiatives = [
    {
      name: "Digital Transformation",
      progress: 65,
      target: "Dec 2023"
    },
    {
      name: "Sustainability Goals",
      progress: 42,
      target: "Mar 2024"
    },
    {
      name: "Market Expansion",
      progress: 78,
      target: "Jun 2023"
    }
  ];

  // Get KPIs by section for organized display
  const getKPIsBySection = (section: string) => {
    return kpiData.filter(kpi => kpi.section === section);
  };

  const strategicKPIs = getKPIsBySection('Strategic Performance');
  const financialKPIs = getKPIsBySection('Financial Health');
  const demandSupplyKPIs = getKPIsBySection('Demand–Supply Mismatch');
  const productionKPIs = getKPIsBySection('Production & Inventory Health');
  const logisticsKPIs = getKPIsBySection('Logistics & Distribution');
  const marketKPIs = getKPIsBySection('Sales, Revenue & Market Insights');

  return (
    <div>
      {/* Executive Dashboard Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
        <TabsList className="grid w-[500px] grid-cols-3">
          <TabsTrigger value="overview">Executive Overview</TabsTrigger>
          <TabsTrigger value="strategic">Strategic KPIs</TabsTrigger>
          <TabsTrigger value="operational">Operational Metrics</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeView === "overview" ? (
        <div className="space-y-6">
          {/* Critical Business Alerts */}
          {criticalAlerts.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-red-800 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Critical Business Alerts
                  </CardTitle>
                  <Badge variant="destructive">{criticalAlerts.length} Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start p-4 bg-white rounded-lg border border-red-200">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-red-900">{alert.message}</div>
                        <div className="text-sm text-red-700 mt-1">
                          <span className="font-medium">Impact:</span> {alert.impact}
                        </div>
                        <div className="text-sm text-red-700">
                          <span className="font-medium">Recommended Action:</span> {alert.action}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strategic Performance Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Target className="w-6 h-6 mr-2 text-blue-600" />
                Strategic Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {strategicKPIs.slice(0, 4).map((kpi) => (
                  <EnhancedKPICard key={kpi.id} kpi={kpi} size="medium" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Health Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                Financial Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {financialKPIs.map((kpi) => (
                  <EnhancedKPICard key={kpi.id} kpi={kpi} size="medium" />
                ))}
              </div>
              </CardContent>
            </Card>

            {/* Financial Health */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Financial Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialHealth.map((metric, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <div className="flex items-center">
                          <span className="text-lg font-bold mr-2">{metric.value}</span>
                          <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            <span className="text-xs">{Math.abs(metric.change)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Progress value={metric.progress} className="h-2" />
                        <span className="text-xs text-slate-500">{metric.progress}%</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Target className="w-3 h-3 mr-1" />
                        <span>Target: {metric.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Revenue Trend (Last 12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [
                      {
                        label: "Actual Revenue",
                        data: [4.2, 4.5, 4.8, 5.1, 5.3, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.4],
                        borderColor: "#E31E24",
                        backgroundColor: "rgba(227, 30, 36, 0.1)",
                        tension: 0.4,
                      },
                      {
                        label: "Target Revenue",
                        data: [4.5, 4.8, 5.1, 5.4, 5.7, 6.0, 6.3, 6.6, 6.9, 7.2, 7.5, 7.8],
                        borderColor: "#94A3B8",
                        borderDash: [5, 5],
                        tension: 0.4,
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Market Share by Product Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Market Share by Product Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={{
                    labels: ["Milk", "Butter", "Cheese", "Yogurt", "Ice Cream", "Powder"],
                    datasets: [
                      {
                        label: "Market Share %",
                        data: [58, 72, 65, 48, 53, 61],
                        backgroundColor: ["#E31E24", "#E31E24", "#E31E24", "#E31E24", "#E31E24", "#E31E24"],
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Regional Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regionalPerformance.map((region, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-semibold">{region.region} Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-slate-500">Revenue</div>
                      <div className="text-2xl font-bold">{region.revenue}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Growth</div>
                      <div className="flex items-center">
                        <span className="text-xl font-bold mr-2">{region.growth}%</span>
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Market Share</div>
                      <div className="h-24">
                        <GaugeChart value={region.marketShare} maxValue={100} color="#DC2626" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Strategic Initiatives Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Strategic Initiatives Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {strategicInitiatives.map((initiative, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{initiative.name}</span>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Target: {initiative.target}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={initiative.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{initiative.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Daily Pulse View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Daily Business Pulse - {new Date().toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-green-800">Today's Wins</h3>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">+</span>
                      <span>Butter sales exceeded target by 12% in North region</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">+</span>
                      <span>Production efficiency improved 5% at Gujarat plant</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">+</span>
                      <span>New distributor onboarded in South region</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-red-800">Critical Attention</h3>
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-red-200 text-red-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                      <span>Stock-out risk for Amul Gold in Mumbai region</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-200 text-red-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                      <span>Cold chain breach reported in 2 delivery vehicles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-200 text-red-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                      <span>Competitor launched new product in yogurt category</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-blue-800">Decision Support</h3>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">→</span>
                      <span>Increase production of Amul Gold by 15% for Mumbai</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">→</span>
                      <span>Audit cold chain protocols in Western distribution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">→</span>
                      <span>Accelerate flavored yogurt marketing in South region</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Today's Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Sales Volume</div>
                  <div className="text-2xl font-bold">₹124.8M</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <span>8.2% vs yesterday</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Production Output</div>
                  <div className="text-2xl font-bold">842K units</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <span>3.5% vs yesterday</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Order Fill Rate</div>
                  <div className="text-2xl font-bold">96.8%</div>
                  <div className="flex items-center text-red-600 text-sm">
                    <ArrowDown className="w-3 h-3 mr-1" />
                    <span>1.2% vs yesterday</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Delivery On-Time</div>
                  <div className="text-2xl font-bold">94.5%</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <span>2.1% vs yesterday</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}