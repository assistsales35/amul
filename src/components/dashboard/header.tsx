import { RefreshCw, MessageSquare, Bell, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  showChatbot?: boolean;
  onToggleChatbot?: () => void;
}

export default function Header({ timeRange, onTimeRangeChange, showChatbot = false, onToggleChatbot }: HeaderProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated with the latest information.",
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/attached_assets/logo.png" 
                alt="Amul Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Executive Dashboard</h1>
              <p className="text-sm text-slate-600">Welcome back, Managing Director</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">

            
            <Button 
              variant={showChatbot ? "default" : "outline"}
              onClick={onToggleChatbot}
              className={`relative ${showChatbot ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Assistant
              {showChatbot && (
                <Badge className="absolute -top-2 -right-2 bg-white text-green-600 text-xs px-1.5 py-0.5 border border-green-600">
                  Active
                </Badge>
              )}
            </Button>
            

            <Button 
              variant="outline"
              className="relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              Alerts
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                3
              </Badge>
            </Button>
            
            <Button 
              onClick={handleRefresh}
              className="bg-amul-red hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
