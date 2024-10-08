"use client"; // Ensure this component is treated as a client-side component

import { ChatbotUIPNG } from "@/components/icons/chatbotui-png";
import { IconArrowRight } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use 'next/navigation' instead of 'next/router' in Next.js 13+ for client-side navigation

export default function HomePage() {
  const { theme } = useTheme();
  const [queryParams, setQueryParams] = useState<string>("");

  useEffect(() => {
    // This code runs only on the client-side after the component has mounted
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get("view");
    if (view) {
      setQueryParams(`?view=${view}`);
    }
  }, []);

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <ChatbotUIPNG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
      </div>

      <div className="mt-2 text-4xl font-bold">Mia Chat</div>

      <Link
        className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
        href={`/login${queryParams}`} // Append query parameters to the href
      >
        Start Chatting
        <IconArrowRight className="ml-1" size={20} />
      </Link>
    </div>
  );
}
