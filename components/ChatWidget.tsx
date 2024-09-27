import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/router";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageData, setPageData] = useState(null);
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

  // Listen for page data sent from page-data-collector.js script
  useEffect(() => {
    const handlePageData = (event: MessageEvent) => {
      // Check if the message is of type 'PAGE_DATA'
      if (event.data.type === "PAGE_DATA") {
        setPageData(event.data.data);
        console.log("Received page data:", event.data.data);
      }
    };

    window.addEventListener("message", handlePageData);

    return () => {
      window.removeEventListener("message", handlePageData);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Function to send page data to the chat API
  const sendChatMessage = async (messageContent: string) => {
    const payload = {
      chatSettings: {
        model: "gpt-4-turbo", // Example, adjust based on your requirements
        temperature: 0.5,
      },
      messages: [
        {
          role: "user",
          content: messageContent,
        },
        {
          role: "system",
          content: `Page Data: ${JSON.stringify(pageData)}`, // Include page data
        },
      ],
    };

    try {
      const response = await fetch("/api/chat/openai/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      console.log("Chat response:", data);
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  const handleChatSubmit = () => {
    sendChatMessage("User message here"); // Example message
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
            src="/chat?view=widget"
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Chat Interface"
            aria-label="Chat Interface"
          ></iframe>
          <button onClick={handleChatSubmit}>Send to Chat</button>
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
