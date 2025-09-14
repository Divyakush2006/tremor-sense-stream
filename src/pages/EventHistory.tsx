import { useState } from "react";
import { Clock, AlertTriangle, Activity, CheckCircle, XCircle, Calendar, Filter, Search } from "lucide-react";

const eventHistory = [
  {
    id: 1,
    timestamp: "2024-01-15 14:30:22",
    type: "Critical Alert",
    event: "Vibration threshold exceeded in Zone C",
    zone: "Zone C",
    sensor: "VIB-006",
    severity: "critical",
    status: "resolved",
    duration: "45 minutes",
    description: "Vibration levels reached 15.2 mm/s, exceeding critical threshold of 15.0 mm/s"
  },
  {
    id: 2,
    timestamp: "2024-01-15 13:45:10",
    type: "System Event",
    event: "Maintenance completed on displacement sensors",
    zone: "Zone A",
    sensor: "DISP-001",
    severity: "info",
    status: "completed",
    duration: "2 hours",
    description: "Scheduled maintenance and calibration of displacement monitoring equipment"
  },
  {
    id: 3,
    timestamp: "2024-01-15 12:20:15",
    type: "Warning Alert",
    event: "Strain gauge readings elevated",
    zone: "Zone B",
    sensor: "STRN-002",
    severity: "warning",
    status: "monitoring",
    duration: "ongoing",
    description: "Strain levels at 180 μɛ, approaching moderate threshold of 200 μɛ"
  },
  {
    id: 4,
    timestamp: "2024-01-15 11:15:33",
    type: "Weather Alert",
    event: "Heavy rainfall detected",
    zone: "All Zones",
    sensor: "RAIN-004",
    severity: "warning",
    status: "active",
    duration: "3 hours",
    description: "Rainfall rate of 22 mm/h detected, monitoring pore pressure levels"
  },
  {
    id: 5,
    timestamp: "2024-01-15 09:30:45",
    type: "Sensor Event",
    event: "Temperature sensor offline",
    zone: "Zone D",
    sensor: "TEMP-005",
    severity: "warning",
    status: "resolved",
    duration: "30 minutes",
    description: "Communication lost with temperature monitoring unit, restored after power cycle"
  },
  {
    id: 6,
    timestamp: "2024-01-15 08:15:20",
    type: "System Event",
    event: "Daily system health check completed",
    zone: "All Zones",
    sensor: "System",
    severity: "info",
    status: "completed",
    duration: "15 minutes",
    description: "Automated system diagnostics completed successfully, all sensors operational"
  },
  {
    id: 7,
    timestamp: "2024-01-14 22:45:12",
    type: "Critical Alert",
    event: "Pore pressure spike detected",
    zone: "Zone B",
    sensor: "PORE-003",
    severity: "critical",
    status: "resolved",
    duration: "1.5 hours",
    description: "Pore pressure reached 195 kPa following heavy rainfall event"
  },
  {
    id: 8,
    timestamp: "2024-01-14 18:20:30",
    type: "Manual Alert",
    event: "Emergency evacuation drill",
    zone: "All Zones",
    sensor: "Manual",
    severity: "info",
    status: "completed",
    duration: "45 minutes",
    description: "Scheduled quarterly evacuation drill conducted successfully"
  }
];

export default function EventHistory() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = eventHistory.filter(event => {
    const matchesFilter = filter === "all" || event.severity === filter;
    const matchesSearch = searchTerm === "" || 
      event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.sensor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-destructive bg-destructive/10 border-destructive/30";
      case "warning": return "text-warning bg-warning/10 border-warning/30";
      case "info": return "text-primary bg-primary/10 border-primary/30";
      default: return "text-muted-foreground bg-muted/10 border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4 text-success" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
      case "active": return <Activity className="h-4 w-4 text-warning animate-pulse" />;
      case "monitoring": return <Activity className="h-4 w-4 text-primary animate-pulse" />;
      default: return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Event History</h1>
        <p className="text-muted-foreground">Complete timeline of system events and alerts</p>
      </div>

      {/* Filters and Search */}
      <div className="sensor-card mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
            
            <div className="relative">
              <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {eventHistory.length} events
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="sensor-card">
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline line */}
              {index < filteredEvents.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-8 bg-border"></div>
              )}
              
              <div className="flex gap-4 p-4 rounded-lg hover:bg-secondary/30 transition-colors">
                {/* Timeline dot */}
                <div className={`w-4 h-4 rounded-full mt-2 flex-shrink-0 ${
                  event.severity === "critical" ? "bg-destructive" :
                  event.severity === "warning" ? "bg-warning" :
                  "bg-primary"
                }`}></div>
                
                {/* Event details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{event.event}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                          {event.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.timestamp}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.duration}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground">
                          {event.zone}
                        </span>
                        <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground">
                          {event.sensor}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(event.status)}
                      <span className="text-sm font-medium capitalize">{event.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="sensor-card text-center">
          <div className="text-2xl font-bold text-destructive mb-1">
            {eventHistory.filter(e => e.severity === "critical").length}
          </div>
          <div className="text-sm text-muted-foreground">Critical Events</div>
        </div>
        
        <div className="sensor-card text-center">
          <div className="text-2xl font-bold text-warning mb-1">
            {eventHistory.filter(e => e.severity === "warning").length}
          </div>
          <div className="text-sm text-muted-foreground">Warning Events</div>
        </div>
        
        <div className="sensor-card text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {eventHistory.filter(e => e.status === "resolved" || e.status === "completed").length}
          </div>
          <div className="text-sm text-muted-foreground">Resolved Events</div>
        </div>
        
        <div className="sensor-card text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {eventHistory.filter(e => e.status === "active" || e.status === "monitoring").length}
          </div>
          <div className="text-sm text-muted-foreground">Active Events</div>
        </div>
      </div>
    </div>
  );
}