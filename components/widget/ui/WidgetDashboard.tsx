"use client"

import { FC, useState } from "react"
import { RadialMenuButton } from "@/components/widget/ui/radial-menu/RadialMenuButton"
import { RadialMenu } from "@/components/widget/ui/radial-menu/RadialMenu" // Import RadialMenu
import useHotkey from "@/lib/hooks/use-hotkey"
import { CommandK } from "@/components/utility/command-k"

interface DashboardProps {
  children: React.ReactNode
}

export const WidgetDashboard: FC<DashboardProps> = ({ children }) => {
  const [showRadialMenu, setShowRadialMenu] = useState(false)

  useHotkey("s", () => setShowRadialMenu(prev => !prev))

  const handleToggleRadialMenu = () => {
    setShowRadialMenu(prev => !prev)
  }

  const [isDragging, setIsDragging] = useState(false)

  const onFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    const file = files[0]
    setIsDragging(false)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="flex size-full">
      <CommandK />

      <div
        className="bg-muted/50 relative flex w-screen min-w-[90%] grow flex-col sm:min-w-fit"
        onDrop={onFileDrop}
        onDragOver={onDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {isDragging ? (
          <div className="flex h-full items-center justify-center bg-black/50 text-2xl text-white">
            drop file here
          </div>
        ) : (
          children
        )}

        {/* Radial Menu Button */}
        <RadialMenuButton
          isOpen={showRadialMenu}
          toggleMenu={handleToggleRadialMenu}
        />

        {/* Radial Menu with animation */}
        <RadialMenu
          isOpen={showRadialMenu}
          toggleMenu={handleToggleRadialMenu}
        />
      </div>
    </div>
  )
}
