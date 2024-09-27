import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers";
import { ChatSettings } from "@/types";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ServerRuntime } from "next";
import OpenAI from "openai";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { supabase } from "@/lib/supabase/browser-client"; // Correct import for the browser client

export const runtime: ServerRuntime = "edge";

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

    // Retrieve page data using the correct Supabase client
    const { data: pageData, error } = await supabase
      .from("user_page_data")
      .select(
        "page_url, page_title, page_description, product_info"
      )
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching page data:", error);
    }

    // Extract product information from the JSON object, if available
    const productInfo = pageData?.product_info || {};
    const productHandle = productInfo.handle || "N/A";
    const productTitle = productInfo.title || "N/A";
    const productPrice = productInfo.price || "N/A";

    // Append page data to system message if available
    const systemMessage = pageData
      ? {
          role: "system",
          content: `Context: You are assisting a user browsing ${pageData.page_title} (${pageData.page_url}). Description: ${pageData.page_description}. Product Info: Handle: ${productHandle}, Title: ${productTitle}, Price: ${productPrice}`,
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
