import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface FilterOption {
  label: string;
  value: string;
}

interface DashboardFiltersProps {
  filters: {
    region?: boolean;
    timeRange?: boolean;
    productCategory?: boolean;
    channel?: boolean;
  };
  onApply: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
}

const REGIONS: FilterOption[] = [
  { label: "All Regions", value: "all" },
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" }
];
const TIME_RANGES: FilterOption[] = [
  { label: "Last 7 Days", value: "last-7-days" },
  { label: "Last 30 Days", value: "last-30-days" },
  { label: "This Month", value: "this-month" },
  { label: "This Year", value: "this-year" }
];
const PRODUCT_CATEGORIES: FilterOption[] = [
  { label: "All Categories", value: "all" },
  { label: "Milk", value: "milk" },
  { label: "Butter", value: "butter" },
  { label: "Cheese", value: "cheese" },
  { label: "Yogurt", value: "yogurt" },
  { label: "Ice Cream", value: "ice-cream" }
];
const CHANNELS: FilterOption[] = [
  { label: "All Channels", value: "all" },
  { label: "Retail", value: "retail" },
  { label: "Wholesale", value: "wholesale" },
  { label: "Online", value: "online" }
];

export function DashboardFilters({ filters, onApply, initialValues }: DashboardFiltersProps) {
  const [pending, setPending] = useState<Record<string, string>>({
    region: initialValues?.region || "all",
    timeRange: initialValues?.timeRange || "last-30-days",
    productCategory: initialValues?.productCategory || "all",
    channel: initialValues?.channel || "all",
  });

  function handleChange(key: string, value: string) {
    setPending(prev => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    onApply(pending);
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 shadow-md flex justify-center">
      <div className="flex w-full max-w-5xl items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
          {filters.region && (
            <Select value={pending.region} onValueChange={v => handleChange("region", v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {filters.timeRange && (
            <Select value={pending.timeRange} onValueChange={v => handleChange("timeRange", v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Time Range" />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {filters.productCategory && (
            <Select value={pending.productCategory} onValueChange={v => handleChange("productCategory", v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Product Category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {filters.channel && (
            <Select value={pending.channel} onValueChange={v => handleChange("channel", v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Channel" />
              </SelectTrigger>
              <SelectContent>
                {CHANNELS.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <button
          className="ml-0 md:ml-8 px-6 py-2 rounded-lg bg-fulfillment-green text-white font-semibold shadow hover:bg-green-700 transition"
          type="button"
          onClick={handleApply}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
