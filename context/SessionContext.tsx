// SessionContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase/browser-client";

interface SessionData {
  accessToken: string;
  refreshToken: string;
  user: any;
}

interface SessionContextProps {
  session: SessionData | null;
  setSession: (session: SessionData | null) => void;
}

const SessionContext = createContext<SessionContextProps>({
  session: null,
  setSession: () => {},
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      // Attempt to fetch session directly from the headers set by the middleware
      const sessionHeader = document?.head?.querySelector('meta[name="x-session-data"]')?.getAttribute('content');
      const sessionData = sessionHeader ? JSON.parse(sessionHeader) : null;

      if (sessionData) {
        setSession({
          accessToken: sessionData.access_token,
          refreshToken: sessionData.refresh_token,
          user: sessionData.user,
        });
      } else {
        // Fall back to fetching session via Supabase if not available in headers
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          setSession(null);
        } else if (data.session) {
          setSession({
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            user: data.session.user,
          });
        }
      }
    };

    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};
