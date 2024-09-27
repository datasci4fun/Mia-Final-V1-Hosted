// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\ui\radial-menu\RadialMenuSection.tsx

"use client"

import { FC } from "react"

interface RadialMenuSectionProps {
  icon: React.ReactNode
  label: string
  position: {
    top?: string
    left?: string
    right?: string
    bottom?: string
    transform?: string
  }
  onClick: () => void
  onHover: () => void
  isHighlighted: boolean
}

export const RadialMenuSection: FC<RadialMenuSectionProps> = ({
  icon,
  label,
  position,
  onClick,
  onHover,
  isHighlighted
}) => {
  return (
    <div
      className={`section absolute flex size-24 cursor-pointer flex-col items-center justify-center rounded-full transition-transform ${
        isHighlighted ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
      }`}
      style={position}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {icon}
      <p className="mt-1 text-sm">{label}</p>
    </div>
  )
}
