interface MiniChartProps {
  points: number[];
  height?: number;
  className?: string;
}

export default function MiniChart({ 
  points, 
  height = 100,
  className = "" 
}: MiniChartProps) {
  if (!points || points.length === 0) {
    return (
      <div className={`h-${height} w-full flex items-center justify-center ${className}`}>
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  // Find min and max values for scaling
  const minValue = Math.min(...points);
  const maxValue = Math.max(...points);
  const range = maxValue - minValue;

  // Calculate points for polyline
  const calculatePoint = (value: number, index: number) => {
    const x = index * (100 / (points.length - 1));
    // Normalize the value between 0 and 1, then scale to fit chart height
    // Invert the y-coordinate since SVG 0,0 is top-left
    const normalizedValue = range === 0 ? 0.5 : (value - minValue) / range;
    const y = 90 - (normalizedValue * 80); // Leave some margin at top and bottom
    return `${x},${y}`;
  };

  const polylinePoints = points.map(calculatePoint).join(" ");

  return (
    <div className={`mt-4 h-${height} w-full relative ${className}`}>
      <svg width="100%" height="100%" className="chart-container">
        <rect x="0" y="0" width="100%" height="100%" fill="transparent" rx="4"></rect>
        <polyline 
          points={polylinePoints}
          stroke="#6366f1" 
          fill="none" 
          strokeWidth="2"
        />
        {points.map((point, index) => (
          <circle 
            key={index}
            cx={calculatePoint(point, index).split(",")[0]} 
            cy={calculatePoint(point, index).split(",")[1]}
            r="4" 
            fill="#4f46e5"
          />
        ))}
      </svg>
    </div>
  );
}
