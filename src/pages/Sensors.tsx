import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, FileText, Clock, MapPin, Activity, Gauge, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SensorCard from "@/components/SensorCard";
import DatabaseConfig from "@/components/DatabaseConfig";
import { databaseService, type SensorReading } from "@/services/DatabaseService";
import { mlModelService, type MLPrediction } from "@/services/MLModelService";
import { autoEvacuationService } from "@/services/AutoEvacuationService";
import { useToast } from "@/hooks/use-toast";

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

// Sensor mapping configuration
const sensorMappings = {
  'RAIN-001': { field: 'Rainfall_mm' as keyof SensorReading, name: 'Current Rainfall', unit: 'mm', thresholds: { safe: 5, moderate: 15, high: 25 } },
  'RAIN-002': { field: 'Rainfall_3Day' as keyof SensorReading, name: '3-Day Rainfall', unit: 'mm', thresholds: { safe: 20, moderate: 50, high: 100 } },
  'RAIN-003': { field: 'Rainfall_7Day' as keyof SensorReading, name: '7-Day Rainfall', unit: 'mm', thresholds: { safe: 50, moderate: 100, high: 200 } },
  'TEMP-001': { field: 'Temperature_C' as keyof SensorReading, name: 'Temperature', unit: '°C', thresholds: { safe: 40, moderate: 50, high: 60 } },
  'STRN-001': { field: 'Soil_Strain' as keyof SensorReading, name: 'Soil Strain', unit: 'μɛ', thresholds: { safe: 100, moderate: 200, high: 300 } },
  'PORE-001': { field: 'Pore_Water_Pressure_kPa' as keyof SensorReading, name: 'Pore Water Pressure', unit: 'kPa', thresholds: { safe: 100, moderate: 150, high: 200 } },
};
// Initialize sensors from mapping
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
      { id: `${id}-1`, timestamp: new Date().toLocaleString(), level: "info", message: "Sensor initialized - waiting for data" }
    ]
  }));
};

export default function Sensors() {
  const [sensors, setSensors] = useState<SensorType[]>(initializeSensors());
  const [showConfig, setShowConfig] = useState(false);
  const [mlPrediction, setMlPrediction] = useState<MLPrediction | null>(null);
  const [isDataConnected, setIsDataConnected] = useState(false);
  const { toast } = useToast();

  // Update sensors from database data
  const updateSensorsFromData = (sensorData: SensorReading[]) => {
    if (sensorData.length === 0) return;

    const latestReading = sensorData[sensorData.length - 1];
    
    setSensors(prevSensors => 
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
        
        // Create new log entry if status changed or significant value change
        const newLogs = [...sensor.logs];
        if (sensor.status !== newStatus || Math.abs(diff) > 0.5) {
          newLogs.unshift({
            id: `${sensor.id}-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            level: newStatus === "high" ? "error" : newStatus === "moderate" ? "warning" : "info",
            message: `Reading updated: ${newValue} ${sensor.unit} (Status: ${newStatus})`
          });
          
          // Keep only last 10 logs
          if (newLogs.length > 10) {
            newLogs.splice(10);
          }
        }
        
        return {
          ...sensor,
          value: parseFloat(newValue.toFixed(2)),
          status: newStatus,
          trend: newTrend,
          lastUpdated: new Date().toLocaleString(),
          logs: newLogs
        };
      })
    );
    
    setIsDataConnected(true);
  };

  // Setup database and ML services
  useEffect(() => {
    if (databaseService.isConfigured()) {
      // Subscribe to real-time data
      databaseService.subscribe(updateSensorsFromData);
      
      // Start real-time monitoring
      databaseService.startRealTimeMonitoring(5000); // Every 5 seconds
    }

    if (mlModelService.isConfigured()) {
      // Subscribe to ML predictions
      mlModelService.onPrediction((prediction) => {
        setMlPrediction(prediction);
        
        // Process through auto evacuation service
        autoEvacuationService.processPrediction(prediction);
      });
    }

    // Subscribe to auto evacuation triggers
    autoEvacuationService.onEvacuation(() => {
      toast({
        title: "🚨 AUTO EVACUATION TRIGGERED",
        description: "High risk conditions detected by ML model",
        variant: "destructive",
      });
    });

    return () => {
      // Cleanup subscriptions
      databaseService.unsubscribe(updateSensorsFromData);
    };
  }, [toast]);

  // Process sensor data through ML model
  useEffect(() => {
    if (!databaseService.isConfigured() || !mlModelService.isConfigured()) return;

    const processML = async () => {
      try {
        const sensorData = await databaseService.fetchSensorData();
        if (sensorData.length > 0) {
          await mlModelService.processSensorData(sensorData);
        }
      } catch (error) {
        console.error('ML processing error:', error);
      }
    };

    const interval = setInterval(processML, 10000); // Process every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-3">
                Live Sensor Monitoring
              </h1>
              <p className="text-lg text-muted-foreground">
                Real-time data from cloud database with ML-powered risk assessment
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure Services
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Badge variant={isDataConnected ? "secondary" : "destructive"}>
                    {isDataConnected ? "Connected" : "Disconnected"}
                  </Badge>
                  <span className="text-sm">Database</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Badge variant={mlModelService.isConfigured() ? "secondary" : "destructive"}>
                    {mlModelService.isConfigured() ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-sm">ML Model</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Badge variant={autoEvacuationService.isAutoEvacuationEnabled() ? "secondary" : "destructive"}>
                    {autoEvacuationService.isAutoEvacuationEnabled() ? "Enabled" : "Disabled"}
                  </Badge>
                  <span className="text-sm">Auto Evacuation</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ML Prediction Display */}
          {mlPrediction && (
            <Card className={`mb-6 ${mlPrediction.risk_level ? 'border-destructive' : 'border-success'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">ML Risk Assessment</h3>
                    <p className={`text-sm ${mlPrediction.risk_level ? 'text-destructive' : 'text-success'}`}>
                      {mlModelService.getRiskAssessment(mlPrediction)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Contributing Factors:</p>
                    <p className="text-sm">{mlPrediction.contributing_factors.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Configuration Panel */}
        {showConfig && (
          <div className="mb-8">
            <DatabaseConfig />
          </div>
        )}

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