"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabase/browser-client"

// Debounce function to prevent multiple clicks
function debounce(func: (...args: any[]) => void, timeout = 300) {
  let timer: any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout) // Removed 'this' context
  }
}

export const GuestLoginButton = () => {
  const [loading, setLoading] = useState(false)

  const handleGuestLogin = debounce(async () => {
    if (loading) return

    setLoading(true)

    try {
      const response = await fetch("/api/guestLogin", {
        method: "POST"
      })

      if (!response.ok) {
        throw new Error("Guest login failed")
      }

      const data = await response.json()

      if (data.session) {
        await supabase.auth.setSession(data.session)
      }

      if (data.workspaceUrl) {
        window.location.href = data.workspaceUrl
      }
    } catch (error: any) {
      console.error("Error during guest login:", error)
      window.location.href = `/login?message=${encodeURIComponent(error.message)}`
    } finally {
      setLoading(false)
    }
  }, 1000) // Debounce delay of 1 second to prevent multiple rapid requests

  return (
    <button
      className="mb-2 rounded-md bg-gray-600 px-4 py-2 text-white"
      onClick={handleGuestLogin}
      disabled={loading}
    >
      {loading ? "Logging in..." : "Continue as Guest"}
    </button>
  )
}
