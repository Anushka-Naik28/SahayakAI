"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AppContextProps {
  userId: string;
  setUserId: (id: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  largeFont: boolean;
  toggleLargeFont: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState("demo-user-123");
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Sync state on load and save changes
  useEffect(() => {
    const savedUserId = localStorage.getItem("sahayak_userId");
    if (savedUserId) setUserId(savedUserId);

    const savedLanguage = localStorage.getItem("sahayak_language");
    if (savedLanguage) setLanguage(savedLanguage);

    const savedDarkMode = localStorage.getItem("sahayak_darkMode") === "true";
    setDarkMode(savedDarkMode);

    const savedLargeFont = localStorage.getItem("sahayak_largeFont") === "true";
    setLargeFont(savedLargeFont);

    const savedHighContrast = localStorage.getItem("sahayak_highContrast") === "true";
    setHighContrast(savedHighContrast);
  }, []);

  useEffect(() => {
    // Apply styling classes to HTML / Body elements
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    if (largeFont) {
      root.style.fontSize = "18px";
    } else {
      root.style.fontSize = "16px";
    }
    
    if (highContrast) {
      root.classList.add("high-contrast");
      // Add custom styles for high contrast if needed
    } else {
      root.classList.remove("high-contrast");
    }

    localStorage.setItem("sahayak_userId", userId);
    localStorage.setItem("sahayak_language", language);
    localStorage.setItem("sahayak_darkMode", darkMode.toString());
    localStorage.setItem("sahayak_largeFont", largeFont.toString());
    localStorage.setItem("sahayak_highContrast", highContrast.toString());
  }, [userId, language, darkMode, largeFont, highContrast]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLargeFont = () => setLargeFont(!largeFont);
  const toggleHighContrast = () => setHighContrast(!highContrast);

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        language,
        setLanguage,
        darkMode,
        toggleDarkMode,
        largeFont,
        toggleLargeFont,
        highContrast,
        toggleHighContrast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
