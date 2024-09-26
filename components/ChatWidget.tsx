import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/router"; // Import the router

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOrLogin = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          const { error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error("Anonymous login failed:", error.message);
          }
        }
      } catch (error) {
        console.error("Error during session check or login:", error);
      }
    };

    checkOrLogin();
  }, []);

  // Check if the `view=widget` param is present in the URL
  useEffect(() => {
    if (router.query.view === "widget") {
      setIsOpen(true); // Automatically open the chat if `view=widget`
    }
  }, [router.query]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      <button
        onClick={toggleChat}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px",
          borderRadius: "50%",
        }}
        aria-label="Toggle Chat"
      >
        Chat
      </button>

      {isOpen && (
        <div
          style={{
            width: "300px",
            height: "400px",
            backgroundColor: "white",
            border: "1px solid #007bff",
            borderRadius: "10px",
            padding: "10px",
            position: "fixed",
            bottom: "80px",
            right: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <iframe
            src="/chat?view=widget" // Ensure the parameter is passed to the iframe
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Chat Interface"
            aria-label="Chat Interface"
          ></iframe>
        </div>
      )}
    </div>
  );
};

// Attach the component to the window object
declare global {
  interface Window {
    ChatWidget: typeof ChatWidget;
  }
}

window.ChatWidget = ChatWidget;
