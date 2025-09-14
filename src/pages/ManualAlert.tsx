import { useState } from "react";
import { AlertTriangle, Volume2, Users, MapPin, Phone, Clock } from "lucide-react";

export default function ManualAlert() {
  const [alertActive, setAlertActive] = useState(false);
  const [evacuationActive, setEvacuationActive] = useState(false);
  const [buzzerActive, setBuzzerActive] = useState(false);

  const activateAlert = () => {
    setAlertActive(true);
    setBuzzerActive(true);
    // Auto-reset after 30 seconds
    setTimeout(() => {
      setBuzzerActive(false);
    }, 30000);
  };

  const activateEvacuation = () => {
    setEvacuationActive(true);
    setAlertActive(true);
    setBuzzerActive(true);
  };

  const resetAlerts = () => {
    setAlertActive(false);
    setEvacuationActive(false);
    setBuzzerActive(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Manual Alert System</h1>
        <p className="text-muted-foreground">Emergency response controls for immediate site safety</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertTriangle className={`h-8 w-8 ${alertActive ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
            <div>
              <div className={`text-2xl font-bold ${alertActive ? 'text-destructive' : 'text-muted-foreground'}`}>
                {alertActive ? 'ACTIVE' : 'STANDBY'}
              </div>
              <div className="text-sm text-muted-foreground">Alert Status</div>
            </div>
          </div>
        </div>

        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Volume2 className={`h-8 w-8 ${buzzerActive ? 'text-warning animate-pulse' : 'text-muted-foreground'}`} />
            <div>
              <div className={`text-2xl font-bold ${buzzerActive ? 'text-warning' : 'text-muted-foreground'}`}>
                {buzzerActive ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-muted-foreground">Buzzer System</div>
            </div>
          </div>
        </div>

        <div className="sensor-card text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Users className={`h-8 w-8 ${evacuationActive ? 'text-destructive animate-pulse' : 'text-success'}`} />
            <div>
              <div className={`text-2xl font-bold ${evacuationActive ? 'text-destructive' : 'text-success'}`}>
                {evacuationActive ? 'EVACUATING' : 'SAFE'}
              </div>
              <div className="text-sm text-muted-foreground">Personnel Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Emergency Controls */}
        <div className="sensor-card">
          <h2 className="text-2xl font-bold text-foreground mb-6">Emergency Controls</h2>
          
          <div className="space-y-4">
            <button
              onClick={activateAlert}
              disabled={alertActive}
              className={`w-full py-6 px-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                alertActive 
                  ? 'bg-destructive/20 text-destructive cursor-not-allowed' 
                  : 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <AlertTriangle className="h-6 w-6" />
                ACTIVATE ALERT
              </div>
            </button>

            <button
              onClick={activateEvacuation}
              disabled={evacuationActive}
              className={`w-full py-6 px-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                evacuationActive 
                  ? 'bg-destructive text-destructive-foreground cursor-not-allowed animate-pulse' 
                  : 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Users className="h-6 w-6" />
                ACTIVATE EVACUATION
              </div>
            </button>

            <button
              onClick={resetAlerts}
              className="w-full py-4 px-6 rounded-lg font-semibold border border-border hover:bg-secondary transition-all"
            >
              RESET ALL ALERTS
            </button>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="sensor-card">
          <h2 className="text-2xl font-bold text-foreground mb-6">Emergency Contacts</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Emergency Services</span>
              </div>
              <div className="text-lg font-mono text-primary">911</div>
            </div>

            <div className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Site Supervisor</span>
              </div>
              <div className="text-lg font-mono text-primary">+1 (555) 123-4567</div>
            </div>

            <div className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Safety Manager</span>
              </div>
              <div className="text-lg font-mono text-primary">+1 (555) 987-6543</div>
            </div>

            <div className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Evacuation Point</span>
              </div>
              <div className="text-sm text-muted-foreground">Main Parking Lot - 500m North</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alert Banner */}
      {(alertActive || evacuationActive) && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-xl border-2 ${
          evacuationActive 
            ? 'bg-destructive text-destructive-foreground border-destructive animate-pulse' 
            : 'bg-warning text-warning-foreground border-warning'
        }`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <span className="font-bold text-lg">
              {evacuationActive ? 'EVACUATION IN PROGRESS' : 'ALERT ACTIVE'}
            </span>
            <Clock className="h-5 w-5" />
          </div>
        </div>
      )}
    </div>
  );
}