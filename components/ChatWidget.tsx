import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/router";

// Function to dynamically identify and extract the session data from the cookie
const getSessionFromDynamicCookie = () => {
  try {
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => /sb-.*-auth-token=/.test(row));

    if (!sessionCookie) {
      console.error("Session cookie not found.");
      return null;
    }

    const sessionData = JSON.parse(decodeURIComponent(sessionCookie.split("=")[1]));
    console.log("Parsed session from dynamic cookie:", sessionData);

    return sessionData;
  } catch (error) {
    console.error("Error parsing session from dynamic cookie:", error);
    return null;
  }
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageData, setPageData] = useState(null);
  const router = useRouter();
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const initializeSession = () => {
      const session = getSessionFromDynamicCookie();
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
      console.log("Widget view detected. Chat opened automatically.");
    }
  }, [router.query]);

  // Manage scroll behavior when the chat widget is active
  useEffect(() => {
    const preventScroll = (event: Event) => {
      event.preventDefault();
    };

    // Add scroll prevention when the chat is open
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevents scrolling the main page
      window.addEventListener("wheel", preventScroll, { passive: false }); // Prevent scroll events
    } else {
      document.body.style.overflow = ""; // Restore scrolling when the chat is closed
      window.removeEventListener("wheel", preventScroll);
    }

    // Cleanup on component unmount or when `isOpen` changes
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", preventScroll);
    };
  }, [isOpen]);

  // Listen for page data sent from the iframe
  useEffect(() => {
    const handlePageData = async (event: MessageEvent) => {
      if (event.data.type === "PAGE_DATA") {
        setPageData(event.data.data);
        console.log("Received page data:", event.data.data);

        const session = getSessionFromDynamicCookie();

        if (session && session.user && session.user.id) {
          const userId = session.user.id;
          const sessionId = session.access_token;

          if (!userId || !sessionId) {
            console.error("Invalid session data: user_id or session_id is undefined.");
            return;
          }

          console.log("Session data available:", session);

          // Insert the data into Supabase
          try {
            const { data, error } = await supabase
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
              console.log("Page data successfully inserted:", data);
            }
          } catch (insertError) {
            console.error("Error during page data insert:", insertError);
          }
        } else {
          console.error("Session not available or user_id/session_id is missing.");
        }
      }
    };

    window.addEventListener("message", handlePageData);

    // Return cleanup function
    return () => {
      window.removeEventListener("message", handlePageData);
    };
  }, []);

  // Listen for page changes within the iframe and update the current page URL
  useEffect(() => {
    const handlePopState = () => {
      if (iframeRef && iframeRef.contentWindow) {
        iframeRef.contentWindow.postMessage(
          { type: "PAGE_CHANGE", currentUrl: iframeRef.contentWindow.location.href },
          "*"
        );
      }
    };

    // Respond to the parent requesting the current page URL
    const handleGetPageRequest = (event: MessageEvent) => {
      if (event.data.type === "GET_CURRENT_PAGE" && iframeRef && iframeRef.contentWindow) {
        iframeRef.contentWindow.postMessage(
          { type: "PAGE_CHANGE", currentUrl: iframeRef.contentWindow.location.href },
          "*"
        );
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("message", handleGetPageRequest);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("message", handleGetPageRequest);
    };
  }, [iframeRef]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Load the last saved page or start with the chat view parameter
  const iframeSrc = localStorage.getItem("widgetCurrentPage") || `/chat?view=widget`;

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
            ref={(ref) => setIframeRef(ref)}
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
