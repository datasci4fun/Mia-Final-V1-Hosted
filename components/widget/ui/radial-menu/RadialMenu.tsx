"use client";

import { FC, useEffect, useState, useRef } from "react";
import {
  IconMessageCircle,
  IconTag,
  IconTool,
} from "@tabler/icons-react";
import { RadialMenuSection } from "@/components/widget/ui/radial-menu/RadialMenuSection";
import { ProfileSettings } from "@/components/utility/profile-settings";
import { ChatHelp } from "@/components/widget/chat/chat-help";
import { OverlaySidebar } from "@/components/widget/ui/OverlaySidebar";
import { ContentType } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import "./RadialMenu.css"; // Import CSS for the radial behavior

interface RadialMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const RadialMenu: FC<RadialMenuProps> = ({ isOpen, toggleMenu }) => {
  const [menuAnimation, setMenuAnimation] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [currentContentType, setCurrentContentType] =
    useState<ContentType | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(
    null
  );
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [showing, setShowing] = useState(false);
  const [anchorX, setAnchorX] = useState(0);
  const [anchorY, setAnchorY] = useState(0);
  const minDistance = 100;
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

  const handleMouseDown = (e: MouseEvent) => {
    setShowing(true);
    setAnchorX(e.clientX);
    setAnchorY(e.clientY);
    wheelRef.current?.style.setProperty("--x", `${e.clientX}px`);
    wheelRef.current?.style.setProperty("--y", `${e.clientY}px`);
    wheelRef.current?.classList.add("on");
  };

  const handleMouseUp = () => {
    setShowing(false);
    wheelRef.current?.classList.remove("on");
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!showing) return;

    const dx = e.clientX - anchorX;
    const dy = e.clientY - anchorY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= minDistance) {
      const angle = Math.atan2(dy, dx) + 0.625 * Math.PI;
      const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
      setHighlightedSection(
        ["chats", "prompts", "tools"][
          Math.floor(normalizedAngle / (Math.PI / 3))
        ] || null
      );
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [showing, anchorX, anchorY]);

  const handleSectionClick = (path: string) => {
    const newPath = isWidgetView ? `${path}?view=widget` : path;
    router.push(newPath);
    handleCloseOverlayAndMenu(); // Ensure the overlay and menu close
  };

  return (
    <div className={`relative z-50 ${isOpen ? "block" : "hidden"}`}>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 ${menuAnimation}`}
          ref={wheelRef}
        >
          <div className="radial-menu open relative flex size-full items-center justify-center">
            {/* Radial Menu Sections */}
            <RadialMenuSection
              icon={<IconMessageCircle size={24} />}
              label="Chats"
              position={{
                top: "5%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              onHover={() => setHighlightedSection("chats")}
              isHighlighted={highlightedSection === "chats"}
              onClick={() => handleOverlayToggle("chats")}
            />

            <RadialMenuSection
              icon={<IconTag size={24} />}
              label="Prompts"
              position={{
                bottom: "5%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              onHover={() => setHighlightedSection("prompts")}
              isHighlighted={highlightedSection === "prompts"}
              onClick={() => handleOverlayToggle("prompts")}
            />

            <RadialMenuSection
              icon={<IconTool size={24} />}
              label="Tools"
              position={{
                top: "50%",
                right: "5%",
                transform: "translateY(-50%)",
              }}
              onHover={() => setHighlightedSection("tools")}
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
