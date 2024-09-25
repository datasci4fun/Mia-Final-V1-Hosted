import { createClient } from "@/lib/supabase/middleware";
import { i18nRouter } from "next-i18n-router";
import { NextResponse, type NextRequest } from "next/server";
import i18nConfig from "./i18nConfig";

export async function middleware(request: NextRequest) {
  // i18n routing
  const i18nResult = i18nRouter(request, i18nConfig);
  if (i18nResult) return i18nResult;

  // **New Logic Start**
  // 1. Check if the request is coming from usa-rs.com
  const referer = request.headers.get('referer') || '';
  const origin = request.headers.get('origin') || '';
  const host = request.headers.get('host') || '';
  const isFromUsaRs = referer.includes('usa-rs.com') || origin.includes('usa-rs.com');

  // 2. Check if the user is on a mobile device
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // 3. If both conditions are met, ensure '?view=widget' is in the URL
  if (isFromUsaRs && isMobile) {
    const url = request.nextUrl.clone();
    const viewParam = url.searchParams.get('view');

    if (viewParam !== 'widget') {
      url.searchParams.set('view', 'widget');
      return NextResponse.redirect(url);
    }
  }
  // **New Logic End**

  // Skip session logic on login page
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  try {
    const { supabase, response } = createClient(request);

    // Get the session
    const session = await supabase.auth.getSession();

    console.log("Middleware session:", session);

    // Check if the user is anonymous
    if (session?.data?.session?.user?.is_anonymous) {
      console.log("Anonymous user detected");

      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.data.session?.user.id)
        .eq("is_home", true)
        .single();

      if (error || !homeWorkspace) {
        console.error("No workspace found for anonymous user", error);
        // Redirect anonymous users to welcome page if no workspace
        return NextResponse.redirect(new URL("/welcome", request.url));
      }

      // If workspace exists, redirect anonymous users to their home workspace
      return NextResponse.redirect(
        new URL(`/${homeWorkspace.id}/chat`, request.url)
      );
    }

    // If the user is logged in and visiting the root page, redirect them to their workspace
    const redirectToChat = session && request.nextUrl.pathname === "/";

    if (redirectToChat) {
      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.data.session?.user.id)
        .eq("is_home", true)
        .single();

      if (!homeWorkspace) {
        console.error("No home workspace found for logged-in user", error);
        throw new Error(error?.message || "No home workspace found");
      }

      // Redirect logged-in users to their home workspace
      return NextResponse.redirect(
        new URL(`/${homeWorkspace.id}/chat`, request.url)
      );
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