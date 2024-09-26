// src/context/branding-context.tsx

"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

// Branding Configuration Interface
interface BrandingConfig {
  logoUrl: string;
  brandName: string;
  modelIcon?: React.ReactNode;
  [key: string]: any; // Additional branding configurations
}

const defaultBranding: BrandingConfig = {
  logoUrl: '/public/avatar_robot@2x-1ad749fc.png',
  brandName: 'Mia',
};

// Branding Context
const BrandingContext = createContext<BrandingConfig>(defaultBranding);

export const BrandingProvider: React.FC<{ branding: BrandingConfig; children: React.ReactNode }> = ({
  branding,
  children,
}) => {
  return <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>;
};

export const useBranding = () => useContext(BrandingContext);

// Component Visibility Interface
interface ComponentVisibility {
  showQuickSettings: boolean;
  showChatSettings: boolean;
  showChatHelp: boolean;
  showPresets: boolean;
  showPrompts: boolean;
  showFiles: boolean;
  showCollections: boolean;
  showAssistants: boolean;
  showTools: boolean;
  showModels: boolean;
  showChatInfo: boolean;
  isWhiteLabel: boolean; // New white-label setting
  whiteLabelBotName: string; // New white-label bot name
  whiteLabelUrl: string; // New white-label image URL
}

interface VisibilityContextProps {
  visibility: ComponentVisibility;
  setVisibility: React.Dispatch<React.SetStateAction<ComponentVisibility>>;
}

// Visibility Context
const VisibilityContext = createContext<VisibilityContextProps | undefined>(undefined);

export const VisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [visibility, setVisibility] = useState<ComponentVisibility>({
    showQuickSettings: true,
    showChatSettings: true,
    showChatHelp: true,
    showPresets: true,
    showPrompts: true,
    showFiles: true,
    showCollections: true,
    showAssistants: true,
    showTools: true,
    showModels: true,
    showChatInfo: true,
    isWhiteLabel: true, // Default to true for white-label
    whiteLabelBotName: "Mia", // Default bot name
    whiteLabelUrl: "https://mia-react-nextjs-bot.vercel.app/avatar_robot@2x-1ad749fc.png", // Default URL
  });

  return (
    <VisibilityContext.Provider value={{ visibility, setVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => {
  const context = useContext(VisibilityContext);
  if (!context) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return context;
};
