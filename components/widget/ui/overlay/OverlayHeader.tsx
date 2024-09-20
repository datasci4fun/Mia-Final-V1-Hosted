// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\ui\overlay\OverlayHeader.tsx

"use client"

import { FC } from "react"
import { IconX } from "@tabler/icons-react"

interface OverlayHeaderProps {
  type: "chats" | "assistants" | "files"
  onClose: () => void
}

export const OverlayHeader: FC<OverlayHeaderProps> = ({ type, onClose }) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-bold capitalize">{type}</h2>
      <IconX className="cursor-pointer" onClick={onClose} />
    </div>
  )
}
