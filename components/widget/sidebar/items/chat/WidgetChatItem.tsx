import { FC, useContext, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { IconRobotFace } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface WidgetChatItemProps {
  chat: Tables<"chats">
}

export const WidgetChatItem: FC<WidgetChatItemProps> = ({ chat }) => {
  const { selectedWorkspace, selectedChat } = useContext(ChatbotUIContext)
  const router = useRouter()
  const params = useParams()
  const isActive = params.chatid === chat.id || selectedChat?.id === chat.id

  const itemRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (!selectedWorkspace) return
    router.push(`/${selectedWorkspace.id}/chat/${chat.id}?view=widget`)
  }

  return (
    <div
      ref={itemRef}
      className={cn(
        "hover:bg-accent focus:bg-accent group flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none",
        isActive && "bg-accent"
      )}
      tabIndex={0}
      onClick={handleClick}
    >
      <IconRobotFace size={30} />
      <div className="ml-3 flex-1 truncate text-sm font-semibold">
        {chat.name}
      </div>
    </div>
  )
}
