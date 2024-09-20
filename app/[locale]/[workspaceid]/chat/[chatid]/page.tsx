// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\app\[locale]\[workspaceid]\chat\[chatid]\page.tsx

"use client"

import { ChatUI as MainChatUI } from "@/components/chat/chat-ui"
import { WidgetChatUI } from "@/components/widget/chat/chat-ui"
import { useSearchParams, useRouter } from "next/navigation"
import { preserveQueryParams } from "@/lib/utils" // Import utility function

export default function ChatIDPage() {
  const searchParams = useSearchParams()
  const isWidgetView = searchParams.get("view") === "widget"
  const router = useRouter()

  // Define which Chat UI component to render based on the view type
  const ChatUI = isWidgetView ? WidgetChatUI : MainChatUI

  // Function to handle navigation while preserving current query parameters
  const handleNavigation = (path: string) => {
    const preservedPath = preserveQueryParams(path, searchParams)
    router.push(preservedPath)
  }

  return <ChatUI handleNavigation={handleNavigation} />
}
