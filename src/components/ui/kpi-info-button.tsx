import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KpiInfoButtonProps {
  description: string;
  unit?: string;
}

export function KpiInfoButton({ description, unit }: KpiInfoButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="ml-2 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <Info className="w-4 h-4 text-slate-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{description}</p>
          {unit && <p className="text-xs text-slate-400 mt-1">Unit: {unit}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
