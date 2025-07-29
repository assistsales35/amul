import React, { useState } from 'react';
import IndiaMap from '@react-map/india';
// State-wise loss data (in INR Millions) - realistic distribution totaling 8.7M
const stateWiseLossData: Record<string, { name: string; loss: number; region: string }> = {
  // North Region - 2.4M total
  'UP': { name: 'Uttar Pradesh', loss: 0.8, region: 'North' },
  'PB': { name: 'Punjab', loss: 0.4, region: 'North' },
  'HR': { name: 'Haryana', loss: 0.3, region: 'North' },
  'DL': { name: 'Delhi', loss: 0.3, region: 'North' },
  'HP': { name: 'Himachal Pradesh', loss: 0.2, region: 'North' },
  'JK': { name: 'Jammu & Kashmir', loss: 0.2, region: 'North' },
  'UT': { name: 'Uttarakhand', loss: 0.1, region: 'North' },
  'CH': { name: 'Chandigarh', loss: 0.1, region: 'North' },
  // West Region - 3.1M total (highest)
  'MH': { name: 'Maharashtra', loss: 1.2, region: 'West' },
  'GJ': { name: 'Gujarat', loss: 0.8, region: 'West' },
  'RJ': { name: 'Rajasthan', loss: 0.6, region: 'West' },
  'MP': { name: 'Madhya Pradesh', loss: 0.4, region: 'West' },
  'GA': { name: 'Goa', loss: 0.1, region: 'West' },
  // East Region - 1.8M total
  'WB': { name: 'West Bengal', loss: 0.5, region: 'East' },
  'BR': { name: 'Bihar', loss: 0.4, region: 'East' },
  'JH': { name: 'Jharkhand', loss: 0.3, region: 'East' },
  'OR': { name: 'Odisha', loss: 0.2, region: 'East' },
  'AS': { name: 'Assam', loss: 0.2, region: 'East' },
  'CT': { name: 'Chhattisgarh', loss: 0.1, region: 'East' },
  'SK': { name: 'Sikkim', loss: 0.1, region: 'East' },
  // South Region - 1.4M total (lowest)
  'KA': { name: 'Karnataka', loss: 0.4, region: 'South' },
  'TN': { name: 'Tamil Nadu', loss: 0.3, region: 'South' },
  'AP': { name: 'Andhra Pradesh', loss: 0.3, region: 'South' },
  'TG': { name: 'Telangana', loss: 0.2, region: 'South' },
  'KL': { name: 'Kerala', loss: 0.2, region: 'South' }
};
// Color intensity based on loss value
const getStateColor = (stateCode: string): string => {
  const stateData = stateWiseLossData[stateCode];
  if (!stateData) return '#F1F5F9';
  const loss = stateData.loss;
  if (loss >= 1.0) return '#DC2626'; // High loss - dark red
  if (loss >= 0.5) return '#EF4444'; // Medium-high loss - red
  if (loss >= 0.3) return '#F87171'; // Medium loss - light red
  if (loss >= 0.2) return '#FCA5A5'; // Low-medium loss - lighter red
  return '#FECACA'; // Low loss - very light red
};
const ProfessionalIndiaMap: React.FC = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const totalLoss = Object.values(stateWiseLossData).reduce((sum, state) => sum + state.loss, 0);
  // Calculate region totals
  const regionTotals = {
    North: Object.values(stateWiseLossData).filter(s => s.region === 'North').reduce((sum, s) => sum + s.loss, 0),
    West: Object.values(stateWiseLossData).filter(s => s.region === 'West').reduce((sum, s) => sum + s.loss, 0),
    East: Object.values(stateWiseLossData).filter(s => s.region === 'East').reduce((sum, s) => sum + s.loss, 0),
    South: Object.values(stateWiseLossData).filter(s => s.region === 'South').reduce((sum, s) => sum + s.loss, 0)
  };
  const handleStateClick = (stateCode: string) => {
    setSelectedState(stateCode);
  };
  const handleStateHover = (stateCode: string) => {
    setHoveredState(stateCode);
  };
  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 min-h-0">
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative" style={{ width: '300px', height: '240px' }}>
            <div
              className="relative cursor-pointer"
              onClick={(e) => {
                // Get click coordinates relative to the map
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                // Debug: Log coordinates for mapping
                console.log(`:world_map: Clicked at coordinates: x=${x.toFixed(1)}%, y=${y.toFixed(1)}%`);
                // State detection based on user-provided exact coordinate mapping
                let selectedState = '';
                // User-provided exact coordinates:
                // Rajasthan: x=8.7%, y=33.8% (original) + x=19.7%, y=29.6% (refined)
                // Kerala: x=29.0%, y=90.7%
                // Tamil Nadu: x=34.0%, y=89.4%
                // Madhya Pradesh: x=38.3%, y=45.7%
                // Uttar Pradesh: x=43.0%, y=32.8%
                // Uttarakhand: x=40.3%, y=20.3%
                // Maharashtra: x=24.3%, y=57.2%
                // Himachal Pradesh: x=31.3%, y=15.8%
                // Bihar: x=58.0%, y=37.0%
                // Rajasthan - western region (updated with refined coordinates)
                if ((x >= 5 && x <= 15 && y >= 25 && y <= 45) || (x >= 15 && x <= 25 && y >= 25 && y <= 35)) {
                  selectedState = 'RJ';
                }
                // Kerala - far south west
                else if (x >= 25 && x <= 35 && y >= 85 && y <= 95) {
                  selectedState = 'KL';
                }
                // Tamil Nadu - far south central
                else if (x >= 30 && x <= 40 && y >= 85 && y <= 95) {
                  selectedState = 'TN';
                }
                // Madhya Pradesh - central India
                else if (x >= 32 && x <= 45 && y >= 40 && y <= 52) {
                  selectedState = 'MP';
                }
                // Uttar Pradesh - north central
                else if (x >= 38 && x <= 50 && y >= 28 && y <= 38) {
                  selectedState = 'UP';
                }
                // Uttarakhand - northern hills
                else if (x >= 35 && x <= 45 && y >= 15 && y <= 25) {
                  selectedState = 'UT';
                }
                // Maharashtra - central west (highest loss state)
                else if (x >= 20 && x <= 30 && y >= 52 && y <= 62) {
                  selectedState = 'MH';
                }
                // Himachal Pradesh - northern region
                else if (x >= 27 && x <= 37 && y >= 10 && y <= 20) {
                  selectedState = 'HP';
                }
                // Bihar - eastern north central
                else if (x >= 53 && x <= 63 && y >= 32 && y <= 42) {
                  selectedState = 'BR';
                }
                // Temporary fallback for other states (to be updated with more coordinates)
                else {
                  // Keep some basic mapping for other states until user provides more coordinates
                  if (y < 20) {
                    selectedState = 'JK'; // Kashmir region
                  } else if (y < 40) {
                    if (x < 25) selectedState = 'PB'; // Punjab area
                    else if (x < 50) selectedState = 'HR'; // Haryana area
                    else selectedState = 'UP'; // UP area
                  } else if (y < 70) {
                    if (x < 30) selectedState = 'MP'; // MP area
                    else if (x < 60) selectedState = 'MH'; // Maharashtra area
                    else selectedState = 'WB'; // West Bengal area
                  } else {
                    if (x < 40) selectedState = 'KA'; // Karnataka area
                    else selectedState = 'TN'; // Tamil Nadu area
                  }
                }
                if (selectedState && stateWiseLossData[selectedState]) {
                  handleStateClick(selectedState);
                }
              }}
            >
              <IndiaMap
                type="select-single"
                size={300}
                mapColor="#F1F5F9"
                strokeColor="#64748B"
                strokeWidth={1}
                hoverColor="#E2E8F0"
              />
            </div>
          </div>
        </div>
        {/* State selection info */}
        {selectedState && (
          <div className="absolute top-2 right-2 bg-white border border-slate-200 rounded-lg shadow-lg p-3 animate-in fade-in duration-200 min-w-[160px]">
            {(() => {
              const stateData = stateWiseLossData[selectedState];
              if (!stateData) {
                return (
                  <div className="text-sm text-slate-600">
                    Click on map regions to see state data
                  </div>
                );
              }
              return (
                <div>
                  <div className="text-sm font-semibold text-slate-800">{stateData.name}</div>
                  <div className="text-xs text-slate-600 mb-1">{stateData.region} Region</div>
                  <div className="text-lg font-bold text-red-600">₹{stateData.loss}M</div>
                  <div className="text-xs text-slate-500 mt-1">
                    State Loss • Click other regions
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
      {/* Compact Legend */}
      <div className="mt-3 px-2">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-600">Loss Intensity Scale</span>
          <span className="text-slate-600">Total: ₹{totalLoss.toFixed(1)}M</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-slate-500">Low</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FECACA' }}></div>
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FCA5A5' }}></div>
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F87171' }}></div>
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EF4444' }}></div>
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#DC2626' }}></div>
            </div>
            <span className="text-xs text-slate-500">High</span>
          </div>
          <div className="text-xs text-slate-600">
            Range: ₹0.1M - ₹1.2M per state
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfessionalIndiaMap;