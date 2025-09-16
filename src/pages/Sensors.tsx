import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, FileText, Clock, MapPin, Activity, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SensorCard from "@/components/SensorCard";

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
const sensorDetails: SensorType[] = [
  {
    id: "DISP-001",
    name: "Displacement Sensor",
    location: "Section A - North Wall",
    value: 2.45,
    unit: "mm",
    status: "safe",
    trend: "stable",
    threshold: { safe: 5, moderate: 8, high: 12 },
    lastUpdated: "2024-01-15 14:23",
    description: "Monitors structural displacement in the mining wall to detect potential rock movement.",
    logs: [
      { id: "1", timestamp: "2024-01-15 14:23", level: "info", message: "Sensor calibrated successfully" },
      { id: "2", timestamp: "2024-01-15 12:15", level: "warning", message: "Minor displacement detected, monitoring closely" },
      { id: "3", timestamp: "2024-01-15 09:30", level: "info", message: "Daily threshold check completed" }
    ]
  },
  {
    id: "STRN-002", 
    name: "Strain Gauge",
    location: "Section B - Support Beam",
    value: 156.7,
    unit: "μɛ",
    status: "moderate",
    trend: "up",
    threshold: { safe: 100, moderate: 200, high: 300 },
    lastUpdated: "2024-01-15 15:45",
    description: "Measures structural strain to assess material stress and deformation.",
    logs: [
      { id: "4", timestamp: "2024-01-15 15:45", level: "warning", message: "Strain approaching moderate threshold" },
      { id: "5", timestamp: "2024-01-15 13:20", level: "error", message: "Temporary signal interruption detected" },
      { id: "6", timestamp: "2024-01-15 11:10", level: "info", message: "Strain measurements within normal range" }
    ]
  },
  {
    id: "PORE-003",
    name: "Pore Pressure",
    location: "Section C - Ground Level",
    value: 87.3,
    unit: "kPa",
    status: "safe",
    trend: "down",
    threshold: { safe: 100, moderate: 150, high: 200 },
    lastUpdated: "2024-01-15 14:30",
    description: "Monitors groundwater pressure to predict potential slope instability.",
    logs: [
      { id: "7", timestamp: "2024-01-15 14:30", level: "info", message: "Pressure levels decreasing as expected" },
      { id: "8", timestamp: "2024-01-15 10:45", level: "info", message: "Drainage system functioning optimally" },
      { id: "9", timestamp: "2024-01-15 08:15", level: "info", message: "Morning pressure reading completed" }
    ]
  },
  {
    id: "RAIN-004",
    name: "Rainfall Monitor",
    location: "Weather Station - Surface",
    value: 0.0,
    unit: "mm/h",
    status: "safe",
    trend: "stable",
    threshold: { safe: 5, moderate: 15, high: 25 },
    lastUpdated: "2024-01-15 16:00",
    description: "Tracks precipitation levels that can affect slope stability and drainage.",
    logs: [
      { id: "10", timestamp: "2024-01-15 16:00", level: "info", message: "Clear weather conditions maintained" },
      { id: "11", timestamp: "2024-01-15 06:00", level: "info", message: "Daily weather monitoring initiated" },
      { id: "12", timestamp: "2024-01-14 22:30", level: "warning", message: "Light precipitation detected overnight" }
    ]
  },
  {
    id: "TEMP-005",
    name: "Temperature Sensor",
    location: "Section A - Equipment Bay",
    value: 23.8,
    unit: "°C",
    status: "safe",
    trend: "stable",
    threshold: { safe: 40, moderate: 50, high: 60 },
    lastUpdated: "2024-01-15 15:30",
    description: "Monitors ambient temperature for equipment operation and safety.",
    logs: [
      { id: "13", timestamp: "2024-01-15 15:30", level: "info", message: "Temperature within optimal operating range" },
      { id: "14", timestamp: "2024-01-15 12:00", level: "info", message: "Equipment cooling system functioning" },
      { id: "15", timestamp: "2024-01-15 09:00", level: "info", message: "Temperature monitoring stable" }
    ]
  },
  {
    id: "VIB-006",
    name: "Vibration Monitor",
    location: "Section D - Blast Zone",
    value: 12.4,
    unit: "mm/s",
    status: "high",
    trend: "up",
    threshold: { safe: 5, moderate: 10, high: 15 },
    lastUpdated: "2024-01-15 16:15",
    description: "Detects ground vibrations from blasting operations and equipment.",
    logs: [
      { id: "16", timestamp: "2024-01-15 16:15", level: "error", message: "High vibration levels detected - investigate immediately" },
      { id: "17", timestamp: "2024-01-15 14:45", level: "warning", message: "Vibration exceeding moderate threshold" },
      { id: "18", timestamp: "2024-01-15 13:30", level: "warning", message: "Blasting operation caused temporary spike" }
    ]
  }
];

export default function Sensors() {
  const [sensors, setSensors] = useState(sensorDetails);

  // Data randomizer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prevSensors => 
        prevSensors.map(sensor => {
          // Generate small random variations in sensor values
          const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
          const newValue = Math.max(0, sensor.value + variation);
          
          // Determine new status based on thresholds
          let newStatus: "safe" | "moderate" | "high" = "safe";
          if (newValue >= sensor.threshold.high) {
            newStatus = "high";
          } else if (newValue >= sensor.threshold.moderate) {
            newStatus = "moderate";
          }
          
          // Determine trend
          let newTrend: "up" | "down" | "stable" = "stable";
          if (variation > 0.02) newTrend = "up";
          else if (variation < -0.02) newTrend = "down";
          
          return {
            ...sensor,
            value: parseFloat(newValue.toFixed(2)),
            status: newStatus,
            trend: newTrend,
            lastUpdated: new Date().toLocaleString()
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-3">
            Sensor Monitoring Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring with expandable sensor cards for detailed analysis
          </p>
        </div>

        {/* Sensors Vertical Stack */}
        <div className="space-y-6">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="w-full">
              <SensorCard sensor={sensor} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}