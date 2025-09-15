import { useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, FileText, Clock, MapPin, Activity, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sensorDetails = [
  {
    id: "DISP-001",
    name: "Displacement Sensor",
    location: "Section A - North Wall",
    value: 2.45,
    unit: "mm",
    status: "safe" as const,
    trend: "stable" as const,
    threshold: { safe: 5, moderate: 8, high: 12 },
    description: "Monitors structural displacement in the mining wall to detect potential rock movement.",
    logs: [
      { timestamp: "2024-01-15 14:23", level: "info", message: "Sensor calibrated successfully" },
      { timestamp: "2024-01-15 12:15", level: "warning", message: "Minor displacement detected, monitoring closely" },
      { timestamp: "2024-01-15 09:30", level: "info", message: "Daily threshold check completed" }
    ]
  },
  {
    id: "STRN-002", 
    name: "Strain Gauge",
    location: "Section B - Support Beam",
    value: 156.7,
    unit: "μɛ",
    status: "moderate" as const,
    trend: "up" as const,
    threshold: { safe: 100, moderate: 200, high: 300 },
    description: "Measures structural strain to assess material stress and deformation.",
    logs: [
      { timestamp: "2024-01-15 15:45", level: "warning", message: "Strain approaching moderate threshold" },
      { timestamp: "2024-01-15 13:20", level: "error", message: "Temporary signal interruption detected" },
      { timestamp: "2024-01-15 11:10", level: "info", message: "Strain measurements within normal range" }
    ]
  },
  {
    id: "PORE-003",
    name: "Pore Pressure",
    location: "Section C - Ground Level",
    value: 87.3,
    unit: "kPa",
    status: "safe" as const,
    trend: "down" as const,
    threshold: { safe: 100, moderate: 150, high: 200 },
    description: "Monitors groundwater pressure to predict potential slope instability.",
    logs: [
      { timestamp: "2024-01-15 14:30", level: "info", message: "Pressure levels decreasing as expected" },
      { timestamp: "2024-01-15 10:45", level: "info", message: "Drainage system functioning optimally" },
      { timestamp: "2024-01-15 08:15", level: "info", message: "Morning pressure reading completed" }
    ]
  },
  {
    id: "RAIN-004",
    name: "Rainfall Monitor",
    location: "Weather Station - Surface",
    value: 0.0,
    unit: "mm/h",
    status: "safe" as const,
    trend: "stable" as const,
    threshold: { safe: 5, moderate: 15, high: 25 },
    description: "Tracks precipitation levels that can affect slope stability and drainage.",
    logs: [
      { timestamp: "2024-01-15 16:00", level: "info", message: "Clear weather conditions maintained" },
      { timestamp: "2024-01-15 06:00", level: "info", message: "Daily weather monitoring initiated" },
      { timestamp: "2024-01-14 22:30", level: "warning", message: "Light precipitation detected overnight" }
    ]
  },
  {
    id: "TEMP-005",
    name: "Temperature Sensor",
    location: "Section A - Equipment Bay",
    value: 23.8,
    unit: "°C",
    status: "safe" as const,
    trend: "stable" as const,
    threshold: { safe: 40, moderate: 50, high: 60 },
    description: "Monitors ambient temperature for equipment operation and safety.",
    logs: [
      { timestamp: "2024-01-15 15:30", level: "info", message: "Temperature within optimal operating range" },
      { timestamp: "2024-01-15 12:00", level: "info", message: "Equipment cooling system functioning" },
      { timestamp: "2024-01-15 09:00", level: "info", message: "Temperature monitoring stable" }
    ]
  },
  {
    id: "VIB-006",
    name: "Vibration Monitor",
    location: "Section D - Blast Zone",
    value: 12.4,
    unit: "mm/s",
    status: "high" as const,
    trend: "up" as const,
    threshold: { safe: 5, moderate: 10, high: 15 },
    description: "Detects ground vibrations from blasting operations and equipment.",
    logs: [
      { timestamp: "2024-01-15 16:15", level: "error", message: "High vibration levels detected - investigate immediately" },
      { timestamp: "2024-01-15 14:45", level: "warning", message: "Vibration exceeding moderate threshold" },
      { timestamp: "2024-01-15 13:30", level: "warning", message: "Blasting operation caused temporary spike" }
    ]
  }
];

export default function Sensors() {
  const [selectedSensor, setSelectedSensor] = useState(sensorDetails[0]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "moderate":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      safe: "bg-sensor-safe/20 text-sensor-safe border-sensor-safe/30",
      moderate: "bg-sensor-moderate/20 text-sensor-moderate border-sensor-moderate/30",
      high: "bg-sensor-high/20 text-sensor-high border-sensor-high/30"
    };
    return variants[status as keyof typeof variants] || variants.safe;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-success" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getGaugeValue = (sensor: typeof selectedSensor) => {
    return Math.min((sensor.value / sensor.threshold.high) * 100, 100);
  };

  const getLogLevel = (level: string) => {
    switch (level) {
      case "error":
        return "bg-destructive/10 text-destructive border-l-destructive";
      case "warning":
        return "bg-warning/10 text-warning border-l-warning";
      default:
        return "bg-muted/10 text-muted-foreground border-l-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-3">
            Sensor Monitoring Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring and comprehensive analysis of all active sensors across mining operations
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sensor Grid */}
          <div className="xl:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  Active Sensors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sensorDetails.map((sensor) => (
                  <div
                    key={sensor.id}
                    onClick={() => setSelectedSensor(sensor)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedSensor.id === sensor.id 
                        ? "border-primary bg-primary/5 shadow-lg" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(sensor.status)}
                        <Badge variant="outline" className={getStatusBadge(sensor.status)}>
                          {sensor.status.toUpperCase()}
                        </Badge>
                      </div>
                      {getTrendIcon(sensor.trend)}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground text-sm">{sensor.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{sensor.id}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {sensor.location}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-right">
                      <div className="text-lg font-bold font-mono text-foreground">
                        {sensor.value.toFixed(2)}
                        <span className="text-sm text-muted-foreground ml-1">{sensor.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Detailed View */}
          <div className="xl:col-span-3 space-y-6">
            {/* Sensor Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{selectedSensor.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedSensor.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        ID: {selectedSensor.id}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm max-w-2xl">{selectedSensor.description}</p>
                  </div>
                  <Badge className={`${getStatusBadge(selectedSensor.status)} px-4 py-2`}>
                    {getStatusIcon(selectedSensor.status)}
                    <span className="ml-2 font-medium">{selectedSensor.status.toUpperCase()}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Reading */}
                  <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border">
                    <div className="text-4xl font-bold font-mono text-foreground mb-2">
                      {selectedSensor.value.toFixed(2)}
                      <span className="text-xl text-muted-foreground ml-2">{selectedSensor.unit}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {getTrendIcon(selectedSensor.trend)}
                      <span className="text-sm text-muted-foreground font-medium capitalize">
                        {selectedSensor.trend} Trend
                      </span>
                    </div>
                  </div>

                  {/* Circular Gauge */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={
                            selectedSensor.status === "safe" ? "hsl(var(--sensor-safe))" :
                            selectedSensor.status === "moderate" ? "hsl(var(--sensor-moderate))" :
                            "hsl(var(--sensor-high))"
                          }
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${getGaugeValue(selectedSensor) * 2.51} 251`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {getGaugeValue(selectedSensor).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Overview */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Status Overview</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Value</span>
                        <span className="font-mono">{selectedSensor.value} {selectedSensor.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Safe Threshold</span>
                        <span className="font-mono text-success">{selectedSensor.threshold.safe} {selectedSensor.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>High Threshold</span>
                        <span className="font-mono text-destructive">{selectedSensor.threshold.high} {selectedSensor.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Threshold Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Threshold Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-sensor-safe/10 border border-sensor-safe/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-sensor-safe" />
                      <span className="font-semibold text-sensor-safe">Safe Zone</span>
                    </div>
                    <div className="font-mono text-lg">≤ {selectedSensor.threshold.safe} {selectedSensor.unit}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-sensor-moderate/10 border border-sensor-moderate/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-sensor-moderate" />
                      <span className="font-semibold text-sensor-moderate">Moderate Risk</span>
                    </div>
                    <div className="font-mono text-lg">{selectedSensor.threshold.safe + 0.1} - {selectedSensor.threshold.moderate} {selectedSensor.unit}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-sensor-high/10 border border-sensor-high/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-sensor-high" />
                      <span className="font-semibold text-sensor-high">High Risk</span>
                    </div>
                    <div className="font-mono text-lg">≥ {selectedSensor.threshold.moderate + 0.1} {selectedSensor.unit}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sensor Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sensor Logs & Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedSensor.logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${getLogLevel(log.level)}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">{log.timestamp}</span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}