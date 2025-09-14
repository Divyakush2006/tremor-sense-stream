import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "safe" | "moderate" | "high";
  trend: "up" | "down" | "stable";
  lastUpdated: string;
  threshold: {
    safe: number;
    moderate: number;
    high: number;
  };
}

interface SensorCardProps {
  sensor: SensorData;
  className?: string;
}

export default function SensorCard({ sensor, className = "" }: SensorCardProps) {
  const getTrendIcon = () => {
    switch (sensor.trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusConfig = () => {
    switch (sensor.status) {
      case "safe":
        return {
          class: "status-safe",
          label: "Safe",
        };
      case "moderate":
        return {
          class: "status-moderate",
          label: "Moderate Risk",
        };
      case "high":
        return {
          class: "status-high",
          label: "High Risk",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`sensor-card ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-lg">{sensor.name}</h3>
          <p className="text-sm text-muted-foreground">Sensor ID: {sensor.id}</p>
        </div>
        <div className={`status-indicator ${statusConfig.class}`}>
          {sensor.status === "high" && <AlertTriangle className="h-4 w-4" />}
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* Main Value Display */}
      <div className="text-center mb-6">
        <div className="metric-display text-foreground mb-2">
          {sensor.value.toFixed(2)}
          <span className="text-lg font-normal text-muted-foreground ml-1">
            {sensor.unit}
          </span>
        </div>
        
        {/* Trend Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className={`flex items-center gap-1 ${
            sensor.trend === "up" ? "text-warning" : 
            sensor.trend === "down" ? "text-success" : 
            "text-muted-foreground"
          }`}>
            {getTrendIcon()}
            <span>
              {sensor.trend === "up" ? "Increasing" : 
               sensor.trend === "down" ? "Decreasing" : 
               "Stable"}
            </span>
          </div>
        </div>
      </div>

      {/* Mini Gauge/Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Safe: {sensor.threshold.safe}</span>
          <span>High: {sensor.threshold.high}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              sensor.status === "safe" ? "bg-success" :
              sensor.status === "moderate" ? "bg-warning" :
              "bg-destructive"
            }`}
            style={{
              width: `${Math.min((sensor.value / sensor.threshold.high) * 100, 100)}%`
            }}
          />
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-muted-foreground">
        Last updated: {sensor.lastUpdated}
      </div>
    </div>
  );
}