import { ReadingSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants/readerSettings';

const SETTINGS_KEY = 'speed-reading-settings';

export const loadSettings = (): ReadingSettings => {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  const savedSettings = localStorage.getItem(SETTINGS_KEY);
  if (!savedSettings) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsedSettings = JSON.parse(savedSettings);
    // 合并默认设置和保存的设置，确保新添加的设置项也有默认值
    return { ...DEFAULT_SETTINGS, ...parsedSettings };
  } catch (error) {
    console.error('Failed to parse saved settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Partial<ReadingSettings>) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const currentSettings = loadSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}; 