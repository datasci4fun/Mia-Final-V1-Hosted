"use client"

import { ChatHelp as MainChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput as MainChatInput } from "@/components/chat/chat-input"
import { ChatSettings as MainChatSettings } from "@/components/chat/chat-settings"
import { ChatUI as MainChatUI } from "@/components/chat/chat-ui" // Main Chat UI
import { QuickSettings as MainQuickSettings } from "@/components/chat/quick-settings"
import { Brand as MainBrand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { useContext } from "react"
import { useSearchParams } from "next/navigation" // For widget view detection

// Placeholder imports for the widget-specific versions
import { ChatHelp as WidgetChatHelp } from "@/components/widget/chat/chat-help"
import { ChatInput as WidgetChatInput } from "@/components/widget/chat/chat-input"
import { ChatSettings as WidgetChatSettings } from "@/components/widget/chat/chat-settings"
import { QuickSettings as WidgetQuickSettings } from "@/components/widget/chat/quick-settings"
import { Brand as WidgetBrand } from "@/components/widget/ui/brand"
import { WidgetChatUI } from "@/components/widget/chat/chat-ui" // Correct import for Widget Chat UI

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages } = useContext(ChatbotUIContext)
  const { handleNewChat, handleFocusChatInput } = useChatHandler()
  const { theme } = useTheme()
  const searchParams = useSearchParams()
  const isWidgetView = searchParams.get("view") === "widget" // Detect widget mode

  // Use widget-specific components if in widget mode, otherwise use main components
  const ChatHelp = isWidgetView ? WidgetChatHelp : MainChatHelp
  const ChatInput = isWidgetView ? WidgetChatInput : MainChatInput
  const ChatSettings = isWidgetView ? WidgetChatSettings : MainChatSettings
  const QuickSettings = isWidgetView ? WidgetQuickSettings : MainQuickSettings
  const Brand = isWidgetView ? WidgetBrand : MainBrand
  const ChatUI = isWidgetView ? WidgetChatUI : MainChatUI // Use WidgetChatUI for widget mode

  // Adjust the container classes based on whether it's a widget view
  const containerClass = isWidgetView
    ? "relative flex h-[100vh] flex-col items-center justify-center widget-layout"
    : "relative flex h-full flex-col items-center justify-center"

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className={containerClass}>
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
          </div>

          {/* Render QuickSettings and ChatSettings only if not in widget view */}
          {!isWidgetView && (
            <>
              <div className="absolute left-2 top-2">
                <QuickSettings />
              </div>

              <div className="absolute right-2 top-2">
                <ChatSettings />
              </div>

              <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
                <ChatHelp />
              </div>
            </>
          )}

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>
        </div>
      ) : (
        <ChatUI /> // Use the correct ChatUI based on the view mode
      )}
    </>
  )
}
