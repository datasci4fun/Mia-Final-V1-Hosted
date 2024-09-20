"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/browser-client";

// Debounce function to prevent multiple clicks
function debounce(func: (...args: any[]) => void, timeout = 300) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export const GuestLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGuestLogin = debounce(async () => {
    if (loading) return;

    setLoading(true);
    setErrorMessage(null); // Clear previous errors

    try {
      console.log("Starting guest login process...");

      const response = await fetch("/api/guestLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Guest login response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text(); // Capture response body for debugging
        console.error("Guest login failed with status:", response.status, errorText);
        setErrorMessage(`Guest login failed: ${errorText}`);
        throw new Error(`Guest login failed: ${errorText}`);
      }

      const data = await response.json();

      console.log("Received data:", data);

      if (!data.session) {
        throw new Error("No session returned from server.");
      }

      if (!data.workspaceUrl) {
        throw new Error("No workspace URL returned from server.");
      }

      console.log("Setting Supabase session...");
      const { error: sessionError } = await supabase.auth.setSession(data.session);
      if (sessionError) {
        console.error("Failed to set Supabase session:", sessionError.message);
        setErrorMessage(`Failed to set session: ${sessionError.message}`);
        throw new Error(`Failed to set session: ${sessionError.message}`);
      }

      console.log("Redirecting to workspace URL:", data.workspaceUrl);
      window.location.href = data.workspaceUrl;
    } catch (error: any) {
      console.error("Error during guest login:", error);
      setErrorMessage(error.message || "An unknown error occurred during guest login.");
      // Redirect to login page with the error message
      window.location.href = `/login?message=${encodeURIComponent(error.message)}`;
    } finally {
      setLoading(false);
    }
  }, 1000); // Debounce delay of 1 second to prevent multiple rapid requests

  return (
    <div>
      <button
        className="mb-2 rounded-md bg-gray-600 px-4 py-2 text-white"
        onClick={handleGuestLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Continue as Guest"}
      </button>
      {errorMessage && (
        <div className="mt-2 text-red-500">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
    </div>
  );
};
