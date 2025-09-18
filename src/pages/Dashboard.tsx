import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Activity, Zap, Calendar, Users, TrendingUp, AlertTriangle, X, Bell } from "lucide-react";
import SensorCard from "../components/SensorCard";
import { databaseService, type SensorReading } from "@/services/DatabaseService";

// Sensor type definition (compatible with SensorCard)
interface SensorType {
  id: string;
  name: string;
  location: string;
  value: number;
  unit: string;
  status: "safe" | "moderate" | "high";
  trend: "up" | "down" | "stable";
  threshold: { safe: number; moderate: number; high: number };
  lastUpdated: string;
  description: string;
  logs: Array<{
    id: string;
    timestamp: string;
    level: "info" | "warning" | "error";
    message: string;
  }>;
}

// Sensor mapping configuration (same as Sensors page)
const sensorMappings = {
  'RAIN-001': { field: 'Rainfall_mm' as keyof SensorReading, name: 'Current Rainfall', unit: 'mm', thresholds: { safe: 5, moderate: 15, high: 25 } },
  'RAIN-002': { field: 'Rainfall_3Day' as keyof SensorReading, name: '3-Day Rainfall', unit: 'mm', thresholds: { safe: 20, moderate: 50, high: 100 } },
  'RAIN-003': { field: 'Rainfall_7Day' as keyof SensorReading, name: '7-Day Rainfall', unit: 'mm', thresholds: { safe: 50, moderate: 100, high: 200 } },
  'TEMP-001': { field: 'Temperature_C' as keyof SensorReading, name: 'Temperature', unit: '°C', thresholds: { safe: 40, moderate: 50, high: 60 } },
  'STRN-001': { field: 'Soil_Strain' as keyof SensorReading, name: 'Soil Strain', unit: 'μɛ', thresholds: { safe: 100, moderate: 200, high: 300 } },
  'PORE-001': { field: 'Pore_Water_Pressure_kPa' as keyof SensorReading, name: 'Pore Water Pressure', unit: 'kPa', thresholds: { safe: 100, moderate: 150, high: 200 } },
};

// Initialize sensors from mapping (same structure as Sensors page)
const initializeSensors = (): SensorType[] => {
  return Object.entries(sensorMappings).map(([id, config]) => ({
    id,
    name: config.name,
    location: "Mine Site - Monitoring Station",
    value: 0,
    unit: config.unit,
    status: "safe" as const,
    trend: "stable" as const,
    threshold: config.thresholds,
    lastUpdated: new Date().toLocaleString(),
    description: `Real-time monitoring of ${config.name.toLowerCase()} from cloud database sensors.`,
    logs: [
      { id: `${id}-1`, timestamp: new Date().toLocaleString(), level: "info" as const, message: "Sensor initialized - waiting for data" }
    ]
  }));
};

const activeAlerts = [
  {
    id: 1,
    type: "Vibration Anomaly",
    description: "Automated monitoring system detection",
    zone: "Zone A",
    time: "Just now",
    severity: "warning",
    icon: "vibration"
  },
  {
    id: 2,
    type: "Sensor Offline",
    description: "Automated monitoring system detection",
    zone: "Zone D",
    time: "Just now",
    severity: "critical",
    icon: "offline"
  },
  {
    id: 3,
    type: "Temperature Spike",
    description: "Automated monitoring system detection",
    zone: "Zone D",
    time: "Just now",
    severity: "warning",
    icon: "temperature"
  },
  {
    id: 4,
    type: "Sensor Offline",
    description: "Automated monitoring system detection",
    zone: "Zone A",
    time: "1m ago",
    severity: "info",
    icon: "offline"
  },
  {
    id: 5,
    type: "Temperature Spike",
    description: "Automated monitoring system detection",
    zone: "Zone D",
    time: "Just now",
    severity: "warning",
    icon: "temperature"
  }
];

const timelineEvents = [
  { time: "14:30", event: "Vibration spike detected", status: "warning" },
  { time: "13:45", event: "System maintenance completed", status: "success" },
  { time: "12:20", event: "Strain threshold exceeded", status: "alert" },
  { time: "11:15", event: "Weather alert: Heavy rainfall", status: "info" },
];

export default function Dashboard() {
  const [currentSensorIndex, setCurrentSensorIndex] = useState(0);
  const [liveData, setLiveData] = useState(initializeSensors());
  
  const sensorsPerPage = 4;
  const totalPages = Math.ceil(liveData.length / sensorsPerPage);
  
  const getCurrentSensors = () => {
    const start = currentSensorIndex;
    const end = start + sensorsPerPage;
    return liveData.slice(start, end);
  };

  const nextSensors = () => {
    if (currentSensorIndex + sensorsPerPage < liveData.length) {
      setCurrentSensorIndex(currentSensorIndex + sensorsPerPage);
    }
  };

  const prevSensors = () => {
    if (currentSensorIndex > 0) {
      setCurrentSensorIndex(currentSensorIndex - sensorsPerPage);
    }
  };

  // Update sensors from database data (same logic as Sensors page)
  const updateSensorsFromData = (sensorData: SensorReading[]) => {
    if (sensorData.length === 0) return;

    const latestReading = sensorData[sensorData.length - 1];
    
    setLiveData(prevSensors => 
      prevSensors.map(sensor => {
        const mapping = sensorMappings[sensor.id as keyof typeof sensorMappings];
        if (!mapping) return sensor;

        const newValue = Number(latestReading[mapping.field]) || 0;
        
        // Determine status based on thresholds
        let newStatus: "safe" | "moderate" | "high" = "safe";
        if (newValue >= sensor.threshold.high) {
          newStatus = "high";
        } else if (newValue >= sensor.threshold.moderate) {
          newStatus = "moderate";
        }
        
        // Determine trend (simplified - compare with previous value)
        let newTrend: "up" | "down" | "stable" = "stable";
        const diff = newValue - sensor.value;
        if (diff > 0.1) newTrend = "up";
        else if (diff < -0.1) newTrend = "down";
        
        return {
          ...sensor,
          value: parseFloat(newValue.toFixed(2)),
          status: newStatus,
          trend: newTrend,
          lastUpdated: new Date().toLocaleString(),
        };
      })
    );
  };

  // Setup database service (same as Sensors page)
  useEffect(() => {
    if (databaseService.isConfigured()) {
      // Subscribe to real-time data
      databaseService.subscribe(updateSensorsFromData);
      
      // Start real-time monitoring
      databaseService.startRealTimeMonitoring(5000); // Every 5 seconds
    }

    return () => {
      // Cleanup subscriptions
      databaseService.unsubscribe(updateSensorsFromData);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingUp className="h-6 w-6 text-success" />
            <div>
              <div className="text-xs text-success font-medium">+2.3%</div>
              <div className="text-xs text-muted-foreground">Overall Safety Score</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">87%</div>
        </div>

        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <div className="text-xs text-primary font-medium">100% Online</div>
              <div className="text-xs text-muted-foreground">Active Sensors</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">142</div>
        </div>

        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <div className="text-xs text-destructive font-medium">1 Critical</div>
              <div className="text-xs text-muted-foreground">Active Alerts</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">3</div>
        </div>

        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Users className="h-6 w-6 text-success" />
            <div>
              <div className="text-xs text-success font-medium">All Safe</div>
              <div className="text-xs text-muted-foreground">Personnel On-Site</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">48</div>
        </div>
      </div>

      {/* Risk Assessment Map and Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Risk Assessment Map */}
        <div className="lg:col-span-2">
          <div className="sensor-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Risk Assessment Map</h2>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                  4 Active Zones
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
                  1 Critical
                </span>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-primary/5 to-secondary/10 rounded-lg h-80 overflow-hidden">
              {/* Zone A - Safe */}
              <div className="absolute top-12 left-20 flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 bg-success/90 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-4 border-success/50">
                  12
                </div>
                <div className="text-xs font-medium text-foreground mt-2">Zone A</div>
              </div>

              {/* Zone B - Warning */}
              <div className="absolute top-32 right-20 flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 bg-warning/90 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-4 border-warning/50">
                  45
                </div>
                <div className="text-xs font-medium text-foreground mt-2">Zone B</div>
              </div>

              {/* Zone C - Critical */}
              <div className="absolute bottom-12 left-1/3 flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 bg-destructive/90 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-4 border-destructive/50">
                  78
                </div>
                <div className="text-xs font-medium text-foreground mt-2">Zone C</div>
              </div>

              {/* Zone D - Safe */}
              <div className="absolute top-24 right-1/3 flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 bg-success/90 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-4 border-success/50">
                  5
                </div>
                <div className="text-xs font-medium text-foreground mt-2">Zone D</div>
              </div>

              {/* Grid overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="lg:col-span-1">
          <div className="sensor-card h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Active Alerts</h2>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
                10 New
              </span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                  alert.severity === "critical" ? "bg-destructive/10 border-destructive/30" :
                  alert.severity === "warning" ? "bg-warning/10 border-warning/30" :
                  "bg-primary/10 border-primary/30"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        alert.severity === "critical" ? "bg-destructive/20" :
                        alert.severity === "warning" ? "bg-warning/20" :
                        "bg-primary/20"
                      }`}>
                        {alert.icon === "vibration" && <Activity className="h-4 w-4" />}
                        {alert.icon === "offline" && <AlertTriangle className="h-4 w-4" />}
                        {alert.icon === "temperature" && <TrendingUp className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{alert.type}</div>
                        <div className="text-xs text-muted-foreground">{alert.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{alert.zone}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Sensor Data */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Live Sensor Data</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevSensors}
              disabled={currentSensorIndex === 0}
              className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-muted-foreground px-3">
              {Math.floor(currentSensorIndex / sensorsPerPage) + 1} of {totalPages}
            </span>
            <button
              onClick={nextSensors}
              disabled={currentSensorIndex + sensorsPerPage >= liveData.length}
              className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getCurrentSensors().map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} className="slide-in" />
          ))}
        </div>
      </section>

      {/* Event Timeline */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Recent Events</h2>
        <div className="sensor-card">
          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-sm font-mono text-muted-foreground min-w-[60px]">
                  {event.time}
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  event.status === "warning" ? "bg-warning" :
                  event.status === "success" ? "bg-success" :
                  event.status === "alert" ? "bg-destructive" :
                  "bg-primary"
                }`} />
                <div className="text-sm text-foreground">{event.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}