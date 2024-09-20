// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\widget\ui\brand.tsx

"use client"

import { FC, useEffect, useState } from "react"
import { ChatbotUIPNG } from "@/components/icons/chatbotui-png"

interface BrandProps {
  theme?: "dark" | "light"
  isWhiteLabel?: boolean // Flag to indicate white-label mode
  whiteLabelUrl?: string // URL for white-label image
  whiteLabelBotName?: string // Custom bot name for white-label
}

export const Brand: FC<BrandProps> = ({
  theme = "dark",
  isWhiteLabel = false,
  whiteLabelUrl,
  whiteLabelBotName
}) => {
  const [displayText, setDisplayText] = useState<string>("")
  const [typingIndex, setTypingIndex] = useState<number>(0)
  const [deleting, setDeleting] = useState<boolean>(false)

  // Example introduction texts
  const introductionTexts = [
    "Meet Mia, your AI assistant.",
    "Ask Mia anything.",
    "Mia, your smart AI guide.",
    "Discover with Mia, your AI expert."
  ]

  // Typing and deleting animation effect
  useEffect(() => {
    if (deleting) {
      if (displayText.length > 0) {
        setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1))
        }, 50)
      } else {
        setDeleting(false)
        setTypingIndex(prev => (prev + 1) % introductionTexts.length)
      }
    } else {
      if (displayText.length < introductionTexts[typingIndex].length) {
        setTimeout(() => {
          setDisplayText(
            introductionTexts[typingIndex].slice(0, displayText.length + 1)
          )
        }, 100)
      } else {
        setTimeout(() => {
          setDeleting(true)
        }, 2000)
      }
    }
  }, [displayText, deleting, typingIndex])

  return (
    <div
      className="flex flex-col items-center hover:opacity-50"
      style={{ cursor: "default" }}
    >
      <div className="mb-2" style={{ cursor: "default" }}>
        {isWhiteLabel && whiteLabelUrl ? (
          // Render the white-label image using the provided URL
          <img
            src={whiteLabelUrl}
            alt={whiteLabelBotName || "White-label logo"}
            style={{
              width: `${189 * 0.3}px`,
              height: `${194 * 0.3}px`,
              cursor: "default" // Ensure no cursor change on hover
            }}
          />
        ) : (
          // Render the default ChatbotUI image
          <ChatbotUIPNG theme={theme} scale={0.3} />
        )}
      </div>

      <div
        className="text-4xl font-bold tracking-wide"
        style={{ cursor: "default" }}
      >
        {isWhiteLabel ? whiteLabelBotName : "Mia Chat"}
      </div>

      {/* Animated Introduction Text */}
      <div className="text-primary mt-4 text-center text-2xl font-semibold">
        {displayText}
      </div>
    </div>
  )
}
