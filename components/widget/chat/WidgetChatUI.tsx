// components/widget/chat/WidgetChatUI.tsx

"use client"

import { FC, useEffect, useState, useContext } from "react"
import { ChatbotUIContext } from "@/context/context"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { useScroll } from "@/components/chat/chat-hooks/use-scroll"

export const WidgetChatUI: FC = () => {
  const { selectedChat, setChatMessages, setSelectedChat, setChatSettings } =
    useContext(ChatbotUIContext)
  const { messagesEndRef, scrollToBottom, isAtBottom } = useScroll()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
    scrollToBottom()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex size-full flex-col">
      {/* Chat Messages */}
      <div className="w-full grow overflow-auto">
        <ChatMessages />
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="sticky bottom-0 w-full border-t p-2">
        <ChatInput />
      </div>
    </div>
  )
}
