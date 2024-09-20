// app/chat/layout.tsx
import { ReactNode } from 'react'

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="chat-layout">
      {/* You can add chat-specific layout components here */}
      {children}
    </div>
  )
}