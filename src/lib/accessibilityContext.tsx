import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings } from '../types';

const defaultSettings: AccessibilitySettings = {
  textSize: 'normal',
  highContrast: false,
  darkMode: false,
  reduceMotion: false,
  audioOnlyMode: false,
  simpleMode: false,
  readingSpeed: 1.0,
};

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  toggleSimpleMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('temiryol_accessibility_settings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch (e) {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('temiryol_accessibility_settings', JSON.stringify(settings));
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const toggleSimpleMode = () => {
    setSettings(prev => ({ ...prev, simpleMode: !prev.simpleMode }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings, toggleSimpleMode }}>
      <div className={`min-h-screen transition-colors duration-200 ${
        settings.highContrast ? 'bg-black text-yellow-300 contrast-125' :
        settings.darkMode ? 'bg-slate-950 text-slate-100' :
        'bg-slate-50 text-slate-900'
      } ${
        settings.textSize === 'large' ? 'text-lg' :
        settings.textSize === 'xlarge' ? 'text-xl' :
        'text-base'
      }`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
