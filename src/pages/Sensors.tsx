import { useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

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
    history: [1.2, 1.8, 2.1, 2.3, 2.4, 2.45],
    description: "Monitors structural displacement in the mining wall to detect potential rock movement."
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
    history: [98, 112, 134, 145, 152, 156.7],
    description: "Measures structural strain to assess material stress and deformation."
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
    history: [95, 92, 89, 88.5, 87.8, 87.3],
    description: "Monitors groundwater pressure to predict potential slope instability."
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
    history: [0, 0, 0.5, 0.2, 0, 0],
    description: "Tracks precipitation levels that can affect slope stability and drainage."
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
    history: [22.1, 22.8, 23.2, 23.5, 23.6, 23.8],
    description: "Monitors ambient temperature for equipment operation and safety."
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
    history: [3.2, 4.1, 6.8, 9.2, 11.1, 12.4],
    description: "Detects ground vibrations from blasting operations and equipment."
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-warning" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-success" />;
      default:
        return <div className="h-4 w-4 bg-muted-foreground rounded-full" />;
    }
  };

  const getGaugeValue = (sensor: typeof selectedSensor) => {
    return Math.min((sensor.value / sensor.threshold.high) * 100, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sensor Details</h1>
        <p className="text-muted-foreground">Detailed monitoring and analysis of all active sensors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sensor List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Sensors</h2>
          {sensorDetails.map((sensor) => (
            <div
              key={sensor.id}
              onClick={() => setSelectedSensor(sensor)}
              className={`sensor-card cursor-pointer transition-all ${
                selectedSensor.id === sensor.id ? "ring-2 ring-primary shadow-glow" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(sensor.status)}
                  <div>
                    <h3 className="font-semibold text-foreground">{sensor.name}</h3>
                    <p className="text-sm text-muted-foreground">{sensor.id}</p>
                  </div>
                </div>
                {getTrendIcon(sensor.trend)}
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold font-mono">
                  {sensor.value.toFixed(2)} {sensor.unit}
                </div>
                <div className="text-xs text-muted-foreground">{sensor.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sensor Header */}
          <div className="sensor-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedSensor.name}</h2>
                <p className="text-muted-foreground">{selectedSensor.location}</p>
                <p className="text-sm text-muted-foreground mt-2">{selectedSensor.description}</p>
              </div>
              <div className={`status-indicator ${
                selectedSensor.status === "safe" ? "status-safe" :
                selectedSensor.status === "moderate" ? "status-moderate" :
                "status-high"
              }`}>
                {getStatusIcon(selectedSensor.status)}
                <span className="capitalize">{selectedSensor.status} Status</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Reading */}
              <div className="text-center">
                <div className="text-4xl font-bold font-mono text-foreground mb-2">
                  {selectedSensor.value.toFixed(2)}
                  <span className="text-xl text-muted-foreground ml-2">{selectedSensor.unit}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {getTrendIcon(selectedSensor.trend)}
                  <span className="text-sm text-muted-foreground capitalize">
                    {selectedSensor.trend} trend
                  </span>
                </div>
              </div>

              {/* Circular Gauge */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
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
                    <span className="text-sm font-semibold">
                      {getGaugeValue(selectedSensor).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Chart */}
          <div className="sensor-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Historical Data (Last 6 Hours)</h3>
            <div className="chart-container h-48 flex items-end justify-between gap-2 p-4">
              {selectedSensor.history.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary rounded-t transition-all duration-500"
                    style={{ 
                      height: `${(value / selectedSensor.threshold.high) * 100}%`,
                      minHeight: "8px"
                    }}
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    {index === selectedSensor.history.length - 1 ? "Now" : `-${selectedSensor.history.length - 1 - index}h`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thresholds */}
          <div className="sensor-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Threshold Levels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-sensor-safe/10 border border-sensor-safe/20">
                <span className="text-sm font-medium">Safe Level</span>
                <span className="font-mono">≤ {selectedSensor.threshold.safe} {selectedSensor.unit}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-sensor-moderate/10 border border-sensor-moderate/20">
                <span className="text-sm font-medium">Moderate Risk</span>
                <span className="font-mono">{selectedSensor.threshold.safe + 0.1} - {selectedSensor.threshold.moderate} {selectedSensor.unit}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-sensor-high/10 border border-sensor-high/20">
                <span className="text-sm font-medium">High Risk</span>
                <span className="font-mono">≥ {selectedSensor.threshold.moderate + 0.1} {selectedSensor.unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}