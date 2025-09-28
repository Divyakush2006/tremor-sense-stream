import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThresholdSettings {
  displacement: { moderate: number; high: number };
  strain: { moderate: number; high: number };
  porePressure: { moderate: number; high: number };
  rainfall: { moderate: number; high: number };
  temperature: { moderate: number; high: number };
  vibration: { moderate: number; high: number };
}

interface SettingsContextType {
  thresholds: ThresholdSettings;
  updateThresholds: (newThresholds: ThresholdSettings) => void;
}

const defaultThresholds: ThresholdSettings = {
  displacement: { moderate: 8, high: 12 },
  strain: { moderate: 200, high: 300 },
  porePressure: { moderate: 150, high: 200 },
  rainfall: { moderate: 15, high: 25 },
  temperature: { moderate: 50, high: 60 },
  vibration: { moderate: 10, high: 15 }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [thresholds, setThresholds] = useState<ThresholdSettings>(() => {
    const saved = localStorage.getItem('sensorThresholds');
    return saved ? JSON.parse(saved) : defaultThresholds;
  });

  useEffect(() => {
    localStorage.setItem('sensorThresholds', JSON.stringify(thresholds));
  }, [thresholds]);

  const updateThresholds = (newThresholds: ThresholdSettings) => {
    setThresholds(newThresholds);
  };

  return (
    <SettingsContext.Provider value={{ thresholds, updateThresholds }}>
      {children}
    </SettingsContext.Provider>
  );
};