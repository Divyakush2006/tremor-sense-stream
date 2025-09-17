// Generic Cloud Database Service
// Configure this with your preferred cloud database API

interface DatabaseCredentials {
  apiKey: string;
  databaseUrl: string;
  projectId?: string;
}

interface SensorReading {
  id: string;
  timestamp: string;
  Rainfall_mm: number;
  Rainfall_3Day: number;
  Rainfall_7Day: number;
  Temperature_C: number;
  Soil_Strain: number;
  Pore_Water_Pressure_kPa: number;
  sensor_location: string;
}

class DatabaseService {
  private credentials: DatabaseCredentials | null = null;
  private subscribers: Array<(data: SensorReading[]) => void> = [];

  // Initialize database connection
  initialize(credentials: DatabaseCredentials) {
    this.credentials = credentials;
    console.log('Database service initialized');
  }

  // Check if service is configured
  isConfigured(): boolean {
    return this.credentials !== null;
  }

  // Subscribe to real-time data updates
  subscribe(callback: (data: SensorReading[]) => void) {
    this.subscribers.push(callback);
  }

  // Unsubscribe from updates
  unsubscribe(callback: (data: SensorReading[]) => void) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  // Fetch latest sensor data
  async fetchSensorData(): Promise<SensorReading[]> {
    if (!this.credentials) {
      throw new Error('Database not configured');
    }

    try {
      // Replace this with your actual database API call
      const response = await fetch(`${this.credentials.databaseUrl}/sensor-data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.credentials.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Database fetch failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformData(data);
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      throw error;
    }
  }

  // Start real-time monitoring
  startRealTimeMonitoring(intervalMs: number = 5000) {
    if (!this.credentials) {
      console.error('Database not configured for real-time monitoring');
      return;
    }

    const pollData = async () => {
      try {
        const data = await this.fetchSensorData();
        this.notifySubscribers(data);
      } catch (error) {
        console.error('Real-time monitoring error:', error);
      }
    };

    // Initial fetch
    pollData();

    // Set up polling
    setInterval(pollData, intervalMs);
  }

  // Transform raw database data to our format
  private transformData(rawData: any[]): SensorReading[] {
    return rawData.map(item => ({
      id: item.id || `sensor-${Date.now()}`,
      timestamp: item.timestamp || new Date().toISOString(),
      Rainfall_mm: parseFloat(item.Rainfall_mm) || 0,
      Rainfall_3Day: parseFloat(item.Rainfall_3Day) || 0,
      Rainfall_7Day: parseFloat(item.Rainfall_7Day) || 0,
      Temperature_C: parseFloat(item.Temperature_C) || 0,
      Soil_Strain: parseFloat(item.Soil_Strain) || 0,
      Pore_Water_Pressure_kPa: parseFloat(item.Pore_Water_Pressure_kPa) || 0,
      sensor_location: item.sensor_location || 'Unknown Location',
    }));
  }

  // Notify all subscribers
  private notifySubscribers(data: SensorReading[]) {
    this.subscribers.forEach(callback => callback(data));
  }

  // Insert new sensor reading (for testing or manual entry)
  async insertSensorReading(reading: Omit<SensorReading, 'id' | 'timestamp'>): Promise<void> {
    if (!this.credentials) {
      throw new Error('Database not configured');
    }

    try {
      const response = await fetch(`${this.credentials.databaseUrl}/sensor-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reading,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Database insert failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to insert sensor reading:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
export type { SensorReading, DatabaseCredentials };