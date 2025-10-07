'use client';

import { useState, useEffect, useRef } from 'react';

function SunWave() {
  const [mounted, setMounted] = useState(false);
  const [torontoTime, setTorontoTime] = useState('');
  const [delhiTime, setDelhiTime] = useState('');

  const [torontoPosition, setTorontoPosition] = useState({ x: 0, y: 0, hours: 0 });
  const [delhiPosition, setDelhiPosition] = useState({ x: 0, y: 0, hours: 0 });

  const [dialOffset, setDialOffset] = useState(0);
  const [timeOffset, setTimeOffset] = useState(0); // in hours
  const [chartDimensions, setChartDimensions] = useState({ width: 600, height: 450 });
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentOffset = useRef(0);

  useEffect(() => {
    setMounted(true);
    // Generate random stars
    const generatedStars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 3
    }));
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const updateDimensions = () => {
      if (chartRef.current) {
        const { width, height } = chartRef.current.getBoundingClientRect();
        setChartDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [mounted]);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const adjustedTime = new Date(now.getTime() + timeOffset * 3600000); // Add offset in milliseconds

      const torontoFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Toronto',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      const delhiFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      setTorontoTime(torontoFormatter.format(adjustedTime));
      setDelhiTime(delhiFormatter.format(adjustedTime));

      // Calculate positions on the chart
      const torontoDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Toronto',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }).formatToParts(adjustedTime);

      const delhiDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }).formatToParts(adjustedTime);

      const getTimeInHours = (parts: Intl.DateTimeFormatPart[]) => {
        const hours = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
        const minutes = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
        return hours + minutes / 60;
      };

      const torontoHours = getTimeInHours(torontoDate);
      const delhiHours = getTimeInHours(delhiDate);

      const width = chartDimensions.width;
      const height = chartDimensions.height;
      const centerY = height / 2;
      const amplitude = height / 2.5;

      const calculatePosition = (hours: number) => {
        const x = (hours / 24) * width;
        const angle = (hours / 24) * 2 * Math.PI - Math.PI / 2;
        const y = centerY - Math.sin(angle) * amplitude;
        return { x, y, hours };
      };

      setTorontoPosition(calculatePosition(torontoHours));
      setDelhiPosition(calculatePosition(delhiHours));
    };

    updateTimes();
  }, [timeOffset, chartDimensions]);

  // Dial drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    currentOffset.current = dialOffset;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    currentOffset.current = dialOffset;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    const newOffset = currentOffset.current + deltaX;
    setDialOffset(newOffset);
    // Convert pixels to hours (1 hour = 20 pixels movement)
    setTimeOffset(-(newOffset / 20));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.touches[0].clientX - startX.current;
    const newOffset = currentOffset.current + deltaX;
    setDialOffset(newOffset);
    // Convert pixels to hours (1 hour = 20 pixels movement)
    setTimeOffset(-(newOffset / 20));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - startX.current;
      const newOffset = currentOffset.current + deltaX;
      setDialOffset(newOffset);
      // Convert pixels to hours (1 hour = 20 pixels movement)
      setTimeOffset(-(newOffset / 20));
    };

    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Generate sine wave path
  const width = chartDimensions.width;
  const height = chartDimensions.height;
  const centerY = height / 2;
  const amplitude = height / 2.5;
  const points = 200;

  let pathData = '';
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * width;
    const angle = (i / points) * 2 * Math.PI - Math.PI / 2;
    const y = centerY - Math.sin(angle) * amplitude;

    if (i === 0) {
      pathData += `M ${x} ${y}`;
    } else {
      pathData += ` L ${x} ${y}`;
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[600px] sm:px-4">
      <div className="flex gap-8 sm:gap-12 justify-center text-xl sm:text-2xl font-mono">
        <div className="flex flex-col items-center">
          <div className="text-xs sm:text-sm text-rose-500 font-semibold mb-1">Toronto</div>
          <div className="text-2xl sm:text-3xl font-bold text-zinc-100">{torontoTime}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs sm:text-sm text-teal-400 font-semibold mb-1">New Delhi</div>
          <div className="text-2xl sm:text-3xl font-bold text-zinc-100">{delhiTime}</div>
        </div>
      </div>

      <div ref={chartRef} className="relative w-full aspect-[4/3] border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
        {/* Sky gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right,
              #09090b 0%,
              #18181b 12.5%,
              #27272a 16.7%,
              #3f3f46 20%,
              #ea580c 20.8%,
              #f97316 23%,
              #fb923c 25%,
              #fbbf24 29.2%,
              #06b6d4 33.3%,
              #0891b2 41.7%,
              #0e7490 50%,
              #0891b2 58.3%,
              #06b6d4 66.7%,
              #fbbf24 70.8%,
              #fb923c 75%,
              #f97316 77%,
              #ea580c 79.2%,
              #3f3f46 80%,
              #27272a 83.3%,
              #18181b 87.5%,
              #09090b 100%
            )`
          }}
        />

        {/* Stars overlay for night sections */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star, i) => {
            // Only show stars in night sections (0-19% and 81-100%)
            const isInNightZone = star.x < 19 || star.x > 81;
            if (!isInNightZone) return null;

            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: 0.8,
                  animation: `twinkle 3s ease-in-out infinite`,
                  animationDelay: `${star.delay}s`,
                  boxShadow: '0 0 2px rgba(255,255,255,0.8)'
                }}
              />
            );
          })}
        </div>

        {/* SVG for sine wave and horizon */}
        <svg className="absolute inset-0" width={width} height={height}>
          {/* Horizon line */}
          <line
            x1="0"
            y1={centerY}
            x2={width}
            y2={centerY}
            stroke="rgba(250, 250, 250, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="6,4"
          />

          {/* Sine wave */}
          <path
            d={pathData}
            stroke="#fbbf24"
            strokeWidth="3"
            fill="none"
            opacity="0.85"
          />

          {/* Time labels */}
          {[
            { label: '0h', pos: 0 },
            { label: '3h', pos: 0.125 },
            { label: '6h', pos: 0.25 },
            { label: '9h', pos: 0.375 },
            { label: '12h', pos: 0.5 },
            { label: '15h', pos: 0.625 },
            { label: '18h', pos: 0.75 },
            { label: '21h', pos: 0.875 },
            { label: '24h', pos: 1 }
          ].map(({ label, pos }) => (
            <text
              key={label}
              x={pos * width}
              y={height - 10}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontFamily="sans-serif"
            >
              {label}
            </text>
          ))}

          {/* Toronto marker */}
          <g>
            <circle
              cx={torontoPosition.x}
              cy={torontoPosition.y}
              r="8"
              fill="#f43f5e"
              stroke="#fafafa"
              strokeWidth="2"
            />
            <text
              x={torontoPosition.x}
              y={torontoPosition.y - 16}
              textAnchor="middle"
              fill="#fafafa"
              fontSize="13"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            >
              Toronto
            </text>
          </g>

          {/* Delhi marker */}
          <g>
            <circle
              cx={delhiPosition.x}
              cy={delhiPosition.y}
              r="8"
              fill="#14b8a6"
              stroke="#fafafa"
              strokeWidth="2"
            />
            <text
              x={delhiPosition.x}
              y={delhiPosition.y - 16}
              textAnchor="middle"
              fill="#fafafa"
              fontSize="13"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            >
              New Delhi
            </text>
          </g>
        </svg>
      </div>

      {/* Horizontal Dial */}
      <div className="w-full h-16 sm:h-20 relative overflow-hidden bg-zinc-900/50 rounded-xl border border-zinc-800/50 cursor-grab active:cursor-grabbing select-none">
        <div
          ref={dialRef}
          className="absolute inset-0 flex items-center"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Generate dial marks - create infinite looping effect */}
          <div
            className="flex items-center h-full"
            style={{
              transform: `translateX(${dialOffset % 200}px)`,
              marginLeft: '-200px'
            }}
          >
            {Array.from({ length: 150 }).map((_, i) => {
              const isMajor = i % 10 === 0;
              const isMinor = i % 5 === 0;
              return (
                <div key={i} className="flex items-center flex-shrink-0">
                  <div
                    className={`${
                      isMajor
                        ? 'h-8 sm:h-10 w-0.5 bg-zinc-300'
                        : isMinor
                        ? 'h-5 sm:h-6 w-0.5 bg-zinc-500'
                        : 'h-3 sm:h-4 w-px bg-zinc-600'
                    }`}
                  />
                  <div className="w-3 sm:w-4" />
                </div>
              );
            })}
          </div>
        </div>
        {/* Center indicator */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-rose-500 pointer-events-none" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-8 bg-zinc-950 overscroll-none">
      <SunWave />
    </div>
  );
}
