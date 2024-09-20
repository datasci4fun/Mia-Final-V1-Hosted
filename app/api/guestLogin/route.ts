import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { Database } from "@/supabase/types";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { createWorkspace, getHomeWorkspaceByUserId } from "@/db/workspaces";

export async function POST(request: Request) {
  const cookieStore = cookies();

  // Log the individual cookies that are available
  const sessionCookie = cookieStore.get("supabase-auth-token")?.value;
  console.log("Session cookie value:", sessionCookie);

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieValue = cookieStore.get(name)?.value;
          console.log(`Cookie value for '${name}':`, cookieValue); // Log cookie retrieval
          return cookieValue;
        },
        set(name: string, value: string) {
          cookieStore.set(name, value, {
            path: "/",
            sameSite: "none",
            secure: true,
          });
          console.log(
            `Setting cookie '${name}' to value '${value}' with SameSite=None and Secure attributes.`
          ); // Log cookie setting
        },
      },
    }
  );

  // Get the session to check if the user is already anonymous
  const { data: sessionData } = await supabase.auth.getSession();
  console.log("Session data:", sessionData); // Log session data

  let userId;
  let session = sessionData?.session;

  if (!session || !session.user?.is_anonymous) {
    console.log("No existing session or not anonymous, signing in anonymously...");

    // If no session or the user is not anonymous, create a new anonymous session
    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();

    if (!signInData || !signInData.user) {
      console.error("Sign in error:", signInError);
      return NextResponse.json(
        { error: "Anonymous login failed" },
        { status: 500 }
      );
    }

    userId = signInData.user.id;
    session = signInData.session;
    console.log("New anonymous session created:", session); // Log new session creation
  } else {
    // Use the existing anonymous session
    userId = session.user.id;
    console.log("Using existing anonymous session for user:", userId);
  }

  try {
    // Parse the request URL to extract query parameters
    const requestUrl = new URL(request.url);
    const viewParam = requestUrl.searchParams.get("view") || ""; // Extract the 'view' parameter if it exists
    console.log("View parameter:", viewParam);

    // Fetch the user's home workspace
    const existingHomeWorkspace = await getHomeWorkspaceByUserId(userId);
    console.log("Existing home workspace:", existingHomeWorkspace);

    // Check if multiple rows were returned
    if (Array.isArray(existingHomeWorkspace) && existingHomeWorkspace.length !== 1) {
      console.error(
        "Error: Multiple or no home workspaces found for user. Please check database constraints."
      );
      return NextResponse.json(
        { error: "Multiple or no home workspaces found." },
        { status: 500 }
      );
    }

    if (existingHomeWorkspace) {
      // Redirect to the existing workspace with the view parameter if it exists
      const workspaceUrl = `${requestUrl.origin}/${existingHomeWorkspace.id}/chat${
        viewParam ? `?view=${viewParam}` : ""
      }`;
      console.log("Redirecting to existing workspace URL:", workspaceUrl);

      return NextResponse.json({ session, workspaceUrl });
    }

    // If no home workspace exists, create a new one
    const workspaceData = {
      user_id: userId,
      name: `Guest Workspace ${uuidv4()}`,
      is_home: true,
      default_context_length: 4096,
      default_model: "gpt-4",
      default_prompt: "You are a helpful assistant.",
      default_temperature: 0.5,
      description: "Workspace for anonymous guest user",
      embeddings_provider: "openai",
      include_profile_context: false,
      include_workspace_instructions: true,
      instructions: "Default instructions for guest workspace",
    };

    console.log("Creating new workspace with data:", workspaceData); // Log workspace creation

    // Create the new workspace
    const createdWorkspace = await createWorkspace(workspaceData);
    console.log("Workspace created successfully:", createdWorkspace);

    // Build the redirect URL with the preserved view parameter
    const workspaceUrl = `${requestUrl.origin}/${createdWorkspace.id}/chat${
      viewParam ? `?view=${viewParam}` : ""
    }`;
    console.log("Redirecting to new workspace URL:", workspaceUrl);
    return NextResponse.json({ session, workspaceUrl });
  } catch (error) {
    console.error("Error creating or fetching workspace:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
