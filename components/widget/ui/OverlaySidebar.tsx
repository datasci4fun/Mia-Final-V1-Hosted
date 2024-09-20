// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\ui\OverlaySidebar.tsx

"use client"

import { FC, useState, useEffect, useContext } from "react"
import { SidebarContent } from "@/components/widget/sidebar/sidebar-content"
import { ContentType } from "@/types"
import { ChatbotUIContext } from "@/context/context"
import { useRouter, useSearchParams } from "next/navigation"

interface EnhancedDataItem {
  id: string
  name: string
  description: string
  created_at: string
  folder_id: string | null
  sharing: string
  updated_at: string | null
  user_id: string
}

interface OverlaySidebarProps {
  isOpen: boolean
  contentType: ContentType | null
  toggleOverlay: () => void
}

export const OverlaySidebar: FC<OverlaySidebarProps> = ({
  isOpen,
  contentType,
  toggleOverlay
}) => {
  const [menuAnimation, setMenuAnimation] = useState("")
  const [isClosing, setIsClosing] = useState(false) // Track if overlay is in the process of closing
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWidgetView = searchParams.get("view") === "widget"

  const {
    chats,
    presets,
    prompts,
    files,
    collections,
    assistants,
    tools,
    models,
    folders: allFolders
  } = useContext(ChatbotUIContext)

  useEffect(() => {
    if (isOpen && !isClosing) {
      setMenuAnimation("animate-fadeIn")
    } else if (isClosing) {
      setMenuAnimation("animate-fadeOut")
    }
  }, [isOpen, isClosing])

  const handleNavigation = (path: string) => {
    const newPath = isWidgetView ? `${path}?view=widget` : path
    router.push(newPath)
    handleCloseOverlay() // Close overlay when navigating to a different route
  }

  const handleCloseOverlay = () => {
    setIsClosing(true)
    setTimeout(() => {
      toggleOverlay()
      setIsClosing(false)
    }, 300) // Ensure the animation completes before actually closing
  }

  // Function to get data and folders based on the content type
  const getDataAndFolders = (): {
    data: EnhancedDataItem[] // Use the new type to match expected structure
    folders: typeof allFolders
  } => {
    switch (contentType) {
      case "chats":
        return {
          data: chats.map(chat => ({
            id: chat.id,
            name: chat.name,
            description: chat.prompt || "", // Set description to prompt field for chats
            created_at: chat.created_at,
            folder_id: chat.folder_id,
            sharing: chat.sharing || "private",
            updated_at: chat.updated_at || null,
            user_id: chat.user_id
          })),
          folders: allFolders.filter(folder => folder.type === "chats")
        }
      case "presets":
        return {
          data: presets.map(preset => ({
            id: preset.id,
            name: preset.name,
            description: preset.description || "",
            created_at: preset.created_at,
            folder_id: preset.folder_id,
            sharing: preset.sharing || "private",
            updated_at: preset.updated_at || null,
            user_id: preset.user_id
          })),
          folders: allFolders.filter(folder => folder.type === "presets")
        }
      case "prompts":
        return {
          data: prompts.map(prompt => ({
            id: prompt.id,
            name: prompt.name,
            description: prompt.content || "", // Set description to content field for prompts
            created_at: prompt.created_at,
            folder_id: prompt.folder_id,
            sharing: prompt.sharing || "private",
            updated_at: prompt.updated_at || null,
            user_id: prompt.user_id
          })),
          folders: allFolders.filter(folder => folder.type === "prompts")
        }
      case "files":
        return {
          data: files.map(file => ({
            id: file.id,
            name: file.name,
            description: file.description || "",
            created_at: file.created_at,
            folder_id: file.folder_id,
            sharing: file.sharing || "private",
            updated_at: file.updated_at || null,
            user_id: file.user_id
          })),
          folders: allFolders.filter(folder => folder.type === "files")
        }
      case "collections":
        return {
          data: collections.map(collection => ({
            id: collection.id,
            name: collection.name,
            description: collection.description || "",
            created_at: collection.created_at,
            folder_id: collection.folder_id,
            sharing: collection.sharing || "private",
            updated_at: collection.updated_at || null,
            user_id: collection.user_id
          })),
          folders: allFolders.filter(folder => folder.type === "collections")
        }
      case "assistants":
        return {
          data: assistants.map(assistant => ({
            id: assistant.id,
            name: assistant.name,
            description: "", // Provide a placeholder description for assistants
            created_at: assistant.created_at,
            folder_id: assistant.folder_id,
            sharing: "private",
            updated_at: assistant.updated_at || null,
            user_id: assistant.user_id
          })),
          folders: allFolders.filter(folder => folder.type === "assistants")
        }
      case "tools":
        return {
          data: tools.map(tool => ({
            id: tool.id,
            name: tool.name,
            description: tool.description || "",
            created_at: tool.created_at,
            folder_id: tool.folder_id,
            sharing: tool.sharing || "private",
            updated_at: tool.updated_at || null,
            user_id: tool.user_id
          })),
          folders: allFolders.filter(folder => folder.type === "tools")
        }
      case "models":
        return {
          data: models.map(model => ({
            id: model.id,
            name: model.name,
            description: model.description || "",
            created_at: model.created_at,
            folder_id: model.folder_id,
            sharing: model.sharing || "private",
            updated_at: model.updated_at || null,
            user_id: model.user_id
          })),
          folders: allFolders.filter(folder => folder.type === "models")
        }
      default:
        return { data: [], folders: [] }
    }
  }

  const { data, folders } = getDataAndFolders()

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${menuAnimation} ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="relative h-[75vh] w-full max-w-md rounded p-4 shadow-lg">
        <button
          onClick={handleCloseOverlay}
          className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white focus:outline-none"
        >
          Close
        </button>

        {contentType && (
          <SidebarContent
            contentType={contentType}
            data={data}
            folders={folders}
            handleNavigation={handleNavigation}
          />
        )}
      </div>
    </div>
  )
}
