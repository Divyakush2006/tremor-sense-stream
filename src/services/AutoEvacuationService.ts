// Auto Evacuation Service
// Handles automatic evacuation triggers based on ML model predictions

import type { MLPrediction } from './MLModelService';

interface EvacuationEvent {
  id: string;
  timestamp: string;
  prediction: MLPrediction;
  status: 'triggered' | 'acknowledged' | 'resolved';
  acknowledgedAt?: string;
  resolvedAt?: string;
}

type EvacuationCallback = () => void;
type EvacuationEventCallback = (event: EvacuationEvent) => void;

class AutoEvacuationService {
  private isEnabled = true;
  private evacuationCallbacks: EvacuationCallback[] = [];
  private eventCallbacks: EvacuationEventCallback[] = [];
  private evacuationHistory: EvacuationEvent[] = [];
  private currentEvacuation: EvacuationEvent | null = null;

  // Enable/disable auto evacuation
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    console.log(`Auto evacuation ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Check if auto evacuation is enabled
  isAutoEvacuationEnabled(): boolean {
    return this.isEnabled;
  }

  // Subscribe to evacuation triggers
  onEvacuation(callback: EvacuationCallback) {
    this.evacuationCallbacks.push(callback);
  }

  // Subscribe to evacuation events
  onEvacuationEvent(callback: EvacuationEventCallback) {
    this.eventCallbacks.push(callback);
  }

  // Process ML prediction and trigger evacuation if needed
  processPrediction(prediction: MLPrediction) {
    if (!this.isEnabled) {
      return;
    }

    // Check if evacuation should be triggered
    if (this.shouldTriggerEvacuation(prediction)) {
      this.triggerEvacuation(prediction);
    } else if (this.currentEvacuation && !prediction.risk_level) {
      // Auto-resolve if conditions improve
      this.resolveEvacuation();
    }
  }

  // Determine if evacuation should be triggered
  private shouldTriggerEvacuation(prediction: MLPrediction): boolean {
    // Don't trigger if already evacuating
    if (this.currentEvacuation && this.currentEvacuation.status === 'triggered') {
      return false;
    }

    // Trigger if high risk with sufficient confidence
    return prediction.risk_level && prediction.confidence >= 0.7;
  }

  // Trigger automatic evacuation
  private triggerEvacuation(prediction: MLPrediction) {
    const evacuationEvent: EvacuationEvent = {
      id: `evac-${Date.now()}`,
      timestamp: new Date().toISOString(),
      prediction,
      status: 'triggered',
    };

    this.currentEvacuation = evacuationEvent;
    this.evacuationHistory.push(evacuationEvent);

    console.log('🚨 AUTO EVACUATION TRIGGERED:', {
      confidence: prediction.confidence,
      factors: prediction.contributing_factors,
    });

    // Notify evacuation callbacks
    this.evacuationCallbacks.forEach(callback => callback());
    this.eventCallbacks.forEach(callback => callback(evacuationEvent));
  }

  // Manually acknowledge evacuation
  acknowledgeEvacuation() {
    if (this.currentEvacuation && this.currentEvacuation.status === 'triggered') {
      this.currentEvacuation.status = 'acknowledged';
      this.currentEvacuation.acknowledgedAt = new Date().toISOString();
      
      console.log('Evacuation acknowledged by operator');
      this.eventCallbacks.forEach(callback => callback(this.currentEvacuation!));
    }
  }

  // Resolve evacuation (conditions safe)
  resolveEvacuation() {
    if (this.currentEvacuation) {
      this.currentEvacuation.status = 'resolved';
      this.currentEvacuation.resolvedAt = new Date().toISOString();
      
      console.log('Evacuation resolved - conditions safe');
      this.eventCallbacks.forEach(callback => callback(this.currentEvacuation!));
      
      this.currentEvacuation = null;
    }
  }

  // Get current evacuation status
  getCurrentEvacuation(): EvacuationEvent | null {
    return this.currentEvacuation;
  }

  // Get evacuation history
  getEvacuationHistory(): EvacuationEvent[] {
    return [...this.evacuationHistory];
  }

  // Clear evacuation history
  clearHistory() {
    this.evacuationHistory = [];
    console.log('Evacuation history cleared');
  }

  // Get evacuation statistics
  getStatistics() {
    const total = this.evacuationHistory.length;
    const triggered = this.evacuationHistory.filter(e => e.status === 'triggered').length;
    const acknowledged = this.evacuationHistory.filter(e => e.status === 'acknowledged').length;
    const resolved = this.evacuationHistory.filter(e => e.status === 'resolved').length;

    return {
      total,
      triggered,
      acknowledged,
      resolved,
      currentlyEvacuating: this.currentEvacuation !== null,
    };
  }
}

export const autoEvacuationService = new AutoEvacuationService();
export type { EvacuationEvent, EvacuationCallback, EvacuationEventCallback };