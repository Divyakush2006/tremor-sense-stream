import { useState, useRef } from "react";
import { AlertTriangle, Volume2, Users, Clock } from "lucide-react";

export default function ManualAlert() {
  const [alertActive, setAlertActive] = useState(false);
  const [evacuationActive, setEvacuationActive] = useState(false);
  const [buzzerActive, setBuzzerActive] = useState(false);
  const alertAudioRef = useRef<HTMLAudioElement | null>(null);
  const buzzerAudioRef = useRef<HTMLAudioElement | null>(null);

  // Create alert sound (warning tone)
  const createAlertSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.5);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
    
    return audioContext;
  };

  // Create evacuation buzzer sound (loud, urgent)
  const createBuzzerSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    return audioContext;
  };

  const activateAlert = () => {
    setAlertActive(true);
    setBuzzerActive(true);
    
    // Play alert sound repeatedly
    const playAlertLoop = () => {
      createAlertSound();
      setTimeout(playAlertLoop, 2000);
    };
    playAlertLoop();
    
    // Auto-reset after 30 seconds
    setTimeout(() => {
      setBuzzerActive(false);
    }, 30000);
  };

  const activateEvacuation = () => {
    setEvacuationActive(true);
    setAlertActive(true);
    setBuzzerActive(true);
    
    // Play loud buzzer sound repeatedly
    const playBuzzerLoop = () => {
      createBuzzerSound();
      setTimeout(playBuzzerLoop, 1000);
    };
    playBuzzerLoop();
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
      <div className="mb-8">
        {/* Emergency Controls */}
        <div className="sensor-card max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Emergency Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={activateAlert}
              disabled={alertActive}
              className={`py-8 px-6 rounded-lg font-bold text-xl transition-all transform hover:scale-105 ${
                alertActive 
                  ? 'bg-destructive/20 text-destructive cursor-not-allowed' 
                  : 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-lg'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <AlertTriangle className="h-12 w-12" />
                <span>ACTIVATE ALERT</span>
                <div className="text-sm font-normal opacity-80">Warning Sound</div>
              </div>
            </button>

            <button
              onClick={activateEvacuation}
              disabled={evacuationActive}
              className={`py-8 px-6 rounded-lg font-bold text-xl transition-all transform hover:scale-105 ${
                evacuationActive 
                  ? 'bg-destructive text-destructive-foreground cursor-not-allowed animate-pulse' 
                  : 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <Users className="h-12 w-12" />
                <span>ACTIVATE EVACUATION</span>
                <div className="text-sm font-normal opacity-80">Emergency Buzzer</div>
              </div>
            </button>

            <button
              onClick={resetAlerts}
              className="py-8 px-6 rounded-lg font-bold text-xl border-2 border-border hover:bg-secondary transition-all transform hover:scale-105"
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <Volume2 className="h-12 w-12" />
                <span>RESET ALL ALERTS</span>
                <div className="text-sm font-normal opacity-80">Stop All Sounds</div>
              </div>
            </button>
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