import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/router";

// Function to retrieve the current session data
const getSessionData = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error.message);
      return null;
    }

    const session = data.session;

    if (session) {
      console.log("Session retrieved:", session);
      return session;
    } else {
      console.log("No session found, signing in anonymously.");
      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) {
        console.error("Anonymous login failed:", signInError.message);
        return null;
      }
      // Retry getting the session after anonymous sign-in
      const retry = await supabase.auth.getSession();
      return retry.data.session;
    }
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageData, setPageData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initializeSession = async () => {
      const session = await getSessionData();
      if (!session) {
        console.error("Session could not be initialized.");
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
        const session = await getSessionData();

        if (session) {
          console.log("Session data available:", session);

          // Log the page data that will be inserted
          console.log("Attempting to insert page data:", {
            session_id: session.access_token, // Ensure this is the correct identifier
            url: event.data.data.url,
            title: event.data.data.title,
            description: event.data.data.description,
            keywords: event.data.data.keywords,
            product_handle: event.data.data.product?.handle,
            product_title: event.data.data.product?.title,
            product_price: event.data.data.product?.price,
            created_at: new Date().toISOString(),
          });

          // Insert the data into Supabase
          const { error } = await supabase
            .from("user_page_data")
            .insert({
              session_id: session.access_token, // Ensure this is the correct identifier
              url: event.data.data.url,
              title: event.data.data.title,
              description: event.data.data.description,
              keywords: event.data.data.keywords,
              product_handle: event.data.data.product?.handle,
              product_title: event.data.data.product?.title,
              product_price: event.data.data.product?.price,
              created_at: new Date().toISOString(),
            });

          if (error) {
            console.error("Error inserting page data:", error);
          } else {
            console.log("Page data successfully inserted.");
          }
        } else {
          console.error("Session not available.");
        }
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
