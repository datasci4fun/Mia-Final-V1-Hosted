import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'None', // Allow cross-origin access
            secure: true,     // Ensure the cookie is only sent over HTTPS
          });
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          })
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'None', // Allow cross-origin access
            secure: true,     // Ensure the cookie is only sent over HTTPS
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: "",
            ...options,
            sameSite: 'None', // Allow cross-origin access
            secure: true,     // Ensure the cookie is only sent over HTTPS
          })
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
            sameSite: 'None', // Allow cross-origin access
            secure: true,     // Ensure the cookie is only sent over HTTPS
          })
        }
      }
    }
  )

  return { supabase, response }
}
