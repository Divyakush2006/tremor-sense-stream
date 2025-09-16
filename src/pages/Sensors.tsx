import { useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, FileText, Clock, MapPin, Activity, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SensorCard from "@/components/SensorCard";

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
    lastUpdated: "2024-01-15 14:23",
    description: "Monitors structural displacement in the mining wall to detect potential rock movement.",
    logs: [
      { id: "1", timestamp: "2024-01-15 14:23", level: "info" as const, message: "Sensor calibrated successfully" },
      { id: "2", timestamp: "2024-01-15 12:15", level: "warning" as const, message: "Minor displacement detected, monitoring closely" },
      { id: "3", timestamp: "2024-01-15 09:30", level: "info" as const, message: "Daily threshold check completed" }
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
    lastUpdated: "2024-01-15 15:45",
    description: "Measures structural strain to assess material stress and deformation.",
    logs: [
      { id: "4", timestamp: "2024-01-15 15:45", level: "warning" as const, message: "Strain approaching moderate threshold" },
      { id: "5", timestamp: "2024-01-15 13:20", level: "error" as const, message: "Temporary signal interruption detected" },
      { id: "6", timestamp: "2024-01-15 11:10", level: "info" as const, message: "Strain measurements within normal range" }
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
    lastUpdated: "2024-01-15 14:30",
    description: "Monitors groundwater pressure to predict potential slope instability.",
    logs: [
      { id: "7", timestamp: "2024-01-15 14:30", level: "info" as const, message: "Pressure levels decreasing as expected" },
      { id: "8", timestamp: "2024-01-15 10:45", level: "info" as const, message: "Drainage system functioning optimally" },
      { id: "9", timestamp: "2024-01-15 08:15", level: "info" as const, message: "Morning pressure reading completed" }
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
    lastUpdated: "2024-01-15 16:00",
    description: "Tracks precipitation levels that can affect slope stability and drainage.",
    logs: [
      { id: "10", timestamp: "2024-01-15 16:00", level: "info" as const, message: "Clear weather conditions maintained" },
      { id: "11", timestamp: "2024-01-15 06:00", level: "info" as const, message: "Daily weather monitoring initiated" },
      { id: "12", timestamp: "2024-01-14 22:30", level: "warning" as const, message: "Light precipitation detected overnight" }
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
    lastUpdated: "2024-01-15 15:30",
    description: "Monitors ambient temperature for equipment operation and safety.",
    logs: [
      { id: "13", timestamp: "2024-01-15 15:30", level: "info" as const, message: "Temperature within optimal operating range" },
      { id: "14", timestamp: "2024-01-15 12:00", level: "info" as const, message: "Equipment cooling system functioning" },
      { id: "15", timestamp: "2024-01-15 09:00", level: "info" as const, message: "Temperature monitoring stable" }
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
    lastUpdated: "2024-01-15 16:15",
    description: "Detects ground vibrations from blasting operations and equipment.",
    logs: [
      { id: "16", timestamp: "2024-01-15 16:15", level: "error" as const, message: "High vibration levels detected - investigate immediately" },
      { id: "17", timestamp: "2024-01-15 14:45", level: "warning" as const, message: "Vibration exceeding moderate threshold" },
      { id: "18", timestamp: "2024-01-15 13:30", level: "warning" as const, message: "Blasting operation caused temporary spike" }
    ]
  }
];

export default function Sensors() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-3">
            Sensor Monitoring Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring with expandable sensor cards for detailed analysis
          </p>
        </div>

        {/* Sensors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sensorDetails.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </div>
    </div>
  );
}