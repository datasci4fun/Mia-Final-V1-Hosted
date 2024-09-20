// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\ui\overlay\item\chat-item.tsx

import { ModelIcon } from "@/components/models/model-icon"
import { WithTooltip } from "@/components/ui/with-tooltip"
import { ChatbotUIContext } from "@/context/context"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { LLM } from "@/types"
import { IconRobotFace } from "@tabler/icons-react"
import Image from "next/image"
import { useParams, useRouter, useSearchParams } from "next/navigation" // Import useSearchParams
import { FC, useContext, useRef } from "react"
import { DeleteChat } from "@/components/sidebar/items/chat/delete-chat"
import { UpdateChat } from "@/components/sidebar/items/chat/update-chat"

interface ChatItemProps {
  chat: Tables<"chats">
}

export const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const {
    selectedWorkspace,
    selectedChat,
    availableLocalModels,
    assistantImages,
    availableOpenRouterModels
  } = useContext(ChatbotUIContext)

  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams() // Get search params
  const isWidgetView = searchParams.get("view") === "widget" // Check if widget view is active
  const isActive = params.chatid === chat.id || selectedChat?.id === chat.id

  const itemRef = useRef<HTMLDivElement>(null)

  // Handle navigation and retain parameters
  const handleNavigation = (path: string) => {
    // Preserve widget view parameter if active
    const newPath = isWidgetView ? `${path}?view=widget` : path
    router.push(newPath)
  }

  const handleClick = () => {
    if (!selectedWorkspace) return
    handleNavigation(`/${selectedWorkspace.id}/chat/${chat.id}`) // Use handleNavigation function
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      itemRef.current?.click()
    }
  }

  const MODEL_DATA = [
    ...LLM_LIST,
    ...availableLocalModels,
    ...availableOpenRouterModels
  ].find(llm => llm.modelId === chat.model) as LLM

  const assistantImage = assistantImages.find(
    image => image.assistantId === chat.assistant_id
  )?.base64

  return (
    <div
      ref={itemRef}
      className={cn(
        "hover:bg-accent focus:bg-accent group flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none",
        isActive && "bg-accent"
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick} // Update the click handler
    >
      {chat.assistant_id ? (
        assistantImage ? (
          <Image
            style={{ width: "30px", height: "30px" }}
            className="rounded"
            src={assistantImage}
            alt="Assistant image"
            width={30}
            height={30}
          />
        ) : (
          <IconRobotFace
            className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
            size={30}
          />
        )
      ) : (
        <WithTooltip
          delayDuration={200}
          display={<div>{MODEL_DATA?.modelName}</div>}
          trigger={
            <ModelIcon provider={MODEL_DATA?.provider} height={30} width={30} />
          }
        />
      )}

      <div className="ml-3 flex-1 truncate text-sm font-semibold">
        {chat.name}
      </div>

      <div
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
        className={`ml-2 flex space-x-2 ${
          !isActive && "w-11 opacity-0 group-hover:opacity-100"
        }`}
      >
        <UpdateChat chat={chat} />

        <DeleteChat chat={chat} />
      </div>
    </div>
  )
}
