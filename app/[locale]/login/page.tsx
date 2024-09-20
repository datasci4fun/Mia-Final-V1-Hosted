import { Brand } from "@/components/ui/brand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/supabase/types";
import { createServerClient } from "@supabase/ssr";
import { get } from "@vercel/edge-config";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { GuestLoginButton } from "@/components/setup/GuestLoginButton";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Login({ searchParams }: { searchParams: { message: string } }) {
  const cookieStore = cookies();
  console.log("Initializing Supabase client...");

  // Create the Supabase client with detailed logging
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieValue = cookieStore.get(name)?.value;
          console.log(`Cookie value retrieved for '${name}':`, cookieValue);
          return cookieValue;
        },
      },
    }
  );

  // Attempt to retrieve the current session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  console.log("Session data fetched:", sessionData);

  if (sessionError) {
    console.error("Error fetching session data:", sessionError);
  }

  const session = sessionData?.session;

  if (session) {
    console.log("Session exists, fetching home workspace for user:", session.user.id);

    const { data: homeWorkspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_home", true)
      .single();

    console.log("Home workspace data:", homeWorkspace);

    if (workspaceError) {
      console.error("Error fetching home workspace:", workspaceError.message);
      throw new Error(workspaceError.message);
    }

    if (!homeWorkspace) {
      console.error("No home workspace found for user:", session.user.id);
      throw new Error("Home workspace not found");
    }

    console.log("Redirecting to home workspace:", homeWorkspace.id);
    return redirect(`/${homeWorkspace.id}/chat`);
  } else {
    console.log("No session found, proceeding to login form...");
  }

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    console.log("Attempting to sign in with email:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign-in error:", error.message);
      return redirect(`/login?message=${error.message}`);
    }

    console.log("Sign-in successful, fetching home workspace for user:", data.user.id);

    const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("is_home", true)
      .single();

    console.log("Home workspace data:", homeWorkspace);

    if (homeWorkspaceError) {
      console.error("Error fetching home workspace:", homeWorkspaceError.message);
      throw new Error(homeWorkspaceError.message || "An unexpected error occurred");
    }

    if (!homeWorkspace) {
      console.error("No home workspace found for user:", data.user.id);
      throw new Error("Home workspace not found after sign-in");
    }

    console.log("Redirecting to home workspace:", homeWorkspace.id);
    return redirect(`/${homeWorkspace.id}/chat`);
  };

  const getEnvVarOrEdgeConfigValue = async (name: string) => {
    console.log(`Fetching value for ${name} from environment or Edge Config...`);
    if (process.env.EDGE_CONFIG) {
      try {
        const value = await get<string>(name);
        console.log(`Value fetched from Edge Config for ${name}:`, value);
        return value;
      } catch (error) {
        console.error(`Error fetching value from Edge Config for ${name}:`, error);
      }
    }

    const envValue = process.env[name];
    console.log(`Value fetched from environment for ${name}:`, envValue);
    return envValue;
  };

  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Attempting to sign up with email:", email);

    const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue("EMAIL_DOMAIN_WHITELIST");
    const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
      ? emailDomainWhitelistPatternsString?.split(",")
      : [];
    const emailWhitelistPatternsString = await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST");
    const emailWhitelist = emailWhitelistPatternsString?.trim()
      ? emailWhitelistPatternsString?.split(",")
      : [];

    if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
      const domainMatch = emailDomainWhitelist?.includes(email.split("@")[1]);
      const emailMatch = emailWhitelist?.includes(email);
      console.log(`Email domain match: ${domainMatch}, email match: ${emailMatch}`);
      if (!domainMatch && !emailMatch) {
        console.error(`Email ${email} is not allowed to sign up.`);
        return redirect(`/login?message=Email ${email} is not allowed to sign up.`);
      }
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Sign-up error:", error.message);
      return redirect(`/login?message=${error.message}`);
    }

    console.log("Sign-up successful, redirecting to setup...");
    return redirect("/setup");
  };

  const handleResetPassword = async (formData: FormData) => {
    const origin = headers().get("origin");
    const email = formData.get("email") as string;

    console.log("Attempting password reset for email:", email);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/login/password`,
    });

    if (error) {
      console.error("Password reset error:", error.message);
      return redirect(`/login?message=${error.message}`);
    }

    console.log("Password reset request successful, check email.");
    return redirect("/login?message=Check email to reset password");
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
        action={signIn}
      >
        <Brand />

        <Label className="text-md mt-4" htmlFor="email">
          Email
        </Label>
        <Input
          className="mb-3 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />

        <Label className="text-md" htmlFor="password">
          Password
        </Label>
        <Input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
        />

        <SubmitButton className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white">
          Login
        </SubmitButton>

        <SubmitButton
          formAction={signUp}
          className="border-foreground/20 mb-2 rounded-md border px-4 py-2"
        >
          Sign Up
        </SubmitButton>

        {/* Use the client-side GuestLoginButton here */}
        <GuestLoginButton />

        <div className="text-muted-foreground mt-1 flex justify-center text-sm">
          <span className="mr-1">Forgot your password?</span>
          <button
            formAction={handleResetPassword}
            className="text-primary ml-1 underline hover:opacity-80"
          >
            Reset
          </button>
        </div>

        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
