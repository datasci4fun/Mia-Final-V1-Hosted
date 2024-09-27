import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/router";

// Function to parse the session cookie and extract the session data
const getSessionFromCookie = () => {
  try {
    // Assuming your cookie name is 'sb-access-token'
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sb-access-token="));
    
    if (!sessionCookie) {
      console.error("Session cookie not found.");
      return null;
    }

    // Parse the JSON from the cookie value
    const sessionData = JSON.parse(decodeURIComponent(sessionCookie.split("=")[1]));
    console.log("Parsed session from cookie:", sessionData);

    return sessionData;
  } catch (error) {
    console.error("Error parsing session from cookie:", error);
    return null;
  }
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageData, setPageData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initializeSession = () => {
      const session = getSessionFromCookie();
      if (!session) {
        console.error("Session could not be initialized from cookie.");
      } else {
        console.log("Session initialized:", session);
      }
    };

    initializeSession();
  }, []);

  // Check if the `view=widget` param is present in the URL
  useEffect(() => {
    if (router.query.view === "widget") {
      setIsOpen(true); // Automatically open the chat if `view=widget`
    }
  }, [router.query]);

  // Listen for page data sent from page-data-collector.js script
  useEffect(() => {
    const handlePageData = async (event: MessageEvent) => {
      if (event.data.type === "PAGE_DATA") {
        setPageData(event.data.data);
        console.log("Received page data:", event.data.data);
    
        // Retrieve the session data using the getSessionData function
        const session = getSessionFromCookie();
    
        if (session && session.user && session.user.id) {
          const userId = session.user.id; // Use user_id from session
          const sessionId = session.access_token; // Use session_id from session
    
          if (!userId || !sessionId) {
            console.error("Invalid session data: user_id or session_id is undefined.");
            return;
          }
    
          console.log("Session data available:", session);
    
          // Log the page data that will be inserted
          console.log("Attempting to insert page data:", {
            user_id: userId,
            session_id: sessionId,
            url: event.data.data.url,
            title: event.data.data.title,
            description: event.data.data.description,
            product_info: {
              handle: event.data.data.product?.handle,
              title: event.data.data.product?.title,
              price: event.data.data.product?.price,
            },
            created_at: new Date().toISOString(),
          });
    
          // Insert the data into Supabase
          const { error } = await supabase
            .from("user_page_data")
            .insert({
              user_id: userId,
              session_id: sessionId,
              page_url: event.data.data.url,
              page_title: event.data.data.title,
              page_description: event.data.data.description,
              product_info: {
                handle: event.data.data.product?.handle,
                title: event.data.data.product?.title,
                price: event.data.data.product?.price,
              },
              created_at: new Date().toISOString(),
            });
    
          if (error) {
            console.error("Error inserting page data:", error);
          } else {
            console.log("Page data successfully inserted.");
          }
        } else {
          console.error("Session not available or user_id/session_id is missing.");
        }
      }
    };

    window.addEventListener("message", handlePageData);

    // Add a basic POST request with manual data to test table insertion
    const manualInsert = async () => {
      try {
        console.log("Attempting manual data insert for testing...");
        const { error } = await supabase.from("user_page_data").insert({
          user_id: "25348352-ebd4-4ebd-aba6-0aa1333b9c2e", // Replace with a valid UUID
          session_id: "5df4af32-725c-4052-b2e0-aa919b83f205", // Replace with a valid UUID
          page_url: "https://example.com/manual-insert",
          page_title: "Manual Insert Test",
          page_description: "This is a manually inserted test entry.",
          product_info: { handle: "test-product", title: "Test Product", price: "99.99" },
          created_at: new Date().toISOString(),
        });
        if (error) {
          console.error("Manual data insert error:", error);
        } else {
          console.log("Manual data insert successful.");
        }
      } catch (err) {
        console.error("Error during manual data insert:", err);
      }
    };

    manualInsert();

    return () => {
      window.removeEventListener("message", handlePageData);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const iframeSrc = `/chat?view=widget`;

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
            src={iframeSrc}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Chat Interface"
            aria-label="Chat Interface"
          ></iframe>
        </div>
      )}
    </div>
  );
};
