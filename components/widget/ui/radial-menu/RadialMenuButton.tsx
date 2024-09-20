"use client"

import { FC } from "react"
import { IconPlus, IconX } from "@tabler/icons-react"

interface RadialMenuButtonProps {
  isOpen: boolean
  toggleMenu: () => void
}

export const RadialMenuButton: FC<RadialMenuButtonProps> = ({
  isOpen,
  toggleMenu
}) => {
  return (
    <button
      onClick={toggleMenu}
      className={`rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none${
        isOpen ? "bg-gray-800" : "bg-gray-700"
      }`}
      style={{
        position: "fixed",
        right: "10px", // Keeps the button on the screen edge
        top: "50%", // Centers vertically
        transform: "translateY(-50%)", // Centers the button vertically
        padding: "16px",
        border: "none",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)", // Slightly enhanced shadow for a premium feel
        zIndex: 1000, // Ensures visibility over other elements
        cursor: "pointer"
      }}
    >
      {isOpen ? (
        <IconX size={32} className="text-white" />
      ) : (
        <IconPlus size={32} className="text-white" />
      )}
    </button>
  )
}
