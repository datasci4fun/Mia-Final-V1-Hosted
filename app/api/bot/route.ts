// app/api/bot/route.ts
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { Database } from "@/supabase/types"
import { cookies } from "next/headers" // Import cookies from next/headers

// Define your chatbot response logic here
async function generateBotResponse(message: string): Promise<string> {
  // Placeholder logic for generating a bot response
  // Replace this with your actual chatbot response generation logic
  return `Bot response to: ${message}`
}

export async function POST(req: Request) {
  // Use cookies from the next/headers to manage cookie interactions
  const cookieStore = cookies()

  // Initialize Supabase client with cookie management
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value // Retrieve the cookie value
        },
        set(name: string, value: string) {
          cookieStore.set(name, value, { path: "/" }) // Set the cookie value
        }
      }
    }
  )

  try {
    // Parse the request body
    const { sender, message } = await req.json()

    if (!sender || !message) {
      return NextResponse.json(
        { error: "Missing sender or message" },
        { status: 400 }
      )
    }

    // Add any additional Supabase logic here if needed, e.g., logging messages or fetching data

    // Generate a response using your bot logic
    const response = await generateBotResponse(message)

    return NextResponse.json({ sender, response })
  } catch (error) {
    console.error("Error handling request:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}