'use client';

// Simplified world map outline for NORAD display
// Hotspots positioned at: Taiwan Strait, Middle East, US/Tech centers

export function WorldMapSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 500"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Grid lines */}
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M 50 0 L 0 0 0 50"
            fill="none"
            stroke="rgba(54, 212, 255, 0.12)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Simplified continent outlines */}
      <g fill="none" stroke="rgba(54, 212, 255, 0.4)" strokeWidth="1.5">
        {/* North America */}
        <path d="M 80 120 Q 120 80 180 90 L 220 100 Q 280 90 300 120 L 280 180 Q 260 220 220 240 L 180 260 Q 140 240 120 200 L 100 160 Q 80 140 80 120 Z" />

        {/* South America */}
        <path d="M 220 280 Q 260 270 280 300 L 300 360 Q 290 420 260 450 L 220 460 Q 200 440 210 380 L 220 320 Q 210 290 220 280 Z" />

        {/* Europe */}
        <path d="M 440 100 Q 480 80 520 90 L 560 100 Q 580 120 560 150 L 520 170 Q 480 180 460 160 L 440 130 Q 430 110 440 100 Z" />

        {/* Africa */}
        <path d="M 460 200 Q 500 180 540 200 L 560 260 Q 560 320 540 360 L 500 400 Q 460 390 440 340 L 440 280 Q 450 230 460 200 Z" />

        {/* Asia */}
        <path d="M 580 80 Q 660 60 740 80 L 820 100 Q 880 120 900 160 L 880 220 Q 840 260 780 260 L 700 240 Q 640 220 600 180 L 580 140 Q 570 100 580 80 Z" />

        {/* Australia */}
        <path d="M 800 340 Q 860 320 900 350 L 920 400 Q 900 440 860 450 L 820 440 Q 790 410 800 370 L 800 340 Z" />
      </g>

      {/* Filled continents with low opacity */}
      <g fill="rgba(54, 212, 255, 0.06)">
        <path d="M 80 120 Q 120 80 180 90 L 220 100 Q 280 90 300 120 L 280 180 Q 260 220 220 240 L 180 260 Q 140 240 120 200 L 100 160 Q 80 140 80 120 Z" />
        <path d="M 220 280 Q 260 270 280 300 L 300 360 Q 290 420 260 450 L 220 460 Q 200 440 210 380 L 220 320 Q 210 290 220 280 Z" />
        <path d="M 440 100 Q 480 80 520 90 L 560 100 Q 580 120 560 150 L 520 170 Q 480 180 460 160 L 440 130 Q 430 110 440 100 Z" />
        <path d="M 460 200 Q 500 180 540 200 L 560 260 Q 560 320 540 360 L 500 400 Q 460 390 440 340 L 440 280 Q 450 230 460 200 Z" />
        <path d="M 580 80 Q 660 60 740 80 L 820 100 Q 880 120 900 160 L 880 220 Q 840 260 780 260 L 700 240 Q 640 220 600 180 L 580 140 Q 570 100 580 80 Z" />
        <path d="M 800 340 Q 860 320 900 350 L 920 400 Q 900 440 860 450 L 820 440 Q 790 410 800 370 L 800 340 Z" />
      </g>

      {/* Connection lines between hotspots */}
      <g stroke="rgba(2, 255, 129, 0.2)" strokeWidth="1" strokeDasharray="4 4">
        <line x1="200" y1="160" x2="520" y2="240" />
        <line x1="520" y1="240" x2="820" y2="160" />
        <line x1="200" y1="160" x2="820" y2="160" />
      </g>
    </svg>
  );
}
