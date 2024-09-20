"use client";

import { FC, useEffect, useState, useRef } from "react";
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

export const RadialMenu: FC<RadialMenuProps> = ({ isOpen, toggleMenu }) => {
  const [menuAnimation, setMenuAnimation] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [currentContentType, setCurrentContentType] = useState<ContentType | null>(null);
  const [iconRotation, setIconRotation] = useState(0);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
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

  const handleMouseMove = (event: MouseEvent) => {
    if (!radialMenuRef.current) return;
    const rect = radialMenuRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    const angle = Math.atan2(deltaY, deltaX);
    setIconRotation((angle * 180) / Math.PI + 90);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSectionClick = (path: string) => {
    const newPath = isWidgetView ? `${path}?view=widget` : path;
    router.push(newPath);
    handleCloseOverlayAndMenu(); // Ensure the overlay and menu close
  };

  const handleSectionHover = (sectionName: string) => {
    setHighlightedSection(sectionName);
  };

  return (
    <div className={`relative z-50 ${isOpen ? "block" : "hidden"}`}>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 ${menuAnimation}`}
          ref={radialMenuRef}
        >
          <div className="radial-menu open relative flex size-full items-center justify-center">
            <div
              className="absolute flex items-center justify-center transition-transform duration-300"
              style={{
                transform: `translate(-50%, -50%) rotate(${iconRotation}deg)`,
                top: "50%",
                left: "50%",
              }}
            >
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

            {/* Radial Menu Sections */}
            <RadialMenuSection
              icon={<IconMessageCircle size={24} />}
              label="Chats"
              position={{
                top: "10%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onHover={() => handleSectionHover("chats")}
              isHighlighted={highlightedSection === "chats"}
              onClick={() => handleOverlayToggle("chats")}
            />

            <RadialMenuSection
              icon={<IconTag size={24} />}
              label="Prompts"
              position={{
                top: "70%",
                right: "10%",
                transform: "translate(-50%, -50%)",
              }}
              onHover={() => handleSectionHover("prompts")}
              isHighlighted={highlightedSection === "prompts"}
              onClick={() => handleOverlayToggle("prompts")}
            />

            <RadialMenuSection
              icon={<IconTool size={24} />}
              label="Tools"
              position={{
                bottom: "10%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onHover={() => handleSectionHover("tools")}
              isHighlighted={highlightedSection === "tools"}
              onClick={() => handleOverlayToggle("tools")}
            />

            {/* Profile Settings positioned in the bottom left corner */}
            <div
              className="absolute bottom-4 left-4 flex items-center justify-center"
              style={{ transform: "translate(-10%, -10%)" }}
            >
              <ProfileSettings />
            </div>

            {/* Chat Help positioned in the bottom right corner */}
            <div
              className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4"
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
