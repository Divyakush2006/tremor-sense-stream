import { useState } from "react";
import { Bell, Shield, Database, Monitor, Save, AlertTriangle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { thresholds, updateThresholds } = useSettings();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    highRisk: true,
    moderateRisk: false,
    maintenance: true
  });

  const [monitoring, setMonitoring] = useState({
    refreshRate: 30,
    dataRetention: 90,
    autoBackup: true,
    alertDelay: 5
  });

  const handleSave = () => {
    // Save settings to context and localStorage
    console.log("Settings saved:", { notifications, thresholds, monitoring });
    
    toast({
      title: "Settings Saved",
      description: "Threshold settings have been updated and will apply to live sensor data.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure monitoring parameters, alerts, and system preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Notification Settings */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Notification Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-foreground mb-4">Delivery Methods</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Email notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">SMS alerts</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Push notifications</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-4">Alert Types</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications.highRisk}
                    onChange={(e) => setNotifications(prev => ({ ...prev, highRisk: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">High risk alerts</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications.moderateRisk}
                    onChange={(e) => setNotifications(prev => ({ ...prev, moderateRisk: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Moderate risk alerts</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications.maintenance}
                    onChange={(e) => setNotifications(prev => ({ ...prev, maintenance: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Maintenance reminders</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Threshold Settings */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-warning" />
            <h2 className="text-xl font-semibold text-foreground">Alert Thresholds</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(thresholds).map(([sensor, values]) => (
              <div key={sensor} className="space-y-3">
                <h3 className="font-medium text-foreground capitalize">
                  {sensor.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Moderate Risk</label>
                    <input
                      type="number"
                      value={values.moderate}
                      onChange={(e) => updateThresholds({
                        ...thresholds,
                        [sensor]: { ...thresholds[sensor as keyof typeof thresholds], moderate: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">High Risk</label>
                    <input
                      type="number"
                      value={values.high}
                      onChange={(e) => updateThresholds({
                        ...thresholds,
                        [sensor]: { ...thresholds[sensor as keyof typeof thresholds], high: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoring Settings */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Monitoring Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data Refresh Rate (seconds)
                </label>
                <select
                  value={monitoring.refreshRate}
                  onChange={(e) => setMonitoring(prev => ({ ...prev, refreshRate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data Retention (days)
                </label>
                <input
                  type="number"
                  value={monitoring.dataRetention}
                  onChange={(e) => setMonitoring(prev => ({ ...prev, dataRetention: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Alert Delay (minutes)
                </label>
                <input
                  type="number"
                  value={monitoring.alertDelay}
                  onChange={(e) => setMonitoring(prev => ({ ...prev, alertDelay: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="pt-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={monitoring.autoBackup}
                    onChange={(e) => setMonitoring(prev => ({ ...prev, autoBackup: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Automatic data backup</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="sensor-card">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Database Management</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors">
              <Database className="h-4 w-4" />
              Export Data
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors">
              <Database className="h-4 w-4" />
              Backup Database
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-warning text-warning-foreground rounded-lg hover:bg-warning/90 transition-colors">
              <AlertTriangle className="h-4 w-4" />
              Clear Old Data
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}