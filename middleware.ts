// middleware.ts
import { createClient } from "@/lib/supabase/middleware";
import { i18nRouter } from "next-i18n-router";
import { NextResponse, type NextRequest } from "next/server";
import i18nConfig from "./i18nConfig";

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig);
  if (i18nResult) return i18nResult;

  // Skip session logic on login page
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  try {
    const { supabase, response } = createClient(request);

    // Get the session
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session in middleware:", error);
    } else if (data?.session) {
      const session = data.session;
      console.log("Middleware session:", session);

      // Attach session info to response headers to be used globally
      response.headers.set("x-session-data", JSON.stringify(session));

      // Extract the view parameter or other existing query parameters
      const viewParam = request.nextUrl.searchParams.get("view");
      const existingQuery = request.nextUrl.search;

      // Check if the user is anonymous
      if (session.user?.is_anonymous) {
        console.log("Anonymous user detected");

        const { data: homeWorkspace, error } = await supabase
          .from("workspaces")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("is_home", true)
          .single();

        if (error || !homeWorkspace) {
          console.error("No workspace found for anonymous user", error);
          // Redirect anonymous users to the welcome page if no workspace
          return NextResponse.redirect(new URL(`/welcome${existingQuery}`, request.url));
        }

        // If workspace exists, redirect anonymous users to their home workspace with query parameters
        return NextResponse.redirect(
          new URL(`/${homeWorkspace.id}/chat${existingQuery}`, request.url)
        );
      }

      // If the user is logged in and visiting the root page, redirect them to their workspace
      const redirectToChat = request.nextUrl.pathname === "/";

      if (redirectToChat) {
        const { data: homeWorkspace, error } = await supabase
          .from("workspaces")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("is_home", true)
          .single();

        if (error || !homeWorkspace) {
          console.error("No home workspace found for logged-in user", error);
          throw new Error(error?.message || "No home workspace found");
        }

        // Redirect logged-in users to their home workspace with query parameters
        return NextResponse.redirect(
          new URL(`/${homeWorkspace.id}/chat${existingQuery}`, request.url)
        );
      }
    }

    return response;
  } catch (e) {
    console.error("Error in middleware:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)",
};
