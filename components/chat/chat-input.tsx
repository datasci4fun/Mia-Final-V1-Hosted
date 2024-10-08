"use client";

import { ChatbotUIContext } from "@/context/context";
import useHotkey from "@/lib/hooks/use-hotkey";
import { cn } from "@/lib/utils";
import { IconCirclePlus, IconPlayerStopFilled, IconSend } from "@tabler/icons-react";
import { FC, useContext, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { ChatFilesDisplay } from "@/components/chat/chat-files-display";
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler";
import { useSelectFileHandler } from "@/components/chat/chat-hooks/use-select-file-handler";
import { usePromptAndCommand } from "@/components/chat/chat-hooks/use-prompt-and-command"; // Import the hook

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = () => {
  useHotkey("l", () => {
    handleFocusChatInput();
  });

  const [isTyping, setIsTyping] = useState<boolean>(false);

  const {
    userInput,
    chatMessages,
    isGenerating,
    selectedTools,
    setSelectedTools,
    selectedAssistant,
    assistantImages,
  } = useContext(ChatbotUIContext);

  const { chatInputRef, handleSendMessage, handleStopMessage, handleFocusChatInput } = useChatHandler();
  const { filesToAccept, handleSelectDeviceFile } = useSelectFileHandler();
  const { handleInputChange } = usePromptAndCommand(); // Destructure handleInputChange from the hook

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolClick = (toolId: string) => {
    setSelectedTools(selectedTools.filter(tool => tool.id !== toolId));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isTyping && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(userInput, chatMessages, false);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        if (!file) return;
        handleSelectDeviceFile(file);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col flex-wrap justify-center gap-2">
        <ChatFilesDisplay />

        {selectedTools &&
          selectedTools.map((tool, index) => (
            <div
              key={index}
              className="flex justify-center"
              onClick={() => handleToolClick(tool.id)}
            >
              <div className="flex cursor-pointer items-center justify-center space-x-1 rounded-lg bg-purple-600 px-3 py-1 hover:opacity-50">
                <div>{tool.name}</div>
              </div>
            </div>
          ))}

        {selectedAssistant && (
          <div className="border-primary mx-auto flex w-fit items-center space-x-2 rounded-lg border p-1.5">
            {selectedAssistant.image_path && (
              <img
                className="rounded"
                src={assistantImages.find((img) => img.path === selectedAssistant.image_path)?.base64}
                width={28}
                height={28}
                alt={selectedAssistant.name}
              />
            )}
            <div className="text-sm font-bold">Talking to {selectedAssistant.name}</div>
          </div>
        )}
      </div>

      <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
        <IconCirclePlus
          className="absolute bottom-[12px] left-3 cursor-pointer p-1 hover:opacity-50"
          size={32}
          onClick={() => fileInputRef.current?.click()}
        />

        <Input
          ref={fileInputRef}
          className="hidden"
          type="file"
          onChange={(e) => {
            if (!e.target.files) return;
            handleSelectDeviceFile(e.target.files[0]);
          }}
          accept={filesToAccept}
        />

        <TextareaAutosize
          textareaRef={chatInputRef}
          className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Type your message..."
          value={userInput}
          onValueChange={handleInputChange} // Use handleInputChange from the hook
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />

        <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
          {isGenerating ? (
            <IconPlayerStopFilled className="hover:bg-background animate-pulse rounded bg-transparent p-1" onClick={handleStopMessage} size={30} />
          ) : (
            <IconSend
              className={cn("bg-primary text-secondary rounded p-1", !userInput && "cursor-not-allowed opacity-50")}
              onClick={() => {
                if (!userInput) return;
                handleSendMessage(userInput, chatMessages, false);
              }}
              size={30}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ChatInput;
