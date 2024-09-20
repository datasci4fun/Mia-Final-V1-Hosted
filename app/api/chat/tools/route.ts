import { openapiToFunctions } from "@/lib/openapi-conversion";
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers";
import { Tables } from "@/supabase/types";
import { ChatSettings } from "@/types";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

export async function POST(request: Request) {
  const json = await request.json();
  const { chatSettings, messages, selectedTools } = json as {
    chatSettings: ChatSettings;
    messages: any[];
    selectedTools: Tables<"tools">[];
  };

  try {
    const profile = await getServerProfile();

    checkApiKey(profile.openai_api_key, "OpenAI");

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id,
    });

    let allTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [];
    let allRouteMaps = {};
    let schemaDetails = [];

    for (const selectedTool of selectedTools) {
      try {
        const convertedSchema = await openapiToFunctions(
          JSON.parse(selectedTool.schema as string)
        );
        const tools = convertedSchema.functions || [];
        allTools = allTools.concat(tools);

        const routeMap = convertedSchema.routes.reduce(
          (map: Record<string, string>, route) => {
            map[route.path.replace(/{(\w+)}/g, ":$1")] = route.operationId;
            return map;
          },
          {}
        );

        allRouteMaps = { ...allRouteMaps, ...routeMap };

        schemaDetails.push({
          title: convertedSchema.info.title,
          description: convertedSchema.info.description,
          url: convertedSchema.info.server,
          headers: selectedTool.custom_headers,
          routeMap,
          requestInBody: convertedSchema.routes[0].requestInBody,
        });
      } catch (error: any) {
        console.error("Error converting schema", error);
      }
    }

    const firstResponse = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages,
      tools: allTools.length > 0 ? allTools : undefined,
    });

    const message = firstResponse.choices[0].message;
    messages.push(message);
    const toolCalls = message.tool_calls || [];

    if (toolCalls.length === 0) {
      return new Response(JSON.stringify({ message: message.content }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    for (const toolCall of toolCalls) {
      const functionCall = toolCall.function;
      const functionName = functionCall.name;
      const argumentsString = toolCall.function.arguments.trim();
      const parsedArgs = JSON.parse(argumentsString);

      const schemaDetail = schemaDetails.find((detail) =>
        Object.values(detail.routeMap).includes(functionName)
      );

      if (!schemaDetail) {
        throw new Error(`Function ${functionName} not found in any schema`);
      }

      const pathTemplate = Object.keys(schemaDetail.routeMap).find(
        (key) => schemaDetail.routeMap[key] === functionName
      );

      if (!pathTemplate) {
        throw new Error(`Path for function ${functionName} not found`);
      }

      const path = pathTemplate.replace(/:(\w+)/g, (_, paramName) => {
        const value = parsedArgs.parameters[paramName];
        if (!value) {
          throw new Error(
            `Parameter ${paramName} not found for function ${functionName}`
          );
        }
        return encodeURIComponent(value);
      });

      let data = {};

      try {
        const isRequestInBody = schemaDetail.requestInBody;
        let headers = { "Content-Type": "application/json" };

        if (schemaDetail.headers && typeof schemaDetail.headers === "string") {
          headers = {
            ...headers,
            ...JSON.parse(schemaDetail.headers),
          };
        }

        const fullUrl = schemaDetail.url + path;
        let response;

        if (isRequestInBody) {
          response = await fetch(fullUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(parsedArgs.requestBody || parsedArgs),
          });
        } else {
          const queryParams = new URLSearchParams(
            parsedArgs.parameters
          ).toString();
          const urlWithQuery = fullUrl + (queryParams ? "?" + queryParams : "");
          response = await fetch(urlWithQuery, {
            method: "GET",
            headers,
          });
        }

        if (!response.ok) {
          data = { error: response.statusText };
        } else {
          data = await response.json();
        }
      } catch (fetchError: any) {
        console.error(`Error during fetch for function ${functionName}`, fetchError);
        data = { error: fetchError.message };
      }

      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: JSON.stringify(data),
      });
    }

    const secondResponse = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages,
      stream: true,
    });

    const stream = OpenAIStream(secondResponse);

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error("Error processing chat tools request", error);
    const errorMessage = error.message || "An unexpected error occurred";
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: error.status || 500,
    });
  }
}
