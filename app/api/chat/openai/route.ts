// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1-Hosted\app\api\chat\openai\route.ts

import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers";
import { ChatSettings } from "@/types";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ServerRuntime } from "next";
import OpenAI from "openai";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

export const runtime: ServerRuntime = "edge";

// Helper function to parse cookies
function parseCookies(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    console.log("No cookies found in the request headers.");
    return {};
  }
  console.log("Cookies received:", cookieHeader);
  return Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [key, ...v] = cookie.split("=");
      return [key, decodeURIComponent(v.join("="))];
    })
  );
}

interface Variant {
  title: string;
  price: string;
}

export async function POST(request: Request) {
  const json = await request.json();
  const { chatSettings, messages, sessionId } = json as {
    chatSettings: ChatSettings;
    messages: any[];
    sessionId: string;
  };

  try {
    const profile = await getServerProfile();
    checkApiKey(profile.openai_api_key, "OpenAI");

    // Parse cookies to get product data
    const cookies = parseCookies(request);
    let productData: { handle: string; title: string; variants: Variant[] } | null = null;

    if (cookies.product_data) {
      try {
        productData = JSON.parse(cookies.product_data);
        console.log("Parsed product data from cookie:", productData);
      } catch (error) {
        console.error("Failed to parse product_data from cookie:", error);
      }
    } else {
      console.error("product_data cookie not found.");
    }

    // Extract product information from the JSON object, if available
    const productHandle = productData?.handle || "N/A";
    const productTitle = productData?.title || "N/A";
    const productVariants = productData?.variants || [];

    // Format the product variants information for the system message
    const formattedVariants = productVariants
      .map((variant: Variant) => `Variant: ${variant.title}, Price: ${variant.price}`)
      .join("; ");

    // Append page data to system message if available
    const systemMessage = productData
      ? {
          role: "system",
          content: `Context: You are assisting a user browsing ${productTitle}. Handle: ${productHandle}. ${formattedVariants}`,
        }
      : null;

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id,
    });

    const response = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: systemMessage ? [systemMessage, ...messages] : messages,
      temperature: chatSettings.temperature,
      max_tokens:
        chatSettings.model === "gpt-4-vision-preview" ||
        chatSettings.model === "gpt-4o"
          ? 4096
          : null,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings.";
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings.";
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
