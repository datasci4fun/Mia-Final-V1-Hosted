// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\components\icons\chatbotui-png.tsx

import { FC } from "react"

interface ChatbotUIPNGProps {
  theme: "dark" | "light"
  scale?: number
  imageUrl?: string // Optional URL for custom branding
  altText?: string // Optional alt text for custom branding
}

export const ChatbotUIPNG: FC<ChatbotUIPNGProps> = ({
  theme,
  scale = 1,
  imageUrl,
  altText
}) => {
  // Default image paths based on the theme
  const defaultImageUrl =
    theme === "dark"
      ? "/avatar_robot@2x-1ad749fc.png"
      : "/avatar_robot@2x-1ad749fc.png"

  return (
    <img
      src={imageUrl || defaultImageUrl} // Use the provided imageUrl or default
      alt={altText || "Chatbot UI"} // Use the provided alt text or default
      width={189 * scale}
      height={194 * scale}
      style={{ maxWidth: "100%", height: "auto" }} // Ensure the image scales correctly
    />
  )
}
