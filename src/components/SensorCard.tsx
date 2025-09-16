import { TrendingUp, TrendingDown, Minus, AlertTriangle, ChevronDown, ChevronUp, Activity, MapPin, Settings, Clock } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  location?: string;
  description?: string;
  logs?: Array<{
    id: string;
    timestamp: string;
    level: "info" | "warning" | "error";
    message: string;
  }>;
}

interface SensorCardProps {
  sensor: SensorData;
  className?: string;
}

export default function SensorCard({ sensor, className = "" }: SensorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
          variant: "secondary" as const,
        };
      case "moderate":
        return {
          class: "status-moderate",
          label: "Moderate Risk",
          variant: "default" as const,
        };
      case "high":
        return {
          class: "status-high",
          label: "High Risk",
          variant: "destructive" as const,
        };
    }
  };

  const getLogLevelConfig = (level: string) => {
    switch (level) {
      case "error":
        return { variant: "destructive" as const, icon: AlertTriangle };
      case "warning":
        return { variant: "default" as const, icon: TrendingUp };
      default:
        return { variant: "secondary" as const, icon: Activity };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className={`transition-all duration-500 hover:shadow-lg ${isExpanded ? 'shadow-xl scale-[1.02]' : ''} ${className}`}>
      <CardContent className="p-6">
        {/* Header with Expand Button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground text-lg">{sensor.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0 hover:bg-accent transition-all duration-300"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                )}
              </Button>
            </div>
            {!isExpanded && (
              <p className="text-sm text-muted-foreground">Sensor ID: {sensor.id}</p>
            )}
          </div>
          <Badge variant={statusConfig.variant} className={`${statusConfig.class} transition-all duration-300`}>
            {sensor.status === "high" && <AlertTriangle className="h-4 w-4 mr-1" />}
            {statusConfig.label}
          </Badge>
        </div>

        {/* Conditional Content */}
        {!isExpanded ? (
          /* Brief View */
          <div className="animate-fade-in">
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
                <div className={`flex items-center gap-1 transition-colors duration-300 ${
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
        ) : (
          /* Expanded Detailed View */
          <div className="animate-fade-in space-y-6">
            {/* Sensor Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Current Reading
                  </h4>
                  <div className="metric-display text-foreground">
                    {sensor.value.toFixed(2)}
                    <span className="text-lg font-normal text-muted-foreground ml-1">
                      {sensor.unit}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 mt-2 ${
                    sensor.trend === "up" ? "text-warning" : 
                    sensor.trend === "down" ? "text-success" : 
                    "text-muted-foreground"
                  }`}>
                    {getTrendIcon()}
                    <span className="text-sm">
                      {sensor.trend === "up" ? "Increasing" : 
                       sensor.trend === "down" ? "Decreasing" : 
                       "Stable"}
                    </span>
                  </div>
                </div>

                {sensor.location && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </h4>
                    <p className="text-muted-foreground">{sensor.location}</p>
                  </div>
                )}

                {sensor.description && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-muted-foreground">{sensor.description}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Threshold Configuration
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-success/10 border border-success/20">
                      <span className="text-sm font-medium">Safe Zone</span>
                      <span className="text-success font-semibold">0 - {sensor.threshold.safe} {sensor.unit}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <span className="text-sm font-medium">Moderate Risk</span>
                      <span className="text-warning font-semibold">{sensor.threshold.safe} - {sensor.threshold.moderate} {sensor.unit}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <span className="text-sm font-medium">High Risk</span>
                      <span className="text-destructive font-semibold">{sensor.threshold.moderate}+ {sensor.unit}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Last Updated
                  </h4>
                  <p className="text-muted-foreground">{sensor.lastUpdated}</p>
                </div>
              </div>
            </div>

            {/* Sensor Logs */}
            {sensor.logs && sensor.logs.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-3">Recent Logs</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {sensor.logs.map((log) => {
                    const logConfig = getLogLevelConfig(log.level);
                    const LogIcon = logConfig.icon;
                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <Badge variant={logConfig.variant} className="h-6 w-6 p-0 flex items-center justify-center">
                            <LogIcon className="h-3 w-3" />
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{log.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}