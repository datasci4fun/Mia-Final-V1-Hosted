// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\ui\radial-menu\RadialMenuSection.tsx

"use client"

import { FC } from "react"

interface RadialMenuSectionProps {
  icon: React.ReactNode
  label: string
  position?: {
    top?: string
    left?: string
    right?: string
    bottom?: string
    transform?: string
  }
  className?: string // Add this line to accept className
  onClick: () => void
  onHover: () => void
  isHighlighted: boolean
}

export const RadialMenuSection: FC<RadialMenuSectionProps> = ({
  icon,
  label,
  position,
  className, // Add this line to accept the className prop
  onClick,
  onHover,
  isHighlighted,
}) => {
  return (
    <div
      className={`section absolute flex size-24 cursor-pointer flex-col items-center justify-center rounded-full transition-transform ${isHighlighted ? "bg-blue-600 text-white" : "bg-gray-700 text-white"} ${className}`} // Include className here
      style={position}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {icon}
      <p className="mt-1 text-sm">{label}</p>
    </div>
  )
}