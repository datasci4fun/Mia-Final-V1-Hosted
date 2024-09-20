// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\ui\overlay\OverlayContent.tsx

"use client"

import { FC } from "react"
import { IconPlus } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

interface OverlayContentProps {
  type: "chats" | "assistants" | "files"
}

export const OverlayContent: FC<OverlayContentProps> = ({ type }) => {
  const router = useRouter()

  const handleNewItem = () => {
    // Logic to redirect to new item creation based on type
    const path =
      type === "chats"
        ? "/new-chat?view=widget"
        : type === "assistants"
          ? "/new-assistant?view=widget"
          : "/new-file?view=widget"
    router.push(path)
  }

  // Sample data for demonstration
  const sampleData: Record<"chats" | "assistants" | "files", string[]> = {
    chats: ["Chat 1", "Chat 2", "Chat 3"],
    assistants: ["Assistant 1", "Assistant 2", "Assistant 3"],
    files: ["File 1", "File 2", "File 3"]
  }

  return (
    <>
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
    </>
  )
}
