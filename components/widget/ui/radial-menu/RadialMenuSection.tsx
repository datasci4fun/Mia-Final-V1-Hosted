"use client";

import { FC } from "react";

interface RadialMenuSectionProps {
  icon: React.ReactNode;
  label: string;
  position?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    transform?: string;
  };
  wedge?: boolean; // Adding the wedge prop
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
  // Set the wedge style and hide label when wedge is true
  const wedgeStyle = wedge ? "wedge-style" : "";
  const labelClass = wedge ? "hidden" : "mt-1 text-sm"; // Hide label for wedges

  return (
    <div
      className={`section absolute flex cursor-pointer flex-col items-center justify-center transition-transform ${
        isHighlighted ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
      } ${wedgeStyle}`} // Apply wedge-style class if wedge is true
      style={!wedge ? position : undefined} // Only apply position if not a wedge
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {icon}
      <p className={labelClass}>{label}</p>
    </div>
  );
};
