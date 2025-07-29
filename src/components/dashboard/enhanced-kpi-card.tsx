import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Minus, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

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
  history?: number[]; // optional time-series for sparkline
}

interface EnhancedKPICardProps {
  kpi: KPI;
  size?: "small" | "medium" | "large";
  showBenchmark?: boolean;
}

// Utility to generate a simple fallback sparkline when history not provided
const generateFallbackHistory = (current: number) => {
  const points = 10;
  const history: number[] = [];
  for (let i = points - 1; i >= 0; i--) {
    // create slight variation (-5% to +5%) around current value
    const variation = current * (1 + (Math.random() - 0.5) * 0.1);
    history.unshift(parseFloat(variation.toFixed(2)));
  }
  return history;
};

export default function EnhancedKPICard({ kpi, size = "medium", showBenchmark = true }: EnhancedKPICardProps) {
  console.log('Rendering EnhancedKPICard for:', kpi.name, 'with value:', kpi.value);
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      case "improving":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === "INR Billion") return `₹${value.toFixed(2)}B`;
    if (unit === "INR Million") return `₹${value.toFixed(1)}M`;
    if (unit === "INR Crores") return `₹${value.toFixed(1)}Cr`;
    if (unit === "Million units") return `${value.toFixed(1)}M`;
    if (unit === "Million litres") return `${value.toFixed(1)}M L`;
    if (unit === "%") return `${value.toFixed(1)}%`;
    if (unit === "/10") return `${value.toFixed(1)}/10`;
    if (unit === "times/year") return `${value.toFixed(1)}x`;
    if (unit === "hours") return `${value.toFixed(1)}h`;
    if (unit === "count/month") return `${value}`;
    if (unit === "count") return `${value}`;
    return `${value}${unit}`;
  };

  const progress = kpi.target ? Math.min(100, Math.round((kpi.value / kpi.target) * 100)) : 0;
  // Prepare sparkline data
  const history = kpi.history && kpi.history.length > 1 ? kpi.history : generateFallbackHistory(kpi.value);
  const sparklineData = history.map((val, idx) => ({ idx, value: val }));

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${
      size === "small" ? "p-3" : size === "large" ? "p-6" : "p-4"
    }`}>
      <CardHeader className={`pb-2 ${size === "small" ? "p-2" : "p-4"}`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`${
            size === "small" ? "text-sm" : size === "large" ? "text-lg" : "text-base"
          } font-medium text-gray-700`}>
            {kpi.name}
          </CardTitle>
          {kpi.priority && (
            <Badge className={`text-xs ${getPriorityColor(kpi.priority)}`}>
              {kpi.priority}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`${size === "small" ? "p-2" : "p-4"} pt-0`}>
        <div className="space-y-3">
          {/* Main Value */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`${
                size === "small" ? "text-xl" : size === "large" ? "text-3xl" : "text-2xl"
              } font-bold text-gray-900`}>
                {formatValue(kpi.value, kpi.unit)}
              </span>
              
              {kpi.trend && kpi.change !== undefined && (
                <div className="flex items-center space-x-1">
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-sm font-medium ${
                    kpi.change > 0 ? "text-green-600" : 
                    kpi.change < 0 ? "text-red-600" : "text-gray-600"
                  }`}>
                    {kpi.change > 0 ? "+" : ""}{kpi.change.toFixed(1)}%
                  </span>
                  {/* Status pill */}
                  {kpi.target && (
                    progress >= 90 ? (
                      <span className="flex items-center text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> On track
                      </span>
                    ) : progress < 70 ? (
                      <span className="flex items-center text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Alert
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Progress to Target */}
          {kpi.target && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Target: {formatValue(kpi.target, kpi.unit)}</span>
                <span>{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2"
                // @ts-ignore
                style={{ "--progress-background": getProgressColor(progress) }}
              />
            </div>
          )}

          {/* Benchmark */}
          {showBenchmark && kpi.benchmark && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <span className="font-medium">Benchmark:</span> {kpi.benchmark}
            </div>
          )}

          {/* Sparkline */}
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line type="monotone" dataKey="value" strokeWidth={2} stroke="#0ea5e9" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 leading-relaxed">
            {kpi.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
