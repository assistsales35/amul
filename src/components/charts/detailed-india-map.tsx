import React, { useState } from 'react';

interface RegionData {
  name: string;
  value: number;
  color: string;
}

interface DetailedIndiaMapProps {
  data: RegionData[];
  title?: string;
}

export default function DetailedIndiaMap({ data, title = "Regional Data" }: DetailedIndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Get color intensity based on value
  const getColorIntensity = (value: number, maxValue: number) => {
    const intensity = Math.min(value / maxValue, 1);
    return `rgba(239, 68, 68, ${0.2 + intensity * 0.8})`;
  };

  const maxValue = Math.max(...data.map(d => d.value));

  // Regional data mapping
  const regionData = data.reduce((acc, region) => {
    acc[region.name.toLowerCase()] = region;
    return acc;
  }, {} as Record<string, RegionData>);

  // State to region mapping
  const stateToRegion: Record<string, string> = {
    'jammu-kashmir': 'north',
    'himachal-pradesh': 'north',
    'punjab': 'north',
    'haryana': 'north',
    'delhi': 'north',
    'uttarakhand': 'north',
    'uttar-pradesh': 'north',
    'rajasthan': 'west',
    'gujarat': 'west',
    'maharashtra': 'west',
    'goa': 'west',
    'madhya-pradesh': 'west',
    'chhattisgarh': 'east',
    'bihar': 'east',
    'jharkhand': 'east',
    'west-bengal': 'east',
    'odisha': 'east',
    'assam': 'east',
    'meghalaya': 'east',
    'manipur': 'east',
    'mizoram': 'east',
    'tripura': 'east',
    'nagaland': 'east',
    'arunachal-pradesh': 'east',
    'sikkim': 'east',
    'andhra-pradesh': 'south',
    'telangana': 'south',
    'karnataka': 'south',
    'kerala': 'south',
    'tamil-nadu': 'south'
  };

  const getStateColor = (stateId: string) => {
    const region = stateToRegion[stateId];
    if (!region || !regionData[region]) return '#f1f5f9';
    return getColorIntensity(regionData[region].value, maxValue);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-lg">
        <svg
          viewBox="0 0 600 700"
          className="w-full h-auto"
          style={{ maxHeight: '400px' }}
        >
          {/* Jammu & Kashmir */}
          <path
            id="jammu-kashmir"
            d="M150 50 L250 50 L280 80 L250 120 L180 100 L150 80 Z"
            fill={getStateColor('jammu-kashmir')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Jammu & Kashmir')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Himachal Pradesh */}
          <path
            id="himachal-pradesh"
            d="M180 100 L250 120 L230 150 L180 140 Z"
            fill={getStateColor('himachal-pradesh')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Himachal Pradesh')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Punjab */}
          <path
            id="punjab"
            d="M150 140 L200 140 L200 180 L150 180 Z"
            fill={getStateColor('punjab')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Punjab')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Haryana & Delhi */}
          <path
            id="haryana"
            d="M200 140 L250 140 L250 200 L200 200 Z"
            fill={getStateColor('haryana')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Haryana & Delhi')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Uttarakhand */}
          <path
            id="uttarakhand"
            d="M250 140 L300 140 L300 180 L250 180 Z"
            fill={getStateColor('uttarakhand')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Uttarakhand')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Uttar Pradesh */}
          <path
            id="uttar-pradesh"
            d="M200 200 L350 200 L350 260 L200 260 Z"
            fill={getStateColor('uttar-pradesh')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Uttar Pradesh')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Rajasthan */}
          <path
            id="rajasthan"
            d="M80 180 L200 180 L200 320 L80 320 Z"
            fill={getStateColor('rajasthan')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Rajasthan')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Gujarat */}
          <path
            id="gujarat"
            d="M80 320 L180 320 L180 420 L80 420 Z"
            fill={getStateColor('gujarat')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Gujarat')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Maharashtra */}
          <path
            id="maharashtra"
            d="M180 320 L280 320 L280 420 L180 420 Z"
            fill={getStateColor('maharashtra')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Maharashtra')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Madhya Pradesh */}
          <path
            id="madhya-pradesh"
            d="M200 260 L350 260 L350 320 L200 320 Z"
            fill={getStateColor('madhya-pradesh')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Madhya Pradesh')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Chhattisgarh */}
          <path
            id="chhattisgarh"
            d="M350 260 L400 260 L400 320 L350 320 Z"
            fill={getStateColor('chhattisgarh')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Chhattisgarh')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Bihar */}
          <path
            id="bihar"
            d="M350 200 L420 200 L420 260 L350 260 Z"
            fill={getStateColor('bihar')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Bihar')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* West Bengal */}
          <path
            id="west-bengal"
            d="M420 200 L480 200 L480 300 L420 300 Z"
            fill={getStateColor('west-bengal')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('West Bengal')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Odisha */}
          <path
            id="odisha"
            d="M400 320 L480 320 L480 380 L400 380 Z"
            fill={getStateColor('odisha')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Odisha')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Andhra Pradesh & Telangana */}
          <path
            id="andhra-pradesh"
            d="M280 420 L380 420 L380 500 L280 500 Z"
            fill={getStateColor('andhra-pradesh')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Andhra Pradesh & Telangana')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Karnataka */}
          <path
            id="karnataka"
            d="M180 420 L280 420 L280 520 L180 520 Z"
            fill={getStateColor('karnataka')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Karnataka')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Kerala */}
          <path
            id="kerala"
            d="M150 520 L200 520 L200 600 L150 600 Z"
            fill={getStateColor('kerala')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Kerala')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Tamil Nadu */}
          <path
            id="tamil-nadu"
            d="M200 520 L300 520 L300 600 L200 600 Z"
            fill={getStateColor('tamil-nadu')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Tamil Nadu')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Northeast States */}
          <path
            id="northeast"
            d="M480 120 L550 120 L550 200 L480 200 Z"
            fill={getStateColor('assam')}
            stroke="#64748b"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredState('Northeast States')}
            onMouseLeave={() => setHoveredState(null)}
          />

          {/* Regional Labels */}
          <text x="200" y="100" textAnchor="middle" className="text-sm font-bold fill-slate-700">
            NORTH
          </text>
          {regionData.north && (
            <text x="200" y="115" textAnchor="middle" className="text-xs font-bold fill-red-600">
              ₹{regionData.north.value}M
            </text>
          )}

          <text x="130" y="350" textAnchor="middle" className="text-sm font-bold fill-slate-700">
            WEST
          </text>
          {regionData.west && (
            <text x="130" y="365" textAnchor="middle" className="text-xs font-bold fill-red-600">
              ₹{regionData.west.value}M
            </text>
          )}

          <text x="450" y="250" textAnchor="middle" className="text-sm font-bold fill-slate-700">
            EAST
          </text>
          {regionData.east && (
            <text x="450" y="265" textAnchor="middle" className="text-xs font-bold fill-red-600">
              ₹{regionData.east.value}M
            </text>
          )}

          <text x="240" y="560" textAnchor="middle" className="text-sm font-bold fill-slate-700">
            SOUTH
          </text>
          {regionData.south && (
            <text x="240" y="575" textAnchor="middle" className="text-xs font-bold fill-red-600">
              ₹{regionData.south.value}M
            </text>
          )}
        </svg>

        {/* Hover tooltip */}
        {hoveredState && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs animate-in fade-in duration-200">
            {hoveredState}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-200 border border-slate-300 rounded"></div>
          <span>Low Loss</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-400 border border-slate-300 rounded"></div>
          <span>Medium Loss</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-600 border border-slate-300 rounded"></div>
          <span>High Loss</span>
        </div>
      </div>


    </div>
  );
}
