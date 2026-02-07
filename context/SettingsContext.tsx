import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: 'GBR Estilos',
  whatsapp: '5511986628325',
  email: 'contato@gbrestilos.com',
  maintenanceMode: false,
  bannerActive: true,
  homeHeroVisible: true
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.admin.getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings); // Optimistic update
    await api.admin.saveSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};