import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Activity, Zap, Calendar } from "lucide-react";
import SensorCard from "../components/SensorCard";

// Mock sensor data
const mockSensors = [
  {
    id: "DISP-001",
    name: "Displacement Sensor",
    value: 2.45,
    unit: "mm",
    status: "safe" as const,
    trend: "stable" as const,
    lastUpdated: "2 mins ago",
    threshold: { safe: 5, moderate: 8, high: 12 }
  },
  {
    id: "STRN-002", 
    name: "Strain Gauge",
    value: 156.7,
    unit: "μɛ",
    status: "moderate" as const,
    trend: "up" as const,
    lastUpdated: "1 min ago",
    threshold: { safe: 100, moderate: 200, high: 300 }
  },
  {
    id: "PORE-003",
    name: "Pore Pressure",
    value: 87.3,
    unit: "kPa",
    status: "safe" as const,
    trend: "down" as const,
    lastUpdated: "3 mins ago",
    threshold: { safe: 100, moderate: 150, high: 200 }
  },
  {
    id: "RAIN-004",
    name: "Rainfall Monitor",
    value: 0.0,
    unit: "mm/h",
    status: "safe" as const,
    trend: "stable" as const,
    lastUpdated: "1 min ago",
    threshold: { safe: 5, moderate: 15, high: 25 }
  },
  {
    id: "TEMP-005",
    name: "Temperature Sensor",
    value: 23.8,
    unit: "°C",
    status: "safe" as const,
    trend: "stable" as const,
    lastUpdated: "2 mins ago",
    threshold: { safe: 40, moderate: 50, high: 60 }
  },
  {
    id: "VIB-006",
    name: "Vibration Monitor",
    value: 12.4,
    unit: "mm/s",
    status: "high" as const,
    trend: "up" as const,
    lastUpdated: "30 secs ago",
    threshold: { safe: 5, moderate: 10, high: 15 }
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
  const [liveData, setLiveData] = useState(mockSensors);
  
  const sensorsPerPage = 4;
  const totalPages = Math.ceil(mockSensors.length / sensorsPerPage);
  
  const getCurrentSensors = () => {
    const start = currentSensorIndex;
    const end = start + sensorsPerPage;
    return liveData.slice(start, end);
  };

  const nextSensors = () => {
    if (currentSensorIndex + sensorsPerPage < mockSensors.length) {
      setCurrentSensorIndex(currentSensorIndex + sensorsPerPage);
    }
  };

  const prevSensors = () => {
    if (currentSensorIndex > 0) {
      setCurrentSensorIndex(currentSensorIndex - sensorsPerPage);
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => prev.map(sensor => ({
        ...sensor,
        value: sensor.value + (Math.random() - 0.5) * 0.1,
        lastUpdated: "Just now"
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Activity className="h-8 w-8 text-success" />
            <div>
              <div className="text-2xl font-bold text-success">6</div>
              <div className="text-sm text-muted-foreground">Active Sensors</div>
            </div>
          </div>
        </div>

        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="h-8 w-8 text-warning" />
            <div>
              <div className="text-2xl font-bold text-warning">2</div>
              <div className="text-sm text-muted-foreground">Alerts Active</div>
            </div>
          </div>
        </div>

        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold text-primary">24h</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
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
              disabled={currentSensorIndex + sensorsPerPage >= mockSensors.length}
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