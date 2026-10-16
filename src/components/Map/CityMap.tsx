import React, { useState } from 'react';
import { useRide } from '../../context/RideContext';
import { POPULAR_LOCATIONS } from '../../data/mockData';
import { MapPin, Navigation, Compass, Layers, Car, Zap, ZoomIn, ZoomOut } from 'lucide-react';

export const CityMap: React.FC = () => {
  const { 
    pickup, 
    destination, 
    setPickup, 
    setDestination, 
    currentTrip, 
    activeDriverPosition, 
    driversList,
    currentRole
  } = useRide();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showTraffic, setShowTraffic] = useState<boolean>(true);

  // SVG grid coordinate dimensions (0-100% mapped to viewBox 0 0 1000 700)
  const mapX = (percent: number) => percent * 10;
  const mapY = (percent: number) => percent * 7;

  // Active driver coordinates
  const driverX = activeDriverPosition ? mapX(activeDriverPosition.x) : mapX(pickup.x - 6);
  const driverY = activeDriverPosition ? mapY(activeDriverPosition.y) : mapY(pickup.y + 5);

  const pickupCoord = { x: mapX(pickup.x), y: mapY(pickup.y) };
  const destCoord = destination ? { x: mapX(destination.x), y: mapY(destination.y) } : null;

  // Generate realistic turn-by-turn route path
  const getRoutePath = () => {
    if (!destCoord) return '';
    // Generate an authentic Manhattan-style grid path with 90-degree turns
    const midX = destCoord.x;
    const midY = pickupCoord.y;
    return `M ${pickupCoord.x} ${pickupCoord.y} L ${midX} ${midY} L ${destCoord.x} ${destCoord.y}`;
  };

  const getDriverToPickupPath = () => {
    if (!currentTrip || currentTrip.status !== 'driver_assigned') return '';
    const midX = pickupCoord.x;
    const midY = driverY;
    return `M ${driverX} ${driverY} L ${midX} ${midY} L ${pickupCoord.x} ${pickupCoord.y}`;
  };

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[580px] bg-[#0c0d11] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl select-none flex flex-col justify-between">
      {/* Map Header Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]" />
          <span className="text-xs font-semibold tracking-wide text-neutral-200">
            METRO GPS DISPATCH <span className="text-yellow-400 font-mono">NY-CENTRAL</span>
          </span>
          <span className="text-neutral-500 text-xs">|</span>
          <span className="text-xs text-neutral-400 font-mono">
            {driversList.filter(d => d.isOnline).length} Active Cabs
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 backdrop-blur-md ${
              showTraffic 
                ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold shadow-sm' 
                : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Traffic</span>
          </button>
          <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl flex items-center p-1 gap-1">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
              className="p-1.5 text-neutral-400 hover:text-yellow-400 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
              className="p-1.5 text-neutral-400 hover:text-yellow-400 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Vector City Map */}
      <div className="w-full h-full flex-1 overflow-hidden relative">
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Golden Taxi Glow Filter */}
            <filter id="yellowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Pattern for water */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#09131e" />
              <stop offset="100%" stopColor="#050b12" />
            </linearGradient>

            {/* Park Green pattern */}
            <linearGradient id="parkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f2219" />
              <stop offset="100%" stopColor="#091710" />
            </linearGradient>

            {/* Route Yellow Gradient */}
            <linearGradient id="routeYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>

          {/* Waterway (Hudson / East River aesthetic) */}
          <path
            d="M 120 0 C 130 180, 100 340, 160 520 C 190 610, 240 700, 260 700 L 0 700 L 0 0 Z"
            fill="url(#waterGrad)"
          />
          <path
            d="M 850 0 C 820 220, 840 450, 780 700 L 1000 700 L 1000 0 Z"
            fill="url(#waterGrad)"
          />

          {/* Central Park Zone */}
          <rect
            x="460"
            y="60"
            width="120"
            height="180"
            rx="8"
            fill="url(#parkGrad)"
            stroke="#1c3b2b"
            strokeWidth="1.5"
          />
          <text x="520" y="155" fill="#3b7a57" fontSize="12" fontWeight="600" textAnchor="middle" letterSpacing="2">
            CENTRAL PARK
          </text>

          {/* Building Blocks Grids */}
          {Array.from({ length: 9 }).map((_, col) => {
            return Array.from({ length: 7 }).map((_, row) => {
              const bx = 220 + col * 68;
              const by = 80 + row * 82;
              // Don't render inside park
              if (bx >= 460 && bx <= 570 && by >= 60 && by <= 230) return null;
              return (
                <rect
                  key={`block-${col}-${row}`}
                  x={bx}
                  y={by}
                  width="48"
                  height="58"
                  rx="4"
                  fill="#13151b"
                  stroke="#1c1f28"
                  strokeWidth="1"
                />
              );
            });
          })}

          {/* Secondary Street Grid */}
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={`h-street-${i}`}
              x1="160"
              y1={50 + i * 46}
              x2="850"
              y2={50 + i * 46}
              stroke="#1b1f2b"
              strokeWidth="1.5"
            />
          ))}

          {Array.from({ length: 13 }).map((_, i) => (
            <line
              key={`v-street-${i}`}
              x1="200 + i * 54"
              y1="0"
              x2="200 + i * 54"
              y2="700"
              stroke="#1b1f2b"
              strokeWidth="1.5"
            />
          ))}

          {/* Primary Arterials & Avenues (Golden Taxi Grid) */}
          <line x1="200" y1="0" x2="200" y2="700" stroke="#2c303f" strokeWidth="3" />
          <line x1="380" y1="0" x2="380" y2="700" stroke="#373c4f" strokeWidth="4" />
          <line x1="480" y1="250" x2="480" y2="700" stroke="#4b5563" strokeWidth="5" />
          <line x1="620" y1="0" x2="620" y2="700" stroke="#373c4f" strokeWidth="4" />
          <line x1="760" y1="0" x2="760" y2="700" stroke="#2c303f" strokeWidth="3" />

          {/* Diagonal Iconic Broadway Arterial */}
          <line
            x1="340"
            y1="0"
            x2="600"
            y2="700"
            stroke="#eab308"
            strokeOpacity="0.3"
            strokeWidth="4"
            strokeDasharray="8 6"
          />

          {/* Major Crosstown Express Avenues */}
          <line x1="160" y1="245" x2="850" y2="245" stroke="#373c4f" strokeWidth="5" />
          <line x1="160" y1="420" x2="850" y2="420" stroke="#4b5563" strokeWidth="6" />
          <line x1="160" y1="580" x2="850" y2="580" stroke="#373c4f" strokeWidth="4" />

          {/* Traffic flow indicators */}
          {showTraffic && (
            <g opacity="0.75">
              <line x1="380" y1="120" x2="380" y2="380" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="6 4" />
              <line x1="480" y1="280" x2="480" y2="440" stroke="#eab308" strokeWidth="3" strokeDasharray="5 3" />
              <line x1="160" y1="420" x2="420" y2="420" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 4" />
              <line x1="620" y1="180" x2="620" y2="520" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="6 4" />
            </g>
          )}

          {/* Driver approaching pickup path */}
          {currentTrip && currentTrip.status === 'driver_assigned' && (
            <path
              d={getDriverToPickupPath()}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          )}

          {/* Active Trip Route Path (Yellow Cab route with glow) */}
          {destCoord && (
            <g>
              <path
                d={getRoutePath()}
                fill="none"
                stroke="#000"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={getRoutePath()}
                fill="none"
                stroke="url(#routeYellow)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#yellowGlow)"
              />
            </g>
          )}

          {/* Other Online Idle Taxi Fleet Cabs */}
          {driversList.filter(d => d.isOnline && d.status === 'idle').map(drv => {
            const cx = mapX(drv.currentLocation.x);
            const cy = mapY(drv.currentLocation.y);
            return (
              <g key={drv.id} className="transition-all duration-700">
                <circle cx={cx} cy={cy} r="14" fill="#18181b" stroke="#eab308" strokeWidth="1.5" />
                <rect x={cx - 7} y={cy - 4} width="14" height="8" rx="2" fill="#FACC15" />
                {/* Taxi sign */}
                <rect x={cx - 3} y={cy - 6} width="6" height="2" fill="#000" rx="0.5" />
                <circle cx={cx - 4} cy={cy + 4} r="1.5" fill="#000" />
                <circle cx={cx + 4} cy={cy + 4} r="1.5" fill="#000" />
              </g>
            );
          })}

          {/* Active Driver Vehicle Marker */}
          {currentTrip && currentTrip.status !== 'completed' && (
            <g className="transition-all duration-300 ease-linear">
              {/* Pulse Radar Ring */}
              <circle
                cx={driverX}
                cy={driverY}
                r="22"
                fill="none"
                stroke="#FACC15"
                strokeWidth="1.5"
                opacity="0.4"
                className="animate-ping"
              />
              {/* Outer disk */}
              <circle cx={driverX} cy={driverY} r="18" fill="#09090b" stroke="#FACC15" strokeWidth="2.5" />
              {/* Yellow Taxi Icon body */}
              <rect x={driverX - 9} y={driverY - 5} width="18" height="10" rx="2" fill="#FACC15" />
              {/* Windows */}
              <rect x={driverX - 5} y={driverY - 4} width="10" height="4" rx="1" fill="#18181b" />
              {/* Roof Taxi Light */}
              <rect x={driverX - 4} y={driverY - 7} width="8" height="2.5" rx="0.5" fill="#f59e0b" stroke="#000" strokeWidth="0.5" />
              {/* Wheels */}
              <circle cx={driverX - 6} cy={driverY + 5} r="2" fill="#000" />
              <circle cx={driverX + 6} cy={driverY + 5} r="2" fill="#000" />

              {/* Driver Badge Box */}
              <g transform={`translate(${driverX - 45}, ${driverY - 32})`}>
                <rect width="90" height="20" rx="10" fill="#09090b" stroke="#FACC15" strokeWidth="1.5" />
                <text x="45" y="14" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {currentTrip.driver?.name?.split(' ')[0] || 'CAB'} · {currentTrip.driver?.vehicle.plate || 'TAXI'}
                </text>
              </g>
            </g>
          )}

          {/* Popular Landmark Pins (Clickable) */}
          {POPULAR_LOCATIONS.map(loc => {
            const lx = mapX(loc.x);
            const ly = mapY(loc.y);
            const isPickup = pickup.id === loc.id;
            const isDest = destination?.id === loc.id;

            if (isPickup || isDest) return null; // Rendered below with dedicated highlight

            return (
              <g
                key={loc.id}
                className="cursor-pointer group"
                onClick={() => {
                  if (currentRole === 'rider') {
                    if (!destination) {
                      setDestination(loc);
                    } else {
                      setDestination(loc);
                    }
                  }
                }}
              >
                <circle
                  cx={lx}
                  cy={ly}
                  r="5"
                  fill="#27272a"
                  stroke="#52525b"
                  strokeWidth="1.5"
                  className="group-hover:fill-yellow-400 group-hover:stroke-yellow-300 transition-colors"
                />
                <text
                  x={lx}
                  y={ly - 9}
                  fill="#a1a1aa"
                  fontSize="10"
                  textAnchor="middle"
                  className="opacity-70 group-hover:opacity-100 group-hover:fill-white font-medium transition-opacity"
                >
                  {loc.name.split('&')[0].trim()}
                </text>
              </g>
            );
          })}

          {/* Pickup Pin */}
          <g transform={`translate(${pickupCoord.x}, ${pickupCoord.y})`}>
            <circle r="12" fill="#FACC15" opacity="0.2" className="animate-ping" />
            <circle r="7" fill="#09090b" stroke="#FACC15" strokeWidth="3" />
            <g transform="translate(-40, -42)">
              <rect width="80" height="24" rx="12" fill="#FACC15" />
              <text x="40" y="16" fill="#09090b" fontSize="11" fontWeight="800" textAnchor="middle">
                PICKUP
              </text>
              <polygon points="36,24 44,24 40,29" fill="#FACC15" />
            </g>
          </g>

          {/* Destination Pin */}
          {destCoord && (
            <g transform={`translate(${destCoord.x}, ${destCoord.y})`}>
              <circle r="12" fill="#ffffff" opacity="0.2" className="animate-ping" />
              <circle r="7" fill="#ffffff" stroke="#09090b" strokeWidth="3" />
              <g transform="translate(-45, -42)">
                <rect width="90" height="24" rx="12" fill="#09090b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="45" y="16" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                  DROPOFF
                </text>
                <polygon points="41,24 49,24 45,29" fill="#09090b" />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Map Bottom Telemetry Banner */}
      <div className="p-3 bg-neutral-900/90 backdrop-blur-md border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <Compass className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-medium">Active Zone:</span>
            <span className="text-white font-semibold">{pickup.name.split('&')[0]}</span>
          </div>
          {destination && (
            <>
              <span className="text-neutral-600">→</span>
              <span className="text-yellow-400 font-semibold">{destination.name.split('&')[0]}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-neutral-400">
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">Live Traffic:</span>
            <span className="text-emerald-400 font-medium">Optimal (4.2 mi/hr avg)</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-neutral-300">
            <Car className="w-3.5 h-3.5 text-yellow-400" />
            <span>Fleet ID: YW-708</span>
          </div>
        </div>
      </div>
    </div>
  );
};
