import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, AlertTriangle, Factory, Truck, Search, Send, Bot, User, BarChart3, PieChart, Activity, Target, X, MessageCircle, DollarSign } from "lucide-react";

type MessageType = {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  metrics?: {
    label: string;
    value: string;
    // change?: number;
  }[];
  followUps?: string[];
};

interface IntelligentChatbotProps {
  isVisible: boolean;
  onClose?: () => void;
  initialContext?: {
    messages?: MessageType[];
    title?: string;
    description?: string;
    type?: string; // 'insight' or 'context'
    insight?: string; // e.g., 'financial', 'critical', 'production'
    context?: any[]; // Array of messages or data
  };
}

interface KPI {
  id: number;
  name: string;
  unit: string;
  section: string;
  description: string;
  value: number;
  trend?: string;
  // change?: number;
  target?: number;
  priority?: string;
  benchmark?: string;
  history?: number[];
}

export default function IntelligentChatbot({ isVisible, onClose, initialContext }: IntelligentChatbotProps) {
  // Ensure the chatbot is only rendered when visible
  if (!isVisible) return null;
  
  const defaultMessages: MessageType[] = [
    {
      id: "welcome",
      sender: "bot",
      content: "Welcome, Managing Director. I'm your AI assistant for quick insights and decision support. How can I help you today?",
      timestamp: new Date(),
      followUps: [
        "📊 Market Analysis",
        "💬 Customer Sentiments", 
        "💰 Financial Performance",
        "🚚 Inventory & Logistics Health"
      ]
    }
  ];

  const [messages, setMessages] = useState<MessageType[]>(
    initialContext?.messages || defaultMessages
  );
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle initial context when it changes
  useEffect(() => {
    if (initialContext?.type === 'insight' && initialContext?.context) {
      const contextMessages: MessageType[] = [
        {
          id: "welcome",
          sender: "bot",
          content: "Welcome, Managing Director. I'm your AI assistant for quick insights and decision support. How can I help you today?",
          timestamp: new Date(),
          followUps: [
            "📊 Market Analysis",
            "💬 Customer Sentiments", 
            "💰 Financial Performance",
            "🚚 Inventory & Logistics Health"
          ]
        },
        {
          id: "context-intro",
          sender: "bot",
          content: `I have detailed information about the ${initialContext.insight} issue. Here's what I know:`,
          timestamp: new Date()
        }
      ];
      
      // Convert chat data to messages (limit to first 3 messages)
      if (Array.isArray(initialContext.context)) {
        initialContext.context.slice(0, 3).forEach((msg: any, index: number) => {
          if (msg.type === 'system') {
            contextMessages.push({
              id: `context-${index}`,
              sender: "bot",
              content: msg.message,
              timestamp: new Date()
            });
          }
        });
      }
      
      // Add follow-up suggestions (remove the duplicate "What specific information" message)
      contextMessages.push({
        id: "context-followup",
        sender: "bot",
        content: "What specific information would you like about this issue?",
        timestamp: new Date(),
        followUps: [
          "What's causing this issue?",
          "How can we fix this?",
          "What's the financial impact?",
          "Show me action plans"
        ]
      });
      
      setMessages(contextMessages);
    } else if (initialContext?.type === 'emergency' && initialContext?.context) {
      const emergencyMessages: MessageType[] = [
        {
          id: "welcome",
          sender: "bot",
          content: "Welcome, Managing Director. I'm your AI assistant for quick insights and decision support. How can I help you today?",
          timestamp: new Date(),
          followUps: [
            "📊 Market Analysis",
            "💬 Customer Sentiments", 
            "💰 Financial Performance",
            "🚚 Inventory & Logistics Health"
          ]
        },
        {
          id: "emergency-actions",
          sender: "bot",
          content: "As Managing Director, here are your immediate action options:",
          timestamp: new Date(),
          followUps: [
            "📞 Call for urgent meeting",
            "📊 Generate 3-month report",
            // "📅 Send calendar invite",
            "⏰ Schedule future meeting"
          ]
        }
      ];
      
      setMessages(emergencyMessages);
    }
  }, [initialContext]);

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
    // {
    //   label: "Financial Performance",
    //   query: "What's our financial performance?",
    //   icon: TrendingUp,
    //   color: "text-green-600"
    // },
    // {
    //   label: "Critical Issues",
    //   query: "What critical issues need my attention?",
    //   icon: AlertTriangle,
    //   color: "text-red-600"
    // },
    // {
    //   label: "Production Efficiency",
    //   query: "How is our production efficiency?",
    //   icon: Factory,
    //   color: "text-blue-600"
    // },
    {
      label: "Market Analysis",
      query: "Show me market share and competitive analysis",
      icon: PieChart,
      color: "text-purple-600"
    },
    {
      label: "Customer Sentiments",
      query: "What are customers saying about us?",
      icon: MessageCircle,
      color: "text-purple-600"
    },
    // {
    //   label: "Supply Chain Status",
    //   query: "Any supply chain or logistics issues?",
    //   icon: Truck,
    //   color: "text-orange-600"
    // },
    // {
    //   label: "KPI Performance",
    //   query: "Which KPIs are underperforming?",
    //   icon: BarChart3,
    //   color: "text-indigo-600"
    // },
    // {
    //   label: "Strategic Targets",
    //   query: "How are we tracking against our targets?",
    //   icon: Target,
    //   color: "text-cyan-600"
    // },
    // {
    //   label: "Operational Health",
    //   query: "Give me an operational health summary",
    //   icon: Activity,
    //   color: "text-emerald-600"
    // }
    {
      label: "Financial Performance",
      query: "How are we performing financially?",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      label: "Inventory & Logistics Health",
      query: "What’s the current status of our inventory and logistics?",
      icon: Truck,
      color: "text-yellow-600"
    }

  ];

  // Generate AI response based on user input
  const generateResponse = (userInput: string) => {
    const lowerQuery = userInput.toLowerCase();
    
    // First check for insight-specific queries
    const insightResponse = handleInsightQuery(userInput);
    if (insightResponse) {
      return insightResponse;
    }
    
    // Financial Performance
    if (lowerQuery.includes('financial') || lowerQuery.includes('finance') || lowerQuery.includes('profit') || lowerQuery.includes('revenue')) {
      const financialKPIs = kpiData.filter(kpi => kpi.section === 'Financial Health' || kpi.section === 'Strategic Performance');
      const metrics = financialKPIs.slice(0, 4).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit}`,
      }));
      
      return {
        content: "Here's a comprehensive view of our financial performance:",
        metrics,
        followUps: [
          "Show me revenue breakdown",
          "What's our profit margin trend?",
          "Where can we improve financially?"
        ]
      };
    }
    
    // Critical Issues
    if (lowerQuery.includes('critical') || lowerQuery.includes('issues') || lowerQuery.includes('problems') || lowerQuery.includes('alerts')) {
      const criticalKPIs = kpiData.filter(kpi => 
        kpi.section === 'Sales, Revenue & Market Insights' ||
        kpi.section === 'Operational Efficiency' ||
        kpi.priority === 'high'
      );
      const metrics = criticalKPIs.slice(0, 3).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit}`,
      }));
      
      return {
        content: "Here are the critical issues requiring immediate attention:",
        metrics,
        followUps: [
          "What's causing these issues?",
          "Show me action plans",
          "How can we resolve these quickly?"
        ]
      };
    }
    
    // Production Efficiency
    if (lowerQuery.includes('production') || lowerQuery.includes('efficiency') || lowerQuery.includes('manufacturing')) {
      const productionKPIs = kpiData.filter(kpi => kpi.section === 'Operational Efficiency');
      const metrics = productionKPIs.slice(0, 3).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit}`,
      }));
      
      return {
        content: "Here's our current production efficiency status:",
        metrics,
        followUps: [
          "Which plants are underperforming?",
          "Show me capacity utilization",
          "What's our quality score?"
        ]
      };
    }
    
    // Customer Sentiments
    if (lowerQuery.includes('customer') || lowerQuery.includes('sentiment') || lowerQuery.includes('saying')) {
      return {
        content: "Here's what customers are saying about Amul:",
        metrics: [
          { label: "Customer Satisfaction", value: "4.6/5"},
          { label: "Net Promoter Score", value: "72"},
          { label: "Social Media Sentiment", value: "85% Positive"}
        ],
        followUps: [
          "What are the main complaints?",
          "Show me positive feedback",
          "How can we improve satisfaction?"
        ]
      };
    }
    
    // Customer Complaints
    if (lowerQuery.includes('complaint') || lowerQuery.includes('complaints')) {
      return {
        content: "Here are the main customer complaints we're tracking:",
        metrics: [
          { label: "Delivery Delays", value: "32%"},
          { label: "Product Availability", value: "28%"},
          { label: "Packaging Issues", value: "15%"}
        ],
        followUps: [
          "What's causing delivery delays?",
          "How can we reduce complaints?",
          "Show me complaint trends"
        ]
      };
    }
    
    // Positive Feedback
    if (lowerQuery.includes('positive') || lowerQuery.includes('feedback') || lowerQuery.includes('good')) {
      return {
        content: "Here's the positive feedback from our customers:",
        metrics: [
          { label: "Product Quality", value: "94% Positive"},
          { label: "Taste & Freshness", value: "91% Positive"},
          { label: "Brand Trust", value: "89% Positive"}
        ],
        followUps: [
          "What products get most praise?",
          "Show me customer testimonials",
          "How can we leverage this?"
        ]
      };
    }
    
    // Improve Satisfaction
    if (lowerQuery.includes('improve') || lowerQuery.includes('satisfaction') || lowerQuery.includes('better')) {
      return {
        content: "Here are the key areas to improve customer satisfaction:",
        metrics: [
          { label: "Faster Delivery"},
          { label: "Better Communication"},
          { label: "Product Variety"}
        ],
        followUps: [
          "How to improve delivery plan?",
          "Show me communication strategies",
          "How can we measure improvement?"
        ]
      };
    }
    
    // Market Analysis
    if (lowerQuery.includes('market') || lowerQuery.includes('competitive') || lowerQuery.includes('share')) {
      const marketKPIs = kpiData.filter(kpi => kpi.section === 'Sales, Revenue & Market Insights');
      const metrics = marketKPIs.slice(0, 3).map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit}`,
      }));
      
      return {
        content: "Here's our market position and competitive analysis:",
        metrics,
        followUps: [
          "Who are our main competitors?",
          "Show me regional performance",
          "What's our growth potential?"
        ]
      };
    }
    
    // Supply Chain
    if (lowerQuery.includes('supply') || lowerQuery.includes('logistics') || lowerQuery.includes('chain')) {
      return {
        content: "Here's our supply chain and logistics performance:",
        metrics: [
          { label: "On-Time Delivery", value: "94.2%"},
          { label: "Inventory Turnover", value: "8.5x"},
          { label: "Supplier Performance", value: "92.8%"}
        ],
        followUps: [
          "Any cold chain issues?",
          "Show me delivery delays",
          "What's our supplier risk?"
        ]
      };
    }
    
    // KPI Performance
    if (lowerQuery.includes('kpi') || lowerQuery.includes('performance') || lowerQuery.includes('metrics')) {
      const underperformingKPIs = kpiData.slice(0, 3); // Just take first 3 KPIs instead of filtering by change
      const metrics = underperformingKPIs.map(kpi => ({
        label: kpi.name,
        value: `${kpi.value}${kpi.unit}`,
      }));
      
      return {
        content: "Here are the KPIs that need attention:",
        metrics,
        followUps: [
          "What's causing these declines?",
          "Show me improvement plans",
          "Which KPIs are improving?"
        ]
      };
    }
    
    // Strategic Targets
    if (lowerQuery.includes('target') || lowerQuery.includes('strategic') || lowerQuery.includes('goals')) {
      return {
        content: "Here's how we're tracking against our strategic targets:",
        metrics: [
          { label: "Revenue Target", value: "85%"},
          { label: "Market Share Goal", value: "92%"},
          { label: "Efficiency Target", value: "78%"}
        ],
        followUps: [
          "What's our progress timeline?",
          "Show me target breakdown",
          "Which targets are at risk?"
        ]
      };
    }
    
    // Operational Health
    if (lowerQuery.includes('operational') || lowerQuery.includes('health') || lowerQuery.includes('overview')) {
      return {
        content: "Here's our overall operational health summary:",
        metrics: [
          { label: "System Uptime", value: "99.2%"},
          { label: "Customer Satisfaction", value: "4.6/5"},
          { label: "Employee Productivity", value: "87%"}
        ],
        followUps: [
          "Show me detailed metrics",
          "What areas need improvement?",
          "How do we compare to industry?"
        ]
      };
    }
    
    // Default response
    return {
      content: "I can help you analyze various aspects of Amul's performance. Try asking about financial metrics, production efficiency, market analysis, or critical issues.",
      metrics: [],
      followUps: [
        "Show me financial performance",
        "What are our critical issues?",
        "Analyze market opportunities"
      ]
    };
  };

  // Handle specific insight types from executive summary
  const handleInsightQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Emergency Protocol Actions
    if (lowerQuery.includes('call for urgent meeting') || lowerQuery.includes('urgent meeting')) {
      return {
        content: "🚨 URGENT MEETING INITIATED - I've sent immediate notifications to all department heads and key stakeholders. Meeting scheduled for the next available slot.",
        metrics: [
          { label: "Notifications Sent", value: "12"},
          { label: "Meeting Status", value: "Scheduled"}
        ],
        followUps: [
          "📋 Prepare meeting agenda",
          "📊 Get latest metrics",
          "👥 Add specific attendees"
        ]
      };
    }
    
    if (lowerQuery.includes('generate 3-month report') || lowerQuery.includes('3-month report')) {
      return {
        content: "📊 3-MONTH REPORT GENERATION - I'm compiling comprehensive data including financial impact, trend analysis, and predictive insights.",
        metrics: [
          { label: "Report Sections", value: "8"},
          { label: "Data Points", value: "2,450"},
          { label: "Generation Time", value: "3 mins"}
        ],
        followUps: [
          "📈 Add executive summary",
          "🎯 Focus on specific metrics",
          "📤 Send to stakeholders"
        ]
      };
    }
    
    // if (lowerQuery.includes('send calendar invite') || lowerQuery.includes('calendar invite')) {
    //   return {
    //     content: "📅 CALENDAR INVITE SENT - Emergency protocol meeting invitation has been sent to all relevant executives and department heads.",
    //     metrics: [
    //       { label: "Invites Sent", value: "15", change: 0 },
    //       { label: "Acceptance Rate", value: "87%", change: 0 },
    //       { label: "Meeting Duration", value: "90 mins", change: 0 }
    //     ],
    //     followUps: [
    //       "📋 Set meeting agenda",
    //       "👥 Add more attendees",
    //       "⏰ Adjust meeting time"
    //     ]
    //   };
    // }
    
    if (lowerQuery.includes('schedule future meeting') || lowerQuery.includes('future meeting')) {
      return {
        content: "⏰ FUTURE MEETING SCHEDULED - Strategic planning session has been scheduled for next week to address long-term solutions.",
        metrics: [
          { label: "Scheduled Date", value: "Next Week"},
          { label: "Duration", value: "2 hours"},
          { label: "Attendees", value: "8"}
        ],
        followUps: [
          "📋 Prepare strategic agenda",
          "📊 Include trend analysis",
          "🎯 Set clear objectives"
        ]
      };
    }
    
    // Overselling
    if (lowerQuery.includes('overselling') || lowerQuery.includes('oversold')) {
      return {
        content: "Here are the details about the overselling issue:",
        metrics: [
          { label: "Oversold Orders", value: "127"},
          { label: "Refund Amount", value: "₹3.2L"},
          { label: "Sync Delay", value: "18 mins"}
        ],
        followUps: [
          "What's causing the overselling?",
          "How can we prevent this?",
          "What's the financial impact?"
        ]
      };
    }
    
    // Stockouts
    if (lowerQuery.includes('stockout') || lowerQuery.includes('stock out')) {
      return {
        content: "Here are the stockout cancellation details:",
        metrics: [
          { label: "Cancellations", value: "52 orders"},
          { label: "Revenue Loss", value: "₹1.8L"},
          { label: "Bangalore Impact", value: "Highest"}
        ],
        followUps: [
          "Why are stockouts increasing?",
          "How can we improve inventory?",
          "What's the root cause?"
        ]
      };
    }
    
    // Support Tickets
    if (lowerQuery.includes('ticket') || lowerQuery.includes('support')) {
      return {
        content: "Here are the support ticket details:",
        metrics: [
          { label: "Tickets Raised", value: "78"},
          { label: "Resolution Time", value: "4.3 hrs"},
          { label: "Customer Impact", value: "High"}
        ],
        followUps: [
          "What's causing the ticket spike?",
          "How can we reduce tickets?",
          "What's the customer impact?"
        ]
      };
    }
    
    // Sync Lag
    if (lowerQuery.includes('sync') || lowerQuery.includes('lag')) {
      return {
        content: "Here are the inventory sync lag details:",
        metrics: [
          { label: "Current Lag", value: "21 mins"},
          { label: "SLA Breach", value: "6 mins"},
          { label: "Affected Zones", value: "Bangalore, Ahmedabad"}
        ],
        followUps: [
          "What's causing the sync delays?",
          "How can we improve sync?",
          "What's the technical issue?"
        ]
      };
    }
    
    // Hub Mismatch
    if (lowerQuery.includes('hub') || lowerQuery.includes('assignment')) {
      return {
        content: "Here are the hub assignment error details:",
        metrics: [
          { label: "Assignment Errors", value: "93 orders"},
          { label: "Delivery Delay", value: "9.6 hrs"},
          { label: "Revenue Impact", value: "₹2.1L"}
        ],
        followUps: [
          "What's causing the assignment errors?",
          "How can we fix routing?",
          "What's the logistics impact?"
        ]
      };
    }
    
    // Delivery Delay
    if (lowerQuery.includes('delivery') || lowerQuery.includes('delay')) {
      return {
        content: "Here are the delivery delay details:",
        metrics: [
          { label: "Avg Delay", value: "3.2 hrs"},
          { label: "Customer Impact", value: "18%"},
          { label: "Worst Routes", value: "Pune, Bangalore"}
        ],
        followUps: [
          "What's causing the delays?",
          "How can we improve delivery?",
          "What's the customer impact?"
        ]
      };
    }
    
    // Logistics Cost
    if (lowerQuery.includes('logistics') || lowerQuery.includes('cost')) {
      return {
        content: "Here are the logistics cost details:",
        metrics: [
          { label: "Additional Cost", value: "₹85K"},
          { label: "Rerouting Cost", value: "62%"},
          { label: "Eastern Region", value: "₹32K"}
        ],
        followUps: [
          "What's causing the cost increase?",
          "How can we reduce logistics cost?",
          "What's the cost breakdown?"
        ]
      };
    }
    
    // Drop-off
    if (lowerQuery.includes('drop') || lowerQuery.includes('dropoff')) {
      return {
        content: "Here are the order drop-off details:",
        metrics: [
          { label: "Drop-off Rate", value: "9.1%"},
          { label: "Affected Orders", value: "113"},
          { label: "Revenue Loss", value: "₹4.5L"}
        ],
        followUps: [
          "What's causing the drop-offs?",
          "How can we reduce drop-offs?",
          "What's the customer behavior?"
        ]
      };
    }
    
    // If no specific insight found, return null to let the main generateResponse handle it
    return null;
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
    // Map follow-up button text to actual queries
    let actualQuery = query;
    if (query.includes("📊 Market Analysis")) {
      actualQuery = "Show me market share and competitive analysis";
    } else if (query.includes("💬 Customer Sentiments")) {
      actualQuery = "What are customers saying about us?";
    } else if (query.includes("💰 Financial Performance")) {
      actualQuery = "How are we performing financially?";
    } else if (query.includes("🚚 Inventory & Logistics Health")) {
      actualQuery = "What's the current status of our inventory and logistics?";
    }
    
    // Add user message immediately
    const userMessage: MessageType = {
      id: Date.now().toString(),
      sender: "user",
      content: actualQuery,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate AI processing delay and generate response
    setTimeout(() => {
      const responseData = generateResponse(actualQuery);
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 w-96 h-[760px] bg-white rounded-tl-xl shadow-2xl border border-slate-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-slate-50 rounded-tl-xl">
        <div className="flex items-center">
          <Bot className="w-5 h-5 mr-2 text-amul-red" />
          <span className="font-semibold text-slate-800">AI Assistant</span>
          <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100 border-0">Active</Badge>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Messages area */}
      <ScrollArea className="flex-1 p-2">
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
                  <div className="flex-1">
                    <div className="text-sm">{message.content}</div>
                    
                    {/* Metrics display */}
                    {message.metrics && (
                      <div className="mt-3 space-y-2">
                        {message.metrics.map((metric, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs bg-white bg-opacity-50 rounded p-2">
                            <span className="font-medium">{metric.label}</span>
                            <div className="flex items-center space-x-1">
                              <span className="font-bold">{metric.value}</span>
                              {/* {metric.change !== undefined && ( */}
                              {/* <span className={`text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                                </span> */}
                              {/* )} */}
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
    </div>
  );
}