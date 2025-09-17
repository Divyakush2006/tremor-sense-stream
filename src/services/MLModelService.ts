// ML Model Service for landslide prediction
// Integrates with your ML model API or local processing

import type { SensorReading } from './DatabaseService';

interface MLPrediction {
  risk_level: boolean; // true = high risk (evacuation needed), false = safe
  confidence: number; // 0-1 confidence score
  contributing_factors: string[];
  timestamp: string;
}

interface MLModelCredentials {
  modelApiUrl: string;
  apiKey?: string;
}

class MLModelService {
  private credentials: MLModelCredentials | null = null;
  private predictionCallbacks: Array<(prediction: MLPrediction) => void> = [];

  // Initialize ML model service
  initialize(credentials: MLModelCredentials) {
    this.credentials = credentials;
    console.log('ML Model service initialized');
  }

  // Check if service is configured
  isConfigured(): boolean {
    return this.credentials !== null;
  }

  // Subscribe to prediction updates
  onPrediction(callback: (prediction: MLPrediction) => void) {
    this.predictionCallbacks.push(callback);
  }

  // Process sensor data through ML model
  async processSensorData(sensorData: SensorReading[]): Promise<MLPrediction> {
    if (!this.credentials) {
      throw new Error('ML Model not configured');
    }

    try {
      // Prepare data for ML model
      const modelInput = this.prepareModelInput(sensorData);

      // Call ML model API
      const response = await fetch(`${this.credentials.modelApiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.credentials.apiKey && { 'Authorization': `Bearer ${this.credentials.apiKey}` }),
        },
        body: JSON.stringify(modelInput),
      });

      if (!response.ok) {
        throw new Error(`ML Model API failed: ${response.statusText}`);
      }

      const prediction = await response.json();
      const formattedPrediction = this.formatPrediction(prediction);

      // Notify subscribers
      this.notifyPredictionCallbacks(formattedPrediction);

      return formattedPrediction;
    } catch (error) {
      console.error('ML Model processing failed:', error);
      
      // Fallback local processing if API fails
      return this.fallbackProcessing(sensorData);
    }
  }

  // Prepare sensor data for ML model input
  private prepareModelInput(sensorData: SensorReading[]) {
    // Get the latest reading
    const latest = sensorData[sensorData.length - 1];
    
    if (!latest) {
      throw new Error('No sensor data available');
    }

    return {
      features: {
        rainfall_mm: latest.Rainfall_mm,
        rainfall_3day: latest.Rainfall_3Day,
        rainfall_7day: latest.Rainfall_7Day,
        temperature_c: latest.Temperature_C,
        soil_strain: latest.Soil_Strain,
        pore_water_pressure_kpa: latest.Pore_Water_Pressure_kPa,
      },
      timestamp: latest.timestamp,
      location: latest.sensor_location,
    };
  }

  // Format ML model response
  private formatPrediction(rawPrediction: any): MLPrediction {
    return {
      risk_level: Boolean(rawPrediction.risk_level || rawPrediction.prediction === 1),
      confidence: parseFloat(rawPrediction.confidence) || 0,
      contributing_factors: rawPrediction.contributing_factors || [],
      timestamp: new Date().toISOString(),
    };
  }

  // Fallback processing when ML API is unavailable
  private fallbackProcessing(sensorData: SensorReading[]): MLPrediction {
    const latest = sensorData[sensorData.length - 1];
    
    if (!latest) {
      return {
        risk_level: false,
        confidence: 0,
        contributing_factors: ['No data available'],
        timestamp: new Date().toISOString(),
      };
    }

    // Simple rule-based fallback
    const riskFactors = [];
    let riskScore = 0;

    // High rainfall risk
    if (latest.Rainfall_mm > 25) {
      riskFactors.push('High current rainfall');
      riskScore += 0.3;
    }

    if (latest.Rainfall_3Day > 50) {
      riskFactors.push('High 3-day rainfall accumulation');
      riskScore += 0.2;
    }

    if (latest.Rainfall_7Day > 100) {
      riskFactors.push('High 7-day rainfall accumulation');
      riskScore += 0.2;
    }

    // High soil strain
    if (latest.Soil_Strain > 300) {
      riskFactors.push('Critical soil strain levels');
      riskScore += 0.4;
    }

    // High pore water pressure
    if (latest.Pore_Water_Pressure_kPa > 200) {
      riskFactors.push('Elevated pore water pressure');
      riskScore += 0.3;
    }

    const highRisk = riskScore >= 0.7;

    return {
      risk_level: highRisk,
      confidence: Math.min(riskScore, 1.0),
      contributing_factors: riskFactors.length > 0 ? riskFactors : ['Normal conditions'],
      timestamp: new Date().toISOString(),
    };
  }

  // Notify prediction callbacks
  private notifyPredictionCallbacks(prediction: MLPrediction) {
    this.predictionCallbacks.forEach(callback => callback(prediction));
  }

  // Get risk assessment text
  getRiskAssessment(prediction: MLPrediction): string {
    if (prediction.risk_level) {
      return `HIGH RISK - Confidence: ${(prediction.confidence * 100).toFixed(1)}%`;
    } else {
      return `SAFE - Confidence: ${(prediction.confidence * 100).toFixed(1)}%`;
    }
  }
}

export const mlModelService = new MLModelService();
export type { MLPrediction, MLModelCredentials };