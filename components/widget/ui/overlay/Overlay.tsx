// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\ui\overlay\Overlay.tsx

"use client"

import { FC, useState } from "react"
import { IconX, IconPlus } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

// Define the types for sample data
type OverlayType = "chats" | "assistants" | "files"

interface OverlayProps {
  type: OverlayType
  onClose: () => void
}

export const Overlay: FC<OverlayProps> = ({ type, onClose }) => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)

  // Handle smooth closing animation
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose() // Call the onClose callback to ensure the overlay is removed properly
    }, 300)
  }

  const handleNewItem = () => {
    // Logic to redirect to new item creation based on type
    const newPath =
      type === "chats"
        ? "/new-chat?view=widget"
        : type === "assistants"
          ? "/new-assistant?view=widget"
          : "/new-file?view=widget"
    router.push(newPath)
    handleClose() // Ensure the overlay closes when navigating to a new item creation
  }

  // Sample data for demonstration
  const sampleData: Record<OverlayType, string[]> = {
    chats: ["Chat 1", "Chat 2", "Chat 3"],
    assistants: ["Assistant 1", "Assistant 2", "Assistant 3"],
    files: ["File 1", "File 2", "File 3"]
  }

  return (
    <div
      className={`overlay-container fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
        isVisible ? "fade-in" : "fade-out"
      }`}
    >
      <div className="w-[90%] max-w-[400px] rounded bg-white p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold capitalize">{type}</h2>
          <IconX className="cursor-pointer" onClick={handleClose} />
        </div>

        {/* List of Items */}
        <div className="space-y-2">
          {sampleData[type]?.map((item: string, index: number) => (
            <div key={index} className="cursor-pointer rounded border p-2">
              {item}
            </div>
          ))}
        </div>

        {/* New Item Button */}
        <button
          onClick={handleNewItem}
          className="bg-primary mt-4 flex w-full items-center justify-center rounded p-2 text-white"
        >
          <IconPlus size={20} className="mr-2" /> New {type.slice(0, -1)}
        </button>
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
