import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SettingsContext = createContext(null);

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [settings, setSettings] = useState(null);
useEffect(() => {
  const loadSettings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found — skipping settings fetch");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/setting/fetch-setting`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data || null;
      setSettings(data);

      if (data?.websiteTitle) {
        localStorage.setItem("websiteTitle", data.websiteTitle);
      }
    } catch (error) {
      console.error("Error fetching global settings:", error);
    }
  };

  loadSettings();
}, [API_URL]);


  // Update title + favicon globally
  useEffect(() => {
    if (!settings) return;

    if (settings.websiteTitle) {
      document.title = settings.websiteTitle;
    }

    if (settings.favicon) {
      let favicon = document.querySelector("link[rel='icon']");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/png";
        document.head.appendChild(favicon);
      }
      favicon.href = `${API_URL}/${settings.favicon}?v=${Date.now()}`;
    }
  }, [settings, API_URL]);


  // Provide update function
  const updateSettings = (newData) => {
    setSettings(newData);
    if (newData.websiteTitle) {
      localStorage.setItem("websiteTitle", newData.websiteTitle);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
