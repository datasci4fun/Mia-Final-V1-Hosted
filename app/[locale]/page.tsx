"use client"

import { ChatbotUIPNG } from "@/components/icons/chatbotui-png";
import { IconArrowRight } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";

export default function HomePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { query } = router;

  // Function to build the URL with preserved query parameters
  const buildUrlWithQuery = (path: string): string => {
    const url = new URL(path, window.location.origin);

    // Append each existing query parameter from the current URL
    Object.keys(query).forEach((key) => {
      const value = query[key];
      // Handle different types of query values: string, string[], or undefined
      if (typeof value === 'string') {
        url.searchParams.set(key, value);
      } else if (Array.isArray(value)) {
        url.searchParams.set(key, value.join(',')); // Combine array values into a single string
      }
    });

    // Return the path with query parameters preserved
    return url.toString().replace(window.location.origin, '');
  };

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <ChatbotUIPNG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
      </div>

      <div className="mt-2 text-4xl font-bold">Mia Chat</div>

      <Link
        className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
        href={buildUrlWithQuery('/login')}
      >
        Start Chatting
        <IconArrowRight className="ml-1" size={20} />
      </Link>
    </div>
  );
}
