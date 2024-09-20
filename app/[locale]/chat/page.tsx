"use client";

import { useTheme } from "next-themes"; // Hook to handle theme changes
import { Brand } from "@/components/ui/brand"; // Branding component
import { ChatInput } from "@/components/chat/chat-input"; // Input component for chat

export default function ChatPage() {
  const { theme } = useTheme(); // Get current theme (dark or light)

  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      {/* Display branding component */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Brand theme={theme === "dark" ? "dark" : "light"} />
      </div>

      {/* Display chat input at the bottom */}
      <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
        <ChatInput />
      </div>
    </div>
  );
}
