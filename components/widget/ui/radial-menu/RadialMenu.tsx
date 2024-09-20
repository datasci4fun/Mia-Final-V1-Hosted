"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  IconMessageCircle,
  IconTool,
  IconTag,
} from "@tabler/icons-react";
import { RadialMenuSection } from "@/components/widget/ui/radial-menu/RadialMenuSection";
import { ProfileSettings } from "@/components/utility/profile-settings";
import { ChatHelp } from "@/components/widget/chat/chat-help";
import { OverlaySidebar } from "@/components/widget/ui/OverlaySidebar";
import { ContentType } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";

interface RadialMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const RadialMenu: React.FC<RadialMenuProps> = ({ isOpen, toggleMenu }) => {
  const [menuAnimation, setMenuAnimation] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [currentContentType, setCurrentContentType] =
    useState<ContentType | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(
    null
  );
  const radialMenuRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const isWidgetView = searchParams.get("view") === "widget";
  const router = useRouter();

  useEffect(() => {
    setMenuAnimation(isOpen ? "animate-fadeIn" : "animate-fadeOut");
  }, [isOpen]);

  const handleOverlayToggle = (contentType: ContentType) => {
    setCurrentContentType(contentType);
    setOverlayOpen(!overlayOpen); // Toggle overlay state
  };

  // Close overlay and menu when a section is clicked
  const handleCloseOverlayAndMenu = () => {
    setOverlayOpen(false);
    toggleMenu(); // Close the radial menu as well
  };

  return (
    <div className={`relative z-50 ${isOpen ? "block" : "hidden"}`}>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 ${menuAnimation}`}
          ref={radialMenuRef}
        >
          <div className="wheel">
            {/* Radial Menu Sections */}
            <RadialMenuSection
              icon={<IconMessageCircle size={24} />}
              label="Chats"
              wedge
              onHover={() => setHighlightedSection("chats")}
              isHighlighted={highlightedSection === "chats"}
              onClick={() => handleOverlayToggle("chats")}
            />

            <RadialMenuSection
              icon={<IconTag size={24} />}
              label="Prompts"
              wedge
              onHover={() => setHighlightedSection("prompts")}
              isHighlighted={highlightedSection === "prompts"}
              onClick={() => handleOverlayToggle("prompts")}
            />

            <RadialMenuSection
              icon={<IconTool size={24} />}
              label="Tools"
              wedge
              onHover={() => setHighlightedSection("tools")}
              isHighlighted={highlightedSection === "tools"}
              onClick={() => handleOverlayToggle("tools")}
            />

            {/* Center Radial Element */}
            <div className="radial-center">
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white opacity-80"
              >
                <path
                  d="M12 2L19 21H5L12 2Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Profile Settings positioned in the bottom left corner */}
            <div
              className="absolute bottom-4 left-4 flex items-center justify-center"
              style={{ transform: "translate(-10%, -10%)" }}
            >
              <ProfileSettings />
            </div>

            {/* Chat Help positioned in the bottom right corner */}
            <div
              className="absolute bottom-4 right-4 flex items-center justify-center"
              style={{ transform: "translate(-10%, -10%)" }}
            >
              <ChatHelp />
            </div>
          </div>
        </div>
      )}

      {/* Overlay Sidebar */}
      <OverlaySidebar
        isOpen={overlayOpen}
        contentType={currentContentType}
        toggleOverlay={handleCloseOverlayAndMenu} // Close overlay when toggled
      />
    </div>
  );
};
