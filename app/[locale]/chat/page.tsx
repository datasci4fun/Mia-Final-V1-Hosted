"use client"

import { ChatbotUIContext } from "@/context/context" // Context for managing chat states
import { useContext } from "react"
import { ChatUI } from "@/components/chat/chat-ui" // Main Chat UI component
import { ChatInput } from "@/components/chat/chat-input" // Input component for chat
import { ChatSettings } from "@/components/chat/chat-settings" // Settings component for chat
import { QuickSettings } from "@/components/chat/quick-settings" // Quick settings component
import { ChatHelp } from "@/components/chat/chat-help" // Help component
import { Brand } from "@/components/ui/brand" // Branding component
import { useTheme } from "next-themes" // Hook to handle theme changes

export default function ChatPage() {
  const { chatMessages = [] } = useContext(ChatbotUIContext) // Access chat messages from context with default fallback
  const { theme } = useTheme() // Get current theme (dark or light)

  if (!chatMessages) {
    return <div>Loading chat...</div>
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
          </div>
          <div className="absolute left-2 top-2">
            <QuickSettings />
          </div>
          <div className="absolute right-2 top-2">
            <ChatSettings />
          </div>
          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
          <div className="flex grow flex-col items-center justify-center" />
          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>
        </div>
      ) : (
        <ChatUI /> // Display chat UI when there are messages
      )}
    </div>
  )
}