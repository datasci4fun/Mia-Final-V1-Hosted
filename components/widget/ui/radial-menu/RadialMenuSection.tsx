"use client";

import { FC } from "react";

interface RadialMenuSectionProps {
  icon: React.ReactNode;
  label: string;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    transform?: string;
  };
  wedge?: boolean; // Add this line to include the wedge prop
  onClick: () => void;
  onHover: () => void;
  isHighlighted: boolean;
}

export const RadialMenuSection: FC<RadialMenuSectionProps> = ({
  icon,
  label,
  position,
  wedge = false, // Default value set to false
  onClick,
  onHover,
  isHighlighted,
}) => {
  return (
    <div
      className={`section absolute flex cursor-pointer flex-col items-center justify-center transition-transform ${
        isHighlighted ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
      } ${wedge ? "wedge-style" : ""}`} // Apply wedge-style class if wedge is true
      style={position}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {icon}
      <p className="mt-1 text-sm">{label}</p>
    </div>
  );
};
