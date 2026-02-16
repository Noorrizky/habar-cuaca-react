import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow } from 'lucide-react';

export const getWeatherDescription = (code) => {
  const mapping = {
    0: { label: "Cerah", icon: Sun, color: "text-yellow-400" },
    1: { label: "Cerah Berawan", icon: Sun, color: "text-yellow-200" },
    2: { label: "Berawan", icon: Cloud, color: "text-slate-300" },
    3: { label: "Mendung", icon: Cloud, color: "text-slate-400" },
    45: { label: "Kabut", icon: Cloud, color: "text-slate-200" },
    61: { label: "Hujan Ringan", icon: CloudRain, color: "text-blue-300" },
    95: { label: "Badai Petir", icon: CloudLightning, color: "text-purple-400" },
  };

  return mapping[code] || { label: "Unknown", icon: Cloud, color: "text-white" };
};