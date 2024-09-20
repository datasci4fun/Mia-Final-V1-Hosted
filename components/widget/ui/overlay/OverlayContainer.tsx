// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\ui\overlay\OverlayContainer.tsx

"use client"

import { FC, useState, useEffect } from "react"
import { OverlayHeader } from "@/components/widget/ui/overlay/OverlayHeader"
import { OverlayContent } from "@/components/widget/ui/overlay/OverlayContent"

interface OverlayContainerProps {
  type: "chats" | "assistants" | "files"
  onClose: () => void
}

export const OverlayContainer: FC<OverlayContainerProps> = ({
  type,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true)

  // Handle smooth closing animation
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for the animation to finish before closing
  }

  // Effect to reset visibility when Overlay opens
  useEffect(() => {
    setIsVisible(true)
  }, [type])

  return (
    <div
      className={`overlay-container fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
        isVisible ? "fade-in" : "fade-out"
      }`}
    >
      <div className="h-[75vh] w-[90%] max-w-[400px] rounded p-4 shadow-lg">
        <OverlayHeader type={type} onClose={handleClose} />
        <OverlayContent type={type} />
      </div>

      <style jsx>{`
        .overlay-container {
          z-index: 1000;
        }

        .fade-in {
          opacity: 1;
          transition: opacity 0.5s ease-in-out;
        }

        .fade-out {
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
