import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, AlertTriangle, Factory, Truck, Search, Send, Bot, User, BarChart3, PieChart, Activity, Target } from "lucide-react";

type MessageType = {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  metrics?: {
    label: string;
    value: string;
    change: number;
  }[];
  followUps?: string[];
};

interface IntelligentChatbotProps {
  isVisible: boolean;
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

export default function IntelligentChatbot({ isVisible }: IntelligentChatbotProps) {
  // Ensure the chatbot is only rendered when visible
  if (!isVisible) return null;
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      sender: "bot",
      content: "Welcome, Managing Director. I'm your AI assistant for quick insights and decision support. How can I help you today?",
      timestamp: new Date(),
      followUps: [
        "What are our key financial metrics?",
        "Show me critical issues",
        "Analyze market opportunities"
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Quick insight suggestions
  const quickInsights = [
    {
      label: "Financial Performance",
      query: "What's our financial performance?",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      label: "Critical Issues",
      query: "What critical issues need my attention?",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      label: "Production Efficiency",
      query: "How is our production efficiency?",
      icon: Factory,
      color: "text-blue-600"
    },
    {
      label: "Market Analysis",
      query: "Show me market share and competitive analysis",
      icon: PieChart,
      color: "text-purple-600"
    },
    {
      label: "Supply Chain Status",
      query: "Any supply chain or logistics issues?",
      icon: Truck,
      color: "text-orange-600"
    },
    {
      label: "KPI Performance",
      query: "Which KPIs are underperforming?",
      icon: BarChart3,
      color: "text-indigo-600"
    },
    {
      label: "Strategic Targets",
      query: "How are we tracking against our targets?",
      icon: Target,
      color: "text-cyan-600"
    },
    {
      label: "Operational Health",
      query: "Give me an operational health summary",
      icon: Activity,
      color: "text-emerald-600"
    }
  ];

  // Generate intelligent responses based on KPI data
  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Financial Performance
    if (lowerQuery.includes('financial') || lowerQuery.includes('finance') || lowerQuery.includes('profit') || lowerQuery.includes('revenue')) {
      const financialKPIs = kpiData.filter(kpi => kpi.section === 'Financial Health' || kpi.section === 'Strategic Performance');
      const metrics = financialKPIs.slice(0, 4).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit === '%' ? '%' : kpi.unit === 'INR Billion' ? 'B' : kpi.unit}`,
        change: kpi.change || 0
      }));
      
      return {
        content: "Here's a comprehensive view of our financial performance:",
        metrics,
        followUps: [
          "How does this compare to last quarter?",
          "What's driving our margin improvement?",
          "Where can we improve financially?"
        ]
      };
    }
    
    // Critical Issues
    if (lowerQuery.includes('critical') || lowerQuery.includes('issues') || lowerQuery.includes('problems') || lowerQuery.includes('attention')) {
      const criticalKPIs = kpiData.filter(kpi => kpi.priority === 'critical' || kpi.priority === 'high');
      const metrics = criticalKPIs.slice(0, 4).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit === '%' ? '%' : kpi.unit}`,
        change: kpi.change || 0
      }));
      
      return {
        content: "These critical areas require your immediate attention:",
        metrics,
        followUps: [
          "What actions are being taken?",
          "Show me the root cause analysis",
          "When will these be resolved?"
        ]
      };
    }
    
    // Production Efficiency
    if (lowerQuery.includes('production') || lowerQuery.includes('manufacturing') || lowerQuery.includes('plant') || lowerQuery.includes('efficiency')) {
      const productionKPIs = kpiData.filter(kpi => kpi.section === 'Production & Inventory Health');
      const metrics = productionKPIs.slice(0, 4).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit === '%' ? '%' : kpi.unit}`,
        change: kpi.change || 0
      }));
      
      return {
        content: "Current production and inventory status:",
        metrics,
        followUps: [
          "Which plants are underperforming?",
          "How can we improve utilization?",
          "What's the capacity forecast?"
        ]
      };
    }
    
    // Market Analysis
    if (lowerQuery.includes('market') || lowerQuery.includes('competitive') || lowerQuery.includes('share') || lowerQuery.includes('competitor')) {
      const marketKPIs = kpiData.filter(kpi => 
        kpi.section === 'Sales, Revenue & Market Insights' || 
        kpi.name.includes('Market Share') ||
        kpi.name.includes('Customer')
      );
      const metrics = marketKPIs.slice(0, 4).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit === '%' ? '%' : kpi.unit}`,
        change: kpi.change || 0
      }));
      
      return {
        content: "Market position and competitive analysis:",
        metrics,
        followUps: [
          "Which regions show growth potential?",
          "How do we compare to competitors?",
          "What's our brand strength?"
        ]
      };
    }
    
    // Supply Chain/Logistics
    if (lowerQuery.includes('supply') || lowerQuery.includes('logistics') || lowerQuery.includes('distribution') || lowerQuery.includes('delivery')) {
      const logisticsKPIs = kpiData.filter(kpi => kpi.section === 'Logistics & Distribution');
      const metrics = logisticsKPIs.slice(0, 4).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit === '%' ? '%' : kpi.unit}`,
        change: kpi.change || 0
      }));
      
      return {
        content: "Supply chain and logistics performance:",
        metrics,
        followUps: [
          "Any cold chain issues?",
          "How's our delivery performance?",
          "Fleet optimization opportunities?"
        ]
      };
    }
    
    // KPI Performance
    if (lowerQuery.includes('kpi') || lowerQuery.includes('underperform') || lowerQuery.includes('metrics') || lowerQuery.includes('performance')) {
      const underperformingKPIs = kpiData.filter(kpi => 
        kpi.target && kpi.value < kpi.target * 0.9
      );
      const metrics = underperformingKPIs.slice(0, 4).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit === '%' ? '%' : kpi.unit}`,
        change: kpi.change || 0
      }));
      
      return {
        content: "KPIs that need attention (below 90% of target):",
        metrics,
        followUps: [
          "What's causing the underperformance?",
          "Show me improvement plans",
          "Timeline for target achievement?"
        ]
      };
    }
    
    // Strategic Targets
    if (lowerQuery.includes('target') || lowerQuery.includes('goal') || lowerQuery.includes('tracking') || lowerQuery.includes('strategic')) {
      const strategicKPIs = kpiData.filter(kpi => kpi.section === 'Strategic Performance');
      const metrics = strategicKPIs.slice(0, 4).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit === '%' ? '%' : kpi.unit}`,
        change: kpi.change || 0
      }));
      
      return {
        content: "Strategic performance against targets:",
        metrics,
        followUps: [
          "Which targets are at risk?",
          "What's our forecast accuracy?",
          "Resource allocation needed?"
        ]
      };
    }
    
    // Default response
    return {
      content: "I can help you analyze various aspects of Amul's performance. Try asking about financial metrics, production efficiency, market analysis, or critical issues.",
      followUps: [
        "Show me financial performance",
        "What are the critical issues?",
        "How is production efficiency?"
      ]
    };
  };
  
  // Legacy sample responses for backward compatibility
  const sampleResponses: Record<string, {
    content: string;
    metrics?: { label: string; value: string; change: number }[];
    followUps?: string[];
  }> = {
    financial: {
      content: "Here's a summary of our current financial performance:",
      metrics: [
        { label: "Revenue Growth", value: "8.2%", change: 1.2 },
        { label: "Gross Profit Margin", value: "32.8%", change: 1.5 },
        { label: "Operating Profit", value: "18.4%", change: 0.7 },
        { label: "Cash Flow", value: "₹1.24B", change: 12.5 }
      ],
      followUps: [
        "How does this compare to last quarter?",
        "What's driving our margin improvement?",
        "Where can we improve financially?"
      ]
    },
    issues: {
      content: "These critical issues require your immediate attention:",
      metrics: [
        { label: "Stock-out Risk", value: "High", change: -2.5 },
        { label: "Plant Utilization", value: "68.5%", change: -12.0 },
        { label: "Cold Chain Breaches", value: "2", change: 2.0 }
      ],
      followUps: [
        "What's causing the stock-out risk?",
        "How can we improve plant utilization?",
        "Show me cold chain breach details"
      ]
    },
    production: {
      content: "Current production efficiency metrics:",
      metrics: [
        { label: "Plant Utilization", value: "82.1%", change: -1.5 },
        { label: "Production Cycle", value: "3.9 hrs", change: -0.2 },
        { label: "Wastage Rate", value: "3.2%", change: -0.3 }
      ],
      followUps: [
        "Which plant is most efficient?",
        "How can we reduce wastage?",
        "What's our production forecast?"
      ]
    },
    market: {
      content: "Based on current data, here are key market opportunities:",
      metrics: [
        { label: "South Region Yogurt", value: "₹5.8M potential", change: 15.0 },
        { label: "East Region Cheese", value: "₹3.2M potential", change: 8.5 },
        { label: "Premium Milk", value: "₹7.1M potential", change: 12.0 }
      ],
      followUps: [
        "What's driving the yogurt opportunity?",
        "Who are our competitors in cheese?",
        "How quickly can we scale premium milk?"
      ]
    },
    distribution: {
      content: "Current distribution challenges that need attention:",
      metrics: [
        { label: "On-Time Delivery", value: "94.5%", change: 0.8 },
        { label: "Fleet Utilization", value: "78.6%", change: -2.3 },
        { label: "Last-Mile Issues", value: "12 reports", change: 4.0 }
      ],
      followUps: [
        "Where are the last-mile issues occurring?",
        "How can we improve fleet utilization?",
        "What's our distributor satisfaction?"
      ]
    },
    decision: {
      content: "Based on current data, here are recommended decisions:",
      metrics: [
        { label: "Increase Mumbai Production", value: "15% recommended", change: 15.0 },
        { label: "Audit Cold Chain", value: "Western region", change: 0 },
        { label: "Marketing Investment", value: "South yogurt", change: 25.0 }
      ],
      followUps: [
        "What's the ROI on increased production?",
        "How quickly can we audit cold chain?",
        "What marketing channels are best?"
      ]
    }
  };



  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const responseData = generateResponse(userMessage.content);
      const botResponse: MessageType = {
        id: Date.now().toString(),
        sender: "bot",
        content: responseData.content,
        timestamp: new Date(),
        metrics: responseData.metrics,
        followUps: responseData.followUps
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle quick insight button click
  const handleQuickInsight = (query: string) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isVisible) return null;

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden max-h-[calc(100vh-200px)]">
      <CardHeader className="pb-3 border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bot className="w-5 h-5 mr-2 text-amul-red" />
            AI Assistant
            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100 border-0">Active</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        {/* Quick insights */}
        <div className="p-4 border-b bg-slate-50">
          <div className="text-sm font-medium mb-2">Quick Insights</div>
          <div className="flex flex-wrap gap-2">
            {quickInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="bg-white hover:bg-slate-50" 
                  onClick={() => handleQuickInsight(insight.query)}
                >
                  <Icon className={`w-3 h-3 mr-1 ${insight.color}`} />
                  {insight.label}
                </Button>
              );
            })}
          </div>
        </div>
        
        {/* Messages area */}
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4 pr-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user' 
                    ? 'bg-amul-red text-white' 
                    : 'bg-slate-100 text-slate-800'}`}
                >
                  <div className="flex items-start mb-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${message.sender === 'user' ? 'bg-white text-amul-red' : 'bg-slate-200 text-slate-700'}`}>
                      {message.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="text-sm">{message.content}</div>
                      
                      {/* Metrics display */}
                      {message.metrics && (
                        <div className="mt-3 space-y-2">
                          {message.metrics.map((metric, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white bg-opacity-10 rounded p-2">
                              <span className="text-xs">{metric.label}</span>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">{metric.value}</span>
                                <div className={`flex items-center text-xs ${metric.change > 0 ? 'text-green-400' : metric.change < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                  {metric.change > 0 ? '↑' : metric.change < 0 ? '↓' : '→'}
                                  <span>{Math.abs(metric.change)}%</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Follow-up suggestions */}
                      {message.followUps && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.followUps.map((followUp, idx) => (
                            <Button 
                              key={idx} 
                              variant="outline" 
                              size="sm" 
                              className={`text-xs ${message.sender === 'user' ? 'bg-white text-amul-red' : 'bg-white text-slate-800'}`}
                              onClick={() => handleQuickInsight(followUp)}
                            >
                              {followUp}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 rounded-lg p-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Ask me anything about your business..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-amul-red hover:bg-red-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}