import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle2, 
  Zap, 
  DollarSign, 
  Users, 
  Award, 
  Activity, 
  BarChart3,
  RefreshCw,
  X,
  Send,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  AlertOctagon,
  Shield,
  Thermometer,
  Wifi,
  Database
} from "lucide-react";

interface ExecutiveSummaryTabProps {
  timeRange: string;
}

interface Alert {
  type: string;
  message: string;
  impact: string;
  action: string;
  priority: string;
}

interface HubData {
  name: string;
  status: string;
  riskLevel: string;
  issues: string[];
}

interface InsightCard {
  id: string;
  type: "critical" | "warning";
  title: string;
  description: string;
  impact: string;
  insight: string;
}

interface ActionPlan {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CarouselAlert {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  severity: 'critical' | 'warning' | 'info';
}

export default function ExecutiveSummaryTab({ timeRange }: ExecutiveSummaryTabProps) {
  const [currentTime, setCurrentTime] = useState<string>("Loading...");
  const [chatPopup, setChatPopup] = useState(false);
  const [chatContent, setChatContent] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [activeInsight, setActiveInsight] = useState<string>("");
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Carousel alerts data
  const carouselAlerts: CarouselAlert[] = [
    {
      id: 1,
      title: "Inventory Crisis Alert",
      subtitle: "Multiple critical issues detected today",
      icon: <AlertTriangle className="h-6 w-6" />,
      bgColor: "bg-red-500",
      iconColor: "text-white",
      severity: 'critical'
    },
    {
      id: 2,
      title: "System Performance Warning",
      subtitle: "Database sync delays affecting operations",
      icon: <Database className="h-6 w-6" />,
      bgColor: "bg-orange-500",
      iconColor: "text-white",
      severity: 'warning'
    },
    {
      id: 3,
      title: "Network Connectivity Issues",
      subtitle: "Hub communication experiencing delays",
      icon: <Wifi className="h-6 w-6" />,
      bgColor: "bg-yellow-500",
      iconColor: "text-white",
      severity: 'warning'
    },
    {
      id: 4,
      title: "Temperature Monitoring Alert",
      subtitle: "Cold chain integrity at risk",
      icon: <Thermometer className="h-6 w-6" />,
      bgColor: "bg-blue-500",
      iconColor: "text-white",
      severity: 'info'
    },
    {
      id: 5,
      title: "Security Protocol Active",
      subtitle: "Enhanced monitoring in place",
      icon: <Shield className="h-6 w-6" />,
      bgColor: "bg-green-500",
      iconColor: "text-white",
      severity: 'info'
    }
  ];

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      };
      setCurrentTime(now.toLocaleString('en-IN', options));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Carousel auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % carouselAlerts.length);
      setProgress(0);
    }, 5000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2; // Increment by 2% every 100ms (5 seconds total)
      });
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [carouselAlerts.length]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentAlertIndex((prev) => (prev - 1 + carouselAlerts.length) % carouselAlerts.length);
    setProgress(0);
  };

  const goToNext = () => {
    setCurrentAlertIndex((prev) => (prev + 1) % carouselAlerts.length);
    setProgress(0);
  };

  // Hub data
  const hubData: HubData[] = [
    {
      name: "Bangalore Hub",
      status: "HIGH RISK",
      riskLevel: "critical",
      issues: [
        "Stockout rate: 52 orders (↑35%)",
        "Hub assignment errors: 41% of total",
        "Order drop-off rate: 9.1% (113 orders)"
      ]
    },
    {
      name: "Hyderabad Hub",
      status: "MODERATE RISK",
      riskLevel: "warning",
      issues: [
        "Oversold inventory: 38 orders",
        "Support ticket share: 25% of total",
        "Delivery delay: 3.2 hours avg."
      ]
    },
    {
      name: "Ahmedabad Hub",
      status: "MODERATE RISK",
      riskLevel: "warning",
      issues: [
        "Sync lag: 19 mins (↑5 mins)",
        "Oversold inventory: 22 orders",
        "Logistics cost increase: ₹28K"
      ]
    }
  ];

  // Insight cards data
  const insightCards: InsightCard[] = [
    {
      id: "overselling",
      type: "critical",
      title: "₹3.2L Lost to Overselling Today",
      description: "127 orders placed during inventory lag window were oversold today, resulting in ₹3.2 lakh refunds. Average inventory sync delay: 18 mins.",
      impact: "Majority impact: Bangalore, Hyderabad hubs",
      insight: "overselling"
    },
    {
      id: "stockouts",
      type: "warning",
      title: "Stockout Cancellations from Bangalore ↑35%",
      description: "Order cancellations due to stockouts rose 35% from baseline. Bangalore hub saw the highest spike (52 orders).",
      impact: "Potential lost revenue: ₹1.8L",
      insight: "stockouts"
    },
    {
      id: "tickets",
      type: "warning",
      title: "78 Support Tickets Raised Due to Unavailable Items",
      description: "Customers flagged 78 orders as undelivered due to real-time inventory mismatch — a 2.2x increase from usual.",
      impact: "Customer satisfaction at risk",
      insight: "tickets"
    },
    {
      id: "synclag",
      type: "critical",
      title: "Inventory Sync Lag Crossing SLA",
      description: "Today's average inventory sync lag is 21 minutes — exceeding acceptable SLA by 6 mins.",
      impact: "Delays primarily from: Bangalore & Ahmedabad zones",
      insight: "synclag"
    },
    {
      id: "hubmismatch",
      type: "warning",
      title: "₹2.1L in Revenue Delays Due to Hub Mismatch",
      description: "93 orders with hub assignment errors today. 41% came from Bangalore hub, causing cumulative delay of 9.6 hours and estimated ₹2.1L of delayed revenue.",
      impact: "Cash flow impact significant",
      insight: "hubmismatch"
    },
    {
      id: "deliverydelay",
      type: "warning",
      title: "Avg. Delivery Delay ↑3.2 Hours for Rerouted Orders",
      description: "Rerouted orders are being delivered 3.2 hours later than baseline SLA. Highest delays: Pune (4.1 hrs) and Bangalore (3.8 hrs) routes.",
      impact: "Customer experience deteriorating",
      insight: "deliverydelay"
    },
    {
      id: "logisticscost",
      type: "warning",
      title: "₹85K Additional Logistics Cost from Rerouting",
      description: "Mismatch in hub inventory caused extra rerouting cost of ₹85K today. Repeat issue observed in Eastern region (₹32K).",
      impact: "Profit margins eroding",
      insight: "logisticscost"
    },
    {
      id: "dropoff",
      type: "critical",
      title: "9.1% Drop-off Due to Delayed Fulfillment",
      description: "Delayed fulfillment led to 113 order drop-offs today — a potential ₹4.5L revenue loss. Bangalore had highest impact.",
      impact: "Immediate intervention needed",
      insight: "dropoff"
    }
  ];

  // Action plan data
  const actionPlans: ActionPlan[] = [
    {
      title: "Immediate Sync Interval Reduction",
      description: "Reduce sync intervals from 15 mins to 5 mins for all high-velocity SKUs, especially in Bangalore & Hyderabad hubs.",
      icon: <Clock className="h-6 w-6 text-slate-700" />
    },
    {
      title: "Implement Safety Stock Buffers",
      description: "Add 15% safety stock buffer to all high-demand products in Bangalore hub to prevent stockouts during sync delays.",
      icon: <CheckCircle2 className="h-6 w-6 text-slate-700" />
    },
    {
      title: "Deploy Auto-Response System",
      description: "Implement automated customer communication for affected orders with compensation offers to maintain satisfaction.",
      icon: <Users className="h-6 w-6 text-slate-700" />
    },
    {
      title: "Audit Hub Assignment Logic",
      description: "Revise routing algorithms to prioritize inventory availability over proximity for high-value orders.",
      icon: <BarChart3 className="h-6 w-6 text-slate-700" />
    }
  ];

  // Chat data
  const chatData: Record<string, any[]> = {
    overselling: [
      { type: 'system', message: 'Overselling Alert Details' },
      { type: 'system', message: '• 127 orders were oversold today due to inventory sync delays' },
      { type: 'system', message: '• Total refund amount: ₹3.2 lakhs' },
      { type: 'system', message: '• Average inventory sync delay: 18 minutes' },
      { type: 'system', message: '• Most affected categories: Electronics (42%), Fashion (31%)' },
      { type: 'system', message: '• Primary cause: Inventory system lag during peak hours (11AM-2PM)' },
      { type: 'system', message: 'What specific information would you like about this issue?' }
    ],
    stockouts: [
      { type: 'system', message: 'Stockout Cancellations Details' },
      { type: 'system', message: '• Cancellations due to stockouts increased 35% from baseline' },
      { type: 'system', message: '• Bangalore hub most affected with 52 cancelled orders' },
      { type: 'system', message: '• Estimated revenue loss: ₹1.8 lakhs' },
      { type: 'system', message: '• Top affected products: Smartphones, Premium Apparel' },
      { type: 'system', message: '• Recommended action: Audit replenishment cycles and product velocity' },
      { type: 'system', message: 'What specific information would you like about this issue?' }
    ],
    tickets: [
      { type: 'system', message: 'Support Tickets Details' },
      { type: 'system', message: '• 78 customer support tickets raised today' },
      { type: 'system', message: '• 2.2x increase from usual daily average' },
      { type: 'system', message: '• Primary complaint: Items showing as available but unavailable at checkout' },
      { type: 'system', message: '• Average resolution time: 4.3 hours (73% above normal)' },
      { type: 'system', message: '• Recommended action: Deploy auto-response and initiate sync diagnostics' },
      { type: 'system', message: 'What specific information would you like about this issue?' }
    ],
    synclag: [
      { type: 'system', message: 'Inventory Sync Lag Details' },
      { type: 'system', message: '• Current average sync lag: 21 minutes' },
      { type: 'system', message: '• Exceeding acceptable SLA by 6 minutes' },
      { type: 'system', message: '• Primary affected zones: Bangalore (24 min) & Ahmedabad (19 min)' },
      { type: 'system', message: '• Root cause analysis: Database query optimization issues during peak load' },
      { type: 'system', message: '• Recommended action: Revisit integration throughput and update schedules' },
      { type: 'system', message: 'What specific information would you like about this issue?' }
    ],
    hubmismatch: [
      { type: 'system', message: 'Hub Assignment Error Details' },
      { type: 'system', message: '• 93 orders with hub assignment errors today' },
      { type: 'system', message: '• 41% originated from Bangalore hub' },
      { type: 'system', message: '• Cumulative delivery delay: 9.6 hours' },
      { type: 'system', message: '• Estimated delayed revenue: ₹2.1 lakhs' },
      { type: 'system', message: '• Recommended action: Audit hub assignment logic, adjust regional stock buffers' },
      { type: 'system', message: 'What specific information would you like about this issue?' }
    ],
    deliverydelay: [
      { type: 'system', message: 'Delivery Delay Details' },
      { type: 'system', message: '• Average delivery delay for rerouted orders: 3.2 hours' },
      { type: 'system', message: '• Highest delay routes: Pune (4.1 hrs) and Bangalore (3.8 hrs)' },
      { type: 'system', message: '• Customer satisfaction impact: 18% increase in negative feedback' },
      { type: 'system', message: '• Recommended action: Check alternate hub inventory and last-mile scheduling' },
      { type: 'system', message: 'What specific information would you like about this issue?' }
    ],
    logisticscost: [
      { type: 'system', message: 'Additional Logistics Cost Details' },
      { type: 'system', message: '• Extra rerouting cost today: ₹85,000' },
      { type: 'system', message: '• Primary cause: Mismatch in hub inventory' },
      { type: 'system', message: '• Most affected region: Eastern (₹32,000)' },
      { type: 'system', message: '• Cost breakdown: Express shipping (62%), Additional handling (28%), Other (10%)' },
      { type: 'system', message: '• Recommended action: Consider predictive replenishment or hub capacity reshuffling' },
      { type: 'system', message: 'What specific information would you like about this issue?' }
    ],
    dropoff: [
      { type: 'system', message: 'Order Drop-off Details' },
      { type: 'system', message: '• Current drop-off rate: 9.1%' },
      { type: 'system', message: '• Total affected orders: 113' },
      { type: 'system', message: '• Potential revenue loss: ₹4.5 lakhs' },
      { type: 'system', message: '• Highest impact location: Bangalore' },
      { type: 'system', message: '• Customer segment most affected: Premium tier (58%)' },
      { type: 'system', message: '• Recommended action: Send alerts for time-sensitive SKUs with delivery guarantees' },
      { type: 'system', message: 'What specific information would you like about this issue?' }
    ]
  };

  // Sample responses for user questions
  const responses: Record<string, string> = {
    'why': 'The primary causes are: 1) Inventory system lag during peak hours, 2) Insufficient buffer stock in high-demand hubs, 3) Database query optimization issues, and 4) Outdated hub assignment logic that doesn\'t account for real-time inventory.',
    'fix': 'Immediate fixes include: 1) Reduce sync intervals to 5 minutes, 2) Implement 15% safety stock buffer, 3) Deploy auto-response system for affected customers, and 4) Revise routing algorithms to prioritize inventory availability.',
    'impact': 'The total financial impact is approximately ₹9.6 lakhs, including ₹3.2L in refunds, ₹1.8L in stockout cancellations, ₹2.1L in delayed revenue, ₹85K in additional logistics costs, and ₹4.5L in potential revenue loss from drop-offs.',
    'bangalore': 'Bangalore hub is experiencing the most severe issues with 52 stockout cancellations, 41% of all hub assignment errors, and the highest order drop-off rate (9.1%). This appears to be due to high order volume combined with insufficient inventory buffers.',
    'sync': 'Current sync lag is 21 minutes (6 minutes above SLA). The lag is primarily affecting Bangalore (24 min) and Ahmedabad (19 min) zones. Root cause appears to be database query optimization issues during peak load periods.',
    'help': 'You can ask about causes, recommended fixes, financial impact, specific hubs like Bangalore, or details about the inventory sync lag. You can also ask for specific action plans to address these issues.'
  };

  const handleKnowMore = (insight: string) => {
    setActiveInsight(insight);
    setChatContent(chatData[insight] || []);
    setChatPopup(true);
  };

  const handleCloseChat = () => {
    setChatPopup(false);
    setChatContent([]);
    setChatInput("");
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user', message: chatInput };
    setChatContent(prev => [...prev, userMessage]);
    setChatInput("");

    // Simple response logic
    setTimeout(() => {
      let response = 'I don\'t have specific information about that. Try asking about causes, fixes, impact, or specific hubs like Bangalore.';
      
      // Check for keywords in the message
      for (const [keyword, reply] of Object.entries(responses)) {
        if (chatInput.toLowerCase().includes(keyword.toLowerCase())) {
          response = reply;
          break;
        }
      }
      
      setChatContent(prev => [...prev, { type: 'system', message: response }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const currentAlert = carouselAlerts[currentAlertIndex];

  return (
    <div className="min-h-screen">
      {/* Header with Carousel */}
      <header className="bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg rounded-xl relative overflow-hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center flex-1">
              <div className={`${currentAlert.bgColor} p-2 rounded-full mr-3`}>
                <div className={currentAlert.iconColor}>
                  {currentAlert.icon}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{currentAlert.title}</h1>
                <p className="text-slate-300">{currentAlert.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">Last updated</p>
                <p className="font-semibold">{currentTime}</p>
              </div>
              <Button className="bg-white text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Refresh Alerts
              </Button>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-4">
            <Button 
              onClick={goToPrevious}
              variant="ghost" 
              className="text-white hover:text-slate-300 hover:bg-slate-600 p-2 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {/* Progress Indicators */}
            <div className="flex space-x-2">
              {carouselAlerts.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentAlertIndex ? 'bg-white' : 'bg-slate-500'
                  }`}
                />
              ))}
            </div>
            
            <Button 
              onClick={goToNext}
              variant="ghost" 
              className="text-white hover:text-slate-300 hover:bg-slate-600 p-2 rounded-full"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Loading Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-600">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 shadow-md">
          <div className="flex items-start">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">₹9.6 Lakhs at Risk Today</h2>
              <p className="text-slate-700 mt-1">Immediate action required: Inventory sync delays causing significant revenue loss and customer dissatisfaction</p>
            </div>
          </div>
        </div>

        {/* Hub Impact Analysis */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Hub Impact Analysis</h3>
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hubData.map((hub, index) => (
              <div key={hub.name} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-800">{hub.name}</h4>
                  <div className={`flex items-center ${hub.riskLevel === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {hub.status}
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  {hub.issues.map((issue, issueIndex) => (
                    <li key={issueIndex} className="flex items-start">
                      <ChevronRight className={`h-5 w-5 ${hub.riskLevel === 'critical' ? 'text-red-600' : 'text-amber-600'} mr-2 flex-shrink-0`} />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Section 1: Inventory Sync & Overselling */}
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2 text-slate-600" />
          Inventory Sync Delay & Overselling
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {insightCards.slice(0, 4).map((card) => (
            <div key={card.id} className={`insight-card ${card.type} bg-white rounded-xl shadow-md p-5 relative transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`}>
              <div className={`absolute -top-3 -right-3 ${card.type === 'critical' ? 'bg-red-100' : 'bg-amber-100'} p-1.5 rounded-full border-2 border-white`}>
                <AlertCircle className={`h-5 w-5 ${card.type === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">{card.title}</h4>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">{card.impact}</span>
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  onClick={() => handleKnowMore(card.insight)}
                >
                  Know More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Plan Section */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Urgent Action Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionPlans.map((plan, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-lg mr-3">
                    {plan.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{plan.title}</h4>
                    <p className="text-sm text-slate-300 mt-1">{plan.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button className="bg-white text-slate-800 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
              Implement Emergency Protocol
            </Button>
          </div>
        </div>

        {/* Insights Section 2: Routing Errors */}
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Activity className="h-6 w-6 mr-2 text-slate-600" />
          Hub Assignment Errors & Reassignments
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {insightCards.slice(4).map((card) => (
            <div key={card.id} className={`insight-card ${card.type} bg-white rounded-xl shadow-md p-5 relative transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`}>
              <div className={`absolute -top-3 -right-3 ${card.type === 'critical' ? 'bg-red-100' : 'bg-amber-100'} p-1.5 rounded-full border-2 border-white`}>
                <AlertCircle className={`h-5 w-5 ${card.type === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">{card.title}</h4>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">{card.impact}</span>
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  onClick={() => handleKnowMore(card.insight)}
                >
                  Know More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Chat Popup */}
      {chatPopup && (
        <div className="fixed bottom-0 right-0 mb-4 mr-4 w-96 bg-white rounded-t-xl shadow-2xl z-50">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-xl px-6 py-4 flex justify-between items-center">
            <h3 className="text-white font-semibold">Inventory Assistant</h3>
            <Button variant="ghost" onClick={handleCloseChat} className="text-white hover:text-slate-300">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4 h-80 overflow-y-auto">
            {chatContent.map((msg, index) => (
              <div key={index} className="mb-4">
                {msg.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-slate-700 text-white rounded-lg py-2 px-4 max-w-xs">
                      {msg.message}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg py-2 px-4 max-w-xs">
                      {msg.message}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="border-t p-4 flex">
            <Input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Ask about this issue..."
            />
            <Button onClick={handleSendMessage} className="bg-slate-700 text-white rounded-r-lg px-4 py-2 hover:bg-slate-800">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
